<script setup lang="ts">
import { computed } from 'vue';

import type { WorkshopStatus } from '@/mocks/workshop.mock';

const props = defineProps<{
  status: WorkshopStatus;
  isPaid: boolean;
  isTrialUser: boolean;
  isSubscriptionSectionDisabled: boolean;
  modelValue: 'trial' | 'paid' | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'trial' | 'paid' | null): void;
  (e: 'redirectToECPay', plan: 'trial' | 'onetime'): void;
  (e: 'onboardingSave'): void;
}>();

const selectedPlan = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (props.status === 'onboarding') {
      emit('update:modelValue', value);
    }
  },
});

const handlePlanClick = (plan: 'trial' | 'paid') => {
  if (props.status === 'onboarding') {
    selectedPlan.value = plan;
  }
};
</script>

<template>
  <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm mt-6">
    <h2 class="text-2xl font-semibold text-[#4a4a43] mb-6">訂閱付費方案</h2>

    <div v-if="isPaid" class="text-center p-6 bg-[#f5f4f0] border border-[#d1d1c1] rounded-2xl">
      <h3 class="text-xl font-bold text-[#6b6b5a]">您已開通 VIP 會員</h3>
      <p class="text-[#8a8a7d] mt-2">感謝您的支持！您現在可以享受所有進階功能。</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 30 天免費試用 -->
      <div
        :class="[
          'border rounded-2xl p-6 flex flex-col items-center text-center transition relative',
          isSubscriptionSectionDisabled
            ? 'opacity-50'
            : status === 'onboarding'
              ? 'cursor-pointer'
              : '',
          isTrialUser || (status === 'onboarding' && selectedPlan === 'trial')
            ? 'border-2 border-[#6b6b5a] bg-[#f5f4f0]'
            : 'border-[#e0dfd6]',
        ]"
        @click="handlePlanClick('trial')"
      >
        <div
          v-if="isTrialUser"
          class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8b7d6b] text-white text-xs font-bold px-3 py-1 rounded-full"
        >
          目前方案
        </div>
        <h3 class="text-xl font-bold text-[#6b6b5a] mb-2">免費試用</h3>
        <p class="text-[#4a4a43] mb-4">30 天全功能免費體驗</p>
        <ul class="text-[#8a8a7d] text-sm space-y-2 mb-6">
          <li>體驗所有進階功能</li>
        </ul>

        <button
          type="button"
          v-if="status === 'onboarding'"
          class="px-6 py-2 rounded-2xl font-medium transition"
          :class="
            selectedPlan === 'trial'
              ? 'bg-[#6b6b5a] text-white cursor-default'
              : 'bg-[#8b7d6b] text-white hover:bg-[#7a6d5b]'
          "
        >
          {{ selectedPlan === 'trial' ? '已選擇' : '選擇此方案' }}
        </button>
        <template v-else>
          <button
            type="button"
            v-if="!isTrialUser"
            @click="$emit('redirectToECPay', 'trial')"
            :disabled="isSubscriptionSectionDisabled || isPaid || isTrialUser"
            class="px-6 py-2 rounded-2xl bg-[#8b7d6b] text-white font-medium hover:bg-[#7a6d5b] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            啟用免費試用
          </button>
          <div v-else class="text-center">
            <p class="font-bold text-[#6b6b5a]">正在試用中</p>
            <p class="text-xs text-[#8a8a7d] mt-1">一個帳號僅限一次</p>
          </div>
        </template>
      </div>

      <!-- 買斷制 -->
      <div
        :class="[
          'border rounded-2xl p-6 flex flex-col items-center text-center relative transition',
          isSubscriptionSectionDisabled
            ? 'opacity-50'
            : status === 'onboarding'
              ? 'cursor-pointer'
              : '',
          isPaid || (status === 'onboarding' && selectedPlan === 'paid')
            ? 'border-2 border-[#6b6b5a] bg-[#f5f4f0]'
            : 'border-[#6b6b5a]',
        ]"
        @click="handlePlanClick('paid')"
      >
        <div
          class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6b6b5a] text-white text-xs font-bold px-3 py-1 rounded-full"
        >
          一次性買斷
        </div>
        <h3 class="text-xl font-bold text-[#6b6b5a] mb-2">進階方案</h3>
        <p class="text-2xl font-bold text-[#4a4a43] mb-4">NT$ 500</p>
        <ul class="text-[#4a4a43] text-sm space-y-2 mb-6">
          <li>永久使用所有進階功能</li>
        </ul>
        <button
          type="button"
          v-if="status === 'onboarding'"
          class="px-6 py-2 rounded-2xl font-medium transition"
          :class="
            selectedPlan === 'paid'
              ? 'bg-[#6b6b5a] text-white cursor-default'
              : 'bg-[#8b7d6b] text-white hover:bg-[#7a6d5b]'
          "
        >
          {{ selectedPlan === 'paid' ? '已選擇' : '選擇此方案' }}
        </button>
        <button
          type="button"
          v-else
          @click="$emit('redirectToECPay', 'onetime')"
          :disabled="isSubscriptionSectionDisabled || isPaid"
          class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium hover:bg-[#57574a] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          立即升級
        </button>
      </div>
    </div>
  </section>
</template>
