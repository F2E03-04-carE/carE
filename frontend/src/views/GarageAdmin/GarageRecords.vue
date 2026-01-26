<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { supabase } from '@/lib/supabase';
import { useMaintenanceRecords } from '@/composables/garage/useMaintenanceRecords';
import type { MaintenanceRecord } from '@/composables/garage/types';

// Garage ID
const garageId = ref<number | null>(null);
const isLoadingGarage = ref(true);
const noGarageError = ref(false);

// Composables 實例
let recordsApi: ReturnType<typeof useMaintenanceRecords>;

// 維修記錄資料
const records = ref<MaintenanceRecord[]>([]);

// 搜尋
const recordSearch = ref('');

// 篩選後的維修記錄列表
const filteredRecords = computed(() => {
  const q = recordSearch.value.trim().toLowerCase();
  if (!q) return records.value || [];
  return records.value.filter((r: any) =>
    (r.customer_name || '').toLowerCase().includes(q) ||
    (r.license_plate || '').toLowerCase().includes(q)
  );
});

// 輔助函數
function formatCurrency(n?: number) {
  return `NT$${(n || 0).toLocaleString('zh-Hant-TW')}`;
}

// 初始化資料
async function initGarageData() {
  try {
    isLoadingGarage.value = true;

    // 從資料庫取得第一筆 garage（開發測試用）
    const { data: garages, error } = await supabase
      .from('garages')
      .select('id')
      .limit(1)
      .single();

    if (error || !garages) {
      noGarageError.value = true;
      return;
    }

    garageId.value = garages.id;

    // 確保 garageId 不為 null 才初始化 composable
    if (!garageId.value) {
      noGarageError.value = true;
      return;
    }

    // 初始化 composable
    recordsApi = useMaintenanceRecords(garageId.value);

    // 取得維修記錄資料
    await recordsApi.fetchRecords();

    // 同步資料並設定 watch
    records.value = recordsApi.records.value;
    watch(recordsApi.records, () => {
      records.value = recordsApi.records.value;
    }, { deep: true });

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
  <div class="min-h-screen bg-[#EBE8E3]">
    <!-- Loading State -->
    <div v-if="isLoadingGarage" class="flex h-screen w-full items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#6B6B5C] border-t-transparent"></div>
        <div class="text-xl font-bold text-[#6B6B5C]">系統載入中...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="noGarageError" class="flex h-screen w-full items-center justify-center p-6">
      <div class="max-w-md text-center">
        <h2 class="mb-4 text-2xl font-bold text-[#4A4A45]">找不到任何車廠資料</h2>
        <p class="mb-6 text-stone-500">
          資料庫可能是空的，請先在資料庫建立至少一筆車廠資料。
        </p>
      </div>
    </div>

    <!-- Records Content -->
    <div v-else class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <!-- 搜尋區塊 -->
      <div class="rounded-xl border border-[#DCD9D3] bg-white p-5 shadow-sm">
        <div class="relative max-w-md">
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            v-model="recordSearch"
            type="text"
            placeholder="輸入車主姓名或車牌查詢歷史紀錄..."
            class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] py-2.5 pl-10 pr-4 text-sm text-[#4A4A45] outline-none transition focus:border-[#6B6B5C] focus:bg-white focus:ring-1 focus:ring-[#6B6B5C]"
          >
        </div>
      </div>

      <!-- 維修記錄列表 -->
      <div class="grid grid-cols-1 gap-6">
        <div v-for="rec in filteredRecords" :key="rec.id" class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm">
          <div class="flex flex-col justify-between gap-4 border-b border-[#F0EEE9] pb-4 md:flex-row md:items-center">
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold text-[#4A4A45]">{{ rec.customer_name }}</h3>
                <span class="rounded bg-[#F0EEE9] px-2 py-0.5 text-xs text-stone-500">{{ rec.license_plate }}</span>
              </div>
              <p class="text-sm text-stone-400">{{ rec.car_model }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-stone-400">{{ rec.service_date }}</p>
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="(item, idx) in rec.items" :key="idx" class="flex justify-between text-sm">
              <span class="text-stone-600">{{ item.name }}</span>
              <span class="font-medium text-[#4A4A45]">{{ formatCurrency(item.price) }}</span>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between border-t border-[#F0EEE9] pt-4">
            <p class="text-sm text-stone-400 italic">{{ rec.notes || '無備註' }}</p>
            <p class="text-lg font-bold text-[#4A4A45]">總計: {{ formatCurrency(rec.total_amount) }}</p>
          </div>
        </div>
        <div v-if="filteredRecords.length === 0" class="text-center text-stone-400 py-12">
          <div class="rounded-xl border border-dashed border-stone-300 p-12">
            <svg class="mx-auto h-12 w-12 text-stone-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
              <path d="M10 9H8"/>
            </svg>
            <p class="text-stone-400">無維修紀錄</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
