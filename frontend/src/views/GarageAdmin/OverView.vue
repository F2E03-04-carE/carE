<script setup lang="ts">
import { ref } from 'vue';
import OrderCard from '@/components/GarageAdmin/OrderCard.vue';
import OrderDetailModal from '@/components/GarageAdmin/OrderDetailModal.vue';
import type { Order } from '@/types/garage';
import { mockStats, mockOrders } from '@/composables/garage/mockData';

// 假資料
const orders = ref<Order[]>([...mockOrders]);

const showModal = ref(false);
const selectedOrder = ref<Order | null>(null);

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
    <!-- 標題 -->
    <div>
      <h1 class="text-2xl font-semibold text-[#4a4a43]">總覽</h1>
      <p class="mt-1 text-[#8a8a7d]">今日維修廠營運概況</p>
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="item in mockStats"
        :key="item.label"
        class="bg-[#f5f4f0] rounded-2xl p-6 flex items-center justify-between shadow-sm"
      >
        <div>
          <p class="text-[#8a8a7d] text-sm mb-1">{{ item.label }}</p>
          <p class="text-3xl font-semibold text-[#4a4a43]">{{ item.value }}</p>
        </div>
        <div class="w-12 h-12 flex items-center justify-center text-xl bg-white rounded-xl">
          <span class="material-symbols-outlined">{{ item.icon }}</span>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-semibold text-[#4a4a43]">近期工單</h2>
      <!-- 工單列表 -->
      <section class="mt-5 space-y-6">
        <OrderCard v-for="order in orders" :key="order.id" :order="order" @open="open" />
      </section>
    </div>
  </div>

  <!-- 浮窗 -->
  <OrderDetailModal v-model="showModal" :order="selectedOrder" @save="save" />
</template>
