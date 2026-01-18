<script setup lang="ts">
import { ref } from 'vue';
import { useMemberData, type Member } from '@/views/Admin/composables/memberCore';
import MemberDetailModal from './components/MemberDetailModal.vue';
import CarOwnerTable from './components/CarOwnerTable.vue';
import ShopTable from './components/ShopTable.vue';

const tabs = [
  { id: 'carOwner', name: '車主會員' },
  { id: 'shop', name: '維修廠會員' },
];

const currentTab = ref('carOwner');
const selectedMember = ref<Member | null>(null);

const { carOwners, shops } = useMemberData();

const openModal = (member: Member) => {
  selectedMember.value = member;
};

const closeModal = () => {
  selectedMember.value = null;
};
</script>

<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium leading-6 text-gray-900">會員資料列表</h3>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex" aria-label="Tabs">
        <!-- 使用靜態定義的唯一 id 作為 key，確保頁籤切換時的效能與正確性 -->
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-[#6b6b5a] text-[#6b6b5a]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Content -->
    <div class="p-6">
      <CarOwnerTable
        v-if="currentTab === 'carOwner'"
        :members="carOwners"
        @view-detail="openModal"
      />
      <ShopTable v-else :members="shops" @view-detail="openModal" />
    </div>

    <!-- 詳情 Modal -->
    <MemberDetailModal
      v-if="selectedMember"
      :member="selectedMember"
      :type="currentTab"
      @close="closeModal"
    />
  </div>
</template>
