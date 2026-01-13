import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Workshop, WorkshopStatus } from '@/mocks/workshop.mock'
import {
  activeWorkshop,
  pendingReviewWorkshop,
  onboardingWorkshop,
  trialWorkshop,
} from '@/mocks/workshop.mock'

export interface WorkshopProfile {
  name: string
  phone: string
  address: string
  description: string
  taxId: string
  brands: string[]
  skills: string[]
  // 營業時間
  hours: {
    day: string
    enabled: boolean
    start: string
    end: string
  }[]
  // 照片
  photos: (File | string)[]
}

// 假資料
const defaultEmptyProfile: WorkshopProfile = {
  name: '',
  phone: '',
  address: '',
  description: '',
  taxId: '',
  brands: [],
  skills: [],
  hours: [
    { day: '週一', enabled: true, start: '09:00', end: '18:00' },
    { day: '週二', enabled: true, start: '09:00', end: '18:00' },
    { day: '週三', enabled: true, start: '09:00', end: '18:00' },
    { day: '週四', enabled: true, start: '09:00', end: '18:00' },
    { day: '週五', enabled: true, start: '09:00', end: '18:00' },
    { day: '週六', enabled: false, start: '09:00', end: '18:00' },
    { day: '週日', enabled: false, start: '09:00', end: '18:00' },
  ],
  photos: [],
}

const defaultFullProfile: WorkshopProfile = {
  name: '極速動力維修中心',
  phone: '02-2955-7788',
  address: '新北市板橋區中山路一段 102 號',
  taxId: '27894561',
  description: '專注高效率維修，擁有先進設備及專業技師團隊。',
  brands: ['Nissan', 'Mazda', 'Lexus'],
  skills: ['變速箱維修', '底盤懸吊', '空調冷氣維修', '輪胎更換/定位'],
  hours: [
    { day: '週一', enabled: true, start: '09:00', end: '18:00' },
    { day: '週二', enabled: true, start: '09:00', end: '18:00' },
    { day: '週三', enabled: true, start: '09:00', end: '18:00' },
    { day: '週四', enabled: true, start: '09:00', end: '18:00' },
    { day: '週五', enabled: true, start: '09:00', end: '18:00' },
    { day: '週六', enabled: true, start: '10:00', end: '17:00' },
    { day: '週日', enabled: false, start: '09:00', end: '18:00' },
  ],
  photos: [],
}

export const useAuthStore = defineStore('auth', () => {
  // 目前登入使用者的維修廠資料
  const workshop = ref<Workshop | null>(activeWorkshop)

  // 維修廠編輯用的表單資料
  const profile = ref<WorkshopProfile>(defaultFullProfile)

  // 目前維修廠狀態
  const status = computed(() => workshop.value?.status as WorkshopStatus)

  // 目前訂閱狀態
  const subscriptionStatus = computed(() => workshop.value?.subscription_status)

  // 目前維修廠狀態，用於 DevRoleSwitcher 顯示用
  const displayStatus = computed(() => {
    if (workshop.value?.id === trialWorkshop.id) {
      return 'active_trial'
    }
    return status.value
  })

  // 切換維修廠狀態（測試 / 模擬用）
  function setStatus(newStatus: WorkshopStatus, subStatus?: 'trial' | 'paid') {
    if (newStatus === 'active') {
      // active 狀態（依是否試用切換資料）
      if (subStatus === 'trial') {
        workshop.value = trialWorkshop
        profile.value = { ...defaultFullProfile }
      } else {
        workshop.value = activeWorkshop
        profile.value = { ...defaultFullProfile }
      }
    } else if (newStatus === 'pending_review') {
      // 等待審核狀態
      workshop.value = pendingReviewWorkshop
      profile.value = { ...defaultFullProfile }
    } else if (newStatus === 'onboarding') {
      // 新註冊狀態
      workshop.value = onboardingWorkshop
      profile.value = { ...defaultEmptyProfile }
    }
  }

  // 更新維修廠資料
  function updateProfile(newProfile: WorkshopProfile, plan?: 'trial' | 'paid' | null) {
    // 更新表單資料
    profile.value = newProfile

    // onboarding 完成後送出審核
    if (status.value === 'onboarding' && plan) {
      const newPendingWorkshop: Workshop = {
        ...(workshop.value as Workshop),
        ...newProfile,
        status: 'pending_review',
        profile_completed: true,
        subscription_status: plan,
        subscription_plan: 'pro',
      }
      workshop.value = newPendingWorkshop

      // 非 onboarding 狀態僅更新資料
    } else if (status.value !== 'onboarding') {
      if (workshop.value) {
        workshop.value = { ...workshop.value, ...newProfile }
      }
    }
  }

  // 對外暴露狀態與方法
  return {
    workshop,
    profile,
    status,
    displayStatus,
    subscriptionStatus,
    setStatus,
    updateProfile,
  }
})
