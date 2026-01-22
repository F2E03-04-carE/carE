<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PricingCard from '@/components/ui/PricingCard.vue';
import PaymentDrawer from '@/components/payment/PaymentDrawer.vue';

const router = useRouter();

// 方案資料
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

// Drawer 狀態
const isDrawerOpen = ref(false);
const selectedPlan = ref<typeof pricingPlans[0] | null>(null);

// 點擊方案卡片
function handlePlanClick(plan: typeof pricingPlans[0]) {
  selectedPlan.value = plan;
  isDrawerOpen.value = true;
}

// 關閉 Drawer
function closeDrawer() {
  isDrawerOpen.value = false;
  setTimeout(() => {
    selectedPlan.value = null;
  }, 300);
}

// 處理付款方式選擇
async function handlePaymentMethodSelect(paymentMethod: 'oen' | 'linepay') {
  if (!selectedPlan.value) return;

  try {
    if (selectedPlan.value.type === 'trial') {
      // 免費試用:直接開通
      await activateFreeTrial();
    } else {
      // 付費方案:根據選擇的付款方式處理
      await createPayment(selectedPlan.value, paymentMethod);
    }
  } catch (error) {
    console.error('處理失敗:', error);
    alert('操作失敗,請稍後再試');
  }
}

// 開通免費試用
async function activateFreeTrial() {
  // TODO: 呼叫後端 API
  // const response = await fetch('/api/trial/activate', { method: 'POST' });

  await new Promise(resolve => setTimeout(resolve, 1000));

  closeDrawer();
  router.push({
    name: 'SubscriptionSuccess',
    query: { type: 'trial' }
  });
}

// 建立付款
async function createPayment(plan: typeof pricingPlans[0], paymentMethod: 'oen' | 'linepay') {
  // TODO: 呼叫不同的金流 API
  const endpoint = paymentMethod === 'oen'
    ? '/api/payment/oen/create-checkout'
    : '/api/payment/linepay/create-checkout';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: plan.price,
      orderId: `ORDER-${Date.now()}`,
      description: `${plan.title} - carE 平台訂閱`,
      successUrl: `${window.location.origin}/garage/subscription/success?type=lifetime`,
      failureUrl: `${window.location.origin}/garage/subscription/failure`,
    }),
  });

  const data = await response.json();

  if (data.success && data.checkoutUrl) {
    // 跳轉到金流結帳頁面
    window.location.href = data.checkoutUrl;
  } else {
    throw new Error(data.message || '建立付款失敗');
  }
}

// 返回上一步
function goBack() {
  router.back();
}
</script>

<template>
  <main class="relative min-h-screen bg-[#f5f4f0] pt-[60px] sm:pt-[70px]">
    <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-[32px] sm:text-[40px] font-bold text-[#4a4a43] mb-4">
          選擇訂閱方案
        </h1>
        <p class="text-[16px] sm:text-[18px] text-[#8a8a7d]">
          選擇最適合您的方案，開始使用 carE 平台
        </p>
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

    <!-- PaymentDrawer Component -->
    <PaymentDrawer
      v-if="selectedPlan"
      :is-open="isDrawerOpen"
      :plan="selectedPlan"
      @close="closeDrawer"
      @select-payment="handlePaymentMethodSelect"
    />
  </main>
</template>
