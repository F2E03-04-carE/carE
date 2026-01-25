<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="min-h-screen bg-[#f4f1eb]">
    <header class="bg-[#f9f7f4] border-b border-[#e0dbd3]">
      <div class="max-w-5xl mx-auto px-6 py-5">
        <h1 class="text-[#4a4540] tracking-wide">維修歷史</h1>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-6 py-8 md:py-10">
      <div class="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div class="rounded-full bg-[#f9f7f4] p-8 mb-6">
          <span class="material-symbols-outlined text-[#8b7f6f] text-[64px]">
            history
          </span>
        </div>
        <h2 class="text-2xl font-bold text-[#4a4540] mb-3">維修歷史功能建置中</h2>
        <p class="text-[#8a8a7d] mb-8 max-w-md">
          我們正在努力開發此功能，敬請期待！您將能在此查看所有的維修歷史紀錄。
        </p>
        <button
          @click="router.push('/member/profile')"
          class="px-6 py-3 bg-[#8b7f6f] text-white rounded-lg hover:bg-[#7a6f5f] transition-colors cursor-pointer"
        >
          返回會員中心
        </button>
      </div>
    </main>
  </div>
</template>
