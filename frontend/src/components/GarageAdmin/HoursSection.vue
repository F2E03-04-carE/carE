<script setup lang="ts">
// 假資料
const businessHours = [
  { day: '週一', enabled: true, start: '09:00', end: '18:00' },
  { day: '週二', enabled: true, start: '09:00', end: '18:00' },
  { day: '週三', enabled: true, start: '09:00', end: '18:00' },
  { day: '週四', enabled: true, start: '09:00', end: '18:00' },
  { day: '週五', enabled: true, start: '09:00', end: '18:00' },
  { day: '週六', enabled: false, start: '', end: '' },
  { day: '週日', enabled: false, start: '', end: '' },
];
</script>
<template>
  <div class="space-y-4">
    <div
      v-for="item in businessHours"
      :key="item.day"
      class="flex items-center justify-between rounded-2xl px-6 py-4 bg-white border border-transparent min-h-[56px]"
    >
      <div class="flex items-center gap-4">
        <span class="font-medium w-8">{{ item.day }}</span>
        <div class="relative cursor-pointer">
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
      <div
        class="flex items-center gap-3 px-4 py-2 rounded-2xl transition justify-center"
        :class="
          item.enabled ? 'bg-white ring-1 ring-[#6b6b5a] shadow-sm' : 'bg-[#e0dfd6] text-[#8a8a7d]'
        "
      >
        <template v-if="item.enabled">
          <input
            type="time"
            :value="item.start"
            class="bg-transparent rounded-lg px-2 outline-none"
          />
          <span>至</span>
          <input
            type="time"
            :value="item.end"
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
