<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

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
  <aside
    class="fixed top-0 left-0 z-40 w-[260px] h-screen bg-[#f5f4f0] shadow-[8px_0_10px_-3px_rgba(0,0,0,0.25)] flex flex-col"
  >
    <div class="px-6 py-6 text-xl font-semibold text-[#4a4a43]">維修廠後台</div>

    <nav class="flex-1 overflow-y-auto px-3 gap-4 flex flex-col">
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
