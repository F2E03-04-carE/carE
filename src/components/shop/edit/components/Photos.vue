<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

const fileInputRef = ref<HTMLInputElement | null>(null)

// 實際選取的檔案（給 API 用
const files = ref<File[]>([])

// 預覽用 URL
const previews = ref<string[]>([])

// 點擊上傳區
const triggerUpload = () => {
  fileInputRef.value?.click()
}

// 檔案選取
const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const selected = Array.from(input.files)

  selected.forEach((file) => {
    if (!file.type.startsWith('image/')) return
    if (files.value.length >= 3) return

    files.value.push(file)
    previews.value.push(URL.createObjectURL(file))
  })

  input.value = ''
}

// 刪除圖片
const removePhoto = (index: number) => {
  URL.revokeObjectURL(previews.value[index])
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
}

// 提交表單
const submitPhotos = () => {
  if (files.value.length === 0) {
    alert('請至少上傳一張廠房照片')
    return
  }

  const formData = new FormData()
  files.value.forEach((file) => {
    formData.append('photos', file)
  })

  console.log('已送出照片', files.value)
  alert('照片已成功送出')
}

// 清除預覽記憶體
onBeforeUnmount(() => {
  previews.value.forEach((url) => URL.revokeObjectURL(url))
})
</script>

<template>
  <h2 class="text-lg font-medium mb-6 flex items-center gap-2 shrink-0">🖼 廠房照片</h2>

  <!-- 隱藏的上傳 input tag -->
  <input
    ref="fileInputRef"
    type="file"
    accept="image/png,image/jpeg"
    multiple
    class="hidden"
    @change="onFileChange"
  />

  <!-- 上傳功能觸發區 -->
  <div
    class="border-2 border-dashed border-gray-300 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition shrink-0"
    @click="triggerUpload"
  >
    <div class="text-4xl mb-2">📷</div>
    <p class="font-medium">點擊上傳廠房照片</p>
    <p class="text-sm mt-1">支援 JPG、PNG 格式，最多 3 張</p>
  </div>

  <div class="flex-1 overflow-y-auto mt-6 mb-6 pr-2">
    <div class="grid grid-cols-3 gap-6">
      <div
        v-for="(preview, index) in previews"
        :key="preview"
        class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
      >
        <img :src="preview" class="w-full h-full object-cover" alt="preview" />

        <button
          class="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
          @click.stop="removePhoto(index)"
        >
          ✕
        </button>
      </div>

      <!-- 預覽窗 -->
      <div
        v-for="n in 3 - previews.length"
        :key="'empty-' + n"
        class="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-300"
      >
        🖼
      </div>
    </div>
  </div>

  <div class="flex justify-end shrink-0">
    <button
      class="px-6 py-2 rounded-xl bg-emerald-600 text-white cursor-pointer disabled:opacity-50"
      :disabled="files.length === 0"
      @click="submitPhotos"
    >
      確認送出
    </button>
  </div>
</template>
