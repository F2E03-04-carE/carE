<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const handleLogout = () => {
  const confirmLogout = confirm('確定要登出嗎？');
  if (confirmLogout) {
    router.push('/admin-login');
  }
};
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- 側邊欄 -->
    <aside class="w-64 bg-[#6b6b5a] text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-[#5a5a4a] flex items-center">
        <span>carE Admin</span>
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
        >
          會員管理
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
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- 頂部導航條 (可選) -->
      <header class="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">後台管理系統</h2>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">管理員，您好</span>
        </div>
      </header>

      <!-- 內容視圖 -->
      <div class="flex-1 overflow-auto p-8">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
