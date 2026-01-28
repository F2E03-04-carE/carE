<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 類型定義
type ApptStatus = 'pending' | 'confirmed' | 'servicing' | 'cancelled';

type Appointment = {
  id: string;
  customerName: string;
  phone: string;
  carModel: string;
  licensePlate: string;
  serviceType: string;
  date: string;
  time: string;
  status: ApptStatus;
  notes?: string;
  estimatedCost: number;
};

// 假資料
const appointments = ref<Appointment[]>([
  {
    id: 'APT-2026-001',
    customerName: '王貓貓',
    phone: '0912-345-678',
    carModel: 'Toyota Camry',
    licensePlate: 'ABC-1234',
    serviceType: '定期保養',
    date: '2026-01-18',
    time: '09:30',
    status: 'servicing',
    estimatedCost: 3500,
    notes: '自備機油',
  },
  {
    id: 'APT-2026-002',
    customerName: '李貓貓',
    phone: '0923-456-789',
    carModel: 'Honda CR-V',
    licensePlate: 'KLM-7788',
    serviceType: '煞車異音檢查',
    date: '2026-01-18',
    time: '10:30',
    status: 'confirmed',
    estimatedCost: 1200,
    notes: '右前輪有異音',
  },
  {
    id: 'APT-2026-003',
    customerName: '陳貓貓',
    phone: '0988-112-233',
    carModel: 'Tesla Model 3',
    licensePlate: 'EAA-9999',
    serviceType: '輪胎更換',
    date: '2026-01-18',
    time: '14:00',
    status: 'pending',
    estimatedCost: 18000,
  },
  {
    id: 'APT-2026-004',
    customerName: '林貓貓',
    phone: '0955-666-777',
    carModel: 'Mini Cooper',
    licensePlate: 'MIN-5678',
    serviceType: '冷氣健檢',
    date: '2026-01-19',
    time: '11:00',
    status: 'pending',
    estimatedCost: 800,
  },
]);

// 統計資料
const dashboardStats = computed(() => {
  const today = '2026-01-18';
  const todayAppts = appointments.value.filter(a => a.date === today);
  const pending = appointments.value.filter(a => a.status === 'pending');
  const servicing = appointments.value.filter(a => a.status === 'servicing');

  return {
    todayCount: todayAppts.length,
    pendingCount: pending.length,
    servicingCount: servicing.length,
  };
});

// 今日需關注的預約
const todayAppointments = computed(() => {
  const today = '2026-01-18';
  return appointments.value
    .filter(a => a.date === today)
    .slice(0, 3);
});

// 狀態相關的輔助函數
function getStatusLabel(s: ApptStatus) {
  const map: Record<ApptStatus, string> = {
    pending: '待確認',
    confirmed: '已排程',
    servicing: '作業中',
    cancelled: '已取消',
  };
  return map[s] || s;
}

function getStatusClass(s: ApptStatus) {
  switch (s) {
    case 'pending': return 'bg-[#E8DCC2] text-[#8C7B5D]';
    case 'confirmed': return 'bg-[#D6DCD9] text-[#5C6B66]';
    case 'servicing': return 'bg-[#C2CCB8] text-[#5A6650]';
    case 'cancelled': return 'bg-[#E8C2C2] text-[#8C5D5D]';
    default: return '';
  }
}

// 導航到預約排程頁面
function goToAppointments() {
  router.push({ name: 'garage-admin-appointments' });
}
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] bg-[#f5f4f0] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#4a4a43]">總覽</h1>
        <p class="mt-2 text-stone-500">今日維修廠營運概況</p>
      </div>

      <!-- Dashboard Content -->
      <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <!-- 統計卡片 -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 今日預約數 -->
          <div class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm hover:shadow-md transition duration-300">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-stone-400">今日預約數</p>
                <p class="mt-2 text-3xl font-bold text-[#4A4A45]">{{ dashboardStats.todayCount }}</p>
              </div>
              <div class="rounded-full bg-[#D6DCD9] p-2 text-[#5C6B66]">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4"/>
                  <path d="M8 2v4"/>
                  <path d="M3 10h18"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- 待確認訂單 -->
          <div class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm hover:shadow-md transition duration-300">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-stone-400">待確認訂單</p>
                <p class="mt-2 text-3xl font-bold text-[#4A4A45]">{{ dashboardStats.pendingCount }}</p>
              </div>
              <div class="rounded-full bg-[#E8DCC2] p-2 text-[#8C7B5D]">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- 正在作業中 -->
          <div class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm hover:shadow-md transition duration-300">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-stone-400">正在作業中</p>
                <p class="mt-2 text-3xl font-bold text-[#4A4A45]">{{ dashboardStats.servicingCount }}</p>
              </div>
              <div class="rounded-full bg-[#C2CCB8] p-2 text-[#5A6650]">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 今日需關注 -->
        <div class="rounded-xl border border-[#DCD9D3] bg-white p-8 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#4A4A45]">今日需關注</h3>
            <button
              @click="goToAppointments"
              class="text-sm font-medium text-[#6B6B5C] hover:text-[#5a5a4d] hover:underline"
            >
              查看全部 &rarr;
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="apt in todayAppointments"
              :key="apt.id"
              class="flex items-center gap-4 rounded-lg bg-[#F8F7F5] p-4 border border-[#F0EEE9]"
            >
              <div class="w-16 text-center">
                <div class="text-xs font-bold text-stone-400">{{ apt.time }}</div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-[#4A4A45]">{{ apt.customerName }}</span>
                  <span class="text-xs text-stone-400">{{ apt.carModel }}</span>
                </div>
                <div class="text-sm text-stone-500">{{ apt.serviceType }}</div>
              </div>
              <div>
                <span
                  class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
                  :class="getStatusClass(apt.status)"
                >
                  {{ getStatusLabel(apt.status) }}
                </span>
              </div>
            </div>
            <div v-if="todayAppointments.length === 0" class="text-center text-stone-400 text-sm py-4">
              目前沒有今日預約資料
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
