import { ref } from 'vue';
import type { Appointment } from '../garage/types';

export function useUserAppointments() {
  const appointments = ref<Appointment[]>([]);
  const loading = ref(false);
  const error = ref<string>('');

  const fetchAppointmentsByPhone = async (phone: string) => {
    loading.value = true;
    error.value = '';

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/appointments?phone=${encodeURIComponent(phone)}`
      );

      if (!response.ok) {
        throw new Error('查詢預約失敗');
      }

      const result = await response.json();
      appointments.value = result.data || [];
    } catch (err) {
      console.error('查詢預約失敗:', err);
      error.value = err instanceof Error ? err.message : '查詢失敗，請稍後再試';
      appointments.value = [];
    } finally {
      loading.value = false;
    }
  };

  const cancelAppointment = async (id: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('取消預約失敗');
      }

      // 更新本地狀態
      const index = appointments.value.findIndex((apt) => apt.id === id);
      if (index !== -1 && appointments.value[index]) {
        appointments.value[index]!.status = 'cancelled';
      }

      return true;
    } catch (err) {
      console.error('取消預約失敗:', err);
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    fetchAppointmentsByPhone,
    cancelAppointment,
  };
}
