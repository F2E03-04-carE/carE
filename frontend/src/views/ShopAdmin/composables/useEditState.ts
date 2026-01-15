import { ref } from 'vue';
import type { Ref } from 'vue';
import type { WorkshopProfile, AuthStore } from '@/stores/auth';

export function useEditState(localProfile: Ref<WorkshopProfile>, authStore: AuthStore) {
  const isInfoEditing = ref(false);
  const isHoursEditing = ref(false);
  const isPhotosEditing = ref(false);

  const onCancel = (section: 'info' | 'hours' | 'photos') => {
    const originalProfile = JSON.parse(JSON.stringify(authStore.profile));

    if (section === 'info') {
      isInfoEditing.value = false;
      localProfile.value.name = originalProfile.name;
      localProfile.value.phone = originalProfile.phone;
      localProfile.value.address = originalProfile.address;
      localProfile.value.description = originalProfile.description;
      localProfile.value.brands = originalProfile.brands;
      localProfile.value.skills = originalProfile.skills;
    } else if (section === 'hours') {
      isHoursEditing.value = false;
      localProfile.value.hours = originalProfile.hours;
    } else if (section === 'photos') {
      isPhotosEditing.value = false;
      localProfile.value.photos = originalProfile.photos;
    }
  };

  const onSave = (section: 'info' | 'hours' | 'photos') => {
    authStore.updateProfile(JSON.parse(JSON.stringify(localProfile.value)));

    if (section === 'info') isInfoEditing.value = false;
    if (section === 'hours') isHoursEditing.value = false;
    if (section === 'photos') isPhotosEditing.value = false;
  };

  return {
    isInfoEditing,
    isHoursEditing,
    isPhotosEditing,
    onCancel,
    onSave,
  };
}
