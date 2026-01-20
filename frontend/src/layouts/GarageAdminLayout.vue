<script setup lang="ts">
import { ref } from 'vue';
import AsideMenu from '@/components/GarageAdmin/AsideMenu.vue';

const isSidebarOpen = ref(false);
</script>

<template>
  <div class="relative flex min-h-screen bg-gray-100 text-[#4a4a43]">
    <!-- 側邊欄 -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 h-screen transform transition-transform duration-300 ease-in-out',
        'lg:shadow-[8px_0_10px_-3px_rgba(0,0,0,0.25)]',
        'lg:translate-x-0',
        { '-translate-x-full': !isSidebarOpen },
      ]"
    >
      <AsideMenu @close="isSidebarOpen = false" />
    </aside>

    <!-- 行動裝置遮罩，把側邊欄打開的時候 -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-30 bg-black/60 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <div class="flex-1 min-w-0 flex flex-col lg:ml-[260px]">
      <!-- 行動裝置 header  -->
      <header class="relative flex h-16 items-center justify-center bg-[#f5f4f0] px-4 lg:hidden">
        <button
          v-if="!isSidebarOpen"
          @click="isSidebarOpen = true"
          class="absolute left-4 grid h-10 w-10 place-items-center rounded-md"
          aria-label="Open menu"
        >
          <!-- 漢堡 -->
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <h1 class="text-lg font-bold text-[#4a4a43]">維修廠後台</h1>
      </header>

      <main class="flex-1 overflow-y-auto bg-white px-4 py-8 lg:px-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
