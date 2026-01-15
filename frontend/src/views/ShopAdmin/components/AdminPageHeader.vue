<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
  placeholder: string;
  keyword: string;
}>();

const emit = defineEmits<{
  (e: 'update:keyword', value: string): void;
}>();

const onInput = (event: Event) => {
  emit('update:keyword', (event.target as HTMLInputElement).value);
};
</script>

<template>
  <!-- 標題 -->
  <div>
    <h1 class="text-2xl font-semibold text-[#4a4a43]">{{ props.title }}</h1>
    <p class="mt-1 text-[#8a8a7d]">{{ props.subtitle }}</p>
  </div>

  <!-- 搜尋欄 -->
  <div class="flex items-center gap-4 rounded-2xl bg-[#f5f4f0] p-6 shadow-sm">
    <div class="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3">
      <span class="material-symbols-outlined">search</span>

      <input
        :value="props.keyword"
        @input="onInput"
        type="text"
        :placeholder="props.placeholder"
        class="w-full bg-transparent text-[#4a4a43] placeholder-[#8a8a7d] outline-none"
      />
    </div>
  </div>
</template>
