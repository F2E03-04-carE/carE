import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { MaintenanceRecord } from './types';

export function useMaintenanceRecords(garageId: number) {
  const records = ref<MaintenanceRecord[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRecords() {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('garage_id', garageId)
        .order('service_date', { ascending: false });

      if (fetchError) throw fetchError;
      records.value = (data as MaintenanceRecord[]) || [];
    } catch (e: any) {
      console.error('fetchRecords error:', e);
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  // 搜尋功能（簡單的前端過濾或後端查詢，這裡示範後端查詢）
  async function searchRecords(query: string) {
    if (!query) return fetchRecords();
    
    loading.value = true;
    try {
      // Supabase 的 ilike 搜尋
      const { data, error: searchError } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('garage_id', garageId)
        .or(`customer_name.ilike.%${query}%,license_plate.ilike.%${query}%`)
        .order('service_date', { ascending: false });

      if (searchError) throw searchError;
      records.value = (data as MaintenanceRecord[]) || [];
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  return { records, loading, error, fetchRecords, searchRecords };
}
