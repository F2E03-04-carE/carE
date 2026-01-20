<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

type FieldKey = `Email` | `Phone`;

//從JoinGarage.vue的按鈕點入都直接判斷車廠身份
export interface RegisterPageProps {
  userType?: 'member' | 'garage';
}

const props = withDefaults(defineProps<RegisterPageProps>(), {
  userType: 'member',
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'switch-to-login'): void;
}>();

const authStore = useAuthStore();

const IsSubmitted = ref(false);
const DidSubmitAttempt = ref(false);
const IsLoading = ref(false);
const ErrorMessage = ref('');

const Countdown = ref(5);
let Timer: number | undefined;

const Form = reactive({
  Email: ``,
  Phone: ``,
});

const Touched = reactive<Record<FieldKey, boolean>>({
  Email: false,
  Phone: false,
});

const Errors = computed<Record<FieldKey, string>>(() => {
  const Next: Record<FieldKey, string> = {
    Email: ``,
    Phone: ``,
  };

  if (!Form.Email) {
    Next.Email = `請輸入電子信箱`;
  } else {
    const EmailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!EmailPattern.test(Form.Email)) {
      Next.Email = `請輸入有效的電子信箱格式`;
    }
  }

  if (!Form.Phone) {
    Next.Phone = `請輸入電話號碼`;
  } else {
    const PhonePattern = /^09\d{8}$/;
    if (!PhonePattern.test(Form.Phone)) {
      Next.Phone = `請輸入有效的手機號碼格式（09開頭，共10碼）`;
    }
  }

  return Next;
});

function ShowError(Key: FieldKey) {
  return (Touched[Key] || DidSubmitAttempt.value) && !!Errors.value[Key];
}

function InputBorderClass(Key: FieldKey) {
  return ShowError(Key)
    ? `border-[#c97d7d] focus:border-[#c97d7d] focus:ring-[#c97d7d]/30`
    : `border-[#e0ddd5]`;
}

function MarkAllTouched() {
  Touched.Email = true;
  Touched.Phone = true;
}

function HandleClose() {
  if (Timer) clearInterval(Timer);

  IsSubmitted.value = false;
  DidSubmitAttempt.value = false;
  ErrorMessage.value = '';

  Form.Email = ``;
  Form.Phone = ``;

  Object.keys(Touched).forEach((key) => {
    Touched[key as FieldKey] = false;
  });

  emit('close');
}

function HandleSwitchToLogin() {
  if (Timer) clearInterval(Timer);
  emit('switch-to-login');
}

function StartRedirectTimer() {
  Countdown.value = 5;

  if (Timer) clearInterval(Timer);

  Timer = window.setInterval(() => {
    Countdown.value -= 1;
    if (Countdown.value <= 0) {
      HandleClose();
    }
  }, 1000);
}

async function HandleSubmit() {
  if (IsLoading.value) return;

  DidSubmitAttempt.value = true;
  MarkAllTouched();
  ErrorMessage.value = '';

  const HasError = Object.values(Errors.value).some((Msg) => Msg.length > 0);
  if (HasError) return;

  IsLoading.value = true;

  try {
    await authStore.signUp(Form.Email, Form.Phone);

    IsSubmitted.value = true;
    StartRedirectTimer();
  } catch (error: any) {
    console.error(`註冊失敗`, error);
    ErrorMessage.value = error.message || `發生錯誤，請稍後再試`;
  } finally {
    IsLoading.value = false;
  }
}

onUnmounted(() => {
  if (Timer) clearInterval(Timer);
});
</script>

<template>
  <div class="fixed inset-0 z-[60] flex justify-center items-center bg-black/40 backdrop-blur-sm transition-opacity">
    <div class="relative w-[90%] max-w-[450px] p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <button
        @click="HandleClose"
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
      <div v-if="IsSubmitted" class="text-center py-4">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#6B6B5C]/10">
          <i class="text-2xl fa-solid fa-envelope text-[#6B6B5C]" aria-hidden="true"></i>
        </div>
        <h2 class="mb-2 text-2xl font-medium text-[#3d3d3d]">註冊成功</h2>
        <p class="mb-2 text-[#8a8a7e]">我們已將登入連結發送至</p>
        <p class="font-bold text-[#6B6B5C] mb-4">{{ Form.Email }}</p>
        <p class="text-[14px] text-[#8a8a7e] mb-6">請檢查您的信箱並點擊連結完成登入</p>
        <p class="text-[#8a8a7e] mb-6">
          將在 <span class="font-bold text-[#6B6B5C]">{{ Countdown }}</span> 秒後自動關閉...
        </p>
        <button
          type="button"
          @click="HandleClose"
          class="w-full px-6 py-2.5 font-bold text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#5a5a4a] shadow-md"
        >
          關閉
        </button>
      </div>
      <div v-else>
        <h2 class="mb-6 text-center text-[24px] font-bold text-[#4a4a43]">
          {{ userType === 'garage' ? '商家註冊' : '會員註冊' }}
        </h2>
        <p class="mb-6 text-center text-[14px] text-gray-600">
          輸入您的資訊，我們會發送登入連結到您的信箱，無需設定密碼
        </p>
        <div v-if="ErrorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-[14px] text-red-600">{{ ErrorMessage }}</p>
        </div>
        <form class="space-y-4" @submit.prevent="HandleSubmit">
          <div>
            <label for="email" class="block mb-1 text-[16px] font-medium text-gray-700">
              電子信箱
            </label>
            <input
              id="email"
              v-model.trim="Form.Email"
              type="email"
              autocomplete="username"
              placeholder="example@email.com"
              class="w-full px-4 py-2 text-[16px] transition-colors bg-white border rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
              :class="InputBorderClass(`Email`)"
              @blur="Touched.Email = true"
            />
            <p v-if="ShowError(`Email`)" class="mt-1 text-[14px] text-[#c97d7d]">{{ Errors.Email }}</p>
          </div>
          <div>
            <label for="phone" class="block mb-1 text-[16px] font-medium text-gray-700">
              電話號碼
            </label>
            <input
              id="phone"
              v-model.trim="Form.Phone"
              type="tel"
              autocomplete="tel"
              placeholder="0912345678"
              class="w-full px-4 py-2 text-[16px] transition-colors bg-white border rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
              :class="InputBorderClass(`Phone`)"
              @blur="Touched.Phone = true"
            />
            <p v-if="ShowError(`Phone`)" class="mt-1 text-[14px] text-[#c97d7d]">{{ Errors.Phone }}</p>
          </div>
          <button
            type="submit"
            :disabled="IsLoading"
            class="w-full px-6 py-2.5 mt-6 text-[16px] font-bold text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#5a5a4a] shadow-md focus:outline-none focus:ring-2 focus:ring-[#6B6B5C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            <span v-if="IsLoading">
              <i class="mr-2 fa-solid fa-spinner fa-spin"></i>處理中...
            </span>
            <span v-else>確認送出</span>
          </button>
        </form>
        <div class="relative flex justify-center items-center my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative px-4 text-[14px] text-gray-500 bg-white/0 backdrop-blur-md">
            已經有帳號了嗎？
          </div>
        </div>
        <div class="text-center">
          <button
            @click="HandleSwitchToLogin"
            class="text-[16px] font-bold text-[#6b6b5a] hover:underline cursor-pointer"
          >
            立即登入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
