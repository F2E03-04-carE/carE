<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const goPage = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}

// startsWith 用以支援子路由，特別是 edit/<childPath>
const activeTab = (path: string) => route.path.startsWith(path)

const isMenuDisabled = computed(() => {
  return authStore.status === 'pending_review' || authStore.status === 'onboarding'
})
</script>

<template>
  <aside
    class="fixed w-[20%] h-screen bg-[#f5f4f0] shadow-[8px_0_10px_-3px_rgba(0,0,0,0.25)] flex flex-col"
  >
    <div class="px-6 py-6 text-xl font-semibold text-[#4a4a43]">維修廠後台</div>

    <nav class="flex flex-col px-3 gap-4">
      <button
        @click="goPage('/overview')"
        :class="[
          activeTab('/overview') ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]',
          isMenuDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e5e3df]',
        ]"
        class="py-3 rounded cursor-pointer flex items-center justify-center gap-2 transition-colors"
        :disabled="isMenuDisabled"
      >
        <span class="material-symbols-outlined">search</span> 總覽
      </button>

      <button
        @click="goPage('/orders')"
        :class="[
          activeTab('/orders') ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]',
          isMenuDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e5e3df]',
        ]"
        class="py-3 rounded cursor-pointer flex items-center justify-center gap-2 transition-colors"
        :disabled="isMenuDisabled"
      >
        <span class="material-symbols-outlined">event_note</span> 工單管理
      </button>

      <button
        @click="goPage('/schedule')"
        :class="[
          activeTab('/schedule') ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]',
          isMenuDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e5e3df]',
        ]"
        class="py-3 rounded cursor-pointer flex items-center justify-center gap-2 transition-colors"
        :disabled="isMenuDisabled"
      >
        <span class="material-symbols-outlined">calendar_month</span> 行程安排
      </button>

      <button
        @click="goPage('/records')"
        :class="[
          activeTab('/records') ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]',
          isMenuDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e5e3df]',
        ]"
        class="py-3 rounded cursor-pointer flex items-center justify-center gap-2 transition-colors"
        :disabled="isMenuDisabled"
      >
        <span class="material-symbols-outlined">trending_up</span> 維修紀錄
      </button>

      <button
        @click="goPage('/edit')"
        :class="activeTab('/edit') ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]'"
        class="py-3 rounded cursor-pointer hover:bg-[#e5e3df] flex items-center justify-center gap-2"
      >
        <span class="material-symbols-outlined">factory</span> 廠房資訊
      </button>
    </nav>

    <div class="mt-auto px-6 py-4 text-sm text-[#8a8a7d]">© 2025 維修廠後台</div>
  </aside>
</template>
