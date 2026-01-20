<script setup lang="ts">
import HeaderNavbar from '@/components/layout/HeaderNavbar.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<template>
  <div class="overflow-x-hidden">
    <HeaderNavbar />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped></style>
