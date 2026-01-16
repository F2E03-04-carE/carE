<script setup lang="ts">
import { ref } from 'vue';
import type { CustomerProfile } from '@/mocks/customer.mock';

const props = defineProps<{
  carOwner: CustomerProfile;
}>();

const activeTab = ref<'records' | 'stats'>('records');

const totalPrice = (carOwner: CustomerProfile) =>
  carOwner.serviceHistory.reduce((sum, record) => sum + (record.price ?? 0), 0);

const lastRepairDate = (carOwner: CustomerProfile) =>
  carOwner.serviceHistory.slice().sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))[0]
    ?.scheduledDate ?? '-';
</script>

<template>
  <div class="bg-white rounded-2xl shadow overflow-hidden">
    <!-- 客戶基本資料 -->
    <div class="px-6 py-4 bg-[#f5f4f0]">
      <div>
        <div class="font-semibold text-[#4a4a43]">{{ carOwner.name }}</div>
        <div class="text-sm text-[#8a8a7d]">{{ carOwner.phone }} ・ {{ carOwner.vehicle.model }}</div>
      </div>
    </div>

    <!-- Tab 切換 -->
    <div class="px-6 py-4">
      <div class="flex gap-2 bg-[#f5f4f0] rounded-full p-1">
        <button
          class="flex-1 py-2 rounded-full text-sm font-medium cursor-pointer"
          :class="
            activeTab === 'records'
              ? 'bg-[#6b6b5a] text-white shadow'
              : 'bg-[#f5f4f0] text-[#4a4a43] hover:bg-[#e3e2dc]'
          "
          @click="activeTab = 'records'"
        >
          <span class="material-symbols-outlined align-middle mr-1">build</span> 維修歷程
        </button>
        <button
          class="flex-1 py-2 rounded-full text-sm font-medium cursor-pointer"
          :class="
            activeTab === 'stats'
              ? 'bg-[#6b6b5a] text-white shadow'
              : 'bg-[#f5f4f0] text-[#4a4a43] hover:bg-[#e3e2dc]'
          "
          @click="activeTab = 'stats'"
        >
          <span class="material-symbols-outlined align-middle mr-1">insights</span> 統計資訊
        </button>
      </div>
    </div>

    <!-- 維修歷程 -->
    <div v-show="activeTab === 'records'" class="px-6 pb-6 space-y-4">
      <div
        v-for="record in carOwner.serviceHistory"
        :key="record.id"
        class="flex justify-between bg-[#f5f4f0] rounded-xl p-4"
      >
        <div>
          <div class="text-sm text-[#8a8a7d] flex items-center gap-1 mb-4">
            <span class="material-symbols-outlined text-sm">event_note</span>
            {{ record.scheduledDate }}
          </div>
          <div class="font-medium text-[#4a4a43] flex items-center gap-1 mb-4">
            <span class="material-symbols-outlined text-sm">construction</span>
            {{ record.serviceType }}
          </div>
          <div class="text-sm text-[#8a8a7d]">{{ record.description }}</div>
        </div>
        <div v-if="record.price" class="font-semibold text-green-600">
          NT${{ record.price.toLocaleString() }}
        </div>
      </div>
    </div>

    <!-- 統計資訊 -->
    <div v-show="activeTab === 'stats'" class="px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-[#f5f4f0] rounded-xl p-4">
        <div class="text-sm text-[#8a8a7d] flex items-center gap-1 mb-4">
          <span class="material-symbols-outlined text-sm">history_edu</span> 總維修次數
        </div>
        <div class="text-2xl font-semibold text-[#4a4a43]">
          {{ carOwner.serviceHistory.length }}
        </div>
      </div>
      <div class="bg-[#f5f4f0] rounded-xl p-4">
        <div class="text-sm text-[#8a8a7d] flex items-center gap-1 mb-4">
          <span class="material-symbols-outlined text-sm">paid</span> 總消費金額
        </div>
        <div class="text-2xl font-semibold text-[#4a4a43]">
          NT${{ totalPrice(carOwner).toLocaleString() }}
        </div>
      </div>
      <div class="bg-[#f5f4f0] rounded-xl p-4">
        <div class="text-sm text-[#8a8a7d] flex items-center gap-1 mb-4">
          <span class="material-symbols-outlined text-sm">calendar_today</span> 最近維修
        </div>
        <div class="text-2xl font-semibold text-[#4a4a43]">{{ lastRepairDate(carOwner) }}</div>
      </div>
    </div>
  </div>
</template>
