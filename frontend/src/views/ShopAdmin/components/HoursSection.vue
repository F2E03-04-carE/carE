<script setup lang="ts">
import { toRef } from 'vue';
import type { WorkshopProfile } from '@/stores/auth';
import { useHours } from '../composables/useHours';

type Hours = WorkshopProfile['hours'];

const modelValue = defineModel<Hours>({ required: true });
const hasError = defineModel<boolean>('hasError');

const props = defineProps({
  areHoursDisabled: Boolean,
});

// 從 composable/useHours.ts 獲取所有邏輯和響應式狀態
const { timeRangeErrors, onDayEnableToggle } = useHours(
  modelValue,
  hasError,
  toRef(props, 'areHoursDisabled'),
);
</script>
<template>
  <div class="space-y-4">
    <div
      v-for="(day, index) in modelValue"
      :key="day.day"
      class="flex items-center justify-between rounded-2xl px-6 py-4 bg-white border border-transparent min-h-[56px]"
    >
      <div class="flex items-center gap-4">
        <span :class="['font-medium w-8', areHoursDisabled && 'text-[#8a8a7d]']">{{
          day.day
        }}</span>
        <div
          :class="[
            'relative',
            !areHoursDisabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
          ]"
          @click="onDayEnableToggle(index)"
        >
          <div
            :class="[
              'w-12 h-6 rounded-full transition-colors',
              day.enabled ? 'bg-[#6b6b5a]' : 'bg-[#d1d1c1]',
            ]"
          ></div>
          <div
            :class="[
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform',
              day.enabled ? 'translate-x-6' : 'translate-x-0',
            ]"
          ></div>
        </div>
      </div>
      <!-- 當營業時間晚於打烊時間，顯示紅色提示文字 -->
      <span v-if="timeRangeErrors[index]" class="text-red-500 mr-2"
        >時間錯誤！營業時間不可晚於打烊時間</span
      >
      <div
        class="flex items-center gap-3 px-4 py-2 rounded-2xl transition justify-center"
        :class="
          day.enabled && !areHoursDisabled
            ? 'bg-white ring-1 ring-[#6b6b5a] shadow-sm'
            : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed'
        "
      >
        <template v-if="day.enabled">
          <input
            type="time"
            v-model="day.start"
            :disabled="areHoursDisabled"
            class="bg-transparent rounded-lg px-2 outline-none disabled:text-[#8a8a7d] disabled:cursor-not-allowed"
          />
          <span>至</span>
          <input
            type="time"
            v-model="day.end"
            :disabled="areHoursDisabled"
            class="bg-transparent rounded-lg px-2 outline-none disabled:text-[#8a8a7d] disabled:cursor-not-allowed"
          />
        </template>
        <template v-else>
          <span>公休</span>
        </template>
      </div>
    </div>
  </div>
</template>
