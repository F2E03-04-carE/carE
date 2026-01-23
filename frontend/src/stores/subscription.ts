import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type PlanType = 'trial' | 'lifetime' | null;

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface Subscription {
  id: string;
  planType: PlanType;
  status: SubscriptionStatus;
  trialStartDate?: string;
  trialExpiryDate?: string;
  features: {
    bookingManagement: boolean;
    reviewSystem: boolean;
    profileDisplay: boolean;
  };
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscription = ref<Subscription | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);


  const daysRemaining = computed(() => {
    if (!subscription.value?.trialExpiryDate) return null;
    if (subscription.value.planType !== 'trial') return null;

    const today = new Date();
    const expiry = new Date(subscription.value.trialExpiryDate);
    const diff = expiry.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 0;
  });


  const isExpiringSoon = computed(() => {
    if (!daysRemaining.value) return false;
    return daysRemaining.value <= 7 && daysRemaining.value > 0;
  });


  const isExpired = computed(() => {
    return daysRemaining.value === 0;
  });


  const isTrial = computed(() => {
    return subscription.value?.planType === 'trial';
  });


  const isLifetime = computed(() => {
    return subscription.value?.planType === 'lifetime';
  });

  // 格式化到期日期顯示
  const expiryDisplayText = computed(() => {
    if (!subscription.value?.trialExpiryDate) return '';
    if (!isTrial.value) return '';

    const expiryDate = new Date(subscription.value.trialExpiryDate);
    const formatted = expiryDate.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    if (daysRemaining.value === 0) {
      return `試用已於 ${formatted} 到期`;
    } else {
      return `試用期限：${formatted}（剩餘 ${daysRemaining.value} 天）`;
    }
  });


  async function fetchSubscription() {
    isLoading.value = true;
    error.value = null;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/subscription/current`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success && data.subscription) {
        subscription.value = data.subscription;
        return true;
      } else {
        subscription.value = null;
        return false;
      }
    } catch (err) {
      console.error('獲取訂閱資訊失敗:', err);
      error.value = '無法載入訂閱資訊';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function activateTrial() {
    isLoading.value = true;
    error.value = null;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/trial/activate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success && data.subscription) {
        subscription.value = data.subscription;
        return { success: true };
      } else {
        error.value = data.message || '啟動試用失敗';
        return { success: false, message: error.value };
      }
    } catch (err) {
      console.error('啟動試用失敗:', err);
      error.value = '網路錯誤，請稍後再試';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  function hasFeature(feature: keyof Subscription['features']): boolean {
    if (!subscription.value) return false;

    if (isExpired.value && isTrial.value) {
      return feature === 'profileDisplay';
    }

    return subscription.value.features[feature] || false;
  }

  function clearSubscription() {
    subscription.value = null;
    error.value = null;
  }

  return {
    subscription,
    isLoading,
    error,

    daysRemaining,
    isExpiringSoon,
    isExpired,
    isTrial,
    isLifetime,
    expiryDisplayText,

    fetchSubscription,
    activateTrial,
    hasFeature,
    clearSubscription,
  };
});
