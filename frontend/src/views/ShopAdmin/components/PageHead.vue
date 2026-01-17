<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-[#4a4a43]">{{ title }}</h1>
    <p class="mt-1 text-[#8a8a7d]">{{ subtitle }}</p>
  </div>
</template>
