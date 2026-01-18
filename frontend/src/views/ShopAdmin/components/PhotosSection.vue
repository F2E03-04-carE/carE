<script setup lang="ts"></script>

<template>
  <input type="file" accept="image/png,image/jpeg" multiple class="hidden" />
  <div
    class="group border-2 border-dashed border-[#e0dfd6] rounded-2xl h-48 flex flex-col items-center justify-center text-[#4a4a43] transition-all duration-200 shrink-0 cursor-pointer hover:bg-white"
  >
    <div class="text-4xl mb-2 text-[#b0afa4] group-hover:text-[#6b6b5a]">
      <span class="material-symbols-outlined">add_a_photo</span>
    </div>
    <p class="font-medium text-[#4a4a43]">點擊上傳廠房照片</p>
    <p class="text-sm mt-1 text-[#8a8a7d]">支援 JPG、PNG 格式，最多 3 張</p>
  </div>
  <div class="flex-1 overflow-y-auto mt-6 mb-6">
    <div class="grid grid-cols-3 gap-6">
      <!-- 靜態範例圖片 1 -->
      <div class="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          src="https://placehold.co/400x400/e0dfd6/6b6b5a?text=Photo+1"
          class="w-full h-full object-cover"
          alt="preview"
        />
        <button
          class="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
      <!-- 靜態範例圖片 2 -->
      <div class="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          src="https://placehold.co/400x400/e0dfd6/6b6b5a?text=Photo+2"
          class="w-full h-full object-cover"
          alt="preview"
        />
        <button
          class="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
      <!-- 空位 -->
      <div
        class="aspect-square rounded-2xl flex items-center justify-center bg-white border border-[#e0dfd6]"
      >
        <span class="material-symbols-outlined text-[#d1d1c1]">image</span>
      </div>
    </div>
  </div>
</template>
