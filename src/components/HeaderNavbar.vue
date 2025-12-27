<script setup lang="ts">
const emit = defineEmits<{
  (e: "login"): void
  (e: "signup"): void
}>()
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <div class="max-w-[1440px] mx-auto px-[5%] sm:px-[8%] lg:px-[5%]">
      <div class="flex justify-between items-center h-[60px] sm:h-[70px]">
        <!-- logo佔位區 -->
        <a href="/" class="flex items-center gap-2">
          <i class="fa-solid fa-car text-[#6b6b5a] text-[20px] sm:text-[24px]"></i>
          <span class="text-[20px] sm:text-[24px] font-bold text-[#4a4a43]">carE</span>
        </a>
        <div class="flex items-center gap-2 sm:gap-3">

        </div>
      </div>
    </div>
  </nav>
</template>
