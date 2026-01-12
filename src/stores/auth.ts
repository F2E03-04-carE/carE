import { defineStore } from 'pinia'
import type { Workshop } from '@/mocks/workshop.mock'
import { activeWorkshop, pendingReviewWorkshop, onboardingWorkshop } from '@/mocks/workshop.mock'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    workshop: activeWorkshop as Workshop | null,
  }),

  actions: {
    // 剛註冊
    useOnboarding() {
      this.workshop = onboardingWorkshop
    },

    // 審核中
    usePendingReview() {
      this.workshop = pendingReviewWorkshop
    },

    // 已開通
    useActive() {
      this.workshop = activeWorkshop
    },
  },
})
