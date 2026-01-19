<script setup lang="ts">
import { ref } from 'vue';
import PageHead from '@/components/GarageAdmin/PageHead.vue';
import SearchBar from '@/components/GarageAdmin/SearchBar.vue';
import RecordCard from '@/components/GarageAdmin/RecordCard.vue';
import type { CustomerProfile } from '@/components/GarageAdmin/types';

// 假資料
const carOwners = ref<CustomerProfile[]>([
  {
    id: 'CUST-001',
    name: '張君雅',
    phone: '0911-222-333',
    vehicle: {
      id: 'VEH-001',
      licensePlate: 'ABC-7890',
      model: 'Nissan Sentra',
      brand: 'Nissan',
    },
    serviceHistory: [
      {
        id: 'REC-001',
        scheduledDate: '2026-01-05',
        serviceType: '輪胎更換',
        description: '更換四條米其林輪胎',
        price: 18000,
      },
      {
        id: 'REC-002',
        scheduledDate: '2025-10-12',
        serviceType: '定期保養',
        description: '五千公里定期保養',
        price: 3500,
      },
    ],
  },
  {
    id: 'CUST-002',
    name: '陳小華',
    phone: '0922-333-444',
    vehicle: {
      id: 'VEH-002',
      licensePlate: 'XYZ-1234',
      model: 'BMW 3系列',
      brand: 'BMW',
    },
    serviceHistory: [
      {
        id: 'REC-003',
        scheduledDate: '2026-01-10',
        serviceType: '煞車系統檢查',
        description: '更換前煞車片',
        price: 4500,
      },
    ],
  },
  {
    id: 'CUST-003',
    name: '林美麗',
    phone: '0933-444-555',
    vehicle: {
      id: 'VEH-003',
      licensePlate: 'DEF-5678',
      model: 'Mercedes-Benz C-Class',
      brand: 'Mercedes-Benz',
    },
    serviceHistory: [
      {
        id: 'REC-004',
        scheduledDate: '2026-01-22',
        serviceType: '引擎故障燈診斷',
        description: '含氧感應器更換',
        price: 6000,
      },
    ],
  },
]);

const keyword = ref('');
</script>

<template>
  <div class="min-h-screen space-y-6">
    <PageHead title="維修紀錄" subtitle="查詢車主過往維修紀錄" />
    <SearchBar placeholder="搜尋客戶姓名、電話或車牌..." v-model:keyword="keyword" />

    <!-- 客戶卡片列表 -->
    <div class="space-y-6">
      <RecordCard v-for="carOwner in carOwners" :key="carOwner.id" :carOwner="carOwner" />
    </div>
  </div>
</template>
