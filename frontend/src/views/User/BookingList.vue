<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

if (!authStore.isAuthenticated) {
  router.push('/');
}

// ==================== 類型定義 ====================
type BookingStatus = 'pending' | 'confirmed' | 'servicing' | 'completed' | 'cancelled';

type Booking = {
  id: number;
  customer_name: string;
  customer_phone: string;
  car_model: string;
  license_plate: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  status: BookingStatus;
  notes?: string;
  estimated_cost?: number;
};

// ==================== 假資料 ====================
const appointments = ref<Booking[]>([
  {
    id: 1,
    customer_name: 'Wei Yun',
    customer_phone: '0922-355-358',
    car_model: 'BMW X2',
    license_plate: 'NDT-199',
    service_type: '定期保養',
    scheduled_date: '2026-01-31',
    scheduled_time: '10:00',
    status: 'servicing',
    notes: '自備機油',
  },
  {
    id: 2,
    customer_name: 'Wei Yun',
    customer_phone: '0922-355-358',
    car_model: 'BMW X2',
    license_plate: 'NDT-199',
    service_type: '引擎異音檢查',
    scheduled_date: '2026-01-31',
    scheduled_time: '10:00',
    status: 'confirmed',
    notes: '右前輪也有異音',
  },
  {
    id: 3,
    customer_name: '陳阿龍',
    customer_phone: '0912-345-678',
    car_model: 'Tesla Model 3',
    license_plate: 'EAA-9999',
    service_type: '輪胎更換',
    scheduled_date: '2026-01-31',
    scheduled_time: '10:00',
    status: 'pending',
    estimated_cost: 18000,
  },
  {
    id: 4,
    customer_name: '陳阿龍',
    customer_phone: '0912-345-678',
    car_model: 'Mini Cooper',
    license_plate: 'MIN-5678',
    service_type: '冷氣健檢',
    scheduled_date: '2026-01-31',
    scheduled_time: '10:00',
    status: 'pending',
    estimated_cost: 800,
  },
]);

// 只顯示已確認的預約
const confirmedAppointments = computed(() =>
  appointments.value.filter((apt) => apt.status === 'confirmed')
);

const loading = ref(false);
const error = ref('');

// 查看詳情彈窗（與維修歷史一致）
const showDetailModal = ref(false);
const selectedBooking = ref<Booking | null>(null);

function openDetailModal(apt: Booking) {
  selectedBooking.value = apt;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  selectedBooking.value = null;
}

const statusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待確認',
    confirmed: '已確認',
    servicing: '服務中',
    completed: '已完成',
    cancelled: '已取消',
  };
  return statusMap[status] || status;
};

const statusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'bg-[#E8DCC2] text-[#8C7B5D]',
    confirmed: 'bg-[#D6DCD9] text-[#5C6B66]',
    servicing: 'bg-[#C2CCB8] text-[#5A6650]',
    completed: 'bg-[#D0E8D0] text-[#4A7A4A]',
    cancelled: 'bg-[#E8C2C2] text-[#8C5D5D]',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

const getStatusBorderClass = (status: string) => {
  const borderMap: Record<string, string> = {
    pending: 'bg-[#D4C4A8]',
    confirmed: 'bg-[#A8B8B2]',
    servicing: 'bg-[#A8B89E]',
    completed: 'bg-[#9EC09E]',
    cancelled: 'bg-[#C4A8A8]',
  };
  return borderMap[status] || 'bg-gray-300';
};

const formatCurrency = (val?: number) => {
  if (!val) return 'NT$0';
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return '—';
  return timeStr.substring(0, 5);
};
</script>

