<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

if (!authStore.isAuthenticated) {
  router.push('/');
}

type AppointmentStatus = 'in_progress' | 'completed';
type FilterType = 'all' | AppointmentStatus;

type Appointment = {
  id: string;
  carModel: string;
  licensePlate: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  shopName: string;
  shopAddress: string;
  notes: string;
  estimatedCost: number;
  quotationImage?: string;  // 報價單圖片 URL
};

// ==================== 假資料 ====================
const mockHistoryAppointments = ref<Appointment[]>([
  {
    id: 'APT-2026-001',
    carModel: 'Toyota Camry',
    licensePlate: 'ABC-1234',
    serviceType: '定期保養',
    appointmentDate: '2026/01/18',
    appointmentTime: '09:30',
    status: 'in_progress',
    shopName: '貓貓汽車保養廠',
    shopAddress: '台北市大安區忠孝東路四段100號',
    notes: '自備機油',
    estimatedCost: 3500,
    quotationImage: '',  // 預留：後台回傳報價單圖片 URL
  },
  {
    id: 'APT-2026-002',
    carModel: 'Honda CR-V',
    licensePlate: 'KLM-7788',
    serviceType: '煞車異音檢查',
    appointmentDate: '2026/01/18',
    appointmentTime: '10:30',
    status: 'in_progress',
    shopName: '喵喵汽車維修中心',
    shopAddress: '台北市信義區松仁路50號',
    notes: '右前輪有異音',
    estimatedCost: 1200,
    quotationImage: '',  // 預留：後台回傳報價單圖片 URL
  },
  {
    id: 'APT-2026-003',
    carModel: 'Tesla Model 3',
    licensePlate: 'EAA-9999',
    serviceType: '輪胎更換',
    appointmentDate: '2026/01/15',
    appointmentTime: '14:00',
    status: 'completed',
    shopName: '汪汪汽車服務站',
    shopAddress: '新北市板橋區中山路一段200號',
    notes: '四輪更換完成',
    estimatedCost: 18000,
    quotationImage: '',  // 預留：後台回傳報價單圖片 URL
  },
  {
    id: 'APT-2026-004',
    carModel: 'Mini Cooper',
    licensePlate: 'MIN-5678',
    serviceType: '冷氣健檢',
    appointmentDate: '2026/01/10',
    appointmentTime: '11:00',
    status: 'completed',
    shopName: '咪咪精修汽車',
    shopAddress: '台北市內湖區成功路三段88號',
    notes: '冷媒補充完成',
    estimatedCost: 800,
    quotationImage: '',  // 預留：後台回傳報價單圖片 URL
  },
]);

const loading = ref(false);
const error = ref('');
const SearchQuery = ref<string>('');
const ActiveFilter = ref<FilterType>('all');

// 報價單彈窗
const showQuoteModal = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

function openQuoteModal(apt: Appointment) {
  selectedAppointment.value = apt;
  showQuoteModal.value = true;
}

function closeQuoteModal() {
  showQuoteModal.value = false;
  selectedAppointment.value = null;
}

const FilteredHistoryAppointments = computed(() => {
  let list = mockHistoryAppointments.value;

  if (ActiveFilter.value !== 'all') {
    list = list.filter((apt) => apt.status === ActiveFilter.value);
  }

  const query = SearchQuery.value.trim().toLowerCase();
  if (query) {
    list = list.filter(
      (apt) =>
        apt.carModel.toLowerCase().includes(query) ||
        apt.licensePlate.toLowerCase().includes(query) ||
        apt.shopName.toLowerCase().includes(query) ||
        apt.serviceType.toLowerCase().includes(query)
    );
  }

  return list;
});

const StatusMap: Record<AppointmentStatus, { label: string; color: string; border: string }> = {
  in_progress: { label: '維修中', color: 'bg-[#C2CCB8] text-[#5A6650]', border: 'bg-[#A8B89E]' },
  completed: { label: '已取車', color: 'bg-[#D0E8D0] text-[#4A7A4A]', border: 'bg-[#9EC09E]' },
};

