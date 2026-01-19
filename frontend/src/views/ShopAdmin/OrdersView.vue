<script setup lang="ts">
import { ref } from 'vue';
import OrderCard from './_components/OrderCard.vue';
import OrderDetailModal from './_components/OrderDetailModal.vue';
import PageHead from './_components/PageHead.vue';
import SearchBar from './_components/SearchBar.vue';
import type { Order } from './types';

// 假資料
const orders = ref<Order[]>([
  {
    id: 'ORD-20260105-001',
    status: '待確認',
    requestTime: '2026-01-04 09:30',
    scheduledDate: '2026-01-05',
    scheduledTime: '10:00',
    serviceType: '輪胎更換',
    note: '希望換抓地力好一點的輪胎，預算兩萬元左右。',
    customer: {
      id: 'CUST-001',
      name: '張君雅',
      phone: '0911-222-333',
    },
    vehicle: {
      id: 'VEH-001',
      licensePlate: 'ABC-7890',
      model: 'Nissan Sentra',
      brand: 'Nissan',
    },
  },
  {
    id: 'ORD-20260110-002',
    status: '進行中',
    requestTime: '2026-01-09 13:00',
    scheduledDate: '2026-01-10',
    scheduledTime: '15:00',
    serviceType: '煞車系統檢查',
    note: '煞車有異音，踩下去軟軟的，請檢查總泵。',
    customer: {
      id: 'CUST-002',
      name: '陳小華',
      phone: '0922-333-444',
    },
    vehicle: {
      id: 'VEH-002',
      licensePlate: 'XYZ-1234',
      model: 'BMW 3系列',
      brand: 'BMW',
    },
  },
  {
    id: 'ORD-20260122-003',
    status: '已完成',
    requestTime: '2026-01-21 16:00',
    scheduledDate: '2026-01-22',
    scheduledTime: '09:00',
    serviceType: '引擎故障燈診斷',
    note: '引擎燈亮了三天，但開起來沒什麼異狀。',
    customer: {
      id: 'CUST-003',
      name: '林美麗',
      phone: '0933-444-555',
    },
    vehicle: {
      id: 'VEH-003',
      licensePlate: 'DEF-5678',
      model: 'Mercedes-Benz C-Class',
      brand: 'Mercedes-Benz',
    },
  },
]);

const showModal = ref(false);
const selectedOrder = ref<Order | null>(null);
const keyword = ref('');

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
      <OrderCard v-for="order in orders" :key="order.id" :order="order" @open="open" />
    </div>
  </div>

  <!-- 浮窗 -->
  <OrderDetailModal v-model="showModal" :order="selectedOrder" @save="save" />
</template>
