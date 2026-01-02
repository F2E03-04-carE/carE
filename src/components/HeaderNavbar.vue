<script setup lang="ts">
defineEmits<{
  (e: 'login'): void
  (e: 'signup'): void
}>()
const baseButtonClass = 'px-3 py-3 sm:px-4 sm:py-2 lg:px-5 lg:py-2 text-[14px] sm:text-[15px] lg:text-[16px] rounded-lg sm:rounded-xl transition-colors duration-200'
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <nav class="max-w-[1440px] mx-auto px-[5%] sm:px-[8%] lg:px-[5%]">
      <div class="flex justify-between items-center h-[60px] sm:h-[70px]">
        <!-- logo佔位區 -->
        <a href="/" class="flex items-center gap-2">
          <i class="fa-solid fa-car text-[#6b6b5a] text-[20px] sm:text-[24px]"></i>
          <span class="text-[20px] sm:text-[24px] font-bold text-[#4a4a43]">carE</span>
        </a>
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="$emit('login')"
            :class="[baseButtonClass, 'border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white']"
          >
          登入
          </button>
          <button
            @click="$emit('signup')"
            :class="[baseButtonClass, 'bg-[#6b6b5a] text-white hover:bg-[#5a5a4a] px-4 sm:px-6 lg:px-6 font-medium border border-transparent']"
          >
          加入會員
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
