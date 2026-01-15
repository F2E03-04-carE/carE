<script setup lang="ts">
import type { PropType } from 'vue';
import type { WorkshopProfile } from '@/stores/auth';

type Hours = WorkshopProfile['hours'];

const props = defineProps({
  modelValue: {
    type: Array as PropType<Hours>,
    required: true,
  },
  areHoursDisabled: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const onDayEnableToggle = (dayIndex: number) => {
  if (props.areHoursDisabled) return;
  const newHours = [...props.modelValue];
  newHours[dayIndex].enabled = !newHours[dayIndex].enabled;
  emit('update:modelValue', newHours);
};

const onTimeChange = (dayIndex: number, timeType: 'start' | 'end', value: string) => {
  const newHours = [...props.modelValue];
  newHours[dayIndex][timeType] = value;
  emit('update:modelValue', newHours);
};
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
            :value="day.start"
            @input="onTimeChange(index, 'start', ($event.target as HTMLInputElement).value)"
            :disabled="areHoursDisabled"
            class="bg-transparent rounded-lg px-2 outline-none disabled:text-[#8a8a7d] disabled:cursor-not-allowed"
          />
          <span>至</span>
          <input
            type="time"
            :value="day.end"
            @input="onTimeChange(index, 'end', ($event.target as HTMLInputElement).value)"
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
