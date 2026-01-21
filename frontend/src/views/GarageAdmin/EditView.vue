<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import PageHead from '@/components/GarageAdmin/PageHead.vue';
import EditSection from '@/components/GarageAdmin/EditSection.vue';
import InfoSection from '@/components/GarageAdmin/InfoSection.vue';
import HoursSection from '@/components/GarageAdmin/HoursSection.vue';
import PhotosSection from '@/components/GarageAdmin/PhotosSection.vue';
import SubscriptionSection from '@/components/GarageAdmin/SubscriptionSection.vue';
import Toast from '@/components/Admin/Toast.vue';
import type { WorkshopInfo, BusinessHour } from '@/types/garage';
import { useGarageStore } from '@/stores/garage';

const garageStore = useGarageStore();

interface GarageFormData {
  info: WorkshopInfo;
  hours: BusinessHour[];
  plan: string;
}

// 預設營業時間結構 (全空)
const defaultHours: BusinessHour[] = [
  { day: '週一', enabled: true, start: '09:00', end: '18:00', capacity: 0 },
  { day: '週二', enabled: true, start: '09:00', end: '18:00', capacity: 0 },
  { day: '週三', enabled: true, start: '09:00', end: '18:00', capacity: 0 },
  { day: '週四', enabled: true, start: '09:00', end: '18:00', capacity: 0 },
  { day: '週五', enabled: true, start: '09:00', end: '18:00', capacity: 0 },
  { day: '週六', enabled: false, start: '', end: '', capacity: 0 },
  { day: '週日', enabled: false, start: '', end: '', capacity: 0 },
];

// 廠房資料 (初始為空)
const garageInfo = reactive<GarageFormData>({
  info: {
    name: '',
    phone: '',
    address: '',
    taxId: '',
    description: '',
    brands: [],
    skills: [],
    images: [],
  },
  hours: JSON.parse(JSON.stringify(defaultHours)),
  plan: '',
});

// 存放使用者選擇的原始圖片檔案
const garageFiles = ref<File[]>([]);

// UI 狀態
const isSaving = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');
const hasTimeError = ref(false);
const hasInfoError = ref(false);

onMounted(() => {
  // 從 GarageStore 載入暫存資料 (來自 Onboarding)
  if (garageStore.tempGarageInfo) {
    garageInfo.info = {
      ...garageInfo.info,
      ...garageStore.tempGarageInfo,
    };
    // 載入後可以選擇是否清除 store，或保留以防重新整理
    // garageStore.clearTempGarageInfo(); 
  }
});

const handleSave = async () => {
  // 再次檢查是否有選擇方案
  if (!garageInfo.plan) {
    toastMessage.value = '請選擇一個訂閱方案';
    toastType.value = 'error';
    showToast.value = true;
    return;
  }

  if (isSaving.value || hasTimeError.value || hasInfoError.value) return;

  isSaving.value = true;

  try {
    // 建立 FormData 物件，因為要混合上傳「文字資料」與「二進位圖片」
    const formData = new FormData();

    // 1. 文字資料
    formData.append('plan', garageInfo.plan);
    formData.append('info', JSON.stringify(garageInfo.info));
    formData.append('hours', JSON.stringify(garageInfo.hours));

    // 2. 圖片
    garageFiles.value.forEach((file) => {
      formData.append('images', file);
    });

    // 3. [打API] 呼叫後端接口
    // 待補

    // 模擬 API 回應延遲
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 假設成功
    console.log('FormData 內容已準備好，包含圖片數量:', garageFiles.value.length);

    // 成功提示
    toastMessage.value = '儲存成功，資料已送出審核';
    toastType.value = 'success';
    showToast.value = true;
  } catch (error) {
    console.error('Error submitting form:', error);
    toastMessage.value = '提交失敗，請稍後再試或聯繫管理員';
    toastType.value = 'error';
    showToast.value = true;
  } finally {
    isSaving.value = false;

    // 3 秒後自動關閉 Toast
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
};
</script>

<template>
  <div class="min-h-screen">
    <div class="space-y-6">
      <div class="mb-8">
        <PageHead title="廠房資訊" subtitle="管理與編輯您的廠房詳細資訊" />
      </div>

      <form class="space-y-6" @submit.prevent="handleSave">
        <EditSection title="基本資料" icon="description">
          <InfoSection v-model:info="garageInfo.info" @validation-error="hasInfoError = $event" />
        </EditSection>

        <EditSection title="營業時間設定" icon="alarm">
          <HoursSection
            v-model:hours="garageInfo.hours"
            @validation-error="hasTimeError = $event"
          />
        </EditSection>

        <EditSection title="廠房照片" icon="imagesmode">
          <PhotosSection v-model:images="garageInfo.info.images" v-model:files="garageFiles" />
        </EditSection>

        <SubscriptionSection v-model:plan="garageInfo.plan" />

        <div class="flex justify-end mt-8">
          <button
            type="submit"
            :disabled="isSaving || hasTimeError || hasInfoError || !garageInfo.plan"
            class="px-8 py-3 rounded-2xl bg-[#6b6b5a] text-white font-bold transition hover:bg-[#57574a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="isSaving" class="material-symbols-outlined animate-spin text-sm">sync</span>
            {{ isSaving ? '儲存中...' : '儲存並提交審核' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Toast 通知 -->
    <Toast :show="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />
  </div>
</template>
