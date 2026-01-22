<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 支援透過 query 傳入錯誤代碼，預設為 404
const statusCode = computed(() => {
  const code = route.query.status || route.params.status;
  return code ? Number(code) : 404;
});

// 根據不同的狀態碼顯示不同的文字內容
const errorInfo = computed(() => {
  const status = statusCode.value;
  if (status >= 500) {
    return {
      title: '伺服器異常',
      message: '抱歉，我們端發生了一些問題，工程師正在努力搶修中。',
      icon: 'fa-server'
    };
  } else if (status === 403) {
    return {
      title: '權限不足',
      message: '您沒有訪問此頁面的權限，請確認您的登入狀態。',
      icon: 'fa-user-shield'
    };
  } else if (status === 400) {
    return {
      title: '錯誤的請求',
      message: '發送的請求格式有誤，請稍後再試。',
      icon: 'fa-circle-exclamation'
    };
  } else {
    return {
      title: '頁面不存在',
      message: '找不到您要訪問的頁面，它可能已被移除或更換了網址。',
      icon: 'fa-map-signs'
    };
  }
});

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
    <div class="max-w-md w-full text-center">
      <!-- 錯誤代碼大數字 (半透明背景感) -->
      <div class="relative mb-8">
        <h1 class="text-[120px] font-black text-[#6B6B5C]/10 leading-none select-none">
          {{ statusCode }}
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <i :class="['fa-solid text-5xl text-[#6B6B5C]', errorInfo.icon]"></i>
        </div>
      </div>

      <!-- 錯誤文字資訊 -->
      <h2 class="text-3xl font-bold text-[#3d3d3d] mb-4">
        {{ errorInfo.title }}
      </h2>
      <p class="text-[#8a8a7e] mb-10 leading-relaxed">
        {{ errorInfo.message }}
      </p>

      <!-- 操作按鈕 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="px-8 py-3 font-bold text-[#6B6B5C] bg-white border-2 border-[#6B6B5C] rounded-xl hover:bg-[#6B6B5C]/5 transition-all duration-300 shadow-sm"
        >
          返回前頁
        </button>
        <button
          @click="goHome"
          class="px-8 py-3 font-bold text-white bg-[#6B6B5C] rounded-xl hover:bg-[#5a5a4a] transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
        >
          回到首頁
        </button>
      </div>

      <!-- 裝飾元素 -->
      <div class="mt-16 opacity-30">
        <img 
          src="/carE_logo_icon_v2_icon16x16.png" 
          alt="carE Logo" 
          class="w-8 h-8 mx-auto grayscale"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 簡單的浮動動畫 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.fa-solid {
  animation: float 4s ease-in-out infinite;
}
</style>
