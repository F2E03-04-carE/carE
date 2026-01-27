<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
});

// 浮窗提示狀態
const toast = reactive({
  show: false,
  message: '',
  type: 'error' as 'success' | 'error',
});

// Toast 樣式
const toastTypeClass = computed(() => {
  return toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
});

// 顯示錯誤提示 (不自動關閉)
const showToast = (message: string) => {
  toast.message = message;
  toast.show = true;
};

// 關閉浮窗
const closeToast = () => {
  toast.show = false;
};

const handleLogin = () => {
  // 純靜態切版模式：只要有輸入帳號密碼即可登入
  if (form.username && form.password) {
    // 登入成功，直接跳轉，不顯示提示
    router.push('/admin/members');
  } else {
    // 未輸入帳號或密碼，顯示錯誤提示
    showToast('請輸入帳號密碼');
  }
};
</script>

<template>
  <!-- 浮窗提示 -->
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform -translate-y-5 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-5 opacity-0"
  >
    <div
      v-if="toast.show"
      class="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] justify-between"
      :class="toastTypeClass"
    >
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-2xl">
          {{ toast.type === 'error' ? 'report' : 'check_circle' }}
        </span>
        <span class="font-medium">{{ toast.message }}</span>
      </div>
      <button
        @click="closeToast"
        class="text-white/80 hover:text-white transition-colors focus:outline-none flex items-center"
        aria-label="關閉"
      >
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  </Transition>

  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">平台管理員登入</h1>
        <p class="text-gray-500 mt-2">請輸入您的管理員帳號密碼</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">帳號</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6b6b5a] focus:border-[#6b6b5a]"
            placeholder="admin"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">密碼</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6b6b5a] focus:border-[#6b6b5a]"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6b6b5a] hover:bg-[#5a5a4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b6b5a]"
          >
            登入
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
