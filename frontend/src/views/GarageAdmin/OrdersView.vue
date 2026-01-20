<script setup lang="ts">
import { ref, computed } from 'vue';
import OrderCard from '@/components/GarageAdmin/OrderCard.vue';
import OrderDetailModal from '@/components/GarageAdmin/OrderDetailModal.vue';
import PageHead from '@/components/GarageAdmin/PageHead.vue';
import SearchBar from '@/components/GarageAdmin/SearchBar.vue';
import type { Order } from '@/types/garage';
import { mockOrders } from '@/composables/garage/mockData';

// 假資料
const orders = ref<Order[]>([...mockOrders]);

const showModal = ref(false);
const selectedOrder = ref<Order | null>(null);
const keyword = ref('');

// 搜尋過濾邏輯
const filteredOrders = computed(() => {
  if (!keyword.value.trim()) return orders.value;
  
  const k = keyword.value.toLowerCase().trim();
  return orders.value.filter(order => {
    return (
      order.id.toLowerCase().includes(k) ||
      order.customer.name.toLowerCase().includes(k) ||
      order.customer.phone.includes(k) ||
      order.vehicle.licensePlate.toLowerCase().includes(k)
    );
  });
});

const open = (order: Order) => {
  selectedOrder.value = order;
  showModal.value = true;
};

const save = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <PageHead title="工單管理" subtitle="系統工單配對、查詢" />
    <SearchBar placeholder="搜尋工單號、客戶姓名、電話或車牌..." v-model:keyword="keyword" />

    <!-- 工單列表 -->
    <div class="space-y-6">
      <div v-if="filteredOrders.length === 0" class="text-center py-10 text-gray-500">
        查無相關工單
      </div>
      <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" @open="open" />
    </div>
  </div>

  <!-- 浮窗 -->
  <OrderDetailModal v-model="showModal" :order="selectedOrder" @save="save" />
</template>
