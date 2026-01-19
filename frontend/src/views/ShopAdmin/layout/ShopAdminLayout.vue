<script setup lang="ts">
import AsideMenu from './AsideMenu.vue';
</script>

<template>
  <div class="min-h-screen text-[#4a4a43] relative">
    <div class="flex min-h-screen">
      <AsideMenu />

      <main class="flex-1 ml-[260px] px-8 py-8 bg-white">
        <router-view />
      </main>
    </div>
  </div>
</template>