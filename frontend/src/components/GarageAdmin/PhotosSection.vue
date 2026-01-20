<script setup lang="ts">
import { ref } from 'vue';
import Toast from '@/components/Admin/Toast.vue';

const images = defineModel<string[]>('images', {
  required: true,
});

const fileInput = ref<HTMLInputElement | null>(null);
const showToast = ref(false);
const toastMessage = ref('');

const triggerFileInput = () => {
  if (images.value.length >= 3) {
    toastMessage.value = '最多只能上傳 3 張照片';
    showToast.value = true;
    return;
  }
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const newFiles = Array.from(input.files);
  const remainingSlots = 3 - images.value.length;

  if (newFiles.length > remainingSlots) {
    toastMessage.value = `最多只能再上傳 ${remainingSlots} 張照片`;
    showToast.value = true;
    // 清空 input 以便下次選擇
    input.value = '';
    return;
  }

  // 模擬上傳與處理
  newFiles.forEach((file) => {
    // [接後端API] 這裡應該呼叫後端上傳 API 並取得 URL
    const previewUrl = URL.createObjectURL(file);
    images.value.push(previewUrl);
  });

  // 清空 input
  input.value = '';
};

const removePhoto = (index: number) => {
  images.value.splice(index, 1);
};
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    accept="image/png,image/jpeg"
    multiple
    class="hidden"
    @change="handleFileSelect"
  />

  <div
    class="group border-2 border-dashed border-[#e0dfd6] rounded-2xl h-48 flex flex-col items-center justify-center text-[#4a4a43] transition-all duration-200 shrink-0 cursor-pointer hover:bg-white"
    @click="triggerFileInput"
    :class="{ 'opacity-50 cursor-not-allowed': images.length >= 3 }"
  >
    <div class="text-4xl mb-2 text-[#b0afa4] group-hover:text-[#6b6b5a]">
      <span class="material-symbols-outlined">add_a_photo</span>
    </div>
    <p class="font-medium text-[#4a4a43]">點擊上傳廠房照片</p>
    <p class="text-sm mt-1 text-[#8a8a7d]">支援 JPG、PNG 格式，最多 3 張 (目前 {{ images.length }}/3)</p>
  </div>

  <div class="flex-1 overflow-y-auto mt-6 mb-6" v-if="images.length > 0">
    <div class="grid grid-cols-3 gap-6">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group"
      >
        <img :src="img" class="w-full h-full object-cover" alt="preview" />
        <button
          @click.stop="removePhoto(index)"
          class="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 cursor-pointer"
        >
          ✕
        </button>
      </div>
      
      <!-- 補齊空格的佔位符 -->
      <div
        v-for="n in (3 - images.length)"
        :key="`empty-${n}`"
        class="aspect-square rounded-2xl flex items-center justify-center bg-white border border-[#e0dfd6]"
      >
        <span class="material-symbols-outlined text-[#d1d1c1]">image</span>
      </div>
    </div>
  </div>

  <!-- 錯誤提示 Toast -->
  <Toast 
    :show="showToast" 
    :message="toastMessage" 
    type="error" 
    @close="showToast = false" 
  />
</template>
