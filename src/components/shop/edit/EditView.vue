<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { WorkshopProfile } from '@/stores/auth'

const authStore = useAuthStore()

const localProfile = ref<WorkshopProfile>(JSON.parse(JSON.stringify(authStore.profile)))

watch(
  () => authStore.profile,
  (newProfile) => {
    localProfile.value = JSON.parse(JSON.stringify(newProfile))
  },
  { deep: true },
)

const status = computed(() => authStore.status)

const isReadOnly = computed(() => status.value === 'pending_review')

const isInfoEditing = ref(false)
const isHoursEditing = ref(false)
const isPhotosEditing = ref(false)

const isNameDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
)
const isPhoneDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
)
const isAddressDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
)
const isDescriptionDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
)
const isTaxIdDisabled = computed(() => status.value !== 'onboarding')
const areTagsDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isInfoEditing.value),
)
const areHoursDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isHoursEditing.value),
)
const isPhotoUploadDisabled = computed(
  () => isReadOnly.value || (status.value === 'active' && !isPhotosEditing.value),
)

const onCancel = () => {
  isInfoEditing.value = false
  isHoursEditing.value = false
  isPhotosEditing.value = false
  localProfile.value = JSON.parse(JSON.stringify(authStore.profile))
}

const onSave = (section: 'info' | 'hours' | 'photos') => {
  authStore.updateProfile(JSON.parse(JSON.stringify(localProfile.value)))
  if (section === 'info') isInfoEditing.value = false
  if (section === 'hours') isHoursEditing.value = false
  if (section === 'photos') isPhotosEditing.value = false
}
const onOnboardingSave = () => {
  authStore.updateProfile(JSON.parse(JSON.stringify(localProfile.value)))
}

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
]
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
]

// 服務項目與擅長項目的標籤選取
const toggleBrand = (brand: string) => {
  if (areTagsDisabled.value) return
  const idx = localProfile.value.brands.indexOf(brand)
  if (idx === -1) localProfile.value.brands.push(brand)
  else localProfile.value.brands.splice(idx, 1)
}

const toggleSkill = (skill: string) => {
  if (areTagsDisabled.value) return
  const idx = localProfile.value.skills.indexOf(skill)
  if (idx === -1) localProfile.value.skills.push(skill)
  else localProfile.value.skills.splice(idx, 1)
}

// 照片上傳
const fileInputRef = ref<HTMLInputElement | null>(null)
const previews = ref<string[]>([])

const updatePreviews = (photos: (File | string)[]) => {
  previews.value.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
  previews.value = photos.map((p) => (typeof p === 'string' ? p : URL.createObjectURL(p)))
}

watch(
  () => localProfile.value.photos,
  (newPhotos) => {
    updatePreviews(newPhotos)
  },
  { deep: true, immediate: true },
)

const triggerUpload = () => {
  if (isPhotoUploadDisabled.value) return
  fileInputRef.value?.click()
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const selected = Array.from(input.files)
  selected.forEach((file) => {
    if (!file.type.startsWith('image/')) return
    if (localProfile.value.photos.length >= 3) return
    localProfile.value.photos.push(file)
  })
  input.value = ''
}

const removePhoto = (index: number) => {
  if (isPhotoUploadDisabled.value) return
  const photoToRemove = localProfile.value.photos[index]
  if (typeof photoToRemove !== 'string') {
    URL.revokeObjectURL(previews.value[index])
  }
  localProfile.value.photos.splice(index, 1)
}

onBeforeUnmount(() => {
  previews.value.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
})
</script>

<template>
  <div class="p-6 bg-[#f5f4f0] min-h-screen">
    <div class="max-w-4xl mx-auto">
      <div
        v-if="status === 'pending_review'"
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg"
      >
        <h3 class="font-bold">審核中</h3>
        <p>您的資料已提交，正在等待平台管理員審核。在審核期間，所有資料將無法修改。</p>
      </div>
      <div
        v-if="status === 'onboarding'"
        class="bg-[#f5f4f0] border-l-4 border-[#6b6b5a] text-[#4a4a43] p-4 mb-6 rounded-r-lg"
      >
        <h3 class="font-bold">歡迎！請完成您的廠房資料</h3>
        <p>請填寫以下所有資訊，完成後點擊最下方的「儲存並提交審核」按鈕。</p>
      </div>

      <h1 class="text-2xl font-bold text-[#4a4a43] mb-8">廠房資訊</h1>

      <section class="bg-white p-8 rounded-2xl shadow-sm mb-8">
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

      <section class="bg-white p-8 rounded-2xl shadow-sm mb-8">
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

      <div v-if="status === 'onboarding'" class="flex justify-end mt-8">
        <button
          @click="onOnboardingSave"
          class="px-8 py-3 rounded-2xl bg-[#6b6b5a] text-white font-bold cursor-pointer hover:bg-[#57574a] transition"
        >
          儲存並提交審核
        </button>
      </div>
    </div>
  </div>
</template>
