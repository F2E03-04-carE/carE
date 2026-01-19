<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const isActive = (path: string) => route.path === path;
</script>

<template>
  <aside
    class="fixed top-0 left-0 z-40 w-[260px] h-screen bg-[#f5f4f0] shadow-[8px_0_10px_-3px_rgba(0,0,0,0.25)] flex flex-col"
  >
    <div class="px-6 py-6 text-xl font-semibold text-[#4a4a43]">維修廠後台</div>

    <nav class="flex-1 overflow-y-auto px-3 gap-4 flex flex-col">
      <RouterLink
        to="/shop-admin/overview"
        :class="[
          'py-3',
          'rounded',
          'flex',
          'items-center',
          'justify-center',
          'gap-2',
          'transition-colors',
          isActive('/shop-admin/overview')
            ? 'font-bold bg-[#6b6b5a] text-white'
            : 'text-[#4a4a43] hover:bg-[#e5e3df] cursor-pointer',
        ]"
      >
        <span class="material-symbols-outlined">search</span> 總覽
      </RouterLink>

      <RouterLink
        to="/shop-admin/orders"
        :class="[
          'py-3',
          'rounded',
          'flex',
          'items-center',
          'justify-center',
          'gap-2',
          'transition-colors',
          isActive('/shop-admin/orders')
            ? 'font-bold bg-[#6b6b5a] text-white'
            : 'text-[#4a4a43] hover:bg-[#e5e3df] cursor-pointer',
        ]"
      >
        <span class="material-symbols-outlined">event_note</span> 工單管理
      </RouterLink>

      <RouterLink
        to="/shop-admin/schedule"
        :class="[
          'py-3',
          'rounded',
          'flex',
          'items-center',
          'justify-center',
          'gap-2',
          'transition-colors',
          isActive('/shop-admin/schedule')
            ? 'font-bold bg-[#6b6b5a] text-white'
            : 'text-[#4a4a43] hover:bg-[#e5e3df] cursor-pointer',
        ]"
      >
        <span class="material-symbols-outlined">calendar_month</span> 行程安排
      </RouterLink>

      <RouterLink
        to="/shop-admin/records"
        :class="[
          'py-3',
          'rounded',
          'flex',
          'items-center',
          'justify-center',
          'gap-2',
          'transition-colors',
          isActive('/shop-admin/records')
            ? 'font-bold bg-[#6b6b5a] text-white'
            : 'text-[#4a4a43] hover:bg-[#e5e3df] cursor-pointer',
        ]"
      >
        <span class="material-symbols-outlined">trending_up</span> 維修紀錄
      </RouterLink>

      <RouterLink
        to="/shop-admin/edit"
        :class="[
          'py-3',
          'rounded',
          'flex',
          'items-center',
          'justify-center',
          'gap-2',
          'transition-colors',
          isActive('/shop-admin/edit')
            ? 'font-bold bg-[#6b6b5a] text-white'
            : 'text-[#4a4a43] hover:bg-[#e5e3df] cursor-pointer',
        ]"
      >
        <span class="material-symbols-outlined">factory</span> 廠房資訊
      </RouterLink>
    </nav>

    <div class="mt-auto px-6 py-4 text-sm text-[#8a8a7d]">© 2025 維修廠後台</div>
  </aside>
</template>
