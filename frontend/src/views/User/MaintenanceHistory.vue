<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useUserAppointments } from '@/composables/user/useUserAppointments';
import type { Appointment as ApiAppointment } from '@/composables/garage/types';
import { supabase } from '@/lib/supabase';

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
  quoteItems?: { name: string; price?: number | null; isAddon?: boolean }[];
};

const { appointments: apiAppointments, loading, error, fetchAppointmentsByPhone } = useUserAppointments();
const SearchQuery = ref<string>('');
const ActiveFilter = ref<FilterType>('all');
const ShowQuoteDetails = ref<Record<string, boolean>>({});
const userPhone = ref('');

// 載入用戶電話
const loadUserPhone = async () => {
  if (!authStore.user?.id) return;

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone')
      .eq('user_id', authStore.user.id)
      .single();

    if (profile?.phone) {
      userPhone.value = profile.phone;
      await fetchAppointmentsByPhone(profile.phone);
    }
  } catch (err) {
    console.error('載入用戶電話失敗:', err);
  }
};

onMounted(() => {
  loadUserPhone();
});

const convertApiStatus = (status: string): AppointmentStatus => {
  if (status === 'completed') return 'completed';
  return 'in_progress';
};

const formatApiDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatApiTime = (timeStr?: string) => {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
};

const HistoryAppointments = computed<Appointment[]>(() => {
  return apiAppointments.value.map((apt: ApiAppointment) => ({
    id: String(apt.id),
    carModel: apt.car_model || '未提供車型',
    licensePlate: apt.license_plate || '未提供車牌',
    serviceType: apt.service_type || '未指定服務',
    appointmentDate: formatApiDate(apt.scheduled_date),
    appointmentTime: formatApiTime(apt.scheduled_time),
    status: convertApiStatus(apt.status),
    shopName: '維修廠',
    shopAddress: '請聯絡維修廠確認地址',
    notes: apt.notes || '無備註',
    quoteItems: apt.estimated_cost ? [{ name: '服務費用', price: apt.estimated_cost, isAddon: false }] : [],
  }));
});

const FilteredHistoryAppointments = computed(() => {
  let list = HistoryAppointments.value;

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

const StatusMap: Record<AppointmentStatus, { label: string; color: string }> = {
  in_progress: { label: '維修中', color: 'text-[#2F2E2A] border-[#6B6B5C] bg-[#f5f4f0]' },
  completed: { label: '已取車', color: 'text-[#6B6B5C] border-[#d0cdc7] bg-[#f0ede8]' },
};

const FormatCurrency = (val: number) =>
  new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);

const QuoteTotal = (apt: Appointment) => {
  return (apt.quoteItems ?? []).reduce((sum, item) => (typeof item.price === 'number' ? sum + item.price : sum), 0);
};
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
          class="rounded-2xl border border-[#e8e4dc] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <div class="mb-4 flex flex-col justify-between gap-4 sm:flex-row">
            <div class="min-w-0 flex-1">
              <div class="mb-2 flex items-center gap-3">
                <h3 class="text-lg font-bold text-[#4a4540]">{{ apt.carModel }}</h3>
                <span class="text-sm font-medium text-[#6B6B5C]">{{ apt.licensePlate }}</span>
              </div>
              <p class="text-sm text-[#6b6460]">維修項目：{{ apt.serviceType }}</p>
            </div>
            <span
              :class="[
                'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold self-start',
                StatusMap[apt.status].color
              ]"
            >
              {{ StatusMap[apt.status].label }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-y-4 border-t border-[#e8e4dc] pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-xl text-[#6B6B5C]">calendar_today</span>
              <div class="min-w-0">
                <p class="text-xs font-bold text-[#6B6B5C]">日期</p>
                <p class="truncate text-sm font-medium text-[#4a4540]">{{ apt.appointmentDate }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-xl text-[#6B6B5C]">schedule</span>
              <div class="min-w-0">
                <p class="text-xs font-bold text-[#6B6B5C]">時間</p>
                <p class="truncate text-sm font-medium text-[#4a4540]">{{ apt.appointmentTime }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-xl text-[#6B6B5C]">store</span>
              <div class="min-w-0">
                <p class="text-xs font-bold text-[#6B6B5C]">店家</p>
                <p class="truncate text-sm font-medium text-[#4a4540]">{{ apt.shopName }}</p>
              </div>
            </div>
          </div>

          <!-- 報價單折疊 -->
          <div v-if="apt.quoteItems && apt.quoteItems.length > 0" class="mt-4 border-t border-[#e8e4dc] pt-4">
            <button
              @click="ShowQuoteDetails[apt.id] = !ShowQuoteDetails[apt.id]"
              class="flex w-full items-center justify-between rounded-lg bg-[#f9f7f4] px-4 py-3 transition-colors hover:bg-[#e8e4dc]"
            >
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#6B6B5C]">request_quote</span>
                <span class="font-medium text-[#4a4540]">查看報價單</span>
              </div>
              <span
                class="material-symbols-outlined text-[#6B6B5C] transition-transform duration-300"
                :class="{ 'rotate-180': ShowQuoteDetails[apt.id] }"
              >
                expand_more
              </span>
            </button>
            <div
              v-if="ShowQuoteDetails[apt.id]"
              class="mt-3 rounded-lg border border-[#e8e4dc] bg-[#f9f7f4] p-4"
            >
              <div class="flex flex-col items-center justify-center gap-2 py-2">
                <span class="text-base font-bold text-[#4a4540]">預估總計金額</span>
                <span class="text-3xl font-bold text-[#6B6B5C]">{{ FormatCurrency(QuoteTotal(apt)) }}</span>
              </div>
            </div>
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
  </div>
</template>
