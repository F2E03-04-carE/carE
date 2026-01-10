<script setup lang="ts">
import { ref } from 'vue'

interface DaySetting {
  day: string
  enabled: boolean
  start: string
  end: string
}

const initialDays: DaySetting[] = [
  { day: '週一', enabled: false, start: '09:00', end: '18:00' },
  { day: '週二', enabled: false, start: '09:00', end: '18:00' },
  { day: '週三', enabled: true, start: '09:00', end: '18:00' },
  { day: '週四', enabled: true, start: '09:00', end: '18:00' },
  { day: '週五', enabled: true, start: '09:00', end: '18:00' },
  { day: '週六', enabled: false, start: '09:00', end: '18:00' },
  { day: '週日', enabled: true, start: '09:00', end: '18:00' },
]

const days = ref<DaySetting[]>(initialDays.map((d) => ({ ...d })))
const isEditing = ref(false)

const onEdit = () => {
  isEditing.value = true
}

const onCancel = () => {
  days.value = initialDays.map((d) => ({ ...d }))
  isEditing.value = false
}

const onSave = () => {
  // TODO: 串接 API 儲存
  initialDays.splice(0, initialDays.length, ...days.value.map((d) => ({ ...d })))
  isEditing.value = false
}
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-lg font-medium flex items-center gap-2">⏰ 營業時間設定</h2>

    <div class="flex gap-3">
      <button
        v-if="!isEditing"
        @click="onEdit"
        class="px-5 py-2 rounded-xl bg-yellow-400 text-black font-medium cursor-pointer hover:bg-yellow-300 transition"
      >
        編輯
      </button>

      <template v-else>
        <button
          @click="onCancel"
          class="px-5 py-2 rounded-xl border text-gray-600 cursor-pointer hover:bg-gray-50 transition"
        >
          取消
        </button>
        <button
          @click="onSave"
          class="px-5 py-2 rounded-xl bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500 transition"
        >
          儲存變更
        </button>
      </template>
    </div>
  </div>

  <!-- 一周七日 v-for -->
  <div class="space-y-4">
    <div
      v-for="day in days"
      :key="day.day"
      class="flex items-center justify-between rounded-xl px-6 py-4 bg-gray-100"
    >
      <!-- 星期 -->
      <div class="flex items-center gap-4">
        <input
          type="checkbox"
          v-model="day.enabled"
          :disabled="!isEditing"
          class="cursor-pointer disabled:cursor-not-allowed"
        />
        <span :class="['font-medium', !isEditing && 'text-gray-400']">
          {{ day.day }}
        </span>
      </div>

      <!-- 營業時間 -->
      <div
        v-if="day.enabled"
        class="flex items-center gap-3 text-sm px-4 py-2 rounded-xl transition"
        :class="
          isEditing
            ? 'bg-white ring-2 ring-emerald-500 shadow-sm'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        "
      >
        <!-- 時間調整 -->
        <input
          type="time"
          v-model="day.start"
          :disabled="!isEditing"
          class="rounded-lg px-2 py-1 disabled:text-gray-400 disabled:cursor-not-allowed"
        />
        <span>至</span>
        <input
          type="time"
          v-model="day.end"
          :disabled="!isEditing"
          class="rounded-lg px-2 py-1 disabled:text-gray-400 disabled:cursor-not-allowed"
        />
      </div>

      <span v-else class="text-sm" :class="isEditing ? 'text-gray-500' : 'text-gray-400'">
        公休
      </span>
    </div>
  </div>
</template>
