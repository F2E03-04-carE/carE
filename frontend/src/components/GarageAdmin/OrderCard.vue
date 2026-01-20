<script setup lang="ts">
import { statusClass } from '@/utils/orderStatus';
import type { Order } from '@/types/garage';

defineProps<{
  order: Order;
}>();

defineEmits<{
  (event: 'open', order: Order): void;
}>();
</script>

<template>
  <div class="rounded-2xl border border-[#6b6b5a]/20 bg-[#f5f4f0] p-8">
    <!-- 工單編號與維修狀況 -->
    <div class="mb-6 flex items-center gap-4">
      <span class="text-[#8a8a7d]">{{ order.id }}</span>
      <span
        class="flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium text-white"
        :class="statusClass(order.status)"
      >
        {{ order.status }}
      </span>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- 客戶 -->
      <div>
        <p class="mb-2 text-[#8a8a7d] font-medium">客戶資訊</p>
        <p class="text-lg font-medium text-[#4a4a43]">
          {{ order.customer.name }}
        </p>
        <p v-if="order.customer.phone" class="text-[#8a8a7d]">
          {{ order.customer.phone }}
        </p>
      </div>

      <!-- 車輛 -->
      <div class="border-l border-[#6b6b5a]/20 pl-6">
        <p class="mb-2 text-[#8a8a7d] font-medium">車輛資訊</p>
        <p class="text-lg font-medium text-[#4a4a43]">
          {{ order.vehicle.model }}
        </p>
        <p class="mt-4 mb-1 text-[#8a8a7d] font-medium">維修項目</p>
        <p class="text-[#4a4a43]">
          {{ order.serviceType }}
        </p>
      </div>

      <!-- 時間 + 詳情按鈕 -->
      <div class="border-l border-[#6b6b5a]/20 pl-6 flex flex-col justify-between">
        <div class="space-y-1">
          <p class="text-sm text-[#8a8a7d] font-medium">提出申請時間</p>
          <p class="font-medium text-[#4a4a43]">{{ order.requestTime }}</p>

          <p class="text-sm text-[#8a8a7d] mt-2">預約維修時間</p>
          <p class="font-medium text-[#4a4a43]">
            {{ order.scheduledDate }} {{ order.scheduledTime }}
          </p>
        </div>

        <button
          class="mt-4 w-36 rounded-xl border border-[#4a4a43] px-4 py-3 font-medium text-[#4a4a43] hover:bg-[#f5f4f0] cursor-pointer"
          @click="$emit('open', order)"
        >
          查看詳情
        </button>
      </div>
    </div>
  </div>
</template>
