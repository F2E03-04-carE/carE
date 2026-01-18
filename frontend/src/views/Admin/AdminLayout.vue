<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = () => {
  const confirmLogout = confirm('確定要登出嗎？');
  if (confirmLogout) {
    router.push('/admin-login');
  }
};
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- 行動裝置遮罩 -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- 側邊欄 -->
    <aside
      class="fixed inset-y-0 left-0 z-30 w-64 bg-[#6b6b5a] text-white flex flex-col transition-transform duration-300 transform lg:static lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div
        class="p-6 text-2xl font-bold border-b border-[#5a5a4a] flex items-center justify-between"
      >
        <span>carE Admin</span>
        <!-- 行動裝置關閉按鈕 -->
        <button class="lg:hidden text-white hover:text-gray-200" @click="isSidebarOpen = false">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link
          to="/admin/members"
          class="block px-4 py-2 rounded transition-colors"
          :class="
            route.path.includes('/members')
              ? 'bg-[#5a5a4a] text-white'
              : 'text-gray-100 hover:bg-[#5a5a4a] hover:text-white'
          "
          @click="isSidebarOpen = false"
        >
          會員管理
        </router-link>
        <router-link
          to="/admin/reviews"
          class="block px-4 py-2 rounded transition-colors"
          :class="
            route.path.includes('/reviews')
              ? 'bg-[#5a5a4a] text-white'
              : 'text-gray-100 hover:bg-[#5a5a4a] hover:text-white'
          "
          @click="isSidebarOpen = false"
        >
          評論列表
        </router-link>
      </nav>

      <div class="p-4 border-t border-[#5a5a4a]">
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center px-4 py-2 border border-white/30 rounded text-sm text-gray-100 hover:bg-[#5a5a4a] hover:text-white transition-colors"
        >
          登出
        </button>
      </div>
    </aside>

    <!-- 主要內容區 -->
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- 頂部導航條 -->
      <header class="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <!-- 側邊欄切換按鈕 (只在 sm, md 顯示) -->
          <button
            class="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-1 rounded-md hover:bg-gray-100"
            @click="toggleSidebar"
          >
            <span class="material-symbols-outlined text-2xl align-middle">menu</span>
          </button>
          <h2 class="text-xl font-semibold text-gray-800">後台管理系統</h2>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600 hidden sm:inline">管理員，您好</span>
          <span class="material-symbols-outlined text-gray-600 sm:hidden">account_circle</span>
        </div>
      </header>

      <!-- 內容視圖 -->
      <div class="flex-1 overflow-auto p-4 sm:p-8">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
