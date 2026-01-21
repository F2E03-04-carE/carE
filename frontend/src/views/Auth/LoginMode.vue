<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const authStore = useAuthStore();

const email = ref('');
const formError = ref('');
const isLoading = ref(false);
const emailSent = ref(false);

const handleLoginSubmit = async () => {
  formError.value = '';

  if (!email.value) {
    formError.value = '請輸入電子信箱';
    return;
  }

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailPattern.test(email.value)) {
    formError.value = '請輸入有效的電子信箱格式';
    return;
  }

  isLoading.value = true;

  try {
    await authStore.signInWithMagicLink(email.value);
    emailSent.value = true;
  } catch (error: any) {
    formError.value = error.message || '發送登入連結失敗，請稍後再試';
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = async () => {
  formError.value = '';
  isLoading.value = true;

  try {
    await authStore.signInWithGoogle();

    // 導向 Google 登入頁
  } catch (error: any) {
    formError.value = error.message || 'Google 登入失敗，請稍後再試';
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 z-[60] flex justify-center items-center bg-black/40 backdrop-blur-sm transition-opacity">
    <div class="relative w-[90%] max-w-[400px] p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 z-50 w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 text-black cursor-pointer transition-colors"
        type="button"
        aria-label="關閉"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div v-if="emailSent" class="text-center py-4">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#6B6B5C]/10">
          <i class="text-2xl fa-solid fa-envelope text-[#6B6B5C]" aria-hidden="true"></i>
        </div>
        <h2 class="mb-2 text-2xl font-medium text-[#3d3d3d]">登入連結已發送</h2>
        <p class="mb-4 text-[#8a8a7e]">我們已將登入連結發送至</p>
        <p class="font-bold text-[#6B6B5C] mb-6">{{ email }}</p>
        <p class="text-[14px] text-[#8a8a7e] mb-6">請檢查您的信箱並點擊連結完成登入</p>
        <button
          type="button"
          @click="emit('close')"
          class="w-full px-6 py-2.5 font-bold text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#5a5a4a] shadow-md"
        >
          關閉
        </button>
      </div>
      <div v-else>
        <h2 class="mb-4 text-center text-[24px] font-bold text-[#4a4a43]">會員登入/註冊</h2>
        <p class="mb-2 text-center text-[14px] text-gray-600">輸入您的電子信箱，我們會發送登入連結給您</p>
        <p class="mb-6 text-center text-[13px] text-[#6B6B5C] bg-[#6B6B5C]/5 rounded-lg py-2 px-3">
          <i class="fa-solid fa-circle-info mr-1"></i>
          採用 Magic Link 無密碼登入，更安全便利
        </p>
        <form @submit.prevent="handleLoginSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="email" class="text-[16px] text-gray-700 font-medium">電子信箱</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="請輸入您的電子信箱"
              :disabled="isLoading"
              :class="[
                'w-full px-4 py-2 text-[16px] rounded-lg border outline-none transition-all',
                formError
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-[#6b6b5a]',
              ]"
            />
            <span v-if="formError" class="text-[14px] text-red-500">
              {{ formError }}
            </span>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="mt-2 w-full py-2.5 text-[16px] font-bold text-white bg-[#6b6b5a] rounded-lg hover:bg-[#5a5a4a] transition-colors shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">
              <i class="mr-2 fa-solid fa-spinner fa-spin"></i>發送中...
            </span>
            <span v-else>發送登入連結</span>
          </button>
          <button
          type="button"
          @click="handleGoogleLogin"
          :disabled="isLoading"
          class="flex items-center justify-center w-full gap-3 px-4 py-2.5 text-[16px] font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-60"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            class="w-5 h-5"
            alt="Google"
          />
          使用 Google 帳號登入
        </button>
        </form>
      </div>
    </div>
  </div>
</template>
