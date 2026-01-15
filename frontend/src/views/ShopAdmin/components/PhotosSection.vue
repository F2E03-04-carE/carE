<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    required: true,
  },
  isPhotoUploadDisabled: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerUpload = () => {
  if (props.isPhotoUploadDisabled) return;
  fileInputRef.value?.click();
};

const onFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const currentPhotos = [...props.modelValue];

  // 計算還可以上傳多少張照片
  const remainingSlots = 3 - currentPhotos.length;
  if (remainingSlots <= 0) return;

  // 只取使用者選取檔案中，可以填滿剩餘空位的部分
  const filesToProcess = Array.from(files).slice(0, remainingSlots);

  filesToProcess.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        currentPhotos.push(e.target.result as string);
        // 每次成功讀取一張，就發出一次更新
        emit('update:modelValue', [...currentPhotos]);
      }
    };
    reader.readAsDataURL(file);
  });

  // 清空 file input 的值，這樣使用者才能重複上傳同一個檔案
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const removePhoto = (index: number) => {
  const newPhotos = [...props.modelValue];
  newPhotos.splice(index, 1);
  emit('update:modelValue', newPhotos);
};
</script>

<template>
  <input
    ref="fileInputRef"
    type="file"
    accept="image/png,image/jpeg"
    multiple
    class="hidden"
    @change="onFileChange"
  />
  <div
    :class="[
      'group border-2 border-dashed border-[#e0dfd6] rounded-2xl h-48 flex flex-col items-center justify-center text-[#4a4a43] transition-all duration-200 shrink-0',
      !isPhotoUploadDisabled ? 'cursor-pointer hover:bg-white' : 'opacity-50 cursor-not-allowed',
    ]"
    @click="triggerUpload"
  >
    <div
      :class="[
        'text-4xl mb-2 text-[#b0afa4]',
        !isPhotoUploadDisabled && 'group-hover:text-[#6b6b5a]',
      ]"
    >
      <span class="material-symbols-outlined">add_a_photo</span>
    </div>
    <p class="font-medium text-[#4a4a43]">點擊上傳廠房照片</p>
    <p class="text-sm mt-1 text-[#8a8a7d]">支援 JPG、PNG 格式，最多 3 張</p>
  </div>
  <div class="flex-1 overflow-y-auto mt-6 mb-6">
    <div class="grid grid-cols-3 gap-6">
      <div
        v-for="(preview, index) in modelValue"
        :key="preview"
        class="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group"
      >
        <img :src="preview" class="w-full h-full object-cover" alt="preview" />
        <button
          v-if="!isPhotoUploadDisabled"
          class="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
          @click.stop="removePhoto(index)"
        >
          ✕
        </button>
      </div>
      <div
        v-for="n in 3 - (modelValue?.length ?? 0)"
        :key="'empty-' + n"
        class="aspect-square rounded-2xl flex items-center justify-center bg-white border border-[#e0dfd6]"
      >
        <span class="material-symbols-outlined text-[#d1d1c1]">image</span>
      </div>
    </div>
  </div>
</template>
