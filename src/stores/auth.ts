import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Workshop, WorkshopStatus } from '@/mocks/workshop.mock'
import { activeWorkshop, pendingReviewWorkshop, onboardingWorkshop } from '@/mocks/workshop.mock'

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
  const workshop = ref<Workshop | null>(activeWorkshop)
  const profile = ref<WorkshopProfile>(defaultFullProfile)

  const status = computed(() => workshop.value?.status as WorkshopStatus)

  function setStatus(newStatus: WorkshopStatus) {
    if (newStatus === 'active') {
      workshop.value = activeWorkshop
      profile.value = { ...defaultFullProfile }
    } else if (newStatus === 'pending_review') {
      workshop.value = pendingReviewWorkshop
      profile.value = { ...defaultFullProfile }
    } else if (newStatus === 'onboarding') {
      workshop.value = onboardingWorkshop
      profile.value = { ...defaultEmptyProfile }
    }
  }

  function updateProfile(newProfile: WorkshopProfile) {
    profile.value = newProfile
    console.log('Profile updated:', profile.value)

    if (status.value === 'onboarding') {
      console.log('Status changed from onboarding to pending_review')
      workshop.value = pendingReviewWorkshop
    }
    alert('資料已儲存！')
  }

  return {
    workshop,
    profile,
    status,
    setStatus,
    updateProfile,
  }
})
