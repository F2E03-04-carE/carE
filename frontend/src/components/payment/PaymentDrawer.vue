<script setup lang="ts">
import { computed } from 'vue';

export interface PaymentDrawerProps {
  isOpen: boolean;
  plan: {
    title: string;
    subtitle: string;
    price: number;
    priceUnit: string;
    features: string[];
    color: 'orange' | 'green';
    type: 'trial' | 'lifetime';
  };
}

const props = defineProps<PaymentDrawerProps>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select-payment', paymentMethod: 'oen' | 'linepay'): void;
}>();

const formattedPrice = computed(() => {
  return props.plan.price === 0
    ? 'NT$ 0'
    : `NT$ ${props.plan.price.toLocaleString()}`;
});

const colorClasses = computed(() => {
  const colors = {
    orange: {
      icon: 'text-[#DB914B]',
      badge: 'bg-[#DB914B]',
    },
    green: {
      icon: 'text-[#70c287]',
      badge: 'bg-[#70c287]',
    },
  };
  return colors[props.plan.color];
});

const handlePayment = (method: 'oen' | 'linepay') => {
  emit('select-payment', method);
};


const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="drawer drawer-end">
    <input
      id="payment-drawer"
      type="checkbox"
      class="drawer-toggle"
      :checked="isOpen"
      @change="handleClose"
    />

    <div class="drawer-side z-50">
      <label
        for="payment-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
        @click="handleClose"
      ></label>

      <div class="min-h-full w-[90vw] sm:w-[400px] bg-white p-6 flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-[24px] font-bold text-[#4a4a43]">確認方案</h3>
          <button
            @click="handleClose"
            class="text-[#8a8a7d] hover:text-[#4a4a43] transition-colors"
          >
            <span class="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>

        <div class="flex-1">
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="text-[20px] font-bold text-[#4a4a43]">{{ plan.title }}</h4>
              <span
                class="px-2 py-1 text-[11px] font-bold text-white rounded-full"
                :class="colorClasses.badge"
              >
                {{ plan.type === 'trial' ? '試用' : '推薦' }}
              </span>
            </div>
            <p class="text-[14px] text-[#8a8a7d] mb-4">{{ plan.subtitle }}</p>

            <div class="mb-6">
              <span class="text-[36px] font-black text-[#4a4a43]">
                {{ formattedPrice }}
              </span>
              <span class="text-[16px] text-[#8a8a7d] ml-2">{{ plan.priceUnit }}</span>
            </div>
            <div class="mb-6">
              <p class="text-[14px] font-bold text-[#4a4a43] mb-3">方案內容：</p>
              <ul class="space-y-2">
                <li
                  v-for="(feature, index) in plan.features"
                  :key="index"
                  class="flex items-start"
                >
                  <span
                    class="material-symbols-outlined text-[20px] mr-2"
                    :class="colorClasses.icon"
                  >
                    check_circle
                  </span>
                  <span class="text-[14px] text-[#4a4a43]">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="plan.type === 'lifetime'" class="mb-6">
            <p class="text-[14px] font-bold text-[#4a4a43] mb-3">選擇付款方式：</p>
            <div class="space-y-3">
              <button
                @click="handlePayment('oen')"
                class="w-full px-4 py-3 text-left border-2 border-[#8a8a7d] rounded-lg hover:border-[#6B6B5C] hover:bg-[#f5f4f0] transition-all"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[16px] font-bold text-[#4a4a43]">應援金流</span>
                  <span class="material-symbols-outlined text-[#8a8a7d]">
                    arrow_forward
                  </span>
                </div>
              </button>

              <button
                @click="handlePayment('linepay')"
                class="w-full px-4 py-3 text-left border-2 border-[#8a8a7d] rounded-lg hover:border-[#6B6B5C] hover:bg-[#f5f4f0] transition-all"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[16px] font-bold text-[#4a4a43]">LINE Pay</span>
                  <span class="material-symbols-outlined text-[#8a8a7d]">
                    arrow_forward
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div v-else>
            <button
              @click="handlePayment('oen')"
              class="w-full px-6 py-4 text-[18px] font-bold text-white bg-gradient-to-r from-[#6B6B5C] to-[#5a5a4a] hover:from-[#5a5a4a] hover:to-[#4a4a3a] rounded-lg transition-all shadow-lg"
            >
              立即開通試用
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
