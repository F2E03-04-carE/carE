<script setup lang="ts">
import PageHead from './components/PageHead.vue';
import EditSection from './components/EditSection.vue';
import InfoSection from './components/InfoSection.vue';
import HoursSection from './components/HoursSection.vue';
import PhotosSection from './components/PhotosSection.vue';
import SubscriptionSection from './components/SubscriptionSection.vue';
</script>

<template>
  <div class="min-h-screen">
    <div class="space-y-6">
      <!-- 狀態提示 -->
      <div class="bg-[#f5f4f0] border-l-4 border-[#6b6b5a] text-[#4a4a43] p-4 rounded-r-lg mb-6">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#6b6b5a]">info</span>
          <h3 class="font-bold">目前模擬資料填寫中的狀態</h3>
        </div>
        <p class="mt-1 text-sm ml-8">
          此頁面目前為純靜態展示，用於預覽版面配置與樣式，暫時無法實際儲存資料。
        </p>
      </div>

      <div class="mb-8">
        <PageHead title="廠房資訊" subtitle="管理與編輯您的廠房詳細資訊" />
      </div>

      <form class="space-y-6" @submit.prevent>
        <EditSection title="基本資料" icon="description">
          <InfoSection />
        </EditSection>

        <EditSection title="營業時間設定" icon="alarm">
          <HoursSection />
        </EditSection>

        <EditSection title="廠房照片" icon="imagesmode">
          <PhotosSection />
        </EditSection>

        <SubscriptionSection />

        <div class="flex justify-end mt-8">
          <button
            type="submit"
            class="px-8 py-3 rounded-2xl bg-[#6b6b5a] text-white font-bold transition hover:bg-[#57574a] cursor-pointer"
          >
            儲存並提交審核
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
