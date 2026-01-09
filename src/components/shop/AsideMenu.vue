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
  <aside class="fixed w-[20%] h-screen bg-stone-100 shadow-lg/30 flex flex-col">
    <div class="px-6 py-6 text-xl font-semibold">維修廠後台</div>

    <nav class="flex flex-col px-3 gap-4">
      <button
        @click="goPage('/overview')"
        :class="activeTab === '/overview' && 'font-bold bg-[#7B8FA1] text-white'"
        class="py-3 rounded cursor-pointer hover:bg-slate-300"
      >
        🔍 總覽
      </button>

      <button
        @click="goPage('/work-orders')"
        :class="activeTab === '/work-orders' && 'font-bold bg-[#7B8FA1] text-white'"
        class="py-3 rounded cursor-pointer hover:bg-slate-300"
      >
        📅 工單管理
      </button>

      <button
        @click="goPage('/schedule')"
        :class="activeTab === '/schedule' && 'font-bold bg-[#7B8FA1] text-white'"
        class="py-3 rounded cursor-pointer hover:bg-slate-300"
      >
        📋 行程安排
      </button>

      <button
        @click="goPage('/records')"
        :class="activeTab === '/records' && 'font-bold bg-[#7B8FA1] text-white'"
        class="py-3 rounded cursor-pointer hover:bg-slate-300"
      >
        📈 維修紀錄
      </button>

      <button
        @click="goPage('/facilityInfo')"
        :class="activeTab === '/facilityInfo' && 'font-bold bg-[#7B8FA1] text-white'"
        class="py-3 rounded cursor-pointer hover:bg-slate-300"
      >
        ⏱️ 廠房資訊
      </button>

      <button
        @click="goPage('/billing')"
        :class="activeTab === '/billing' && 'font-bold bg-[#7B8FA1] text-white'"
        class="py-3 rounded cursor-pointer hover:bg-slate-300"
      >
        💳 付費訂閱
      </button>
    </nav>

    <div class="mt-auto px-6 py-4 text-sm text-slate-400">© 2025 維修廠後台</div>
  </aside>
</template>
