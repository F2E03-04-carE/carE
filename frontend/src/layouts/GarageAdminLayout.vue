<script setup lang="ts">
import HeaderNavbar from '@/components/layout/HeaderNavbar.vue';
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 text-[#4a4a43]">
    <!-- 全域導覽列 -->
    <HeaderNavbar />

    <div class="pt-[60px] sm:pt-[70px] min-h-screen">
      <!-- 主要內容區域 -->
      <main class="min-h-[calc(100vh-70px)] bg-white px-4 py-8 lg:px-8">
        <div class="max-w-[1440px] mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>