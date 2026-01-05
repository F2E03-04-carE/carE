<script setup lang="ts">
import { ref } from 'vue';
import LoginMode from './LoginMode.vue';
import RegisterPage from './RegisterPage.vue';

const baseButtonClass = 'px-3 py-3 sm:px-4 sm:py-2 lg:px-5 lg:py-2 text-[14px] sm:text-[15px] lg:text-[16px] rounded-lg sm:rounded-xl transition-colors duration-200 cursor-pointer';

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

const closeRegister = () => {
  isShowRegister.value = false;
};
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <nav class="max-w-[1440px] mx-auto px-[5%] sm:px-[8%] lg:px-[5%]">
      <div class="flex justify-between items-center h-[60px] sm:h-[70px]">
        <a href="/" class="flex items-center gap-2">
          <i class="fa-solid fa-car text-[#6b6b5a] text-[20px] sm:text-[24px]"></i>
          <span class="text-[20px] sm:text-[24px] font-bold text-[#4a4a43]">carE</span>
        </a>
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="openLoginModal"
            :class="[baseButtonClass, 'border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white']"
          >
          登入
          </button>
          <button
            @click="handleGoToRegister"
            :class="[baseButtonClass, 'bg-[#6b6b5a] text-white hover:bg-[#5a5a4a] px-4 sm:px-6 lg:px-6 font-medium border border-transparent']"
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
    <div v-if="isShowRegister" class="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div class="fixed top-0 right-0 p-4 z-[101]">
         <button @click="closeRegister" class="text-gray-500 hover:text-black font-bold px-4 py-2 bg-gray-100 rounded-lg cursor-pointer flex items-center shadow-md border border-gray-200">
           <i class="fa-solid fa-xmark mr-2"></i>
           關閉 / 返回
         </button>
      </div>
      <RegisterPage />
    </div>
  </header>
</template>