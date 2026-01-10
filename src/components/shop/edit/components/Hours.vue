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
  initialDays.splice(0, initialDays.length, ...days.value.map((d) => ({ ...d })))
  isEditing.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- 標題與按鈕 -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium text-[#4a4a43] flex items-center gap-2">⏰ 營業時間設定</h2>

      <div class="flex gap-3">
        <button
          v-if="!isEditing"
          @click="onEdit"
          class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium cursor-pointer hover:bg-[#57574a] transition"
        >
          編輯
        </button>

        <template v-else>
          <button
            @click="onCancel"
            class="px-6 py-2 rounded-2xl border border-[#6b6b5a] text-[#4a4a43] cursor-pointer hover:bg-[#e6e5df] transition"
          >
            取消
          </button>
          <button
            @click="onSave"
            class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white cursor-pointer hover:bg-[#57574a] transition"
          >
            儲存變更
          </button>
        </template>
      </div>
    </div>

    <!-- 一周七日 -->
    <div class="space-y-4">
      <div
        v-for="(day, index) in days"
        :key="day.day"
        class="flex items-center justify-between rounded-2xl px-6 py-4 bg-[#f5f4f0] border border-[#e0dfd6] min-h-[56px]"
      >
        <!-- 星期 + checkbox (label) -->
        <label
          class="flex items-center gap-4"
          :class="isEditing ? 'cursor-pointer' : 'cursor-not-allowed'"
        >
          <input
            type="checkbox"
            :id="'day-' + index"
            v-model="day.enabled"
            :disabled="!isEditing"
            class="cursor-pointer disabled:cursor-not-allowed"
          />
          <span :class="['font-medium', !isEditing && 'text-[#8a8a7d]']">{{ day.day }}</span>
        </label>

        <!-- 營業時間 / 公休 -->
        <div
          class="flex items-center gap-3 px-4 py-2 rounded-2xl transition justify-center"
          :class="
            day.enabled
              ? isEditing
                ? 'bg-white ring-2 ring-[#6b6b5a] shadow-sm'
                : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed'
              : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed'
          "
        >
          <template v-if="day.enabled">
            <input
              type="time"
              v-model="day.start"
              :disabled="!isEditing"
              class="rounded-2xl px-3 outline-none disabled:text-[#8a8a7d] disabled:cursor-not-allowed flex-1"
            />
            <span>至</span>
            <input
              type="time"
              v-model="day.end"
              :disabled="!isEditing"
              class="rounded-2xl px-3 outline-none disabled:text-[#8a8a7d] disabled:cursor-not-allowed flex-1"
            />
          </template>
          <template v-else>
            <span>公休</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
