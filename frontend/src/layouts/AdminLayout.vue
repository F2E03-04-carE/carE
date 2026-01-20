<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);

// 控制登出確認視窗的顯示
const showLogoutModal = ref(false);

// 導覽項目定義
const navItems = [
  { name: '會員管理', path: '/admin/members' },
  { name: '評論列表', path: '/admin/reviews' },
];

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 點擊登出按鈕，顯示確認視窗
const handleLogout = () => {
  showLogoutModal.value = true;
};

// 確認登出：執行跳轉
const confirmLogoutAction = () => {
  showLogoutModal.value = false;
  router.push('/admin-login');
};

// 取消登出：關閉視窗
const cancelLogout = () => {
  showLogoutModal.value = false;
};
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- 登出確認浮窗 -->
    <div
      v-if="showLogoutModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-[90%] max-w-sm p-6 transform transition-all scale-100"
      >
        <h3 class="text-lg font-bold text-gray-800 mb-2">確認登出</h3>
        <p class="text-gray-600 mb-6">您確定要登出管理後台嗎？</p>
        <div class="flex justify-end gap-3">
          <button
            @click="cancelLogout"
            class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm font-medium"
          >
            取消
          </button>
          <button
            @click="confirmLogoutAction"
            class="px-4 py-2 text-white bg-[#6b6b5a] hover:bg-[#5a5a4a] rounded-md transition-colors text-sm font-medium"
          >
            確定登出
          </button>
        </div>
      </div>
    </div>

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
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="block px-4 py-2 rounded transition-colors"
          :class="
            route.path.startsWith(item.path)
              ? 'bg-[#5a5a4a] text-white'
              : 'text-gray-100 hover:bg-[#5a5a4a] hover:text-white'
          "
          @click="isSidebarOpen = false"
        >
          {{ item.name }}
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
