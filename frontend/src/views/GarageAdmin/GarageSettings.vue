<script setup lang="ts">
import { reactive } from 'vue';

// 類型定義
type GarageInfo = {
  name: string;
  ownerName: string;
  address: string;
  phone: string;
  taxId: string;
  description: string;
  coverImage: string;
  environmentImages: string[];
};

// 假資料 - 車廠基本資料
const garageName = reactive<GarageInfo>({
  name: '晴天自動車',
  ownerName: '店長 Admin',
  address: '台北市中山區職人路 100 號',
  phone: '02-1234-5678',
  taxId: '12345678',
  description: '我們專注於提供最優質的日系車維修服務，擁有超過 10 年的專業經驗。',
  coverImage: '',
  environmentImages: [],
});

// 封面照片上傳
function onCoverFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    garageName.coverImage = URL.createObjectURL(file);
  }
}

// 移除封面照片
function removeCoverImage() {
  garageName.coverImage = '';
}

// 環境照片上傳
function onEnvFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    for (const file of input.files) {
      garageName.environmentImages.push(URL.createObjectURL(file));
    }
  }
}

// 移除環境照片
function removeEnvImage(index: number) {
  garageName.environmentImages.splice(index, 1);
}

// 儲存設定
function saveSettings() {
  // 假裝儲存成功
  alert('儲存成功！（Demo 模式，資料僅存在記憶體中）');
}
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] bg-[#f5f4f0] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#4a4a43]">編輯維修廠</h1>
        <p class="mt-2 text-stone-500">維護維修廠的基本資料與簡介</p>
      </div>

      <!-- Settings Content -->
      <div class="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="rounded-xl border border-[#DCD9D3] bg-white p-8 shadow-sm">
          <!-- 維修廠照片 -->
          <div class="space-y-6">
            <h3 class="text-base font-bold text-[#4A4A45]">維修廠照片</h3>

            <!-- 封面照片 -->
            <div>
              <label class="mb-3 block text-sm font-medium text-stone-500">封面照片 <span class="text-xs text-stone-400 font-normal">(建議尺寸 1200x600)</span></label>
              <div class="relative h-64 w-full overflow-hidden rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] transition-colors hover:border-[#6B6B5C]">
                <input type="file" accept="image/*" class="absolute inset-0 z-10 cursor-pointer opacity-0" @change="onCoverFileChange">
                <div v-if="!garageName.coverImage" class="flex h-full flex-col items-center justify-center text-stone-400">
                  <svg class="mb-3 h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span class="font-medium">點擊上傳封面照片</span>
                  <span class="mt-1 text-xs text-stone-400">支援 JPG, PNG, WebP</span>
                </div>
                <div v-else class="relative h-full w-full">
                  <img :src="garageName.coverImage" class="h-full w-full object-cover" alt="Shop Cover" />
                  <button
                    @click.stop="removeCoverImage"
                    class="absolute top-4 right-4 z-20 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-600"
                  >
                    移除照片
                  </button>
                </div>
              </div>
            </div>

            <!-- 環境照片 -->
            <div>
              <label class="mb-3 block text-sm font-medium text-stone-500">環境照片 <span class="text-xs text-stone-400 font-normal">(展示工位、休息區等)</span></label>
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div v-for="(img, idx) in garageName.environmentImages" :key="idx" class="group relative aspect-square overflow-hidden rounded-xl border border-[#DCD9D3]">
                  <img :src="img" class="h-full w-full object-cover" alt="Environment" />
                  <button
                    @click="removeEnvImage(idx)"
                    class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-stone-500 shadow-sm opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div class="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] text-stone-400 transition-colors hover:border-[#6B6B5C] hover:text-[#6B6B5C]">
                  <input type="file" accept="image/*" multiple class="absolute inset-0 cursor-pointer opacity-0" @change="onEnvFileChange">
                  <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span class="mt-2 text-xs font-medium">新增照片</span>
                </div>
              </div>
            </div>
          </div>

          <div class="my-8 border-t border-[#F0EEE9]"></div>

          <!-- 基本資料 -->
          <div class="space-y-6">
            <h3 class="text-base font-bold text-[#4A4A45]">基本資料</h3>
            <div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium text-stone-500">維修廠名稱</label>
                <input v-model="garageName.name" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="例如：晴天自動車">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-stone-500">店長名稱</label>
                <input v-model="garageName.ownerName" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="請輸入店長名稱">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-stone-500">統一編號</label>
                <input v-model="garageName.taxId" type="text" maxlength="8" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="8 位數統一編號">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-stone-500">聯絡電話</label>
                <input v-model="garageName.phone" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="02-1234-5678">
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-stone-500">維修廠地址</label>
                <input v-model="garageName.address" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="請輸入完整地址">
              </div>
              <div class="col-span-1 space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-stone-500">維修廠簡介</label>
                <textarea
                  v-model="garageName.description"
                  rows="4"
                  class="w-full resize-none rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
                  placeholder="請簡單介紹您的維修廠，例如專修車種、服務特色等..."
                ></textarea>
                <p class="text-right text-xs text-stone-400">{{ garageName.description.length }} / 200</p>
              </div>
            </div>
          </div>

          <!-- 儲存按鈕 -->
          <div class="mt-8 flex justify-end border-t border-[#F0EEE9] pt-6">
            <button
              @click="saveSettings"
              class="rounded-lg bg-[#6B6B5C] px-8 py-3 font-medium text-white shadow-lg shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] hover:shadow-xl active:scale-95"
            >
              儲存變更
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
