<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

type TabKey = 'info' | 'hours' | 'photos'

const route = useRoute()
const router = useRouter()

const tabs: { key: TabKey; label: string; path: string }[] = [
  { key: 'info', label: '基本資訊', path: '/edit/info' },
  { key: 'hours', label: '營業時間', path: '/edit/hours' },
  { key: 'photos', label: '廠房照片', path: '/edit/photos' },
]

const activeTab = computed<TabKey>(() => {
  if (route.path.includes('hours')) return 'hours'
  if (route.path.includes('photos')) return 'photos'
  return 'info'
})

const goTab = (path: string) => {
  router.push(path)
}
</script>

<template>
  <!-- 標題 -->
  <div class="mb-8">
    <h1 class="text-2xl font-semibold text-[#4a4a43]">廠房資訊</h1>
    <p class="mt-1 text-[#8a8a7d]">管理維修廠的基本資訊與設定</p>
  </div>

  <!-- tab -->
  <div class="px-0 mb-8">
    <div class="flex gap-3 bg-[#f5f4f0] rounded-full p-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="goTab(tab.path)"
        class="flex-1 py-2 text-sm rounded-full transition-colors cursor-pointer"
        :class="
          activeTab === tab.key
            ? 'bg-[#6b6b5a] text-white shadow'
            : 'bg-[#f5f4f0] text-[#4a4a43] hover:bg-[#e6e5df]'
        "
      >
        {{ tab.label }}
      </button>
    </div>
  </div>

  <!-- 內容區 -->
  <div class="bg-[#f5f4f0] rounded-2xl p-8 shadow-sm">
    <div class="space-y-6">
      <router-view />
    </div>
  </div>
</template>
