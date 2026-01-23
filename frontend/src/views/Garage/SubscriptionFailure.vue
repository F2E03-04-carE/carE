<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const errorMessage = computed(() => {
  const msg = route.query.message as string;
  return msg || '付款過程發生問題，請稍後再試';
});

const orderId = computed(() => route.query.orderId as string || null);

const isRetrying = ref(false);

const goBackToSelection = () => {
  router.push({ name: 'SubscriptionSelection' });
};
onMounted(() => {
  console.error('Payment failed:', {
    message: errorMessage.value,
    orderId: orderId.value,
    timestamp: new Date().toISOString(),
  });
});
</script>

<template>
  <main class="relative h-screen bg-[#f5f4f0] pt-[60px] sm:pt-[70px] overflow-hidden">
    <div class="w-full max-w-[800px] h-full mx-auto px-6 sm:px-12 py-4 sm:py-6 flex flex-col">
      <!-- Failure Banner -->
      <div class="bg-gradient-to-r from-red-500 to-red-400 rounded-2xl shadow-lg p-4 sm:p-6 mb-3 text-white flex-shrink-0">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20">
              <span class="material-symbols-outlined text-white text-[48px] sm:text-[56px]">
                cancel
              </span>
            </div>
          </div>

          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-[24px] sm:text-[30px] font-bold mb-2">
              付款失敗
            </h1>
            <p class="text-[14px] sm:text-[16px] text-white/90">
              {{ errorMessage }}
            </p>
            <p v-if="orderId" class="text-[12px] sm:text-[13px] text-white/80 mt-1">
              訂單編號：{{ orderId }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-1 overflow-y-auto">
        <!-- Possible Reasons -->
        <div class="mb-6">
          <h3 class="text-[18px] font-bold text-[#4a4a43] mb-4 text-center">
            可能的原因：
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span class="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0">
                error
              </span>
              <div>
                <p class="text-[14px] font-semibold text-[#4a4a43]">信用卡資訊錯誤</p>
                <p class="text-[12px] text-[#8a8a7d]">請檢查卡號、有效期限或安全碼</p>
              </div>
            </div>
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span class="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0">
                error
              </span>
              <div>
                <p class="text-[14px] font-semibold text-[#4a4a43]">信用卡額度不足</p>
                <p class="text-[12px] text-[#8a8a7d]">請確認可用額度是否充足</p>
              </div>
            </div>
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span class="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0">
                error
              </span>
              <div>
                <p class="text-[14px] font-semibold text-[#4a4a43]">網路連線問題</p>
                <p class="text-[12px] text-[#8a8a7d]">請檢查網路狀況後重試</p>
              </div>
            </div>
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span class="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0">
                error
              </span>
              <div>
                <p class="text-[14px] font-semibold text-[#4a4a43]">銀行端驗證失敗</p>
                <p class="text-[12px] text-[#8a8a7d]">3D驗證或簡訊認證失敗</p>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-4 mb-5">
          <button
            @click="goBackToSelection"
            :disabled="isRetrying"
            class="w-full px-6 py-4 text-[16px] font-bold text-white bg-gradient-to-r from-[#6B6B5C] to-[#5a5a4a] hover:from-[#5a5a4a] hover:to-[#4a4a3a] rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isRetrying" class="flex items-center justify-center">
              <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              處理中...
            </span>
            <span v-else>重新選擇方案</span>
          </button>
        </div>

        <div class="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-blue-600 text-[28px] flex-shrink-0">
              support_agent
            </span>
            <div class="flex-1">
              <p class="text-[13px] text-blue-800 mb-2">
                如果持續遇到問題，請聯絡我們的客服團隊，我們將協助您完成訂閱。
              </p>
              <div class="text-[13px] text-blue-900">
                <strong>Email：</strong><a href="mailto:info@care.com" class="hover:text-[#6B6B5C] underline">info@care.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
