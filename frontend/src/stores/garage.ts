import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { WorkshopInfo } from '@/types/garage';

export const useGarageStore = defineStore('garage', () => {
  // 用於暫存 Onboarding 過程中的資料
  const tempGarageInfo = ref<Partial<WorkshopInfo> | null>(null);

  // 設定暫存資料
  function setTempGarageInfo(info: Partial<WorkshopInfo>) {
    tempGarageInfo.value = info;
  }

  // 清除暫存資料
  function clearTempGarageInfo() {
    tempGarageInfo.value = null;
  }

  return {
    tempGarageInfo,
    setTempGarageInfo,
    clearTempGarageInfo,
  };
});
