<script setup lang="ts">
import { computed } from 'vue';
import type { Member } from '@/views/Admin/composables/useMemberData';
import { getStatusLabel, getStatusClass } from '../composables/memberCore';

const props = defineProps<{
  member: Member;
}>();

const displayFields = computed(() => [
  { label: 'ID', value: `#${props.member.id}` },
  { label: '狀態', value: props.member.status, isStatus: true },
  { label: '姓名', value: props.member.name },
  { label: '電話', value: props.member.phone },
  { label: '註冊日期', value: props.member.joinDate },
  { label: '信箱', value: props.member.email, colSpan: true },
]);
</script>

<template>
  <div>
    <h4 class="font-medium text-gray-800 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
      <span class="material-symbols-outlined text-lg mr-1">person</span> 基本資料
    </h4>
    <div class="bg-gray-50 rounded p-3 mb-5 border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- 迴圈渲染基本資料欄位 (ID, 狀態, 姓名...) -->
        <div v-for="field in displayFields" :key="field.label" :class="{ 'md:col-span-2': field.colSpan }">
          <span class="text-xs text-gray-500 block">{{ field.label }}</span>
          <span v-if="field.isStatus" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="getStatusClass(field.value)">
            {{ getStatusLabel(field.value) }}
          </span>
          <span v-else class="text-sm font-medium text-gray-800">{{ field.value }}</span>
        </div>
      </div>
    </div>

    <h4 class="font-medium text-gray-800 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
      <span class="material-symbols-outlined text-lg mr-1">directions_car</span> 愛車列表
    </h4>
    <div v-if="member.vehicles && member.vehicles.length" class="space-y-2">
       <!-- 迴圈渲染每一輛登記的車輛 -->
       <div v-for="car in member.vehicles" :key="car.plate" class="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
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
    <ul v-if="member.bookings && member.bookings.length" class="space-y-2">
      <!-- 迴圈渲染每一筆歷史預約紀錄 -->
      <li v-for="booking in member.bookings" :key="`${booking.date}-${booking.shop}-${booking.service}`" class="flex items-center text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
        <span class="material-symbols-outlined text-gray-400 text-sm mr-2">event</span>
        {{ booking.date }} - {{ booking.shop }} 
        <span class="ml-auto text-xs px-2 py-0.5 rounded" :class="booking.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'">
          {{ booking.service }}
        </span>
      </li>
    </ul>
    <p v-else class="text-sm text-gray-500 italic p-2 text-center bg-gray-50 rounded">尚無近期預約</p>
  </div>
</template>