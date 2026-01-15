import type { Ref } from 'vue';
import type { AuthStore } from '@/stores/auth';

// composable 的參數可以更具體，例如只傳入需要的部分 store
// 但為了簡化，我們先傳入整個 store
export function useSubscription(
  authStore: AuthStore,
  localProfile: Ref<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  selectedPlan: Ref<'trial' | 'paid' | null>,
) {
  const submitOnboarding = () => {
    if (!selectedPlan.value) {
      alert('請選擇一個訂閱方案！');
      return;
    }

    const profileData = JSON.parse(JSON.stringify(localProfile.value));

    if (selectedPlan.value === 'trial') {
      alert('選擇「免費試用」，請等待審核');
      authStore.updateProfile(profileData, 'trial');
    } else if (selectedPlan.value === 'paid') {
      alert('將為您導向至綠界金流進行付款...');
      console.log('模擬呼叫後端 API 以取得 ECPay 表單...', {
        plan: 'paid',
        user: profileData.name,
      });
      authStore.updateProfile(profileData, 'paid');
    }
  };

  // 這個函數是用於 onboarding 之後，active user 想從 trial 升級到 paid
  const redirectToECPay = (plan: 'trial' | 'onetime') => {
    if (plan === 'trial') {
      // 理論上 active user 不會再點 trial
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

  return {
    submitOnboarding,
    redirectToECPay,
  };
}
