<script setup lang="ts">
defineProps<{
  placeholder: string;
}>();

const keyword = defineModel<string>('keyword');
</script>

<template>
  <div class="flex items-center gap-4 rounded-2xl bg-[#f5f4f0] p-6 shadow-sm">
    <div class="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3">
      <span class="material-symbols-outlined">search</span>

      <input
        v-model="keyword"
        type="text"
        :placeholder="placeholder"
        class="w-full bg-transparent text-[#4a4a43] placeholder-[#8a8a7d] outline-none"
      />
    </div>
  </div>
</template>
