<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
  const redirect = localStorage.getItem('postLoginRedirect') || '/';
  const clearRedirect = () => localStorage.removeItem('postLoginRedirect');

  try {
    // ✅ 1) 先嘗試直接拿 session
    let { data: { session }, error: authError } = await supabase.auth.getSession();

    // ✅ 2) 如果 session 沒有、而且網址有 code（PKCE / magic link 常見），就交換成 session
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (!session && code) {
      const exchanged = await supabase.auth.exchangeCodeForSession(code);
      session = exchanged.data.session;
      authError = exchanged.error;
      // 清掉 code，避免重複交換
      window.history.replaceState({}, document.title, url.origin + url.pathname);
    }

    if (authError) throw authError;
    if (!session?.user) throw new Error('NO_SESSION_USER');

    // ...下面保留你原本 hasPhone 邏輯
    const userMetadata = session.user.user_metadata || {};
    const hasPhone = userMetadata.phone && userMetadata.phone.trim() !== '';

    if (!hasPhone) {
      router.replace(`/member/profile?firstLogin=true&redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    clearRedirect();
    router.replace(redirect);
  } catch (e) {
    console.error('Callback failed:', e, window.location.href);
    error.value = '無法取得用戶資訊';
    setTimeout(() => router.push('/'), 3000);
  } finally {
    loading.value = false;
  }
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
