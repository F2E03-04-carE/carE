<script setup lang="ts">
import type { BusinessHour } from '@/types/garage';

const hours = defineModel<BusinessHour[]>('hours', {
  required: true,
});

const toggleDay = (item: BusinessHour) => {
  item.enabled = !item.enabled;
};
</script>
<template>
  <div class="space-y-4">
    <!-- 營業時間項目 -->
    <!-- 使用 flex-col 讓內容在行動裝置上預設為垂直堆疊，在 sm 尺寸以上變為水平排列 -->
    <div
      v-for="item in hours"
      :key="item.day"
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl px-6 py-4 bg-white border border-transparent"
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
      <!-- 時間輸入區塊 -->
      <!-- 加入 flex-wrap 允許內容換行，並在行動裝置上縮小間距 -->
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
