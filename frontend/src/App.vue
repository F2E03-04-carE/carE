<script setup lang="ts">
import HeaderNavbar from './components/layout/HeaderNavbar.vue';
import Home from './views/Home/Home.vue';
import Footer from './components/layout/Footer.vue';
import SearchResults from './views/Search/SearchResults.vue';
import DetailView from './views/Search/components/DetailView.vue';
import ServiceSearchFlow from './components/service-search/ServiceSearchFlow.vue';
import VehicleManagement from './views/User/VehicleManagement.vue';
</script>

<template>
  <HeaderNavbar />
  <Home />
  <Footer />
  <SearchResults />
  <DetailView />
  <ServiceSearchFlow />
  <VehicleManagement />
  <RouterView />
</template>

<style scoped></style>
