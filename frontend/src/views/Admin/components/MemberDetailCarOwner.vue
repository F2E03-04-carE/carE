<script setup lang="ts">
import type { Member } from '@/views/Admin/composables/useMemberData';

defineProps<{
  member: Member;
}>();
</script>

<template>
  <div>
    <h4 class="font-medium text-gray-800 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
      <span class="material-symbols-outlined text-lg mr-1">directions_car</span> 愛車列表
    </h4>
    <div v-if="member.vehicles && member.vehicles.length" class="space-y-2">
       <div v-for="(car, idx) in member.vehicles" :key="idx" class="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
         <div class="flex items-center space-x-3">
           <div class="bg-gray-100 p-2 rounded-full">
             <span class="material-symbols-outlined text-gray-500">directions_car</span>
           </div>
           <div>
             <p class="text-sm font-bold text-gray-800">{{ car.brand }} {{ car.model }}</p>
             <p class="text-xs text-gray-500">{{ car.year }}年 • <span class="bg-gray-100 px-1 rounded text-gray-600">{{ car.plate }}</span></p>
           </div>
         </div>
       </div>
    </div>
    <p v-else class="text-sm text-gray-500 italic p-2 text-center bg-gray-50 rounded">尚無車輛資料</p>

    <h4 class="font-medium text-gray-800 mt-5 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
      <span class="material-symbols-outlined text-lg mr-1">history</span> 近期預約
    </h4>
    <ul class="space-y-2">
      <li class="flex items-center text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
        <span class="material-symbols-outlined text-gray-400 text-sm mr-2">event</span>
        2026/01/20 - 大安修車廠 <span class="ml-auto text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">定期保養</span>
      </li>
      <li class="flex items-center text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
         <span class="material-symbols-outlined text-gray-400 text-sm mr-2">event</span>
         2026/01/05 - 板橋輪胎行 <span class="ml-auto text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">更換輪胎</span>
      </li>
    </ul>
  </div>
</template>