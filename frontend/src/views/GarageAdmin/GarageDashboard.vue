<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import { useAppointments } from '@/composables/garage/useAppointments';

const router = useRouter();

// Garage ID
const garageId = ref<number | null>(null);
const isLoadingGarage = ref(true);
const noGarageError = ref(false);

// 預約資料相關 (需要等 garageId 取得後才能初始化)
let appointmentsComposable: ReturnType<typeof useAppointments> | null = null;
const appointments = ref<any[]>([]);
const dashboardStats = ref({ todayCount: 0, pendingCount: 0, servicingCount: 0 });

const todayAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return appointments.value
    .filter((a) => a.scheduled_date === today)
    .slice(0, 3);
});

// 狀態相關的輔助函數
type ApptStatus = 'pending' | 'confirmed' | 'servicing' | 'cancelled' | 'completed';

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

// 導航到預約排程頁面
function goToAppointments() {
  router.push({ name: 'garage-admin-appointments' });
}

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

    // 嘗試根據當前用戶查詢 garage (如果有 owner_id 欄位)
    let { data: garages, error } = await supabase
      .from('garages')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle();

    // 如果 owner_id 欄位不存在，則查詢第一筆資料（開發測試用）
    if (error && error.message.includes('owner_id')) {
      console.log('DEV MODE: owner_id 欄位不存在，查詢第一筆資料');
      const result = await supabase
        .from('garages')
        .select('id')
        .limit(1)
        .maybeSingle();
      garages = result.data;
      error = result.error;
    }

    if (error) {
      console.error('查詢 garage 失敗:', error);
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }

    if (!garages) {
      console.warn('找不到 garage 資料');
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }

    garageId.value = garages.id;
    console.log('使用 garage ID:', garageId.value);

    // 確保 garageId 不為 null 才初始化 composable
    if (!garageId.value) {
      noGarageError.value = true;
      return;
    }

    // 初始化 composable（傳入 garageId）
    appointmentsComposable = useAppointments(garageId.value);

    // 取得預約資料
    await appointmentsComposable.fetchAppointments();

    // 將 composable 的資料同步到本地 ref
    appointments.value = appointmentsComposable.appointments.value;
    dashboardStats.value = appointmentsComposable.dashboardStats.value;
  } catch (e) {
    console.error('初始化失敗:', e);
    noGarageError.value = true;
  } finally {
    isLoadingGarage.value = false;
  }
}

onMounted(() => {
  initGarageData();
});
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] bg-[#f5f4f0] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#4a4a43]">總覽</h1>
        <p class="mt-2 text-stone-500">今日維修廠營運概況</p>
      </div>

      <div v-if="isLoadingGarage" class="flex h-[50vh] w-full items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#6B6B5C] border-t-transparent"></div>
          <div class="text-xl font-bold text-[#6B6B5C]">系統載入中...</div>
        </div>
      </div>

      <div v-else-if="noGarageError" class="flex h-[50vh] w-full items-center justify-center p-6">
      <div class="max-w-md text-center">
        <h2 class="mb-4 text-2xl font-bold text-[#4A4A45]">找不到任何車廠資料</h2>
        <p class="mb-6 text-stone-500">
          資料庫可能是空的，請先在資料庫建立至少一筆車廠資料。
        </p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
              <div class="text-xs font-bold text-stone-400">{{ apt.scheduled_time?.slice(0, 5) }}</div>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-[#4A4A45]">{{ apt.customer_name }}</span>
                <span class="text-xs text-stone-400">{{ apt.car_model }}</span>
              </div>
              <div class="text-sm text-stone-500">{{ apt.service_type }}</div>
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