<template>
  <div class="min-h-screen bg-[#EBE8E3]">
    <header class="bg-[#f9f7f4] border-b border-[#e0dbd3]">
      <div class="max-w-5xl mx-auto px-6 py-5">
        <h1 class="text-[#4a4540] tracking-wide">預約記錄</h1>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <!-- Loading 狀態 -->
      <div v-if="loading" class="bg-white rounded-2xl border border-[#e8e4dc] p-10 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#6B6B5C] border-t-transparent mb-4"></div>
        <p class="text-sm font-medium text-[#6b6460]">載入中...</p>
      </div>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- 無預約 -->
      <div v-else-if="confirmedAppointments.length === 0" class="bg-white rounded-2xl border border-[#e8e4dc] p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#f9f7f4] rounded-full mb-4">
          <span class="material-symbols-outlined text-[#6B6B5C] text-3xl">event_busy</span>
        </div>
        <h3 class="text-lg font-semibold text-[#4a4540] mb-2">尚無預約記錄</h3>
        <p class="text-sm text-[#6b6460]">您目前沒有任何預約記錄</p>
      </div>

      <!-- 預約列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="apt in confirmedAppointments"
          :key="apt.id"
          class="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center"
        >
          <!-- 左側狀態邊條 -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getStatusBorderClass(apt.status)"></div>

          <!-- 主要資訊 -->
          <div class="flex-1 pl-4">
            <div class="flex flex-wrap items-center gap-3">
              <span class="font-mono text-xs text-stone-400">APT-2026-00{{ apt.id }}</span>
              <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" :class="statusColor(apt.status)">
                {{ statusText(apt.status) }}
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-3">
              <h3 class="text-lg font-bold text-[#4A4A45]">{{ apt.customer_name }}</h3>
              <span class="text-sm text-stone-500">{{ apt.car_model }} <span class="text-stone-300">|</span> {{ apt.license_plate }}</span>
            </div>
            <div class="mt-1 text-sm text-stone-500">
              {{ apt.service_type }}
              <span v-if="apt.notes" class="ml-2 text-[#8C7B5D]">★ {{ apt.notes }}</span>
            </div>
          </div>

          <!-- 日期時間 -->
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
              {{ apt.scheduled_time }}
            </div>
          </div>

          <!-- 預估費用 -->
          <div class="flex items-center justify-end pl-4 lg:w-32 lg:pl-0">
            <div class="text-right">
              <div class="text-xs text-stone-400">預估費用</div>
              <div class="font-bold text-[#4A4A45]">{{ formatCurrency(apt.estimated_cost) }}</div>
            </div>
          </div>

          <!-- 操作按鈕：查看詳情 -->
          <div class="mt-4 flex w-full gap-2 border-t border-[#F0EEE9] pt-4 lg:mt-0 lg:w-auto lg:border-0 lg:pt-0">
            <button
              @click="openDetailModal(apt)"
              class="flex-1 rounded border border-[#DCD9D3] bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-[#F8F7F5] lg:w-28"
            >
              查看詳情
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 預約詳情彈窗（與維修歷史詳情樣式一致） -->
    <div
      v-if="showDetailModal && selectedBooking"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeDetailModal"
    >
      <div class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#FBFAF7] shadow-2xl">
        <!-- Header -->
        <div class="flex shrink-0 items-center justify-between border-b border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
          <h3 class="text-lg font-bold text-[#4A4A45]">預約詳情</h3>
          <button @click="closeDetailModal" class="rounded-full p-1 text-stone-400 hover:bg-black/5 hover:text-stone-600">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- 內容 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- 預約資訊 -->
          <div class="rounded-xl bg-[#F8F7F5] p-4 text-sm border border-[#E6E6DF]">
            <div class="grid grid-cols-2 gap-y-3">
              <div>
                <span class="block text-xs text-stone-400">預約編號</span>
                <span class="font-mono font-medium text-[#4A4A45]">APT-2026-00{{ selectedBooking.id }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">預約狀態</span>
                <span class="font-medium text-[#4A4A45]">{{ statusText(selectedBooking.status) }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">車型</span>
                <span class="text-stone-600">{{ selectedBooking.car_model }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">車牌</span>
                <span class="text-stone-600">{{ selectedBooking.license_plate }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">服務類型</span>
                <span class="text-stone-600">{{ selectedBooking.service_type }}</span>
              </div>
              <div>
                <span class="block text-xs text-stone-400">聯絡電話</span>
                <span class="text-stone-600">{{ selectedBooking.customer_phone }}</span>
              </div>
            </div>
          </div>

          <!-- 預約日期時間 -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">預約日期</label>
            <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45]">
              {{ formatDate(selectedBooking.scheduled_date) }}
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">預約時間</label>
            <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45]">
              {{ formatTime(selectedBooking.scheduled_time) }}
            </div>
          </div>

          <!-- 預估費用 -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">預估費用</label>
            <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45]">
              {{ formatCurrency(selectedBooking.estimated_cost) }}
            </div>
          </div>

          <!-- 備註事項 -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">備註事項</label>
            <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45] min-h-[60px]">
              {{ selectedBooking.notes || '無' }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex shrink-0 items-center justify-end border-t border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
          <button
            @click="closeDetailModal"
            class="rounded-lg bg-[#6B6B5C] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] active:scale-95"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
