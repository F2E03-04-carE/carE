<script setup lang="ts">
import { ref } from 'vue';
import type { WorkshopInfo } from '@/types/garage';

const props = defineProps<{
  garageInfo: WorkshopInfo;
  isEditing: boolean;
}>();

// 訂閱方案資料 (資料變動不頻繁，寫死在前端)
const subscriptionPlans = ref([
  {
    id: 'free',
    title: '免費試用方案',
    subtitle: '先試用，滿意再升級',
    price: 'NT$ 0',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示 （試用期滿僅剩此功能）'],
    tag: null,
  },
  {
    id: 'pro',
    title: '永久會員方案',
    subtitle: '一次付費，終身使用',
    price: 'NT$ 5,555',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示', '永久使用權限'],
    tag: '一次性買斷',
  },
]);

const selectedPlanId = defineModel<string>('plan', { required: true });

const selectPlan = (id: string) => {
  selectedPlanId.value = id;
};
</script>

<template>
  <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm mt-6">
    <h2 class="text-2xl font-semibold text-[#4a4a43] mb-6">訂閱付費方案</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="plan in subscriptionPlans"
        :key="plan.id"
        @click="selectPlan(plan.id)"
        class="border-2 rounded-2xl p-6 flex flex-col items-center text-center transition relative bg-white hover:shadow-md cursor-pointer select-none"
        :class="[
          selectedPlanId === plan.id
            ? 'border-[#6b6b5a] ring-2 ring-[#6b6b5a]/20 bg-[#fbfbf9]'
            : 'border-[#e0dfd6] hover:border-[#b0afa4]',
        ]"
      >
        <!-- 標籤 -->
        <div
          v-if="plan.tag"
          class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6b6b5a] text-white text-xs font-bold px-3 py-1 rounded-full"
        >
          {{ plan.tag }}
        </div>

        <!-- 選取狀態勾勾 -->
        <div v-if="selectedPlanId === plan.id" class="absolute top-4 right-4 text-[#6b6b5a]">
          <span class="material-symbols-outlined text-2xl">check_circle</span>
        </div>

        <h3 class="text-xl font-bold text-[#6b6b5a] mb-2">{{ plan.title }}</h3>
        <p class="text-[#4a4a43] font-medium mb-2">{{ plan.subtitle }}</p>
        <p class="text-2xl font-bold text-[#4a4a43] mb-4">{{ plan.price }}</p>
        <ul class="text-[#4a4a43] text-sm space-y-2 mb-6">
          <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
        </ul>

        <button
          type="button"
          class="mt-auto px-6 py-2 rounded-2xl font-medium transition w-full"
          :class="[
            selectedPlanId === plan.id
              ? 'bg-[#6b6b5a] text-white'
              : 'bg-[#e0dfd6] text-[#4a4a43] hover:bg-[#d1d0c5]',
          ]"
        >
          {{ selectedPlanId === plan.id ? '已選擇' : '選擇此方案' }}
        </button>
      </div>
    </div>
  </section>
</template>
