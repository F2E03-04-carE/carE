import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Appointment, ApptStatus } from './types';

export function useAppointments(garageId: number) {
  const appointments = ref<Appointment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 載入預約列表
  async function fetchAppointments() {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('garage_id', garageId)
        .order('scheduled_date', { ascending: true })
        .order('scheduled_time', { ascending: true });

      if (fetchError) throw fetchError;
      appointments.value = (data as Appointment[]) || [];
    } catch (e: any) {
      console.error('fetchAppointments error:', e);
      error.value = e.message || '無法載入預約列表';
    } finally {
      loading.value = false;
    }
  }

  // 更新預約狀態
  async function updateStatus(id: number, status: ApptStatus) {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      // 更新本地資料，避免重新 fetch
      const index = appointments.value.findIndex(a => a.id === id);
      if (index !== -1 && appointments.value[index]) {
        appointments.value[index].status = status;
      }
    } catch (e: any) {
      console.error('updateStatus error:', e);
      throw e; // 讓 UI 層處理錯誤提示
    }
  }

  // 更新預約詳細資訊
  async function updateAppointment(id: number, updates: Partial<Appointment>) {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      const index = appointments.value.findIndex(a => a.id === id);
      if (index !== -1 && appointments.value[index]) {
        const existing = appointments.value[index];
        appointments.value[index] = {
          ...existing,
          ...updates,
          id: existing.id,
          garage_id: existing.garage_id,
          created_at: existing.created_at,
        };
      }
    } catch (e: any) {
      console.error('updateAppointment error:', e);
      throw e;
    }
  }

  // 刪除預約
  async function deleteAppointment(id: number) {
    try {
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      appointments.value = appointments.value.filter(a => a.id !== id);
    } catch (e: any) {
      console.error('deleteAppointment error:', e);
      throw e;
    }
  }

  // 完成訂單（轉為維修紀錄）
  async function completeAppointment(apt: Appointment) {
    try {
      // 1. 建立維修紀錄
      const recordData = {
        garage_id: garageId,
        original_appointment_id: apt.id,
        customer_name: apt.customer_name,
        car_model: apt.car_model,
        license_plate: apt.license_plate,
        service_date: apt.scheduled_date, // 預設使用預約日期，也可改為當天
        items: [{ name: apt.service_type || '一般維修', price: apt.estimated_cost || 0 }],
        total_amount: apt.estimated_cost || 0,
        notes: apt.notes || '',
      };

      const { error: insertError } = await supabase
        .from('maintenance_records')
        .insert(recordData);

      if (insertError) throw insertError;

      // 2. 更新預約狀態為 completed
      await updateStatus(apt.id, 'completed');

      // 3. 從前端當前列表中移除（如果列表不顯示已完成項目的話）
      // 這裡選擇不移除，而是狀態變更，UI 可以自己決定怎麼 filter
    } catch (e: any) {
      console.error('completeAppointment error:', e);
      throw e;
    }
  }

  // Dashboard 簡易統計
  const dashboardStats = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.value.filter(a => a.scheduled_date === today);
    const pending = appointments.value.filter(a => a.status === 'pending');
    const servicing = appointments.value.filter(a => a.status === 'servicing');

    return {
      todayCount: todayAppts.length,
      pendingCount: pending.length,
      servicingCount: servicing.length,
    };
  });

  return {
    appointments,
    loading,
    error,
    dashboardStats,
    fetchAppointments,
    updateStatus,
    updateAppointment,
    deleteAppointment,
    completeAppointment,
  };
}
