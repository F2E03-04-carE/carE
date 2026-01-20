<script setup lang="ts">
import { watch } from 'vue';
import type { BusinessHour } from '@/types/garage';

const hours = defineModel<BusinessHour[]>('hours', {
  required: true,
});

const emit = defineEmits<{
  (event: 'validation-error', hasError: boolean): void;
}>();

// 驗證單一項目是否無效
const isInvalid = (item: BusinessHour) => {
  if (!item.enabled) return false;
  // 如果尚未填寫時間，暫不視為錯誤（或視需求而定，這裡假設必填則可加強判斷）
  if (!item.start || !item.end) return false;
  return item.start >= item.end;
};

const toggleDay = (item: BusinessHour) => {
  item.enabled = !item.enabled;
};

// 監聽營業時間變化，驗證是否有錯誤並通知父元件
watch(
  hours,
  (newHours) => {
    const hasError = newHours.some((item) => isInvalid(item));
    emit('validation-error', hasError);
  },
  { deep: true, immediate: true },
);
</script>
<template>
  <div class="space-y-4">
    <!-- 營業時間項目 -->
    <div
      v-for="item in hours"
      :key="item.day"
      class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl px-6 py-4 bg-white border"
      :class="isInvalid(item) ? 'border-red-500 bg-red-50' : 'border-transparent'"
    >
      <div class="flex items-center gap-4">
        <span class="font-medium w-8">{{ item.day }}</span>
        <!-- Toggle Switch -->
        <div class="relative cursor-pointer" @click="toggleDay(item)">
          <div
            :class="[
              'w-12 h-6 rounded-full transition-colors',
              item.enabled ? 'bg-[#6b6b5a]' : 'bg-[#d1d1c1]',
            ]"
          ></div>
          <div
            :class="[
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform',
              item.enabled ? 'translate-x-6' : 'translate-x-0',
            ]"
          ></div>
        </div>
      </div>
      <!-- 錯誤提示 -->
      <div v-if="isInvalid(item)" class="absolute right-4 top-2 sm:static sm:block">
        <span class="text-xs font-bold text-red-500 sm:text-sm">時間錯誤</span>
      </div>
      <!-- 時間輸入區塊 -->
      <div
        class="flex flex-wrap items-center justify-center gap-2 rounded-2xl px-2 py-2 transition sm:gap-3 sm:px-4"
        :class="
          item.enabled ? 'bg-white ring-1 ring-[#6b6b5a] shadow-sm' : 'bg-[#e0dfd6] text-[#8a8a7d]'
        "
      >
        <template v-if="item.enabled">
          <input
            type="time"
            v-model="item.start"
            class="bg-transparent rounded-lg px-2 outline-none"
          />
          <span>至</span>
          <input
            type="time"
            v-model="item.end"
            class="bg-transparent rounded-lg px-2 outline-none"
          />
        </template>
        <template v-else>
          <span>公休</span>
        </template>
      </div>
    </div>
  </div>
</template>
