<script setup lang="ts">
import type { Member } from '@/views/Admin/composables/useMemberData';
import { getStatusLabel, getStatusClass } from '../utils/statusHelpers';

defineProps<{
  member: Member;
}>();
</script>

<template>
  <div>
    <h4 class="font-medium text-gray-800 mb-2 border-l-4 border-[#6b6b5a] pl-2 flex items-center">
      <span class="material-symbols-outlined text-lg mr-1">person</span> 基本資料
    </h4>
    <div class="bg-gray-50 rounded p-3 mb-5 border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span class="text-xs text-gray-500 block">ID</span>
          <span class="text-sm font-medium text-gray-800">#{{ member.id }}</span>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">狀態</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="getStatusClass(member.status)">
            {{ getStatusLabel(member.status) }}
          </span>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">姓名</span>
          <span class="text-sm font-medium text-gray-800">{{ member.name }}</span>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">電話</span>
          <span class="text-sm font-medium text-gray-800">{{ member.phone }}</span>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">註冊日期</span>
          <span class="text-sm font-medium text-gray-800">{{ member.joinDate }}</span>
        </div>
        <div class="md:col-span-2">
          <span class="text-xs text-gray-500 block">信箱</span>
          <span class="text-sm font-medium text-gray-800">{{ member.email }}</span>
        </div>
      </div>
    </div>

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
    <ul v-if="member.bookings && member.bookings.length" class="space-y-2">
      <li v-for="(booking, idx) in member.bookings" :key="idx" class="flex items-center text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
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