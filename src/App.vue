<script setup lang="ts">
import HeaderNavbar from './components/HeaderNavbar.vue'
import Home from './components/Home.vue'
import Footer from './components/Footer.vue'
import DevRoleSwitcher from './components/shop/DevRoleSwitcher.vue'
</script>

<template>
  <!-- <HeaderNavbar />
  <Home />
  <Footer /> -->
  <DevRoleSwitcher />
  <RouterView />
</template>

<style scoped></style>
