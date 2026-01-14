<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { WorkshopProfile } from '@/stores/auth';
import { trialWorkshop } from '@/mocks/workshop.mock';

const authStore = useAuthStore();

const localProfile = ref<WorkshopProfile>(JSON.parse(JSON.stringify(authStore.profile)));
const selectedPlan = ref<'trial' | 'paid' | null>(null);

watch(
  () => authStore.profile,
  (newProfile) => {
    localProfile.value = JSON.parse(JSON.stringify(newProfile));
  },
  { deep: true },
);

const status = computed(() => authStore.status);
const subscriptionStatus = computed(() => authStore.subscriptionStatus);

watch(status, (newStatus, oldStatus) => {
  if (oldStatus === 'onboarding' && newStatus === 'pending_review') {
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

const isReadOnly = computed(() => status.value === 'pending_review');

const isInfoEditing = ref(false);
const isHoursEditing = ref(false);
const isPhotosEditing = ref(false);

const isNameDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
);
const isPhoneDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
);
const isAddressDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
);
const isDescriptionDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
);
const isTaxIdDisabled = computed(() => status.value !== 'onboarding');
const areTagsDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
);
const areHoursDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isHoursEditing.value),
);
const isPhotoUploadDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isPhotosEditing.value),
);

const isSubscriptionSectionDisabled = computed(() => status.value === 'pending_review');
const isTrialUser = computed(() => authStore.workshop?.id === trialWorkshop.id);
const isPaid = computed(() => status.value === 'active' && subscriptionStatus.value === 'paid');

const onCancel = () => {
  isInfoEditing.value = false;
  isHoursEditing.value = false;
  isPhotosEditing.value = false;
  localProfile.value = JSON.parse(JSON.stringify(authStore.profile));
};

const onSave = (section: 'info' | 'hours' | 'photos') => {
  authStore.updateProfile(JSON.parse(JSON.stringify(localProfile.value)));
  if (section === 'info') isInfoEditing.value = false;
  if (section === 'hours') isHoursEditing.value = false;
  if (section === 'photos') isPhotosEditing.value = false;
};
const onOnboardingSave = () => {
  if (!selectedPlan.value) {
    alert('請選擇一個訂閱方案！');
    return;
  }

  if (selectedPlan.value === 'paid') {
    alert('將為您導向至綠界金流進行付款...');
  }

  authStore.updateProfile(JSON.parse(JSON.stringify(localProfile.value)), selectedPlan.value);
};

// 標籤
const brandOptions = [
  'Toyota',
  'Honda',
  'Nissan',
  'Mazda',
  'Mitsubishi',
  'Lexus',
  'BMW',
  'Mercedes-Benz',
  'Volkswagen',
  '其他品牌',
];
const skillOptions = [
  '引擎維修',
  '變速箱維修',
  '煞車系統',
  '底盤懸吊',
  '空調冷氣維修',
  '電系/電子系統',
  '車身烤漆/鈑金',
  '輪胎更換/定位',
  '汽車保養/定期檢查',
  '電動車/混合動力維修',
];

// 服務項目與擅長項目的標籤選取
const toggleBrand = (brand: string) => {
  if (areTagsDisabled.value) return;
  const idx = localProfile.value.brands.indexOf(brand);
  if (idx === -1) localProfile.value.brands.push(brand);
  else localProfile.value.brands.splice(idx, 1);
};

const toggleSkill = (skill: string) => {
  if (areTagsDisabled.value) return;
  const idx = localProfile.value.skills.indexOf(skill);
  if (idx === -1) localProfile.value.skills.push(skill);
  else localProfile.value.skills.splice(idx, 1);
};

// 照片上傳
const fileInputRef = ref<HTMLInputElement | null>(null);
const previews = ref<string[]>([]);

const updatePreviews = (photos: (File | string)[]) => {
  previews.value.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
  previews.value = photos.map((p) => (typeof p === 'string' ? p : URL.createObjectURL(p)));
};

watch(
  () => localProfile.value.photos,
  (newPhotos) => {
    updatePreviews(newPhotos);
  },
  { deep: true, immediate: true },
);

const triggerUpload = () => {
  if (isPhotoUploadDisabled.value) return;
  fileInputRef.value?.click();
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const selected = Array.from(input.files);
  selected.forEach((file) => {
    if (!file.type.startsWith('image/')) return;
    if (localProfile.value.photos.length >= 3) return;
    localProfile.value.photos.push(file);
  });
  input.value = '';
};

