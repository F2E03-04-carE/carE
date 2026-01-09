<script setup lang="ts">
import AsideMenu from '@/components/shop/AsideMenu.vue'
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-700">
    <AsideMenu />

    <main class="w-[80%] ml-[20%] p-8">
      <router-view />
    </main>
  </div>
</template>
