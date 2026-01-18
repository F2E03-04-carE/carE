<script setup lang="ts">
import type { Member } from '@/views/Admin/composables/useMemberData';

defineProps<{
  members: Member[];
}>();

const emit = defineEmits<{
  (e: 'view-detail', member: Member): void;
}>();

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'VerifiedFree': return '已驗證 (免費)';
    case 'VerifiedPaid': return '已驗證 (付費)';
    case 'Pending': return '審核中';
    case 'Suspended': return '停權';
    case 'Expired': return '已過期';
    default: return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'VerifiedFree': return 'bg-blue-100 text-blue-800';
    case 'VerifiedPaid': return 'bg-yellow-100 text-yellow-800';
    case 'Pending': return 'bg-gray-100 text-gray-800';
    case 'Suspended': return 'bg-red-100 text-red-800';
    case 'Expired': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">維修廠名稱</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">負責人</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">接單數量</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">評分</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="shop in members" :key="shop.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{{ shop.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ shop.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ shop.shopOwner }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ shop.phone }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ shop.orderCount }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div class="flex items-center">
              <span class="text-yellow-400 mr-1">★</span>
              {{ shop.rating }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span 
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="getStatusClass(shop.status)"
            >
              {{ getStatusLabel(shop.status) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button @click="emit('view-detail', shop)" class="text-[#6b6b5a] hover:text-[#5a5a4a]">查看詳情</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>