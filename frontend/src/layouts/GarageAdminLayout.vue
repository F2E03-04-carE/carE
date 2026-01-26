<template>
  <div class="garage-admin-layout">
    <!-- 暫時的 Layout 框架，Step 6 會完善 -->
    <div class="flex min-h-screen bg-gray-100">
      <!-- Sidebar 區域 -->
      <aside class="w-64 bg-white shadow-lg">
        <div class="p-4">
          <h2 class="text-xl font-bold text-gray-800">維修廠後台</h2>
          <nav class="mt-8 space-y-2">
            <router-link
              to="/garage/admin/dashboard"
              class="block px-4 py-2 rounded hover:bg-gray-100"
              active-class="bg-[#6b6b5a] text-white"
            >
              總覽
            </router-link>
            <router-link
              to="/garage/admin/appointments"
              class="block px-4 py-2 rounded hover:bg-gray-100"
              active-class="bg-[#6b6b5a] text-white"
            >
              預約排程
            </router-link>
            <router-link
              to="/garage/admin/records"
              class="block px-4 py-2 rounded hover:bg-gray-100"
              active-class="bg-[#6b6b5a] text-white"
            >
              完工維修紀錄
            </router-link>
            <router-link
              to="/garage/admin/settings"
              class="block px-4 py-2 rounded hover:bg-gray-100"
              active-class="bg-[#6b6b5a] text-white"
            >
              編輯維修廠
            </router-link>
          </nav>
        </div>
      </aside>

      <!-- 主要內容區域 -->
      <main class="flex-1 p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Step 6 會在這裡加入完整的邏輯
</script>
