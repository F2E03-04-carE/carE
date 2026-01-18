<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
});

const handleLogin = () => {
  // 模擬登入驗證，實際專案應連接後端 API
  if (form.username && form.password) {
    // 登入成功，跳轉至儀表板
    router.push('/admin/members');
  } else {
    alert('請輸入帳號密碼');
  }
};
</script>

<template>
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
