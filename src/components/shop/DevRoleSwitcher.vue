<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import type { WorkshopStatus } from '@/mocks/workshop.mock'

const authStore = useAuthStore()

const statuses: { label: string; value: WorkshopStatus }[] = [
  { label: '已開通', value: 'active' },
  { label: '審核中', value: 'pending_review' },
  { label: '尚未填資料', value: 'onboarding' },
]

const switchStatus = (status: WorkshopStatus) => {
  authStore.setStatus(status)
}
</script>

<template>
  <div class="fixed bottom-15 left-4 bg-white p-4 rounded-lg shadow-2xl border z-50 text-sm">
    <p class="font-bold text-base mb-3 text-[#4a4a43]">開發者工具：切換身分</p>
    <div class="flex flex-col gap-2">
      <button
        v-for="s in statuses"
        :key="s.value"
        @click="switchStatus(s.value)"
        class="px-4 py-2 text-left rounded-lg transition"
        :class="
          authStore.status === s.value
            ? 'bg-[#6b6b5a] text-white font-bold shadow'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        "
      >
        {{ s.label }} ({{ s.value }})
      </button>
    </div>
    <div class="mt-3 text-xs text-gray-500">
      當前狀態: <span class="font-semibold">{{ authStore.status }}</span>
    </div>
  </div>
</template>
