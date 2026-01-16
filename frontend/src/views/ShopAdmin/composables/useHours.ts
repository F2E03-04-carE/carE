import { ref, watch, computed, type Ref } from 'vue';
import type { WorkshopProfile } from '@/stores/auth';

type Hours = WorkshopProfile['hours'];

export function useHours(
  modelValue: Ref<Hours>,
  hasError: Ref<boolean | undefined>,
  areHoursDisabled: Ref<boolean>,
) {
  const timeRangeErrors = ref<boolean[]>(modelValue.value.map(() => false));

  const hasAnyError = computed(() => timeRangeErrors.value.some((error) => error));

  watch(hasAnyError, (newValue) => {
    hasError.value = newValue;
  });

  const onDayEnableToggle = (dayIndex: number) => {
    if (areHoursDisabled.value) return;
    const day = modelValue.value[dayIndex];
    if (day) {
      day.enabled = !day.enabled;
    }
  };

  // 時間防呆和錯誤提示的監聽
  watch(
    modelValue,
    (hours) => {
      while (timeRangeErrors.value.length < hours.length) {
        timeRangeErrors.value.push(false);
      }
      while (timeRangeErrors.value.length > hours.length) {
        timeRangeErrors.value.pop();
      }

      hours.forEach((day, index) => {
        if (day.enabled && day.start && day.end) {
          if (day.start > day.end) {
            timeRangeErrors.value[index] = true;
          } else {
            timeRangeErrors.value[index] = false;
          }
        } else {
          // 公休，清除錯誤標記
          timeRangeErrors.value[index] = false;
        }
      });
    },
    { deep: true, immediate: true },
  );

  return {
    timeRangeErrors,
    onDayEnableToggle,
  };
}
