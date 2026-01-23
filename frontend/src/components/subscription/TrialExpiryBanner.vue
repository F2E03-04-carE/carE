<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSubscriptionStore } from '@/stores/subscription';

const router = useRouter();
const subscriptionStore = useSubscriptionStore();
const bannerStyle = computed(() => {
  const days = subscriptionStore.daysRemaining;

  if (days === null) return null;

  if (days === 0) {
    return {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-900',
      buttonBg: 'bg-red-600 hover:bg-red-700',
    };
  } else if (days <= 3) {
    return {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      text: 'text-orange-900',
      buttonBg: 'bg-orange-600 hover:bg-orange-700',
    };
  } else if (days <= 7) {
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-900',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
    };
  }

  return null;
});

const message = computed(() => {
  const days = subscriptionStore.daysRemaining;

  if (days === null) return '';

  if (days === 0) {
    return '您的試用期已到期，目前僅保留「商家資料展示」功能。';
  } else if (days === 1) {
    return '您的試用期即將於明天到期！';
  } else {
    return `您的試用期還剩 ${days} 天。`;
  }
});

const shouldShowBanner = computed(() => {
  return subscriptionStore.isTrial && bannerStyle.value !== null;
});

function goToUpgrade() {
  router.push({ name: 'SubscriptionSelection' });
}
</script>

<template>
  <div
    v-if="shouldShowBanner"
    class="border-2 rounded-lg p-4 mb-6"
    :class="[bannerStyle?.bg, bannerStyle?.border]"
  >
    <div class="flex items-start gap-3">
      <span
        class="material-symbols-outlined text-2xl mt-0.5"
        :class="bannerStyle?.icon"
      >
        {{ subscriptionStore.isExpired ? 'error' : 'schedule' }}
      </span>

      <div class="flex-1">
        <p class="font-semibold mb-1" :class="bannerStyle?.text">
          {{ subscriptionStore.isExpired ? '試用期已到期' : '試用期即將到期' }}
        </p>
        <p class="text-sm mb-3" :class="bannerStyle?.text">
          {{ message }}
          升級至永久會員，享有完整功能！
        </p>

        <button
          @click="goToUpgrade"
          class="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
          :class="bannerStyle?.buttonBg"
        >
          立即升級
        </button>
      </div>

      <div
        v-if="!subscriptionStore.isExpired"
        class="flex flex-col items-center justify-center min-w-[64px] h-16 rounded-lg bg-white/50"
      >
        <span class="text-2xl font-bold" :class="bannerStyle?.text">
          {{ subscriptionStore.daysRemaining }}
        </span>
        <span class="text-xs" :class="bannerStyle?.text">
          天
        </span>
      </div>
    </div>
  </div>
</template>
