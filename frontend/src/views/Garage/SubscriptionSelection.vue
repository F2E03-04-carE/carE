<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PricingCard from '@/components/ui/PricingCard.vue';
import PaymentDrawer from '@/components/payment/PaymentDrawer.vue';
import { useSubscriptionStore } from '@/stores/subscription';

const router = useRouter();
const subscriptionStore = useSubscriptionStore();

const pricingPlans = [
  {
    title: '免費試用方案',
    subtitle: '先試用,滿意再升級',
    price: 0,
    priceUnit: '30 天試用',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示 (試用期滿僅剩此功能)'],
    color: 'orange' as const,
    isRecommended: false,
    type: 'trial' as const,
  },
  {
    title: '永久會員方案',
    subtitle: '一次付費,終身使用',
    price: 5555,
    priceUnit: '永久方案',
    features: [
      '完整預約管理功能',
      '評價系統功能',
      '商家資料展示',
      '永久使用權限',
    ],
    color: 'green' as const,
    isRecommended: true,
    type: 'lifetime' as const,
  },
];

const isDrawerOpen = ref(false);
const selectedPlan = ref<typeof pricingPlans[0] | null>(null);

function handlePlanClick(plan: typeof pricingPlans[0]) {
  selectedPlan.value = plan;
  isDrawerOpen.value = true;
}

function closeDrawer() {
  isDrawerOpen.value = false;
  setTimeout(() => {
    selectedPlan.value = null;
  }, 300);
}

async function handlePaymentMethodSelect(paymentMethod: 'oen' | 'linepay' | 'trial') {
  if (!selectedPlan.value) return;

  try {
    if (paymentMethod === 'trial') {
      // 免費試用方案
      await activateFreeTrial();
    } else {
      // 付費方案，使用選擇的付款方式
      await createPayment(selectedPlan.value, paymentMethod);
    }
  } catch (error) {
    console.error('處理失敗:', error);
    alert('操作失敗,請稍後再試');
  }
}

async function activateFreeTrial() {
  const result = await subscriptionStore.activateTrial();

  if (result.success) {
    closeDrawer();
    router.push({
      name: 'SubscriptionSuccess',
      query: { type: 'trial' }
    });
  } else {
    alert(result.message || '啟動試用失敗，請稍後再試');
  }
}

async function createPayment(plan: typeof pricingPlans[0], paymentMethod: 'oen' | 'linepay') {
  const endpoint = paymentMethod === 'oen'
    ? 'http://localhost:3000/api/payment/oen/checkout'
    : 'http://localhost:3000/api/payment/linepay/checkout';

  // 生成唯一的 orderId
  const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: plan.price,
      currency: 'TWD',
      orderId: orderId,
      planType: plan.type,
      successUrl: `${window.location.origin}/garage/subscription/success?type=${plan.type}`,
      failureUrl: `${window.location.origin}/garage/subscription/failure`,
      productDetail: `${plan.title} - carE 平台訂閱`,
    }),
  });

  const data = await response.json();

  // 後端回傳 redirectUrl（跳轉到應援金流頁面）
  if (data.success && data.redirectUrl) {
    window.location.href = data.redirectUrl;
  } else {
    throw new Error(data.message || '建立付款失敗');
  }
}

function goBack() {
  router.back();
}
</script>

<template>
  <main class="relative min-h-screen bg-[#f5f4f0] pt-[60px] sm:pt-[70px]">
    <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div class="text-center mb-12">
        <h3 class="text-[32px] sm:text-[40px] font-bold text-[#4a4a43] mb-4">
          選擇訂閱方案
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingCard
          v-for="(plan, index) in pricingPlans"
          :key="index"
          :title="plan.title"
          :subtitle="plan.subtitle"
          :price="plan.price"
          :price-unit="plan.priceUnit"
          :features="plan.features"
          :color="plan.color"
          :is-recommended="plan.isRecommended"
          variant="clickable"
          @card-click="handlePlanClick(plan)"
        />
      </div>
    </div>
    <PaymentDrawer
      v-if="selectedPlan"
      :is-open="isDrawerOpen"
      :plan="selectedPlan"
      @close="closeDrawer"
      @select-payment="handlePaymentMethodSelect"
    />
  </main>
</template>
