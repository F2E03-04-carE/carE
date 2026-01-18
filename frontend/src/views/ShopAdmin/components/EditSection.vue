<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
}>();
</script>

<template>
  <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-[#4a4a43] flex items-center gap-2">
          <span class="material-symbols-outlined">{{ icon }}</span> {{ title }}
        </h2>
      </div>
      <!-- 內容插槽 -->
      <slot></slot>
    </div>
  </section>
</template>
