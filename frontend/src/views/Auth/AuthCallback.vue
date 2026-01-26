<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
  const redirect = localStorage.getItem('postLoginRedirect') || '/';
  const clearRedirect = () => localStorage.removeItem('postLoginRedirect');

  // 先訂閱 auth state change（v2 推薦做法）
  const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
    // event 可能是 SIGNED_IN / TOKEN_REFRESHED 等
    if (session?.user) {
      try {
        const userMetadata = session.user.user_metadata || {};
        const hasPhone = userMetadata.phone && userMetadata.phone.trim() !== '';

        // ✅ 清掉 hash（避免 router warning / selector 問題）
        const url = new URL(window.location.href);
        window.history.replaceState({}, document.title, url.origin + url.pathname);

        if (!hasPhone) {
          router.replace(
            `/member/profile?firstLogin=true&redirect=${encodeURIComponent(redirect)}`
          );
          return;
        }

        clearRedirect();
        router.replace(redirect);
      } finally {
        loading.value = false;
        sub.subscription.unsubscribe();
      }
    }
  });

  // 再補一個保險：如果 session 其實已經有了，就直接走
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    const url = new URL(window.location.href);
    window.history.replaceState({}, document.title, url.origin + url.pathname);

    const userMetadata = data.session.user.user_metadata || {};
    const hasPhone = userMetadata.phone && userMetadata.phone.trim() !== '';

    if (!hasPhone) {
      loading.value = false;
      router.replace(`/member/profile?firstLogin=true&redirect=${encodeURIComponent(redirect)}`);
      sub.subscription.unsubscribe();
      return;
    }

    clearRedirect();
    loading.value = false;
    router.replace(redirect);
    sub.subscription.unsubscribe();
    return;
  }

  // 最後保險：等 10 秒還是沒 session 就顯示錯誤
  setTimeout(async () => {
    const again = await supabase.auth.getSession();
    if (!again.data.session?.user) {
      error.value = '無法取得用戶資訊';
      loading.value = false;
      sub.subscription.unsubscribe();
      // 你要自動回首頁也可以：
      // setTimeout(() => router.push('/'), 10000);
    }
  }, 10000);
});
</script>


<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <div v-if="loading" class="py-8">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#6B6B5C]/10">
          <i class="text-2xl fa-solid fa-spinner fa-spin text-[#6B6B5C]" aria-hidden="true"></i>
        </div>
        <h2 class="text-2xl font-medium text-[#3d3d3d] mb-2">驗證中...</h2>
        <p class="text-[#8a8a7e]">請稍候，我們正在驗證您的身份</p>
      </div>

      <div v-else-if="error" class="py-8">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
          <i class="text-2xl fa-solid fa-exclamation-triangle text-red-500" aria-hidden="true"></i>
        </div>
        <h2 class="text-2xl font-medium text-[#3d3d3d] mb-2">登入失敗</h2>
        <p class="text-[#8a8a7e] mb-6">{{ error }}</p>
        <button
          @click="router.push('/')"
          class="w-full px-6 py-2.5 font-bold text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#5a5a4a] shadow-md"
        >
          返回首頁
        </button>
      </div>

      <div v-else class="py-8">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
          <i class="text-2xl fa-solid fa-check text-green-500" aria-hidden="true"></i>
        </div>
        <h2 class="text-2xl font-medium text-[#3d3d3d] mb-2">登入成功</h2>
        <p class="text-[#8a8a7e]">正在為您跳轉...</p>
      </div>
    </div>
  </div>
</template>
