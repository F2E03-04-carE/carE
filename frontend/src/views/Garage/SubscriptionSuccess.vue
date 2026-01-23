<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSubscriptionStore } from '@/stores/subscription';

const router = useRouter();
const route = useRoute();
const subscriptionStore = useSubscriptionStore();

const planType = computed(() => route.query.type as 'trial' | 'lifetime');

const title = computed(() => {
  return planType.value === 'trial'
    ? '試用方案開通成功！'
    : '永久方案購買成功！';
});

const message = computed(() => {
  return planType.value === 'trial'
    ? '您已成功開通 30 天免費試用，現在可以開始使用所有功能'
    : '您已成功購買永久會員方案，享有終身使用權限';
});

const badge = computed(() => {
  return planType.value === 'trial' ? '試用會員' : '永久會員';
});

const badgeColor = computed(() => {
  return planType.value === 'trial' ? 'bg-[#DB914B]' : 'bg-[#70c287]';
});

const trialExpiryInfo = computed(() => {
  if (planType.value !== 'trial' || !subscriptionStore.subscription?.trialExpiryDate) {
    return null;
  }

  const expiryDate = new Date(subscriptionStore.subscription.trialExpiryDate);
  const formatted = expiryDate.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `試用期限至 ${formatted}`;
});

const countdown = ref(5);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(countdownTimer!);
      // TODO: 跳轉到商家後台首頁
      router.push('/');
    }
  }, 1000);
};

onMounted(() => {

  subscriptionStore.fetchSubscription();
  startCountdown();
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

const goToDashboard = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  // TODO: 跳轉到商家後台首頁
  router.push('/');
};
</script>

<template>
  <main class="relative min-h-screen bg-[#f5f4f0] pt-[60px] sm:pt-[70px]">
    <div class="w-full max-w-[600px] mx-auto px-4 sm:px-6 py-12">
      <div class="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
        <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-[#70c287]/20">
          <span class="material-symbols-outlined text-[#70c287] text-[64px]">
            check_circle
          </span>
        </div>
        <h1 class="text-[28px] sm:text-[32px] font-bold text-[#4a4a43] mb-4">
          {{ title }}
        </h1>
        <div class="inline-block mb-6">
          <span
            class="px-4 py-2 text-[14px] font-bold text-white rounded-full"
            :class="badgeColor"
          >
            {{ badge }}
          </span>
        </div>
        <p class="text-[16px] sm:text-[18px] text-[#8a8a7d] mb-4">
          {{ message }}
        </p>

        <p v-if="trialExpiryInfo" class="text-[14px] text-[#8a8a7d] mb-8">
          {{ trialExpiryInfo }}
        </p>

        <div class="mb-8 p-6 bg-[#f5f4f0] rounded-lg text-left">
          <h3 class="text-[16px] font-bold text-[#4a4a43] mb-4 text-center">
            您現在可以使用以下功能：
          </h3>
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="material-symbols-outlined text-[#70c287] text-[24px] mr-3">
                check_circle
              </span>
              <span class="text-[14px] text-[#4a4a43]">完整預約管理功能</span>
            </li>
            <li class="flex items-start">
              <span class="material-symbols-outlined text-[#70c287] text-[24px] mr-3">
                check_circle
              </span>
              <span class="text-[14px] text-[#4a4a43]">評價系統功能</span>
            </li>
            <li class="flex items-start">
              <span class="material-symbols-outlined text-[#70c287] text-[24px] mr-3">
                check_circle
              </span>
              <span class="text-[14px] text-[#4a4a43]">商家資料展示</span>
            </li>
            <li v-if="planType === 'lifetime'" class="flex items-start">
              <span class="material-symbols-outlined text-[#70c287] text-[24px] mr-3">
                check_circle
              </span>
              <span class="text-[14px] text-[#4a4a43]">永久使用權限</span>
            </li>
          </ul>
        </div>

        <!-- Countdown -->
        <div class="mb-8 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center justify-center gap-2 text-[16px] text-blue-900">
            <span class="material-symbols-outlined text-[20px] animate-spin">
              autorenew
            </span>
            <span>
              將在 <span class="font-bold text-blue-600">{{ countdown }}</span> 秒後自動跳轉到首頁
            </span>
          </div>
        </div>

        <button
          @click="goToDashboard"
          class="w-full px-6 py-4 text-[18px] font-bold text-white bg-gradient-to-r from-[#6B6B5C] to-[#5a5a4a] hover:from-[#5a5a4a] hover:to-[#4a4a3a] rounded-lg transition-all shadow-md"
        >
          立即前往後台
        </button>
      </div>
    </div>
  </main>
</template>
