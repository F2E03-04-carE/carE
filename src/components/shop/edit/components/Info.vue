<script setup lang="ts">
import { ref } from 'vue'

interface Form {
  name: string
  phone: string
  address: string
  description: string
}

const initialForm: Form = {
  name: '專業汽車維修中心',
  phone: '02-1234-5678',
  address: '台北市中山區建國北路123號',
  description: '本廠擁有20年以上維修經驗，專業技師團隊提供各式車輛維修保養服務。',
}

const form = ref<Form>({ ...initialForm })
const isEditing = ref(false)

const onEdit = () => {
  isEditing.value = true
}

const onCancel = () => {
  form.value = { ...initialForm }
  isEditing.value = false
}

const onSave = () => {
  // TODO: 串接 API 儲存
  Object.assign(initialForm, form.value)
  isEditing.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- 廠房名稱 -->
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房名稱</label>
      <input
        v-model="form.name"
        :disabled="!isEditing"
        :class="[
          'w-full rounded-2xl px-4 py-3 outline-none transition',
          isEditing
            ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
            : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
        ]"
      />
    </div>

    <!-- 電話 / 地址 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-[#4a4a43] mb-2">聯絡電話</label>
        <input
          v-model="form.phone"
          :disabled="!isEditing"
          :class="[
            'w-full rounded-2xl px-4 py-3 outline-none transition',
            isEditing
              ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
              : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
          ]"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房地址</label>
        <input
          v-model="form.address"
          :disabled="!isEditing"
          :class="[
            'w-full rounded-2xl px-4 py-3 outline-none transition',
            isEditing
              ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
              : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
          ]"
        />
      </div>
    </div>

    <!-- 簡介 -->
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房簡介</label>
      <textarea
        v-model="form.description"
        :disabled="!isEditing"
        rows="4"
        :class="[
          'w-full rounded-2xl px-4 py-3 outline-none transition',
          isEditing
            ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
            : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
        ]"
      />
      <p class="text-xs mt-2" :class="isEditing ? 'text-[#8a8a7d]' : 'text-[#b0afa4]'">
        建議輸入您的專業特色、服務項目、經驗年資等資訊
      </p>
    </div>

    <!-- 按鈕 -->
    <div class="flex justify-end gap-3 pt-4">
      <!-- 檢視模式 -->
      <button
        v-if="!isEditing"
        @click="onEdit"
        class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium cursor-pointer hover:bg-[#57574a] transition"
      >
        編輯
      </button>

      <!-- 編輯模式 -->
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
</template>
