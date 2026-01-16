import { ref, computed, watch, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { WorkshopProfile } from '@/stores/auth';
import { useEditState } from './useEditState';
import { useTagManagement } from './useTagManagement';
import { useSubscription } from './useSubscription';
import { trialWorkshop } from '@/mocks/workshop.mock';

export function useWorkshopForm() {
  const authStore = useAuthStore();

  // 本地表單資料
  const localProfile = ref<WorkshopProfile>(JSON.parse(JSON.stringify(authStore.profile)));
  watch(
    () => authStore.profile,
    (newProfile) => {
      localProfile.value = JSON.parse(JSON.stringify(newProfile));
    },
    { deep: true },
  );

  // 狀態相關
  const status = computed(() => authStore.status);
  const subscriptionStatus = computed(() => authStore.subscriptionStatus);
  watch(status, (newStatus, oldStatus) => {
    if (oldStatus === 'onboarding' && newStatus === 'pending_review') {
      nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });

  // 編輯狀態 (onSave, onCancel)
  const { isInfoEditing, isHoursEditing, isPhotosEditing, onCancel, onSave } = useEditState(
    localProfile,
    authStore,
  );

  // 唯讀與禁用相關的 computed 屬性
  const isReadOnly = computed(() => status.value === 'pending_review');
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

  // 標籤管理
  const { toggleBrand, toggleSkill } = useTagManagement(localProfile, areTagsDisabled);

  // 訂閱相關
  const selectedPlan = ref<'trial' | 'paid' | null>(null);
  const isSubscriptionSectionDisabled = computed(() => status.value === 'pending_review');
  const isTrialUser = computed(() => authStore.workshop?.id === trialWorkshop.id);
  const isPaid = computed(() => status.value === 'active' && subscriptionStatus.value === 'paid');

  const { submitOnboarding, redirectToECPay } = useSubscription(
    authStore,
    localProfile,
    selectedPlan,
  );

  return {
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
    onOnboardingSave: submitOnboarding,
    toggleBrand,
    toggleSkill,
    redirectToECPay,
  };
}
