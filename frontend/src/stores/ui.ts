// 統一管理全站「登入視窗（Login Modal）」的顯示狀態與跳轉邏輯
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // 登入/註冊浮窗狀態
  const isLoginModalOpen = ref(false);

  // 用來記錄「登入後要跳轉去哪裡」
  const loginRedirectPath = ref<string | null>(null);

  function openLoginModal(redirectPath?: string) {
    isLoginModalOpen.value = true;
    if (redirectPath) {
      loginRedirectPath.value = redirectPath;
    }
  }

  function closeLoginModal() {
    isLoginModalOpen.value = false;
    loginRedirectPath.value = null; // 關閉時通常清除，或看需求保留
  }

  return {
    isLoginModalOpen,
    loginRedirectPath,
    openLoginModal,
    closeLoginModal,
  };
});
