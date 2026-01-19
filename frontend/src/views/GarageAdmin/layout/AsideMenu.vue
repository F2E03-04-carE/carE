<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

defineEmits(['close']);

const route = useRoute();
const userStore = useUserStore();

const garageName = computed(() => {
  if (userStore.currentUser?.role === 'garage') {
    return userStore.currentUser.name;
  }
  return '負責人';
});

const menuItems = [
  { path: '/garage-admin/overview', label: '總覽', icon: 'search' },
  { path: '/garage-admin/orders', label: '工單管理', icon: 'event_note' },
  { path: '/garage-admin/schedule', label: '行程安排', icon: 'calendar_month' },
  { path: '/garage-admin/records', label: '維修紀錄', icon: 'trending_up' },
  { path: '/garage-admin/edit', label: '廠房資訊', icon: 'factory' },
];

const isActive = (path: string) => route.path === path;
</script>

<template>
  <aside class="relative w-[260px] h-screen bg-[#f5f4f0] flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 text-xl font-bold text-[#4a4a43]">
      <span>您好: {{ garageName }}</span>
      <!-- 行動裝置的 X 按鈕 -->
      <button
        @click="$emit('close')"
        class="grid h-10 w-10 place-items-center rounded-md lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="border-b border-gray-300 mx-6 hidden lg:block"></div>

    <div class="hidden px-6 py-4 text-xl font-semibold text-[#4a4a43] lg:block">維修廠後台</div>

    <nav class="flex-1 overflow-y-auto px-3 gap-4 flex flex-col pt-4">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'py-3',
          'rounded',
          'flex',
          'items-center',
          'justify-center',
          'gap-2',
          'transition-colors',
          isActive(item.path)
            ? 'font-bold bg-[#6b6b5a] text-white'
            : 'text-[#4a4a43] hover:bg-[#e5e3df] cursor-pointer',
        ]"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="mt-auto px-6 py-4 text-sm text-[#8a8a7d]">© 2025 維修廠後台</div>
  </aside>
</template>
