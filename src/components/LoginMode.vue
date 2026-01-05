<script setup lang="ts">
import { reactive } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'switch-to-signup'): void;
}>();

const loginForm = reactive({
  account: ``,
  password: ``,
  rememberMe: false,
});

const formErrors = reactive({
  account: ``,
  password: ``,
});

const handleClose = () => {
  emit('close');
};

const handleSwitchToSignup = () => {
  emit('switch-to-signup');
};

const handleLoginSubmit = async () => {
  formErrors.account = ``;
  formErrors.password = ``;
  let isValid = true;

  if (!loginForm.account) {
    formErrors.account = `請輸入帳號`;
    isValid = false;
  }
  
  if (!loginForm.password) {
    formErrors.password = `請輸入密碼`;
    isValid = false;
  }

  if (!isValid) return;

  console.log(`執行登入`, loginForm);
};
</script>

<template>
  <div class="fixed inset-0 z-[60] flex justify-center items-center bg-black/40 backdrop-blur-sm transition-opacity">
    <div class="relative w-[90%] max-w-[400px] p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
      <button
        @click="handleClose"
        class="absolute top-4 right-4 z-50 w-10 h-10 flex justify-center items-center rounded-full hover:bg-black/5 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        type="button"
        aria-label="關閉"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="mb-6 text-center text-[24px] font-bold text-[#4a4a43]">
        會員登入
      </h2>
      <form @submit.prevent="handleLoginSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="account" class="text-[16px] text-gray-700 font-medium">帳號</label>
          <input
            id="account"
            v-model="loginForm.account"
            type="text"
            placeholder="請輸入您的帳號"
            :class="[
              `w-full px-4 py-2 text-[16px] rounded-lg border outline-none transition-all`,
              formErrors.account
                ? `border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200`
                : `border-gray-300 focus:border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a]/20`
            ]"
          />
          <span v-if="formErrors.account" class="text-[14px] text-red-500">
            {{ formErrors.account }}
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <label for="password" class="text-[16px] text-gray-700 font-medium">密碼</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="請輸入您的密碼"
            :class="[
              `w-full px-4 py-2 text-[16px] rounded-lg border outline-none transition-all`,
              formErrors.password
                ? `border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200`
                : `border-gray-300 focus:border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a]/20`
            ]"
          />
          <span v-if="formErrors.password" class="text-[14px] text-red-500">
            {{ formErrors.password }}
          </span>
        </div>
        <div class="flex justify-between items-center mt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input
              v-model="loginForm.rememberMe"
              type="checkbox"
              class="w-4 h-4 text-[#6b6b5a] rounded border-gray-300 focus:ring-[#6b6b5a]"
            />
            <span class="text-[14px] text-gray-600">記住帳號密碼</span>
          </label>
          <a href="#" class="text-[14px] text-[#6b6b5a] hover:underline hover:text-[#4a4a43]">
            忘記密碼？
          </a>
        </div>
        <button
          type="submit"
          class="mt-2 w-full py-2.5 text-[16px] font-bold text-white bg-[#6b6b5a] rounded-lg hover:bg-[#5a5a4a] transition-colors shadow-md cursor-pointer"
        >
          登入
        </button>
      </form>
      <div class="relative flex justify-center items-center my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative px-4 text-[14px] text-gray-500 bg-white/0 backdrop-blur-md">
          還沒有帳號嗎？
        </div>
      </div>
      <div class="text-center">
        <button
          @click="handleSwitchToSignup"
          class="text-[16px] font-bold text-[#6b6b5a] hover:underline cursor-pointer"
        >
          立即註冊
        </button>
      </div>
    </div>
  </div>
</template>