const removePhoto = (index: number) => {
  if (isPhotoUploadDisabled.value) return;
  const photoToRemove = localProfile.value.photos[index];
  if (typeof photoToRemove !== 'string') {
    URL.revokeObjectURL(previews.value[index]);
  }
  localProfile.value.photos.splice(index, 1);
};

onBeforeUnmount(() => {
  previews.value.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
});

const redirectToECPay = (plan: 'trial' | 'onetime') => {
  if (plan === 'trial') {
    authStore.setStatus('active', 'trial');
  } else {
    alert('將為您導向至綠界金流進行付款...');
    // 呼叫後端 API，產生一個帶有加密參數的表單，然後自動提交以重定向到綠界
    console.log({
      plan: 'onetime',
      price: 500,
      user: authStore.profile.name,
    });
    authStore.setStatus('active', 'paid');
  }
};
</script>

<template>
  <div class="min-h-screen">
    <div class="space-y-6">
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

      <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm">
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-[#4a4a43] flex items-center gap-2">
              <span class="material-symbols-outlined">description</span> 基本資料
            </h2>
            <div v-if="status === 'active'" class="flex justify-end gap-3">
              <button
                v-if="!isInfoEditing"
                @click="isInfoEditing = true"
                class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium cursor-pointer hover:bg-[#57574a] transition"
              >
                編輯
              </button>
              <template v-else>
                <button
                  @click="onCancel"
                  class="px-6 py-2 rounded-2xl border border-[#6b6b5a] text-[#4a4a43] cursor-pointer hover:bg-[#e6e5df] transition"
                >
                  取消
                </button>
                <button
                  @click="onSave('info')"
                  class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white cursor-pointer hover:bg-[#57574a] transition"
                >
                  儲存變更
                </button>
              </template>
            </div>
          </div>

          <!-- 廠房名稱 -->
          <div>
            <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房名稱</label>
            <input
              v-model="localProfile.name"
              :disabled="isNameDisabled"
              :class="[
                'w-full rounded-2xl px-4 py-3 outline-none transition',
                !isNameDisabled
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
                v-model="localProfile.phone"
                :disabled="isPhoneDisabled"
                :class="[
                  'w-full rounded-2xl px-4 py-3 outline-none transition',
                  !isPhoneDisabled
                    ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
                    : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
                ]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房地址</label>
              <input
                v-model="localProfile.address"
                :disabled="isAddressDisabled"
                :class="[
                  'w-full rounded-2xl px-4 py-3 outline-none transition',
                  !isAddressDisabled
                    ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
                    : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
                ]"
              />
            </div>
          </div>
          <!-- 統一編號 -->
          <div>
            <label class="block text-sm font-medium text-[#4a4a43] mb-2">統一編號</label>
            <input
              v-model="localProfile.taxId"
              :disabled="isTaxIdDisabled"
              :class="[
                'w-full rounded-2xl px-4 py-3 outline-none transition',
                !isTaxIdDisabled
                  ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
                  : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
              ]"
            />
            <p v-if="status !== 'onboarding'" class="text-xs mt-2 text-[#b0afa4]">
              若要更改統編，請聯繫平台管理員
            </p>
          </div>
          <!-- 簡介 -->
          <div>
            <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房簡介</label>
            <textarea
              v-model="localProfile.description"
              :disabled="isDescriptionDisabled"
              rows="4"
              :class="[
                'w-full rounded-2xl px-4 py-3 outline-none transition',
                !isDescriptionDisabled
                  ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
                  : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
              ]"
            ></textarea>
            <p class="text-xs mt-2 text-[#8a8a7d]">
              建議輸入您的專業特色、服務項目、經驗年資等資訊
            </p>
          </div>
          <!-- 車子品牌 -->
          <div>
            <label class="block text-sm font-medium text-[#4a4a43] mb-2">服務品牌</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="brand in brandOptions"
                :key="brand"
                @click="toggleBrand(brand)"
                :class="[
                  'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition',
                  localProfile.brands.includes(brand)
                    ? 'bg-[#6b6b5a] text-white border-[#6b6b5a]'
                    : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
                  !areTagsDisabled
                    ? 'cursor-pointer hover:opacity-80'
                    : 'opacity-50 cursor-not-allowed',
                ]"
              >
                {{ brand }}
              </span>
            </div>
          </div>
          <!-- 擅長維修項目 -->
          <div>
            <label class="block text-sm font-medium text-[#4a4a43] mb-2">擅長維修項目</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in skillOptions"
                :key="skill"
                @click="toggleSkill(skill)"
                :class="[
                  'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition',
                  localProfile.skills.includes(skill)
                    ? 'bg-[#8b7d6b] text-white border-[#8b7d6b]'
                    : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
                  !areTagsDisabled
                    ? 'cursor-pointer hover:opacity-80'
                    : 'opacity-50 cursor-not-allowed',
                ]"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm">
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-[#4a4a43] flex items-center gap-2">
              <span class="material-symbols-outlined">alarm</span> 營業時間設定
            </h2>
            <div v-if="status === 'active'" class="flex justify-end gap-3">
              <button
                v-if="!isHoursEditing"
                @click="isHoursEditing = true"
                class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium cursor-pointer hover:bg-[#57574a] transition"
              >
                編輯
              </button>
              <template v-else>
                <button
                  @click="onCancel"
                  class="px-6 py-2 rounded-2xl border border-[#6b6b5a] text-[#4a4a43] cursor-pointer hover:bg-[#e6e5df] transition"
                >
                  取消
                </button>
                <button
                  @click="onSave('hours')"
                  class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white cursor-pointer hover:bg-[#57574a] transition"
                >
                  儲存變更
                </button>
              </template>
            </div>
          </div>
          <div class="space-y-4">
            <div
              v-for="day in localProfile.hours"
              :key="day.day"
              class="flex items-center justify-between rounded-2xl px-6 py-4 bg-[#f5f4f0] border border-[#e0dfd6] min-h-[56px]"
            >
              <div class="flex items-center gap-4">
                <span :class="['font-medium w-8', areHoursDisabled && 'text-[#8a8a7d]']">{{
                  day.day
                }}</span>
                <div
                  :class="[
                    'relative',
                    !areHoursDisabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
                  ]"
                  @click="!areHoursDisabled && (day.enabled = !day.enabled)"
                >
                  <div
                    :class="[
                      'w-12 h-6 rounded-full transition-colors',
                      day.enabled ? 'bg-[#6b6b5a]' : 'bg-[#d1d1c1]',
                    ]"
                  ></div>
                  <div
                    :class="[
                      'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform',
                      day.enabled ? 'translate-x-6' : 'translate-x-0',
                    ]"
                  ></div>
                </div>
              </div>
              <div
                class="flex items-center gap-3 px-4 py-2 rounded-2xl transition justify-center"
                :class="
                  day.enabled && !areHoursDisabled
                    ? 'bg-white ring-1 ring-[#6b6b5a] shadow-sm'
                    : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed'
                "
              >
                <template v-if="day.enabled">
                  <input
                    type="time"
                    v-model="day.start"
                    :disabled="areHoursDisabled"
                    class="bg-transparent rounded-lg px-2 outline-none disabled:text-[#8a8a7d] disabled:cursor-not-allowed"
                  />
                  <span>至</span>
                  <input
                    type="time"
                    v-model="day.end"
                    :disabled="areHoursDisabled"
                    class="bg-transparent rounded-lg px-2 outline-none disabled:text-[#8a8a7d] disabled:cursor-not-allowed"
                  />
                </template>
                <template v-else>
                  <span>公休</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium flex items-center gap-2 shrink-0 text-[#4a4a43]">
            <span class="material-symbols-outlined">imagesmode</span> 廠房照片
          </h2>
          <div v-if="status === 'active'" class="flex justify-end gap-3">
            <button
              v-if="!isPhotosEditing"
              @click="isPhotosEditing = true"
              class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium cursor-pointer hover:bg-[#57574a] transition"
            >
              編輯
            </button>
            <template v-else>
              <button
                @click="onCancel"
                class="px-6 py-2 rounded-2xl border border-[#6b6b5a] text-[#4a4a43] cursor-pointer hover:bg-[#e6e5df] transition"
              >
                取消
              </button>
              <button
                @click="onSave('photos')"
                class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white cursor-pointer hover:bg-[#57574a] transition"
              >
                儲存變更
              </button>
            </template>
          </div>
        </div>
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
            !isPhotoUploadDisabled
              ? 'cursor-pointer hover:bg-[#f0f0f0]'
              : 'opacity-50 cursor-not-allowed',
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
              v-for="(preview, index) in previews"
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
              v-for="n in 3 - previews.length"
              :key="'empty-' + n"
              class="aspect-square rounded-2xl flex items-center justify-center bg-[#f5f4f0] border border-[#e0dfd6]"
            >
              <span class="material-symbols-outlined text-[#d1d1c1]">image</span>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm mt-6">
        <h2 class="text-2xl font-semibold text-[#4a4a43] mb-6">訂閱付費方案</h2>

        <div v-if="isPaid" class="text-center p-6 bg-[#f5f4f0] border border-[#d1d1c1] rounded-2xl">
          <h3 class="text-xl font-bold text-[#6b6b5a]">您已開通 VIP 會員</h3>
          <p class="text-[#8a8a7d] mt-2">感謝您的支持！您現在可以享受所有進階功能。</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 30 天免費試用 -->
          <div
            :class="[
              'border rounded-2xl p-6 flex flex-col items-center text-center transition relative',
              isSubscriptionSectionDisabled
                ? 'opacity-50'
                : status === 'onboarding'
                  ? 'cursor-pointer'
                  : '',
              isTrialUser || (status === 'onboarding' && selectedPlan === 'trial')
                ? 'border-2 border-[#6b6b5a] bg-[#f5f4f0]'
                : 'border-[#e0dfd6]',
            ]"
            @click="status === 'onboarding' && (selectedPlan = 'trial')"
          >
            <div
              v-if="isTrialUser"
              class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8b7d6b] text-white text-xs font-bold px-3 py-1 rounded-full"
            >
              目前方案
            </div>
            <h3 class="text-xl font-bold text-[#6b6b5a] mb-2">免費試用</h3>
            <p class="text-[#4a4a43] mb-4">30 天全功能免費體驗</p>
            <ul class="text-[#8a8a7d] text-sm space-y-2 mb-6">
              <li>體驗所有進階功能</li>
            </ul>

            <button
              v-if="status === 'onboarding'"
              class="px-6 py-2 rounded-2xl font-medium transition"
              :class="
                selectedPlan === 'trial'
                  ? 'bg-[#6b6b5a] text-white cursor-default'
                  : 'bg-[#8b7d6b] text-white hover:bg-[#7a6d5b]'
              "
            >
              {{ selectedPlan === 'trial' ? '已選擇' : '選擇此方案' }}
            </button>
            <template v-else>
              <button
                v-if="!isTrialUser"
                @click="redirectToECPay('trial')"
                :disabled="isSubscriptionSectionDisabled || isPaid || isTrialUser"
                class="px-6 py-2 rounded-2xl bg-[#8b7d6b] text-white font-medium hover:bg-[#7a6d5b] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                啟用免費試用
              </button>
              <div v-else class="text-center">
                <p class="font-bold text-[#6b6b5a]">正在試用中</p>
                <p class="text-xs text-[#8a8a7d] mt-1">一個帳號僅限一次</p>
              </div>
            </template>
          </div>

          <!-- 買斷制 -->
          <div
            :class="[
              'border rounded-2xl p-6 flex flex-col items-center text-center relative transition',
              isSubscriptionSectionDisabled
                ? 'opacity-50'
                : status === 'onboarding'
                  ? 'cursor-pointer'
                  : '',
              isPaid || (status === 'onboarding' && selectedPlan === 'paid')
                ? 'border-2 border-[#6b6b5a] bg-[#f5f4f0]'
                : 'border-[#6b6b5a]',
            ]"
            @click="status === 'onboarding' && (selectedPlan = 'paid')"
          >
            <div
              class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6b6b5a] text-white text-xs font-bold px-3 py-1 rounded-full"
            >
              一次性買斷
            </div>
            <h3 class="text-xl font-bold text-[#6b6b5a] mb-2">進階方案</h3>
            <p class="text-2xl font-bold text-[#4a4a43] mb-4">NT$ 500</p>
            <ul class="text-[#4a4a43] text-sm space-y-2 mb-6">
              <li>永久使用所有進階功能</li>
              <li>無限預約管理</li>
              <li>優先搜尋排名</li>
              <li>專屬推廣活動</li>
            </ul>
            <button
              v-if="status === 'onboarding'"
              class="px-6 py-2 rounded-2xl font-medium transition"
              :class="
                selectedPlan === 'paid'
                  ? 'bg-[#6b6b5a] text-white cursor-default'
                  : 'bg-[#8b7d6b] text-white hover:bg-[#7a6d5b]'
              "
            >
              {{ selectedPlan === 'paid' ? '已選擇' : '選擇此方案' }}
            </button>
            <button
              v-else
              @click="redirectToECPay('onetime')"
              :disabled="isSubscriptionSectionDisabled || isPaid"
              class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium hover:bg-[#57574a] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              立即升級
            </button>
          </div>
        </div>

        <div v-if="status === 'onboarding'" class="flex justify-end mt-8">
          <button
            @click="onOnboardingSave"
            class="px-8 py-3 rounded-2xl bg-[#6b6b5a] text-white font-bold cursor-pointer hover:bg-[#57574a] transition"
          >
            儲存並提交審核
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
