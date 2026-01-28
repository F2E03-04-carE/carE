<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAppointments } from '@/composables/garage/useAppointments';
import { useMaintenanceRecords } from '@/composables/garage/useMaintenanceRecords';
import { useImageUpload } from '@/composables/garage/useImageUpload';
import type { ApptStatus, Appointment } from '@/composables/garage/types';

// Garage ID
const garageId = ref<number | null>(null);
const isLoadingGarage = ref(true);
const noGarageError = ref(false);

// 初始化資料
async function initGarageData() {
  try {
    isLoadingGarage.value = true;

    // 取得當前用戶
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('未登入');
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }

    // 根據當前用戶查詢 garage
    const { data: garages, error } = await supabase
      .from('garages')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('查詢 garage 失敗:', error);
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }

    if (!garages) {
      console.warn('找不到車廠資料，請先註冊車廠');
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }

    garageId.value = garages.id;
    console.log('使用車廠 ID:', garageId.value);

    // 初始化 composables
    if (garageId.value === null) {
      console.error('garage ID 為 null');
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }
    appointmentsApi = useAppointments(garageId.value);
    recordsApi = useMaintenanceRecords(garageId.value);

    // 載入預約資料
    await appointmentsApi.fetchAppointments();
    appointments.value = appointmentsApi.appointments.value;

    // 設定 watch 以同步資料
    watch(appointmentsApi.appointments, () => {
      appointments.value = appointmentsApi.appointments.value;
    }, { deep: true });
  } catch (e) {
    console.error('初始化失敗:', e);
    noGarageError.value = true;
  } finally {
    isLoadingGarage.value = false;
  }
}

// Composables 實例
let appointmentsApi: ReturnType<typeof useAppointments>;
let recordsApi: ReturnType<typeof useMaintenanceRecords>;
const uploadApi = useImageUpload();

// 預約資料
const appointments = ref<Appointment[]>([]);

// 搜尋和篩選
const apptSearch = ref('');
const apptFilterStatuses = ref<Set<ApptStatus>>(new Set(['pending', 'confirmed', 'servicing']));

const statusOptions: { value: ApptStatus; label: string }[] = [
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已排程' },
  { value: 'servicing', label: '作業中' },
  { value: 'cancelled', label: '已取消' },
];

function toggleStatusFilter(status: ApptStatus) {
  if (apptFilterStatuses.value.has(status)) {
    apptFilterStatuses.value.delete(status);
  } else {
    apptFilterStatuses.value.add(status);
  }
  apptFilterStatuses.value = new Set(apptFilterStatuses.value);
}

// 篩選後的預約列表
const filteredAppointments = computed(() => {
  let list = appointments.value || [];

  if (apptFilterStatuses.value.size > 0) {
    list = list.filter(a => apptFilterStatuses.value.has(a.status));
  }

  const q = apptSearch.value.trim().toLowerCase();
  if (q) {
    list = list.filter(a =>
      (a.customer_name || '').toLowerCase().includes(q) ||
      (a.license_plate || '').toLowerCase().includes(q) ||
      (a.customer_phone || '').includes(q)
    );
  }

  return list.sort((a, b) => {
    const tA = new Date(`${a.scheduled_date}T${a.scheduled_time || '00:00'}`).getTime();
    const tB = new Date(`${b.scheduled_date}T${b.scheduled_time || '00:00'}`).getTime();
    return tA - tB;
  });
});

// 輔助函數
function formatCurrency(n?: number) {
  return `NT$${(n || 0).toLocaleString('zh-Hant-TW')}`;
}

function getStatusLabel(s: ApptStatus) {
  const map: Record<ApptStatus, string> = {
    pending: '待確認',
    confirmed: '已排程',
    servicing: '作業中',
    cancelled: '已取消',
    completed: '已完成'
  };
  return map[s] || s;
}

function getStatusClass(s: ApptStatus) {
  switch (s) {
    case 'pending': return 'bg-[#E8DCC2] text-[#8C7B5D]';
    case 'confirmed': return 'bg-[#D6DCD9] text-[#5C6B66]';
    case 'servicing': return 'bg-[#C2CCB8] text-[#5A6650]';
    case 'cancelled': return 'bg-[#E8C2C2] text-[#8C5D5D]';
    case 'completed': return 'bg-stone-200 text-stone-500';
    default: return '';
  }
}

