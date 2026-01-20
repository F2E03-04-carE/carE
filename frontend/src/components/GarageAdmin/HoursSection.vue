// HoursSection.vue
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
  // 如果尚未填寫時間，暫不視為錯誤
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
    <div
      v-for="item in hours"
      :key="item.day"
      class="relative flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl px-6 py-4 bg-white border transition-colors"
      :class="isInvalid(item) ? 'border-red-500 bg-red-50' : 'border-transparent'"
    >
      <div class="flex items-center gap-4 shrink-0">
        <span class="font-medium w-8 text-gray-700">{{ item.day }}</span>
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

      <div class="flex-1 flex justify-end">
        <template v-if="item.enabled">
          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white ring-1 ring-[#6b6b5a] shadow-sm px-4 py-2 rounded-xl sm:rounded-2xl w-full sm:w-fit"
          >
            <div class="flex items-center justify-between sm:justify-start gap-2">
              <span class="text-xs text-[#8a8a7d] sm:hidden">開始時間</span>
              <input
                type="time"
                v-model="item.start"
                class="bg-transparent outline-none font-medium text-sm sm:text-base"
              />
            </div>

            <span class="hidden sm:inline text-[#8a8a7d]">至</span>
            <div class="h-px w-full bg-gray-100 sm:hidden"></div>

            <div class="flex items-center justify-between sm:justify-start gap-2">
              <span class="text-xs text-[#8a8a7d] sm:hidden">結束時間</span>
              <input
                type="time"
                v-model="item.end"
                class="bg-transparent outline-none font-medium text-sm sm:text-base"
              />
            </div>

            <div class="hidden sm:block h-4 w-px bg-gray-300 mx-1"></div>
            <div class="h-px w-full bg-gray-100 sm:hidden"></div>

            <div class="flex items-center justify-between sm:justify-start gap-2">
              <div class="flex items-center gap-1 sm:gap-2">
                <span class="material-symbols-outlined text-sm sm:hidden">groups</span>
                <span class="text-xs sm:text-sm font-medium text-[#4a4a43]">接單量</span>
              </div>
              <input
                type="number"
                v-model="item.capacity"
                min="0"
                class="w-12 sm:w-16 bg-transparent outline-none text-right sm:text-center font-bold"
                placeholder="0"
              />
            </div>
          </div>
        </template>

        <template v-else>
          <div
            class="w-full sm:w-48 text-center py-2 bg-[#e0dfd6] rounded-xl text-[#8a8a7d] sm:rounded-2xl text-sm"
          >
            本日公休
          </div>
        </template>
      </div>

      <div v-if="isInvalid(item)" class="absolute right-6 top-4 sm:static">
        <span
          class="text-[10px] font-bold text-red-500 sm:text-sm bg-red-100 sm:bg-transparent px-2 py-0.5 rounded-full"
          >時間錯誤</span
        >
      </div>
    </div>
  </div>
</template>
