<script setup lang="ts">
import EditSection from './components/EditSection.vue';
import InfoSection from './components/InfoSection.vue';
import HoursSection from './components/HoursSection.vue';
import PhotosSection from './components/PhotosSection.vue';
import SubscriptionSection from './components/SubscriptionSection.vue';
import { useWorkshopForm } from './composables/useWorkshopForm';

const {
  // 狀態
  status,
  subscriptionStatus,
  localProfile,
  selectedPlan,
  isInfoEditing,
  isHoursEditing,
  isPhotosEditing,
  // 禁用相關
  isNameDisabled,
  isPhoneDisabled,
  isAddressDisabled,
  isDescriptionDisabled,
  isTaxIdDisabled,
  areTagsDisabled,
  areHoursDisabled,
  isPhotoUploadDisabled,
  isSubscriptionSectionDisabled,
  isTrialUser,
  isPaid,
  // 方法
  onCancel,
  onSave,
  onOnboardingSave,
  toggleBrand,
  toggleSkill,
  redirectToECPay,
} = useWorkshopForm();
</script>

<template>
  <div class="min-h-screen">
    <form class="space-y-6" @submit.prevent="onOnboardingSave">
      <div
        v-if="status === 'pending_review'"
        class="bg-[#f5f4f0] border-l-4 border-[#8a8a7d] text-[#4a4a43] p-4 rounded-r-lg"
      >
        <h3 class="font-bold">審核中</h3>
        <p v-if="subscriptionStatus" class="font-bold">
          您選擇的方案是：{{ subscriptionStatus === 'trial' ? '免費試用' : '進階方案' }}
        </p>
        <p>您的資料已提交，正在等待平台管理員審核。在審核期間，所有資料將無法修改。</p>
      </div>

      <div
        v-if="status === 'onboarding'"
        class="bg-[#f5f4f0] border-l-4 border-[#6b6b5a] text-[#4a4a43] p-4 rounded-r-lg"
      >
        <h3 class="font-bold">歡迎！請完成您的廠房資料</h3>
        <p>請填寫以下所有資訊，完成後點擊最下方的「儲存並提交審核」按鈕。</p>
      </div>

      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-[#4a4a43]">廠房資訊</h1>
        <p class="mt-1 text-[#8a8a7d]">管理與編輯您的廠房詳細資訊</p>
      </div>

      <EditSection
        title="基本資料"
        icon="description"
        :status="status"
        v-model:is-editing="isInfoEditing"
        @save="onSave('info')"
        @cancel="onCancel('info')"
      >
        <InfoSection
          v-model="localProfile"
          :is-name-disabled="isNameDisabled"
          :is-phone-disabled="isPhoneDisabled"
          :is-address-disabled="isAddressDisabled"
          :is-description-disabled="isDescriptionDisabled"
          :is-tax-id-disabled="isTaxIdDisabled"
          :are-tags-disabled="areTagsDisabled"
          :toggle-brand="toggleBrand"
          :toggle-skill="toggleSkill"
        />
      </EditSection>

      <EditSection
        title="營業時間設定"
        icon="alarm"
        :status="status"
        v-model:is-editing="isHoursEditing"
        @save="onSave('hours')"
        @cancel="onCancel('hours')"
      >
        <HoursSection v-model="localProfile.hours" :are-hours-disabled="areHoursDisabled" />
      </EditSection>

      <EditSection
        title="廠房照片"
        icon="imagesmode"
        :status="status"
        v-model:is-editing="isPhotosEditing"
        @save="onSave('photos')"
        @cancel="onCancel('photos')"
      >
        <PhotosSection
          v-model="localProfile.photos"
          :is-photo-upload-disabled="isPhotoUploadDisabled"
        />
      </EditSection>

      <SubscriptionSection
        v-model="selectedPlan"
        :status="status"
        :is-paid="isPaid"
        :is-trial-user="isTrialUser"
        :is-subscription-section-disabled="isSubscriptionSectionDisabled"
        @redirect-to-e-c-pay="redirectToECPay"
      />
      <div v-if="status === 'onboarding'" class="flex justify-end mt-8">
        <button
          @click="onOnboardingSave"
          class="px-8 py-3 rounded-2xl bg-[#6b6b5a] text-white font-bold cursor-pointer hover:bg-[#57574a] transition"
        >
          儲存並提交審核
        </button>
      </div>
    </form>
  </div>
</template>
