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
  <div class="bg-gray-50 w-full">
    <h1 class="text-2xl font-semibold text-gray-800 mb-1">廠房資訊</h1>
    <p class="text-gray-500 mb-6">管理維修廠的基本資訊與設定</p>

    <!-- tab -->
    <div class="flex bg-gray-200 rounded-full p-1 mb-8 w-full">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="goTab(tab.path)"
        class="flex-1 py-2 text-sm rounded-full transition cursor-pointer"
        :class="activeTab === tab.key ? 'bg-white text-gray-800 font-medium' : 'text-gray-500'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="bg-white rounded-2xl p-8 shadow-sm">
      <div class="space-y-6">
        <router-view />
      </div>
    </div>
  </div>
</template>