function getStatusBorderClass(s: ApptStatus) {
  switch (s) {
    case 'pending': return 'bg-[#E8DCC2]';
    case 'confirmed': return 'bg-[#D6DCD9]';
    case 'servicing': return 'bg-[#C2CCB8]';
    case 'cancelled': return 'bg-[#E8C2C2]';
    case 'completed': return 'bg-stone-200';
    default: return '';
  }
}

// 編輯 Modal
const showEditModal = ref(false);
const editingForm = reactive<{
  id: number;
  customerName: string;
  carModel: string;
  serviceType: string;
  status: ApptStatus;
  notes: string;
  estimatedCost: number;
  quotationImage: string;
}>({
  id: 0,
  customerName: '',
  carModel: '',
  serviceType: '',
  status: 'pending',
  notes: '',
  estimatedCost: 0,
  quotationImage: '',
});

function openEditModal(apt: Appointment) {
  editingForm.id = apt.id;
  editingForm.customerName = apt.customer_name || '';
  editingForm.carModel = apt.car_model || '';
  editingForm.serviceType = apt.service_type || '';
  editingForm.status = apt.status;
  editingForm.notes = apt.notes || '';
  editingForm.estimatedCost = apt.estimated_cost || 0;
  editingForm.quotationImage = apt.quotation_image_url || '';
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
}

async function saveEdit() {
  try {
    await appointmentsApi.updateAppointment(editingForm.id, {
      status: editingForm.status,
      notes: editingForm.notes,
      estimated_cost: editingForm.estimatedCost,
      quotation_image_url: editingForm.quotationImage
    });
    closeEditModal();
  } catch (e) {
    alert('更新失敗');
  }
}

// 刪除預約
const showRemoveConfirm = ref(false);
const pendingRemoveId = ref(0);

function confirmRemove() {
  pendingRemoveId.value = editingForm.id;
  showRemoveConfirm.value = true;
}

function cancelRemove() {
  showRemoveConfirm.value = false;
}

async function removeAppointment() {
  try {
    await appointmentsApi.deleteAppointment(pendingRemoveId.value);
    showRemoveConfirm.value = false;
    closeEditModal();
  } catch (e) {
    alert('刪除失敗');
  }
}

// 報價單圖片上傳
async function onQuotationImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const url = await uploadApi.uploadImage(
      file,
      'appointment-quotations',
      `${garageId.value}/${editingForm.id}/${Date.now()}-${file.name}`
    );
    if (url) {
      editingForm.quotationImage = url;
    } else {
      alert('上傳失敗');
    }
  }
}

function removeQuotationImage() {
  editingForm.quotationImage = '';
}

// 狀態變更確認 - 完成訂單
const showCompleteConfirm = ref(false);
const pendingCompleteApt = ref<Appointment | null>(null);

function openCompleteConfirm(apt: Appointment) {
  pendingCompleteApt.value = apt;
  showCompleteConfirm.value = true;
}

function cancelComplete() {
  showCompleteConfirm.value = false;
  pendingCompleteApt.value = null;
}

async function confirmComplete() {
  if (!pendingCompleteApt.value) return;
  try {
    await appointmentsApi.completeAppointment(pendingCompleteApt.value);
    await recordsApi.fetchRecords();
    showCompleteConfirm.value = false;
    pendingCompleteApt.value = null;
  } catch (e) {
    alert('操作失敗');
  }
}

// 狀態變更確認 - 確認訂單
const showConfirmConfirm = ref(false);
const pendingConfirmApt = ref<Appointment | null>(null);

function openConfirmConfirm(apt: Appointment) {
  pendingConfirmApt.value = apt;
  showConfirmConfirm.value = true;
}

function cancelConfirmDialog() {
  showConfirmConfirm.value = false;
  pendingConfirmApt.value = null;
}

async function confirmAppointment() {
  if (!pendingConfirmApt.value) return;
  try {
    await appointmentsApi.updateStatus(pendingConfirmApt.value.id, 'confirmed');
    showConfirmConfirm.value = false;
    pendingConfirmApt.value = null;
  } catch (e) {
    alert('操作失敗');
  }
}

// 狀態變更確認 - 開始作業
const showServicingConfirm = ref(false);
const pendingServicingApt = ref<Appointment | null>(null);

function openServicingConfirm(apt: Appointment) {
  pendingServicingApt.value = apt;
  showServicingConfirm.value = true;
}

function cancelServicingDialog() {
  showServicingConfirm.value = false;
  pendingServicingApt.value = null;
}

