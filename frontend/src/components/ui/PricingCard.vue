<script setup lang="ts">
import { computed } from 'vue';

export interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string | number;
  priceUnit: string;
  features: string[];
  buttonText?: string;
  color?: 'orange' | 'green';
  isRecommended?: boolean;
  variant?: 'button' | 'clickable';
}

const props = withDefaults(defineProps<PricingCardProps>(), {
  color: 'orange',
  isRecommended: false,
  variant: 'button',
});

const emit = defineEmits<{
  (e: 'button-click'): void;
  (e: 'card-click'): void;
}>();

const handleClick = () => {
  if (props.variant === 'clickable') {
    emit('card-click');
  }
};

const handleButtonClick = () => {
  emit('button-click');
};


const colorClasses = computed(() => {
  const colors = {
    orange: {
      gradient: 'from-[#DB914B] to-[#E0A975]',
      icon: 'text-[#DB914B]',
      button: 'from-[#DB914B] to-[#E0A975] hover:from-[#D6853A] hover:to-[#D4985F]',
      border: 'border-[#DB914B]',
      badge: 'bg-[#DB914B]',
      hover: 'hover:shadow-2xl hover:border-[#DB914B]',
    },
    green: {
      gradient: 'from-[#70c287] to-[#8fd19f]',
      icon: 'text-[#70c287]',
      button: 'from-[#70c287] to-[#8fd19f] hover:from-[#5fb176] hover:to-[#7ec08e]',
      border: 'border-[#70c287]',
      badge: 'bg-[#70c287]',
      hover: 'hover:shadow-2xl hover:border-[#70c287]',
    },
  };
  return colors[props.color];
});

const formattedPrice = computed(() => {
  if (typeof props.price === 'number') {
    return `NT$ ${props.price.toLocaleString()}`;
  }
  return props.price;
});
</script>

<template>
   <div
    @click="handleClick"
    class="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
    :class="[
      { 'border-2': isRecommended, [colorClasses.border]: isRecommended },
      variant === 'clickable' ? ['cursor-pointer', colorClasses.hover] : ''
    ]"
  >
    <div class="h-3 bg-gradient-to-r" :class="colorClasses.gradient"></div>
    <div class="p-8 flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-[24px] sm:text-[28px] font-bold text-[#4a4a43]">{{ title }}</h4>
        <span
          v-if="isRecommended"
          class="px-3 py-1 text-[12px] font-bold text-white rounded-full"
          :class="colorClasses.badge"
        >
          推薦
        </span>
      </div>
      <p class="text-[14px] sm:text-[16px] text-[#8a8a7d] mb-6">{{ subtitle }}</p>
      <div class="mb-6">
        <span class="text-[40px] sm:text-[48px] font-black text-[#4a4a43]">
          {{ formattedPrice }}
        </span>
        <span class="text-[18px] text-[#8a8a7d] ml-2">{{ priceUnit }}</span>
      </div>
      <ul class="space-y-3 mb-8 flex-1">
        <li v-for="(feature, index) in features" :key="index" class="flex items-start">
          <span class="material-symbols-outlined text-[24px] mr-2" :class="colorClasses.icon">
            check_circle
          </span>
          <span class="text-[14px] sm:text-[16px] text-[#4a4a43]">{{ feature }}</span>
        </li>
      </ul>
      <div v-if="variant === 'button'">
        <button
          @click="handleButtonClick"
          class="w-full py-4 text-[16px] sm:text-[18px] font-bold text-white bg-gradient-to-r rounded-xl transition-all"
          :class="[colorClasses.button,'cursor-pointer']"
         >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>
