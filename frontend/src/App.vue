<script setup lang="ts">
import HeaderNavbar from '@/components/layout/HeaderNavbar.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<template>
  <div class="overflow-x-hidden">
    <HeaderNavbar />
    <!-- 主內容區：添加 padding-top 避免被 fixed navbar 遮蓋 -->
    <main class="pt-[60px] sm:pt-[70px]">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
