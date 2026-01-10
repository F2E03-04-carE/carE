<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goPage = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const activeTab = computed(() => route.path)
</script>

<template>
  <aside
    class="fixed w-[20%] h-screen bg-[#f5f4f0] shadow-[8px_0_10px_-3px_rgba(0,0,0,0.25)] flex flex-col"
  >
    <div class="px-6 py-6 text-xl font-semibold text-[#4a4a43]">維修廠後台</div>

    <nav class="flex flex-col px-3 gap-4">
      <button
        @click="goPage('/overview')"
        :class="activeTab === '/overview' ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]'"
        class="py-3 rounded cursor-pointer hover:bg-[#e5e3df]"
      >
        🔍 總覽
      </button>

      <button
        @click="goPage('/orders')"
        :class="activeTab === '/orders' ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]'"
        class="py-3 rounded cursor-pointer hover:bg-[#e5e3df]"
      >
        📅 工單管理
      </button>

      <button
        @click="goPage('/schedule')"
        :class="activeTab === '/schedule' ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]'"
        class="py-3 rounded cursor-pointer hover:bg-[#e5e3df]"
      >
        📋 行程安排
      </button>

      <button
        @click="goPage('/records')"
        :class="activeTab === '/records' ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]'"
        class="py-3 rounded cursor-pointer hover:bg-[#e5e3df]"
      >
        📈 維修紀錄
      </button>

      <button
        @click="goPage('/edit')"
        :class="activeTab === '/facility' ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]'"
        class="py-3 rounded cursor-pointer hover:bg-[#e5e3df]"
      >
        ⏱️ 廠房資訊
      </button>

      <button
        @click="goPage('/billing')"
        :class="activeTab === '/billing' ? 'font-bold bg-[#6b6b5a] text-white' : 'text-[#4a4a43]'"
        class="py-3 rounded cursor-pointer hover:bg-[#e5e3df]"
      >
        💳 付費訂閱
      </button>
    </nav>

    <div class="mt-auto px-6 py-4 text-sm text-[#8a8a7d]">© 2025 維修廠後台</div>
  </aside>
</template>
