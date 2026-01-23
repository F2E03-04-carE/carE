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
  return planType.value === 'trial' ? 'bg-[#DB914B]' : 'bg-white/20';
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
  router.push('/');
};
</script>

<template>
  <main class="relative h-screen bg-[#f5f4f0] pt-[60px] sm:pt-[70px] overflow-hidden">
    <div class="w-full max-w-[800px] h-full mx-auto px-6 sm:px-12 py-4 sm:py-6 flex flex-col">
      <!-- Success Banner -->
      <div class="bg-gradient-to-r from-[#70c287] to-[#8fd19f] rounded-2xl shadow-lg p-4 sm:p-6 mb-6 text-white flex-shrink-0">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <!-- Success Icon -->
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20">
              <span class="material-symbols-outlined text-white text-[56px] sm:text-[64px]">
                check_circle
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 class="text-[28px] sm:text-[36px] font-bold">
                {{ title }}
              </h1>
              <span
                class="inline-block px-4 py-1.5 text-[14px] font-bold rounded-full"
                :class="badgeColor"
              >
                {{ badge }}
              </span>
            </div>
            <p class="text-[16px] sm:text-[18px] text-white/90 mb-2">
              {{ message }}
            </p>
            <p v-if="trialExpiryInfo" class="text-[14px] text-white/80">
              {{ trialExpiryInfo }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content Card -->
      <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-8 flex-1 overflow-y-auto">
        <!-- Features List -->
        <div class="mb-6">
          <h3 class="text-[20px] font-bold text-[#4a4a43] mb-4 text-center">
            您現在可以使用以下功能：
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="flex items-start gap-2 p-4 bg-[#f5f4f0] rounded-lg">
              <span class="material-symbols-outlined text-[#70c287] text-[28px] flex-shrink-0">
                check_circle
              </span>
              <div>
                <p class="text-[16px] font-semibold text-[#4a4a43]">完整預約管理功能</p>
                <p class="text-[14px] text-[#8a8a7d] mt-1">管理所有預約訂單</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 bg-[#f5f4f0] rounded-lg">
              <span class="material-symbols-outlined text-[#70c287] text-[28px] flex-shrink-0">
                check_circle
              </span>
              <div>
                <p class="text-[16px] font-semibold text-[#4a4a43]">評價系統功能</p>
                <p class="text-[14px] text-[#8a8a7d] mt-1">回覆顧客評價</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 bg-[#f5f4f0] rounded-lg">
              <span class="material-symbols-outlined text-[#70c287] text-[28px] flex-shrink-0">
                check_circle
              </span>
              <div>
                <p class="text-[16px] font-semibold text-[#4a4a43]">商家資料展示</p>
                <p class="text-[14px] text-[#8a8a7d] mt-1">完整展示商家資訊</p>
              </div>
            </div>
            <div v-if="planType === 'lifetime'" class="flex items-start gap-3 p-4 bg-[#f5f4f0] rounded-lg">
              <span class="material-symbols-outlined text-[#70c287] text-[28px] flex-shrink-0">
                check_circle
              </span>
              <div>
                <p class="text-[16px] font-semibold text-[#4a4a43]">永久使用權限</p>
                <p class="text-[14px] text-[#8a8a7d] mt-1">終身享有所有功能</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Countdown -->
        <div class="mb-6 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div class="flex items-center justify-center gap-2 text-[16px] text-blue-900">
            <span class="material-symbols-outlined text-[20px] animate-spin">
              autorenew
            </span>
            <span>
              將在 <span class="font-bold text-blue-600">{{ countdown }}</span> 秒後自動跳轉
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <button
          @click="goToDashboard"
          class="w-full px-6 py-3 text-[14px] font-bold text-white bg-gradient-to-r from-[#6B6B5C] to-[#5a5a4a] hover:from-[#5a5a4a] hover:to-[#4a4a3a] rounded-xl transition-all shadow-md"
        >
          立即前往後台
        </button>
      </div>
    </div>
  </main>
</template>
