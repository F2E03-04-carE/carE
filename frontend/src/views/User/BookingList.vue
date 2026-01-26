<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserAppointments } from '@/composables/user/useUserAppointments';
import type { Appointment } from '@/composables/garage/types';

const { appointments, loading, error, fetchAppointmentsByPhone, cancelAppointment } = useUserAppointments();

const phoneNumber = ref('');
const hasSearched = ref(false);
const showCancelModal = ref(false);
const appointmentToCancel = ref<Appointment | null>(null);
const cancelling = ref(false);

const isPhoneValid = computed(() => {
  return phoneNumber.value.trim().length >= 10;
});

const handleSearch = async () => {
  if (!isPhoneValid.value) return;
  hasSearched.value = true;
  await fetchAppointmentsByPhone(phoneNumber.value.trim());
};

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
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    servicing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

const canCancel = (apt: Appointment) => {
  return apt.status === 'pending' || apt.status === 'confirmed';
};

const confirmCancel = (apt: Appointment) => {
  appointmentToCancel.value = apt;
  showCancelModal.value = true;
};

const handleCancel = async () => {
  if (!appointmentToCancel.value) return;

  cancelling.value = true;
  try {
    await cancelAppointment(appointmentToCancel.value.id);
    showCancelModal.value = false;
    appointmentToCancel.value = null;
  } catch (err) {
    alert('取消預約失敗，請稍後再試');
  } finally {
    cancelling.value = false;
  }
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
  return timeStr.substring(0, 5); // HH:mm
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <header class="bg-white border-b border-[#E6E6DF]">
      <div class="max-w-5xl mx-auto px-6 py-5">
        <h1 class="text-2xl font-bold text-[#2B2B2B]">預約紀錄</h1>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <!-- 搜尋區塊 -->
      <div class="bg-white rounded-2xl border border-[#E6E6DF] p-8 mb-6">
        <h2 class="text-lg font-semibold text-[#2B2B2B] mb-4">查詢預約</h2>
        <p class="text-sm text-[#7A7A7A] mb-6">請輸入預約時使用的電話號碼來查詢您的預約紀錄</p>

        <div class="flex gap-4">
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="請輸入電話號碼（例：0912345678）"
            class="flex-1 h-12 px-4 rounded-xl bg-[#F5F4EF] border border-[#E6E6DF] outline-none focus:border-[#6B6B5C] transition"
            @keyup.enter="handleSearch"
          />
          <button
            @click="handleSearch"
            :disabled="!isPhoneValid || loading"
            class="px-8 py-3 bg-[#6B6B5C] text-white rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '查詢中...' : '查詢' }}
          </button>
        </div>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- 查詢結果 -->
      <div v-if="hasSearched && !loading">
        <!-- 無預約 -->
        <div v-if="appointments.length === 0" class="bg-white rounded-2xl border border-[#E6E6DF] p-12 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-[#F5F4EF] rounded-full mb-4">
            <span class="material-symbols-outlined text-[#B5B5AD] text-3xl">event_busy</span>
          </div>
          <h3 class="text-lg font-semibold text-[#2B2B2B] mb-2">查無預約紀錄</h3>
          <p class="text-sm text-[#7A7A7A]">此電話號碼沒有任何預約紀錄，請確認電話號碼是否正確</p>
        </div>

        <!-- 預約列表 -->
        <div v-else class="space-y-4">
          <div
            v-for="apt in appointments"
            :key="apt.id"
            class="bg-white rounded-2xl border border-[#E6E6DF] p-6 hover:shadow-md transition"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-[#2B2B2B]">預約編號 #{{ apt.id }}</h3>
                  <span
                    class="px-3 py-1 text-xs font-semibold rounded-full"
                    :class="statusColor(apt.status)"
                  >
                    {{ statusText(apt.status) }}
                  </span>
                </div>
                <p class="text-sm text-[#7A7A7A]">{{ apt.service_type || '服務項目未指定' }}</p>
              </div>
              <button
                v-if="canCancel(apt)"
                @click="confirmCancel(apt)"
                class="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
              >
                取消預約
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-[#E6E6DF]">
              <div>
                <p class="text-xs text-[#B5B5AD] mb-1">預約日期</p>
                <p class="text-sm font-medium text-[#2B2B2B]">
                  {{ formatDate(apt.scheduled_date) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-[#B5B5AD] mb-1">預約時間</p>
                <p class="text-sm font-medium text-[#2B2B2B]">
                  {{ formatTime(apt.scheduled_time) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-[#B5B5AD] mb-1">聯絡人</p>
                <p class="text-sm font-medium text-[#2B2B2B]">
                  {{ apt.customer_name || '—' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-[#B5B5AD] mb-1">聯絡電話</p>
                <p class="text-sm font-medium text-[#2B2B2B]">
                  {{ apt.customer_phone || '—' }}
                </p>
              </div>
              <div v-if="apt.car_model" class="col-span-2">
                <p class="text-xs text-[#B5B5AD] mb-1">車輛資訊</p>
                <p class="text-sm font-medium text-[#2B2B2B]">
                  {{ apt.car_model }} {{ apt.license_plate ? `(${apt.license_plate})` : '' }}
                </p>
              </div>
              <div v-if="apt.notes" class="col-span-2">
                <p class="text-xs text-[#B5B5AD] mb-1">備註</p>
                <p class="text-sm text-[#2B2B2B]">{{ apt.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 取消預約確認 Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="showCancelModal = false"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md w-full">
        <h3 class="text-xl font-bold text-[#2B2B2B] mb-4">確認取消預約</h3>
        <p class="text-[#7A7A7A] mb-6">
          您確定要取消這個預約嗎？此操作無法復原。
        </p>

        <div v-if="appointmentToCancel" class="bg-[#F5F4EF] rounded-xl p-4 mb-6">
          <p class="text-sm text-[#2B2B2B] mb-2">
            <span class="font-semibold">預約日期：</span>
            {{ formatDate(appointmentToCancel.scheduled_date) }}
          </p>
          <p class="text-sm text-[#2B2B2B]">
            <span class="font-semibold">預約時間：</span>
            {{ formatTime(appointmentToCancel.scheduled_time) }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showCancelModal = false"
            :disabled="cancelling"
            class="flex-1 px-6 py-3 border border-[#E6E6DF] text-[#2B2B2B] rounded-xl font-semibold hover:bg-[#F5F4EF] transition disabled:opacity-50"
          >
            返回
          </button>
          <button
            @click="handleCancel"
            :disabled="cancelling"
            class="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {{ cancelling ? '取消中...' : '確認取消' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
