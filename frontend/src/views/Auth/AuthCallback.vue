<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError) {
      error.value = '登入驗證失敗，請重試';
      console.error('Auth callback error:', authError);
      setTimeout(() => {
        router.push('/');
      }, 3000);
      return;
    }

    if (!session?.user) {
      error.value = '無法取得用戶資訊';
      setTimeout(() => {
        router.push('/');
      }, 3000);
      return;
    }

    // 檢查用戶資料完整度
    const userMetadata = session.user.user_metadata || {};
    const hasPhone = userMetadata.phone && userMetadata.phone.trim() !== '';

    // 如果沒有手機號碼，導向個人資料頁面完善資料
    if (!hasPhone) {
      router.push('/member/profile?firstLogin=true');
      return;
    }

    // 資料完整，導向首頁
    router.push('/');
  } catch (err) {
    error.value = '發生未預期的錯誤';
    console.error('Unexpected error:', err);
    setTimeout(() => {
      router.push('/');
    }, 3000);
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


