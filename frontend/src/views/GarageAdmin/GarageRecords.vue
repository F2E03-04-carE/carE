<script setup lang="ts">
import { ref, computed } from 'vue';

// 類型定義
type RecordItem = {
  id: string;
  customerName: string;
  carModel: string;
  licensePlate: string;
  date: string;
  items: Array<{ name: string; price: number; type: 'base' | 'addon' }>;
  total: number;
  notes: string;
  quotationImage?: string;  // 報價單圖片 URL，與維修歷史一致
};

// 假資料 - 維修記錄
const records = ref<RecordItem[]>([
  {
    id: 'REC-2025-888',
    customerName: '張貓貓',
    carModel: 'Mazda 3',
    licensePlate: 'QWE-5566',
    date: '2025-12-20',
    items: [
      { name: '四輪定位', price: 2000, type: 'base' },
      { name: '雨刷更換', price: 800, type: 'addon' },
    ],
    total: 2800,
    notes: '建議下次更換電瓶',
    quotationImage: '',
  },
  {
    id: 'REC-2025-887',
    customerName: '王貓貓',
    carModel: 'Toyota Camry',
    licensePlate: 'ABC-1234',
    date: '2025-11-15',
    items: [
      { name: '小保養套餐', price: 3000, type: 'base' },
    ],
    total: 3000,
    notes: '',
    quotationImage: '',
  },
]);

// 詳情彈窗（與維修歷史一致，含下載報價單）
const showDetailModal = ref(false);
const selectedRecord = ref<RecordItem | null>(null);

function openDetailModal(rec: RecordItem) {
  selectedRecord.value = rec;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  selectedRecord.value = null;
}

// 搜尋
const recordSearch = ref('');

// 篩選後的維修記錄列表
const filteredRecords = computed(() => {
  const q = recordSearch.value.trim().toLowerCase();
  if (!q) return records.value;
  return records.value.filter(r =>
    r.customerName.toLowerCase().includes(q) ||
    r.licensePlate.toLowerCase().includes(q)
  );
});

// 輔助函數
function formatCurrency(n: number) {
  return `NT$${n.toLocaleString('zh-Hant-TW')}`;
}
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] bg-[#f5f4f0] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#4a4a43]">完工維修記錄</h1>
        <p class="mt-2 text-stone-500">查詢過往維修履歷與工單細節</p>
      </div>

      <!-- Records Content -->
      <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
                  <h3 class="text-lg font-bold text-[#4A4A45]">{{ rec.customerName }}</h3>
                  <span class="rounded bg-[#F0EEE9] px-2 py-0.5 text-xs text-stone-500">{{ rec.licensePlate }}</span>
                </div>
                <p class="text-sm text-stone-400">{{ rec.carModel }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-stone-400">{{ rec.date }}</p>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div v-for="(item, idx) in rec.items" :key="idx" class="flex justify-between text-sm">
                <span class="text-stone-600">
                  {{ item.name }}
                  <span v-if="item.type === 'addon'" class="ml-1 text-[10px] text-[#8C7B5D] border border-[#8C7B5D] px-1 rounded">加購</span>
                </span>
                <span class="font-medium text-[#4A4A45]">{{ formatCurrency(item.price) }}</span>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EEE9] pt-4">
              <p class="text-sm text-stone-400 italic">{{ rec.notes || '無備註' }}</p>
              <div class="flex items-center gap-3">
                <p class="text-lg font-bold text-[#4A4A45]">總計: {{ formatCurrency(rec.total) }}</p>
                <button
                  @click="openDetailModal(rec)"
                  class="rounded border border-[#DCD9D3] bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-[#F8F7F5]"
                >
                  查看詳情
                </button>
              </div>
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

      <!-- 詳情彈窗（與維修歷史一樣含下載報價單） -->
      <div
        v-if="showDetailModal && selectedRecord"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="closeDetailModal"
      >
        <div class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#FBFAF7] shadow-2xl">
          <!-- Header -->
          <div class="flex shrink-0 items-center justify-between border-b border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
            <h3 class="text-lg font-bold text-[#4A4A45]">維修單詳情</h3>
            <button @click="closeDetailModal" class="rounded-full p-1 text-stone-400 hover:bg-black/5 hover:text-stone-600">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- 內容 -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="rounded-xl bg-[#F8F7F5] p-4 text-sm border border-[#E6E6DF]">
              <div class="grid grid-cols-2 gap-y-3">
                <div>
                  <span class="block text-xs text-stone-400">工單編號</span>
                  <span class="font-mono font-medium text-[#4A4A45]">{{ selectedRecord.id }}</span>
                </div>
                <div>
                  <span class="block text-xs text-stone-400">車主</span>
                  <span class="font-medium text-[#4A4A45]">{{ selectedRecord.customerName }}</span>
                </div>
                <div>
                  <span class="block text-xs text-stone-400">車型</span>
                  <span class="text-stone-600">{{ selectedRecord.carModel }}</span>
                </div>
                <div>
                  <span class="block text-xs text-stone-400">車牌</span>
                  <span class="text-stone-600">{{ selectedRecord.licensePlate }}</span>
                </div>
                <div>
                  <span class="block text-xs text-stone-400">完工日期</span>
                  <span class="text-stone-600">{{ selectedRecord.date }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-[#4A4A45]">維修項目</label>
              <div class="space-y-2">
                <div v-for="(item, idx) in selectedRecord.items" :key="idx" class="flex justify-between rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm">
                  <span class="text-stone-600">
                    {{ item.name }}
                    <span v-if="item.type === 'addon'" class="ml-1 text-[10px] text-[#8C7B5D] border border-[#8C7B5D] px-1 rounded">加購</span>
                  </span>
                  <span class="font-medium text-[#4A4A45]">{{ formatCurrency(item.price) }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-[#4A4A45]">總計</label>
              <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm font-bold text-[#4A4A45]">
                {{ formatCurrency(selectedRecord.total) }}
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-[#4A4A45]">備註事項</label>
              <div class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] px-4 py-2.5 text-sm text-[#4A4A45] min-h-[60px]">
                {{ selectedRecord.notes || '無' }}
              </div>
            </div>
          </div>

          <!-- Footer：與維修歷史一樣有下載報價單 -->
          <div class="flex shrink-0 items-center justify-between border-t border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
            <a
              :href="selectedRecord.quotationImage || '#'"
              target="_blank"
              download
              class="inline-flex items-center gap-1.5 text-sm font-medium text-[#8C7B5D] hover:text-[#6B5A3D] hover:underline cursor-pointer"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              下載報價單
            </a>
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
  </div>
</template>