const FormatCurrency = (val: number) =>
  new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
</script>

<template>
  <div class="min-h-screen bg-[#EBE8E3]">
    <header class="bg-[#f9f7f4] border-b border-[#e0dbd3]">
      <div class="max-w-5xl mx-auto px-6 py-5">
        <h1 class="text-[#4a4540] tracking-wide">維修歷史</h1>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <!-- 篩選和搜尋 -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-[#e8e4dc] p-4 mb-6">
        <div class="flex flex-wrap gap-3">
          <button
            @click="ActiveFilter = 'all'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              ActiveFilter === 'all'
                ? 'bg-[#6B6B5C] text-white'
                : 'bg-[#f9f7f4] text-[#6b6460] hover:bg-[#e8e4dc]'
            ]"
          >
            全部
          </button>
          <button
            @click="ActiveFilter = 'in_progress'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              ActiveFilter === 'in_progress'
                ? 'bg-[#6B6B5C] text-white'
                : 'bg-[#f9f7f4] text-[#6b6460] hover:bg-[#e8e4dc]'
            ]"
          >
            維修中
          </button>
          <button
            @click="ActiveFilter = 'completed'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              ActiveFilter === 'completed'
                ? 'bg-[#6B6B5C] text-white'
                : 'bg-[#f9f7f4] text-[#6b6460] hover:bg-[#e8e4dc]'
            ]"
          >
            已完成
          </button>
        </div>
        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B5C] select-none">search</span>
          <input
            v-model="SearchQuery"
            type="text"
            placeholder="搜尋車型、車牌或服務..."
            class="w-full rounded-lg border border-[#e8e4dc] bg-[#f9f7f4] py-2 pl-10 pr-4 text-sm text-[#4a4540] placeholder-[#6B6B5C] transition-colors focus:border-[#6B6B5C] focus:outline-none"
          />
        </div>
      </div>

      <!-- Loading 狀態 -->
      <div v-if="loading" class="bg-white rounded-2xl border border-[#e8e4dc] p-10 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#6B6B5C] border-t-transparent mb-4"></div>
        <p class="text-sm font-medium text-[#6b6460]">載入中...</p>
      </div>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- 維修記錄列表 -->
      <div v-else-if="FilteredHistoryAppointments.length > 0" class="space-y-4">
        <div
          v-for="apt in FilteredHistoryAppointments"
          :key="apt.id"
          class="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center"
        >
          <!-- 左側狀態邊條 -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="StatusMap[apt.status].border"></div>
          
          <!-- 主要資訊 -->
          <div class="flex-1 pl-4">
            <div class="flex flex-wrap items-center gap-3">
              <span class="font-mono text-xs text-stone-400">{{ apt.id }}</span>
              <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" :class="StatusMap[apt.status].color">
                {{ StatusMap[apt.status].label }}
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-3">
              <h3 class="text-lg font-bold text-[#4A4A45]">{{ apt.carModel }}</h3>
              <span class="text-sm text-stone-500">{{ apt.licensePlate }}</span>
            </div>
            <div class="mt-1 text-sm text-stone-500">
              {{ apt.serviceType }}
              <span v-if="apt.notes" class="ml-2 text-[#8C7B5D]">★ {{ apt.notes }}</span>
            </div>
          </div>

          <!-- 日期時間與店家 -->
          <div class="flex flex-col gap-1 pl-4 lg:w-48 lg:border-l lg:border-[#F0EEE9] lg:pl-6">
            <div class="flex items-center gap-2 text-sm text-stone-600">
              <svg class="h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4"/>
                <path d="M8 2v4"/>
                <path d="M3 10h18"/>
              </svg>
              {{ apt.appointmentDate }}
            </div>
            <div class="flex items-center gap-2 text-sm text-stone-600">
              <svg class="h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {{ apt.appointmentTime }}
            </div>
            <div class="flex items-center gap-2 text-sm text-stone-600">
              <svg class="h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {{ apt.shopName }}
            </div>
          </div>

          <!-- 預估費用 -->
          <div class="flex items-center justify-end pl-4 lg:w-32 lg:pl-0">
            <div class="text-right">
              <div class="text-xs text-stone-400">預估費用</div>
              <div class="font-bold text-[#4A4A45]">{{ FormatCurrency(apt.estimatedCost) }}</div>
            </div>
          </div>

          <!-- 報價單按鈕 -->
          <div class="mt-4 flex w-full gap-2 border-t border-[#F0EEE9] pt-4 lg:mt-0 lg:w-auto lg:border-0 lg:pt-0">
            <button
              @click="openQuoteModal(apt)"
              class="flex-1 rounded border border-[#DCD9D3] bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-[#F8F7F5] lg:w-28"
            >
              查看詳情
            </button>
          </div>
        </div>
      </div>

      <!-- 無結果 -->
      <div v-else class="bg-white rounded-2xl border border-[#e8e4dc] p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#f9f7f4] rounded-full mb-4">
          <span class="material-symbols-outlined text-[#6B6B5C] text-3xl">event_busy</span>
        </div>
        <h3 class="text-lg font-semibold text-[#4a4540] mb-2">尚無維修記錄</h3>
        <p class="text-sm text-[#6b6460]">目前沒有符合條件的維修記錄</p>
      </div>
    </main>

    <!-- 報價單彈窗 -->
    <div 
      v-if="showQuoteModal && selectedAppointment" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeQuoteModal"
    >
      <div class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#FBFAF7] shadow-2xl">
        <!-- Header -->
        <div class="flex shrink-0 items-center justify-between border-b border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
          <h3 class="text-lg font-bold text-[#4A4A45]">維修單詳情</h3>
          <button @click="closeQuoteModal" class="rounded-full p-1 text-stone-400 hover:bg-black/5 hover:text-stone-600">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- 內容 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- 訂單資訊 -->
          <div class="rounded-xl bg-[#F8F7F5] p-4 text-sm border border-[#E6E6DF]">
            <div class="grid grid-cols-2 gap-y-3">
              <div>
                <span class="block text-xs text-stone-400">預約編號</span>
                <span class="font-mono font-medium text-[#4A4A45]">{{ selectedAppointment.id }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">維修廠</span>
                <span class="font-medium text-[#4A4A45]">{{ selectedAppointment.shopName }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">車型</span>
                <span class="text-stone-600">{{ selectedAppointment.carModel }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">維修項目</span>
                <span class="text-stone-600">{{ selectedAppointment.serviceType }}</span>
              </div>
            </div>
          </div>

          <!-- 訂單狀態 -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">訂單狀態</label>
            <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45]">
              {{ StatusMap[selectedAppointment.status].label }}
            </div>
          </div>

          <!-- 預估費用 -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">預估費用</label>
            <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45]">
              {{ FormatCurrency(selectedAppointment.estimatedCost) }}
            </div>
          </div>

          <!-- 備註事項 -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">備註事項</label>
            <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45] min-h-[60px]">
              {{ selectedAppointment.notes || '無' }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex shrink-0 items-center justify-between border-t border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
          <!-- 左側：下載報價單連結 -->
          <a 
            :href="selectedAppointment.quotationImage || '#'"
            target="_blank"
            download
            class="inline-flex items-center gap-1.5 text-sm font-medium text-[#8C7B5D] hover:text-[#6B5A3D] hover:underline cursor-pointer"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            下載報價單
          </a>
          
          <!-- 右側：關閉按鈕 -->
          <button 
            @click="closeQuoteModal" 
            class="rounded-lg bg-[#6B6B5C] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] active:scale-95"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
