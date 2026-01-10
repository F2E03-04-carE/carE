<script setup lang="ts">
import AsideMenu from './AsideMenu.vue'
</script>

<template>
  <div class="min-h-screen flex text-[#4a4a43]">
    <AsideMenu />

    <main class="w-[80%] ml-[20%] px-8 py-4 bg-white rounded-xl shadow-sm">
      <router-view />
    </main>
  </div>
</template>