async function startServicing() {
  if (!pendingServicingApt.value) return;
  try {
    await appointmentsApi.updateStatus(pendingServicingApt.value.id, 'servicing');
    showServicingConfirm.value = false;
    pendingServicingApt.value = null;
  } catch (e) {
    alert('操作失敗');
  }
}



onMounted(() => {
  initGarageData();
});
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] bg-[#f5f4f0] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#4a4a43]">預約排程</h1>
        <p class="mt-2 text-stone-500">管理客戶預約與維修進度</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingGarage" class="flex h-[50vh] w-full items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#6B6B5C] border-t-transparent"></div>
          <div class="text-xl font-bold text-[#6B6B5C]">系統載入中...</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="noGarageError" class="flex h-[50vh] w-full items-center justify-center p-6">
      <div class="max-w-md text-center">
        <h2 class="mb-4 text-2xl font-bold text-[#4A4A45]">找不到任何車廠資料</h2>
        <p class="mb-6 text-stone-500">
          資料庫可能是空的，請先在資料庫建立至少一筆車廠資料。
        </p>
      </div>
    </div>

    <!-- Appointments Content -->
    <div v-else class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <!-- 搜尋和篩選區塊 -->
      <div class="rounded-xl border border-[#DCD9D3] bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="relative w-full max-w-sm">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              v-model="apptSearch"
              type="text"
              placeholder="搜尋姓名、車牌、手機號碼..."
              class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] py-2.5 pl-10 pr-4 text-sm text-[#4A4A45] outline-none transition focus:border-[#6B6B5C] focus:bg-white focus:ring-1 focus:ring-[#6B6B5C]"
            >
          </div>
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F0EEE9] pt-4">
          <span class="mr-2 text-sm font-medium text-stone-500">篩選狀態：</span>
          <label
            v-for="opt in statusOptions"
            :key="opt.value"
            class="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all"
            :class="apptFilterStatuses.has(opt.value)
              ? 'border-[#6B6B5C] bg-[#6B6B5C] text-white'
              : 'border-[#DCD9D3] bg-white text-stone-500 hover:border-[#6B6B5C] hover:text-[#4A4A45]'"
          >
            <input
              type="checkbox"
              :checked="apptFilterStatuses.has(opt.value)"
              @change="toggleStatusFilter(opt.value)"
              class="sr-only"
            >
            <svg v-if="apptFilterStatuses.has(opt.value)" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span :class="apptFilterStatuses.has(opt.value) ? 'font-medium' : ''">{{ opt.label }}</span>
          </label>
        </div>
      </div>

      <!-- 預約列表 -->
      <div class="space-y-4">
        <div
          v-for="apt in filteredAppointments"
          :key="apt.id"
          class="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center"
        >
          <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getStatusBorderClass(apt.status)"></div>
          <div class="flex-1 pl-4">
            <div class="flex flex-wrap items-center gap-3">
              <span class="font-mono text-xs text-stone-400">#{{ apt.id }}</span>
              <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" :class="getStatusClass(apt.status)">
                {{ getStatusLabel(apt.status) }}
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-3">
              <h3 class="text-lg font-bold text-[#4A4A45]">{{ apt.customer_name }}</h3>
              <span class="text-sm text-stone-500">{{ apt.car_model }} <span class="text-stone-300">|</span> {{ apt.license_plate }}</span>
            </div>
            <div class="mt-1 text-sm text-stone-500">{{ apt.service_type }} <span v-if="apt.notes" class="ml-2 text-[#8C7B5D]">★ {{ apt.notes }}</span></div>
          </div>
          <div class="flex flex-col gap-1 pl-4 lg:w-48 lg:border-l lg:border-[#F0EEE9] lg:pl-6">
            <div class="flex items-center gap-2 text-sm text-stone-600">
              <svg class="h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4"/>
                <path d="M8 2v4"/>
                <path d="M3 10h18"/>
              </svg>
              {{ apt.scheduled_date }}
            </div>
            <div class="flex items-center gap-2 text-sm text-stone-600">
              <svg class="h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {{ apt.scheduled_time?.slice(0, 5) }}
            </div>
          </div>
          <div class="flex items-center justify-end pl-4 lg:w-32 lg:pl-0">
            <div class="text-right">
              <div class="text-xs text-stone-400">預估費用</div>
              <div class="font-bold text-[#4A4A45]">{{ formatCurrency(apt.estimated_cost) }}</div>
            </div>
          </div>
          <div class="mt-4 flex w-full gap-2 border-t border-[#F0EEE9] pt-4 lg:mt-0 lg:w-auto lg:flex-col lg:border-0 lg:pt-0">
            <button v-if="apt.status === 'pending'" @click="openConfirmConfirm(apt)" class="flex-1 rounded bg-[#6B6B5C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#5a5a4d] lg:w-28">確認訂單</button>
            <button v-else-if="apt.status === 'confirmed'" @click="openServicingConfirm(apt)" class="flex-1 rounded bg-[#6B6B5C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#5a5a4d] lg:w-28">開始作業</button>
            <button v-else-if="apt.status === 'servicing'" @click="openCompleteConfirm(apt)" class="flex-1 rounded bg-[#6B6B5C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#5a5a4d] lg:w-28">完成訂單</button>
            <button @click="openEditModal(apt)" class="flex-1 rounded border border-[#DCD9D3] bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-[#F8F7F5] lg:w-28">編輯</button>
          </div>
        </div>
        <div v-if="filteredAppointments.length === 0" class="rounded-xl border border-dashed border-stone-300 p-12 text-center">
          <p class="text-stone-400">沒有符合條件的預約</p>
        </div>
      </div>
    </div>

    <!-- 編輯 Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#FBFAF7] shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <div class="flex shrink-0 items-center justify-between border-b border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
          <h3 class="text-lg font-bold text-[#4A4A45]">編輯預約單</h3>
          <button @click="closeEditModal" class="rounded-full p-1 text-stone-400 hover:bg-black/5 hover:text-stone-600">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="flex-1 space-y-6 overflow-y-auto p-6">
          <div class="rounded-xl bg-[#F8F7F5] p-4 text-sm border border-[#E6E6DF]">
            <div class="grid grid-cols-2 gap-y-3">
              <div>
                <span class="block text-xs text-stone-400">預約編號</span>
                <span class="font-mono font-medium text-[#4A4A45]">#{{ editingForm.id }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">客戶姓名</span>
                <span class="font-bold text-[#4A4A45]">{{ editingForm.customerName }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">車型</span>
                <span class="text-stone-600">{{ editingForm.carModel }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">維修項目</span>
                <span class="text-stone-600">{{ editingForm.serviceType }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#4A4A45]">訂單狀態</label>
              <select v-model="editingForm.status" class="w-full rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
                <option value="pending">待確認 (Pending)</option>
                <option value="confirmed">已排程 (Confirmed)</option>
                <option value="servicing">作業中 (Servicing)</option>
                <option value="cancelled">已取消 (Cancelled)</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#4A4A45]">預估費用</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">NT$</span>
                <input v-model.number="editingForm.estimatedCost" type="number" class="w-full rounded-lg border border-[#DCD9D3] bg-white py-2.5 pl-12 pr-4 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#4A4A45]">備註事項</label>
              <textarea v-model="editingForm.notes" rows="3" class="w-full resize-none rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="輸入備註..."></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-bold text-[#4A4A45]">報價單圖片</label>
              <div v-if="!editingForm.quotationImage" class="relative h-40 w-full overflow-hidden rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] transition-colors hover:border-[#6B6B5C]">
                <input type="file" accept="image/*" class="absolute inset-0 z-10 cursor-pointer opacity-0" @change="onQuotationImageChange">
                <div class="flex h-full flex-col items-center justify-center text-stone-400">
                  <svg class="mb-2 h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span class="text-sm font-medium">點擊上傳報價單圖片</span>
                  <span class="mt-1 text-xs text-stone-400">支援 JPG, PNG, WebP</span>
                </div>
              </div>
              <div v-else class="group relative overflow-hidden rounded-xl border border-[#DCD9D3]">
                <img :src="editingForm.quotationImage" class="w-full object-contain max-h-64" alt="報價單">
                <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <label class="cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-sm transition hover:bg-[#F8F7F5]">
                    <input type="file" accept="image/*" class="hidden" @change="onQuotationImageChange">
                    更換圖片
                  </label>
                  <button @click="removeQuotationImage" class="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-red-600">
                    移除圖片
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex shrink-0 items-center justify-between border-t border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
          <button @click="confirmRemove" class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
            移除預約
          </button>
          <div class="flex items-center gap-3">
            <button @click="closeEditModal" class="rounded-lg border border-[#DCD9D3] bg-white px-5 py-2.5 text-sm font-medium text-stone-600 shadow-sm transition hover:bg-[#F8F7F5]">
              取消
            </button>
            <button @click="saveEdit" class="rounded-lg bg-[#6B6B5C] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] active:scale-95">
              儲存變更
            </button>
          </div>
        </div>
        <!-- 刪除確認 Modal（嵌套在編輯 Modal 內） -->
        <div v-if="showRemoveConfirm" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
          <div class="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h4 class="text-lg font-bold text-[#4A4A45]">確定移除此預約？</h4>
            <p class="mt-2 text-sm text-stone-500">此操作無法復原，預約資料將被永久刪除。</p>
            <div class="mt-6 flex gap-3">
              <button @click="cancelRemove" class="flex-1 rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-[#F8F7F5]">
                取消
              </button>
              <button @click="removeAppointment" class="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600">
                確定移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 完成訂單確認 Modal -->
    <div v-if="showCompleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C2CCB8] text-[#5A6650]">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h4 class="text-lg font-bold text-[#4A4A45]">確定完成此訂單？</h4>
        <p class="mt-2 text-sm text-stone-500">送出後將通知客戶可以取車，並將此訂單移至完工維修記錄。</p>
        <div v-if="pendingCompleteApt" class="mt-4 rounded-lg bg-[#F8F7F5] p-3 text-sm">
          <div class="flex justify-between">
            <span class="text-stone-500">客戶</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingCompleteApt.customer_name }}</span>
          </div>
          <div class="mt-1 flex justify-between">
            <span class="text-stone-500">車牌</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingCompleteApt.license_plate }}</span>
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button @click="cancelComplete" class="flex-1 rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-[#F8F7F5]">
            取消
          </button>
          <button @click="confirmComplete" class="flex-1 rounded-lg bg-[#6B6B5C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#5a5a4d]">
            確定送出
          </button>
        </div>
      </div>
    </div>

    <!-- 確認訂單 Modal -->
    <div v-if="showConfirmConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D6DCD9] text-[#5C6B66]">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h4 class="text-lg font-bold text-[#4A4A45]">確定接受此預約？</h4>
        <p class="mt-2 text-sm text-stone-500">確認後將通知客戶預約已接受，訂單狀態將變更為「已排程」。</p>
        <div v-if="pendingConfirmApt" class="mt-4 rounded-lg bg-[#F8F7F5] p-3 text-sm">
          <div class="flex justify-between">
            <span class="text-stone-500">客戶</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingConfirmApt.customer_name }}</span>
          </div>
          <div class="mt-1 flex justify-between">
            <span class="text-stone-500">車牌</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingConfirmApt.license_plate }}</span>
          </div>
          <div class="mt-1 flex justify-between">
            <span class="text-stone-500">預約時間</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingConfirmApt.scheduled_date }} {{ pendingConfirmApt.scheduled_time?.slice(0, 5) }}</span>
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button @click="cancelConfirmDialog" class="flex-1 rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-[#F8F7F5]">
            取消
          </button>
          <button @click="confirmAppointment" class="flex-1 rounded-lg bg-[#6B6B5C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#5a5a4d]">
            確定接受
          </button>
        </div>
      </div>
    </div>

    <!-- 開始作業 Modal -->
    <div v-if="showServicingConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C2CCB8] text-[#5A6650]">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <h4 class="text-lg font-bold text-[#4A4A45]">確定開始維修作業？</h4>
        <p class="mt-2 text-sm text-stone-500">確認後訂單狀態將變更為「作業中」，技師可以開始進行維修。</p>
        <div v-if="pendingServicingApt" class="mt-4 rounded-lg bg-[#F8F7F5] p-3 text-sm">
          <div class="flex justify-between">
            <span class="text-stone-500">客戶</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingServicingApt.customer_name }}</span>
          </div>
          <div class="mt-1 flex justify-between">
            <span class="text-stone-500">車牌</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingServicingApt.license_plate }}</span>
          </div>
          <div class="mt-1 flex justify-between">
            <span class="text-stone-500">維修項目</span>
            <span class="font-medium text-[#4A4A45]">{{ pendingServicingApt.service_type }}</span>
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button @click="cancelServicingDialog" class="flex-1 rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-[#F8F7F5]">
            取消
          </button>
          <button @click="startServicing" class="flex-1 rounded-lg bg-[#6B6B5C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#5a5a4d]">
            確定開始
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
