<script setup lang="ts">
import HeaderNavbar from './components/layout/HeaderNavbar.vue';
import Home from './views/Home/Home.vue';
import Footer from './components/layout/Footer.vue';
import SearchResults from './views/Search/SearchResults.vue';
import DetailView from './views/Search/components/DetailView.vue';
import ServiceSearchFlow from './components/service-search/ServiceSearchFlow.vue';
import VehicleManagement from './views/User/VehicleManagement.vue';
import JoinGarage from './views/Garage/JoinGarage.vue';
import GarageOnboarding from './views/Garage/GarageOnboarding.vue';

</script>

<template>
  <div class="overflow-x-hidden">
  <HeaderNavbar />
  <Home />
  <SearchResults />
  <DetailView />
  <ServiceSearchFlow />
  <VehicleManagement />
  <JoinGarage />
  <GarageOnboarding />
  <Footer />
  </div>
</template>

<style scoped></style>
