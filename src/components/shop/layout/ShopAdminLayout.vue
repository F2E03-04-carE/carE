<script setup lang="ts">
import AsideMenu from './AsideMenu.vue'
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-700">
    <AsideMenu />

    <main class="w-[80%] ml-[20%] px-8 py-4">
      <router-view />
    </main>
  </div>
</template>
