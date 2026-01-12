<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div
    class="fixed bottom-6 right-6 bg-white shadow-xl rounded-2xl p-4 w-56 border border-gray-200"
  >
    <div class="text-sm font-semibold text-gray-700 mb-3">開發模式 · 身分切換</div>

    <div class="flex flex-col gap-2">
      <button
        @click="auth.useOnboarding()"
        class="py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-left px-3 transition cursor-pointer"
      >
        <div class="font-medium">📝 尚未填資料</div>
        <div class="text-xs text-gray-500">onboarding</div>
      </button>

      <button
        @click="auth.usePendingReview()"
        class="py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-left px-3 transition cursor-pointer"
      >
        <div class="font-medium">🕒 等待審核</div>
        <div class="text-xs text-gray-500">pending_review</div>
      </button>

      <button
        @click="auth.useActive()"
        class="py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-left px-3 transition cursor-pointer"
      >
        <div class="font-medium">🚀 已開通</div>
        <div class="text-xs text-gray-500">active</div>
      </button>
    </div>
  </div>
</template>
