<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

const { appointments, loading, error, fetchAppointmentsByPhone, cancelAppointment } = useUserAppointments();
const showCancelModal = ref(false);
const appointmentToCancel = ref<ApiAppointment | null>(null);
const cancelling = ref(false);
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

const canCancel = (apt: ApiAppointment) => {
  return apt.status === 'pending' || apt.status === 'confirmed';
};

const confirmCancel = (apt: ApiAppointment) => {
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
      <div v-else-if="appointments.length === 0" class="bg-white rounded-2xl border border-[#e8e4dc] p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#f9f7f4] rounded-full mb-4">
          <span class="material-symbols-outlined text-[#6B6B5C] text-3xl">event_busy</span>
        </div>
        <h3 class="text-lg font-semibold text-[#4a4540] mb-2">尚無預約記錄</h3>
        <p class="text-sm text-[#6b6460]">您目前沒有任何預約記錄</p>
      </div>

      <!-- 預約列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="apt in appointments"
          :key="apt.id"
          class="bg-white rounded-2xl border border-[#e8e4dc] p-6 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-[#4a4540]">預約編號 #{{ apt.id }}</h3>
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  :class="statusColor(apt.status)"
                >
                  {{ statusText(apt.status) }}
                </span>
              </div>
              <p class="text-sm text-[#6b6460]">{{ apt.service_type || '服務項目未指定' }}</p>
            </div>
            <button
              v-if="canCancel(apt)"
              @click="confirmCancel(apt)"
              class="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              取消預約
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-[#e8e4dc]">
            <div>
              <p class="text-xs text-[#6B6B5C] mb-1">預約日期</p>
              <p class="text-sm font-medium text-[#4a4540]">
                {{ formatDate(apt.scheduled_date) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-[#6B6B5C] mb-1">預約時間</p>
              <p class="text-sm font-medium text-[#4a4540]">
                {{ formatTime(apt.scheduled_time) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-[#6B6B5C] mb-1">聯絡人</p>
              <p class="text-sm font-medium text-[#4a4540]">
                {{ apt.customer_name || '—' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-[#6B6B5C] mb-1">聯絡電話</p>
              <p class="text-sm font-medium text-[#4a4540]">
                {{ apt.customer_phone || '—' }}
              </p>
            </div>
            <div v-if="apt.car_model" class="col-span-2">
              <p class="text-xs text-[#6B6B5C] mb-1">車輛資訊</p>
              <p class="text-sm font-medium text-[#4a4540]">
                {{ apt.car_model }} {{ apt.license_plate ? `(${apt.license_plate})` : '' }}
              </p>
            </div>
            <div v-if="apt.notes" class="col-span-2">
              <p class="text-xs text-[#6B6B5C] mb-1">備註</p>
              <p class="text-sm text-[#4a4540]">{{ apt.notes }}</p>
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
        <h3 class="text-xl font-bold text-[#4a4540] mb-4">確認取消預約</h3>
        <p class="text-[#6b6460] mb-6">
          您確定要取消這個預約嗎？此操作無法復原。
        </p>

        <div v-if="appointmentToCancel" class="bg-[#f9f7f4] rounded-xl p-4 mb-6">
          <p class="text-sm text-[#4a4540] mb-2">
            <span class="font-semibold">預約日期：</span>
            {{ formatDate(appointmentToCancel.scheduled_date) }}
          </p>
          <p class="text-sm text-[#4a4540]">
            <span class="font-semibold">預約時間：</span>
            {{ formatTime(appointmentToCancel.scheduled_time) }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showCancelModal = false"
            :disabled="cancelling"
            class="flex-1 px-6 py-3 border border-[#e8e4dc] text-[#4a4540] rounded-xl font-semibold hover:bg-[#f9f7f4] transition disabled:opacity-50"
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
