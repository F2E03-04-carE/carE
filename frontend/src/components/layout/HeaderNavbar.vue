<script setup lang="ts">
import { ref } from 'vue';
import LoginMode from '@/views/Auth/LoginMode.vue';
import RegisterPage from '@/views/Auth/RegisterPage.vue';

const baseButtonClass =
  'px-3 py-3 sm:px-4 sm:py-2 lg:px-5 lg:py-2 text-[14px] sm:text-[16px] lg:text-[18px] rounded-lg sm:rounded-xl transition-colors duration-200 cursor-pointer';
const textOnlyButtonClass = 'px-2 py-2 sm:px-4 sm:py-2 lg:px-3 lg:py-2 text-[14px] sm:text-[15px] lg:text-[16px] cursor-pointer'
const isShowLoginModal = ref(false);
const isShowRegister = ref(false);

const openLoginModal = () => {
  isShowLoginModal.value = true;
  isShowRegister.value = false;
};

const closeLoginModal = () => {
  isShowLoginModal.value = false;
};

const handleGoToRegister = () => {
  closeLoginModal();
  isShowRegister.value = true;
  window.scrollTo(0, 0);
};

const handleBackToLogin = () => {
  isShowRegister.value = false;
  isShowLoginModal.value = true;
};

const closeRegister = () => {
  isShowRegister.value = false;
};
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <nav class="max-w-[1440px] mx-auto px-[5%] sm:px-[8%] lg:px-[5%]">
      <div class="flex justify-between items-center h-[60px] sm:h-[70px]">
        <a href="/" class="flex items-center gap-2">
          <img src="@/assets/icons/carE_logo_green.png" alt="carE logo" class="h-15 w-auto object-contain"> </img>
        </a>
        <div class="flex items-center gap-2 sm:gap-3 font-extrabold">
          <div calss="flex items-center">
          <button
            :class="[
              textOnlyButtonClass,
              'text-[#6b6b5a] hover:scale-110',
            ]"
          >
            尋找維修廠
          </button>
          <button
            :class="[
              textOnlyButtonClass,
              'text-[#6b6b5a] hover:scale-110',
            ]"
          >
            刊登維修廠
          </button>
          </div>
          <button
            @click="openLoginModal"
            :class="[
              baseButtonClass,
              'border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white',
            ]"
          >
            登入
          </button>
          <button
            @click="handleGoToRegister"
            :class="[
              baseButtonClass,
              'bg-[#6b6b5a] text-white hover:bg-[#5a5a4a] px-4 sm:px-6 lg:px-6 border border-transparent',
            ]"
          >
            加入會員
          </button>
        </div>
      </div>
    </nav>
    <LoginMode
      v-if="isShowLoginModal"
      @close="closeLoginModal"
      @switch-to-signup="handleGoToRegister"
    />
    <RegisterPage
      v-if="isShowRegister"
      @close="closeRegister"
      @switch-to-login="handleBackToLogin"
    />
  </header>
</template>
