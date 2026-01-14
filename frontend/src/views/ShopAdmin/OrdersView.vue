<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Order } from './components/orderTypeDefine';
import OrderCard from './components/OrderCard.vue';
import OrderDetailModal from './components/OrderDetailModal.vue';
import { useOrders } from './components/useOrderModal';

const { orders, selectedOrder, showModal, open, save } = useOrders();

// 搜尋關鍵字
const keyword = ref('');

// 搜尋過濾
const filteredOrders = computed(() => {
  if (!keyword.value.trim()) return orders.value;
  const key = keyword.value.toLowerCase();
  return orders.value.filter((order) => {
    return (
      order.id.toLowerCase().includes(key) ||
      order.customer.name.toLowerCase().includes(key) ||
      order.customer.phone.includes(key) ||
      order.vehicle.model.toLowerCase().includes(key) ||
      order.vehicle.service.toLowerCase().includes(key)
    );
  });
});
</script>

<template>
  <div class="space-y-6">
    <!-- 標題 -->
    <div>
      <h1 class="text-2xl font-semibold text-[#4a4a43]">工單管理</h1>
      <p class="mt-1 text-[#8a8a7d]">系統工單配對、查詢</p>
    </div>

    <!-- 搜尋欄 -->
    <div class="flex items-center gap-4 rounded-2xl bg-[#f5f4f0] p-6 shadow-sm">
      <div class="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3">
        <svg
          class="h-5 w-5 text-[#8a8a7d]"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>

        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋工單號、客戶姓名或車輛..."
          class="w-full bg-transparent text-[#4a4a43] placeholder-[#8a8a7d] outline-none"
        />
      </div>
    </div>

    <!-- 工單列表 -->
    <div class="space-y-6">
      <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" @open="open" />
    </div>
  </div>

  <!-- 浮窗 -->
  <OrderDetailModal v-model="showModal" :order="selectedOrder" @save="save" />
</template>
