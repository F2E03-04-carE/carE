<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import Toast from '@/components/Admin/Toast.vue';

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
});

// 浮窗提示狀態
const toast = reactive({
  show: false,
  message: '',
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
  <!-- 浮窗提示組件 -->
  <Toast :show="toast.show" :message="toast.message" type="error" @close="closeToast" />

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
