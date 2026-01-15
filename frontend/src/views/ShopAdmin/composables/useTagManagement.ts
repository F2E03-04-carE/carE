import type { Ref } from 'vue';
import type { WorkshopProfile } from '@/stores/auth';

export function useTagManagement(
  localProfile: Ref<WorkshopProfile>,
  areTagsDisabled: Ref<boolean>,
) {
  const toggleBrand = (brand: string) => {
    if (areTagsDisabled.value) return;
    const idx = localProfile.value.brands.indexOf(brand);
    if (idx === -1) {
      localProfile.value.brands.push(brand);
    } else {
      localProfile.value.brands.splice(idx, 1);
    }
  };

  const toggleSkill = (skill: string) => {
    if (areTagsDisabled.value) return;
    const idx = localProfile.value.skills.indexOf(skill);
    if (idx === -1) {
      localProfile.value.skills.push(skill);
    } else {
      localProfile.value.skills.splice(idx, 1);
    }
  };

  return {
    toggleBrand,
    toggleSkill,
  };
}
