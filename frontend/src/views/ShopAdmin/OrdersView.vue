<script setup lang="ts">
import OrderCard from './components/OrderCard.vue';
import OrderDetailModal from './components/OrderDetailModal.vue';
import { useOrders } from './composables/useOrderModal';
import AdminPageHeader from './components/AdminPageHeader.vue';
import { useSearch } from './composables/useSearch';
import type { Order } from './composables/useOrderModal';

const { orders, selectedOrder, showModal, open, save } = useOrders();

const filterFn = (order: Order, key: string) => {
  return (
    order.id.toLowerCase().includes(key) ||
    order.customer.name.toLowerCase().includes(key) ||
    order.customer.phone.includes(key) ||
    order.vehicle.model.toLowerCase().includes(key)
  );
};

const { keyword, filteredResults: filteredOrders } = useSearch(orders, filterFn);
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="工單管理"
      subtitle="系統工單配對、查詢"
      placeholder="搜尋工單號、客戶姓名、電話或車輛..."
      v-model:keyword="keyword"
    />

    <!-- 工單列表 -->
    <div class="space-y-6">
      <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" @open="open" />
    </div>
  </div>

  <!-- 浮窗 -->
  <OrderDetailModal v-model="showModal" :order="selectedOrder" @save="save" />
</template>
