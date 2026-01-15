<script setup lang="ts">
import { computed } from 'vue';
import { useOrders } from './components/useOrderModal';
import OrderCard from './components/OrderCard.vue';
import OrderDetailModal from './components/OrderDetailModal.vue';

const { orders, selectedOrder, showModal, open, save } = useOrders();

const today = new Date();

const isSameDay = (dateStr: string, target: Date) => {
  const date = new Date(dateStr);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
};

const isSameMonth = (dateStr: string, target: Date) => {
  const date = new Date(dateStr);
  return date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth();
};

// 統計卡
const todayOrderCount = computed(
  () => orders.value.filter((order) => isSameDay(order.scheduledDate, today)).length,
);

const waitingCount = computed(
  () => orders.value.filter((order) => order.status === '待確認').length,
);

const monthCompletedCount = computed(
  () =>
    orders.value.filter(
      (order) =>
        (order.status === '已完成' || order.status === '已取車') &&
        isSameMonth(order.scheduledDate, today),
    ).length,
);

const stats = computed(() => [
  { label: '今日預約', value: todayOrderCount.value, icon: 'event_note' },
  { label: '待確認工單', value: waitingCount.value, icon: 'assignment' },
  { label: '本月完成', value: monthCompletedCount.value, icon: 'trending_up' },
]);
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
        v-for="item in stats"
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
