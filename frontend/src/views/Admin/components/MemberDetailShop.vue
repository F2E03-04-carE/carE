<script setup lang="ts">
import { computed } from 'vue';
import type { Member } from '@/views/Admin/composables/useMemberData';

const props = defineProps<{
  member: Member;
}>();

const infoItems = computed(() => [
  { label: '維修廠名稱', value: props.member.name },
  { label: '負責人', value: props.member.shopOwner },
  { label: '電話', value: props.member.phone },
  { label: '信箱', value: props.member.email },
  { label: '地址', value: props.member.address },
  { label: '營業時間', value: '週一至週六 09:00 - 18:00' },
]);
</script>

<template>
  <div>
    <h4 class="font-medium text-gray-800 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
       <span class="material-symbols-outlined text-lg mr-1">store</span> 店家資訊
    </h4>
    <div class="text-sm text-gray-700 space-y-2 mb-4 bg-white p-3 rounded border border-gray-100">
      <!-- 迴圈渲染店家基本資訊 (名稱, 負責人, 電話...) -->
      <p v-for="item in infoItems" :key="item.label" class="flex items-start">
        <span class="font-medium min-w-[5rem] text-gray-500">{{ item.label }}：</span> 
        {{ item.value }}
      </p>
    </div>

    <h4 class="font-medium text-gray-800 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
      <span class="material-symbols-outlined text-lg mr-1">handyman</span> 服務項目
    </h4>
     <div class="flex flex-wrap gap-2 mb-4 pl-1">
      <!-- 迴圈渲染店家提供的服務項目標籤 -->
      <span v-for="service in member.services" :key="service" class="px-3 py-1 bg-[#6b6b5a]/10 text-[#5a5a4a] text-xs font-medium rounded-full border border-[#6b6b5a]/20">
        {{ service }}
      </span>
    </div>

    <h4 class="font-medium text-gray-800 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
      <span class="material-symbols-outlined text-lg mr-1">bar_chart</span> 營運數據
    </h4>
    <div class="flex space-x-4 pl-1">
        <div class="flex-1 text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div class="text-2xl font-bold text-yellow-600 flex justify-center items-center">
              {{ member.rating }} <span class="text-sm ml-1 text-yellow-400">★</span>
            </div>
            <div class="text-xs text-gray-500 mt-1">平均評分</div>
        </div>
         <div class="flex-1 text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div class="text-2xl font-bold text-blue-600">{{ member.orderCount }}</div>
            <div class="text-xs text-gray-500 mt-1">累積接單</div>
        </div>
    </div>
  </div>
</template>
