<script setup lang="ts">
import { ref } from 'vue';
import { mockCustomerProfiles } from '@/mocks/customer.mock';
import type { CustomerProfile } from '@/mocks/customer.mock';
import AdminPageHeader from './components/AdminPageHeader.vue';
import RecordCard from './components/RecordCard.vue';
import { useSearch } from './composables/useSearch';

// 假資料
const carOwners = ref<CustomerProfile[]>(mockCustomerProfiles);

const filterFn = (owner: CustomerProfile, key: string) => {
  return (
    owner.name.toLowerCase().includes(key) ||
    owner.phone.includes(key) ||
    owner.vehicle.model.toLowerCase().includes(key)
  );
};

const { keyword, filteredResults: filteredCarOwners } = useSearch(carOwners, filterFn);
</script>

<template>
  <div class="min-h-screen space-y-6">
    <AdminPageHeader
      title="維修紀錄"
      subtitle="查詢車主過往維修紀錄"
      placeholder="搜尋客戶姓名、電話或車輛..."
      v-model:keyword="keyword"
    />

    <!-- 客戶卡片列表 -->
    <div class="space-y-6">
      <RecordCard
        v-for="carOwner in filteredCarOwners"
        :key="carOwner.id"
        :car-owner="carOwner"
      />
    </div>
  </div>
</template>

