<script setup lang="ts">
import { ref, reactive } from 'vue';
import PageHead from '@/components/GarageAdmin/PageHead.vue';
import EditSection from '@/components/GarageAdmin/EditSection.vue';
import InfoSection from '@/components/GarageAdmin/InfoSection.vue';
import HoursSection from '@/components/GarageAdmin/HoursSection.vue';
import PhotosSection from '@/components/GarageAdmin/PhotosSection.vue';
import SubscriptionSection from '@/components/GarageAdmin/SubscriptionSection.vue';
import Toast from '@/components/Admin/Toast.vue';
import type { WorkshopInfo, BusinessHour } from '@/types/garage';
import { mockWorkshopInfo, mockBusinessHours } from '@/composables/garage/mockData';

interface GarageFormData {
  info: WorkshopInfo;
  hours: BusinessHour[];
}

// 廠房假資料
const garageInfo = reactive<GarageFormData>({
  info: { ...mockWorkshopInfo },
  hours: JSON.parse(JSON.stringify(mockBusinessHours)),
});

// UI 狀態
const isSaving = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const hasTimeError = ref(false);

const handleSave = async () => {
  if (isSaving.value || hasTimeError.value) return;

  isSaving.value = true;

  // 模擬 API 請求
  setTimeout(() => {
    isSaving.value = false;
    toastMessage.value = '儲存成功，資料已送出審核';
    showToast.value = true;

    // 3秒後自動關閉 Toast
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }, 1500);
};
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

      <form class="space-y-6" @submit.prevent="handleSave">
        <EditSection title="基本資料" icon="description">
          <InfoSection v-model:info="garageInfo.info" />
        </EditSection>

        <EditSection title="營業時間設定" icon="alarm">
          <HoursSection
            v-model:hours="garageInfo.hours"
            @validation-error="hasTimeError = $event"
          />
        </EditSection>

        <EditSection title="廠房照片" icon="imagesmode">
          <PhotosSection v-model:images="garageInfo.info.images" />
        </EditSection>

        <SubscriptionSection />

        <div class="flex justify-end mt-8">
          <button
            type="submit"
            :disabled="isSaving || hasTimeError"
            class="px-8 py-3 rounded-2xl bg-[#6b6b5a] text-white font-bold transition hover:bg-[#57574a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="isSaving" class="material-symbols-outlined animate-spin text-sm">sync</span>
            {{ isSaving ? '儲存中...' : '儲存並提交審核' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Toast 通知 -->
    <Toast :show="showToast" :message="toastMessage" type="success" @close="showToast = false" />
  </div>
</template>
