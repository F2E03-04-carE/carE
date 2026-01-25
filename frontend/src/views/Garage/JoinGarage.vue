<script setup lang="ts">
import { useRouter } from 'vue-router';
import PricingCard from '@/components/ui/PricingCard.vue';

const router = useRouter();

const pricingPlans = [
  {
    title: '免費試用方案',
    subtitle: '先試用，滿意再升級',
    price: 0,
    priceUnit: '30 天試用',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示 （試用期滿僅剩此功能）'],
    buttonText: '開始免費試用',
    color: 'orange' as const,
    isRecommended: false,
  },
  {
    title: '永久會員方案',
    subtitle: '一次付費，終身使用',
    price: 5555,
    priceUnit: '永久方案',
    features: [
      '完整預約管理功能',
      '評價系統功能',
      '商家資料展示',
      '永久使用權限',
    ],
    buttonText: '立即購買',
    color: 'green' as const,
    isRecommended: true,
  },
];

const navigateToOnboarding = () => {
  router.push('/garage/onboarding');
};
</script>

<template>
  <div class="relative">
    <section
      class="text-center bg-[url(https://picsum.photos/id/133/1200/900)] bg-no-repeat bg-center bg-cover"
    >
      <div
        class="flex flex-col justify-center items-center py-20 sm:py-32 bg-[#f2f1eedd] backdrop-blur-sm"
      >
        <h1 class="text-[32px] sm:text-[42px] lg:text-[48px] text-[#4a4a43] font-black mb-4">
          讓更多車主找到您的專業
        </h1>
        <h2 class="text-[18px] sm:text-[22px] lg:text-[26px] text-[#4a4a43] font-bold mb-3">
          透明化經營，提升服務品質
        </h2>
        <p class="text-[16px] sm:text-[18px] text-[#8a8a7d] mb-8 max-w-2xl px-4">
          加入 carE 平台，接觸更多潛在客戶，建立專業形象，輕鬆管理預約與評價
        </p>
        <button
          @click="navigateToOnboarding"
          class="px-8 py-4 text-[18px] text-white font-bold bg-[#6b6b5a] hover:bg-[#5a5a4a] rounded-lg transition-colors cursor-pointer"
        >
          立即加入
        </button>
      </div>
    </section>

    <section class="max-w-[1440px] mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-[#4a4a43]">
      <h3 class="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-center mb-4">
        為什麼選擇 carE？
      </h3>
      <p class="text-[16px] sm:text-[18px] text-[#8a8a7d] text-center mb-12 max-w-3xl mx-auto">
        我們提供完整的數位工具，幫助您的維修廠提升效率、增加收入
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="flex flex-col items-center text-center p-6 bg-[#f5f4f0] rounded-lg">
          <span class="material-symbols-outlined text-[#6b6b5a] text-[56px] mb-4">
            trending_up
          </span>
          <h4 class="text-[20px] sm:text-[22px] font-bold mb-3">增加曝光度</h4>
          <p class="text-[14px] sm:text-[16px] text-[#8a8a7d]">
            每月數千位車主在平台搜尋維修廠，讓您的服務被更多人看見
          </p>
        </div>

        <div class="flex flex-col items-center text-center p-6 bg-[#f5f4f0] rounded-lg">
          <span class="material-symbols-outlined text-[#6b6b5a] text-[56px] mb-4">
            target
          </span>
          <h4 class="text-[20px] sm:text-[22px] font-bold mb-3">精準配對</h4>
          <p class="text-[14px] sm:text-[16px] text-[#8a8a7d]">
            依據車款、維修項目自動媒合，只接觸真正需要您服務的客戶
          </p>
        </div>

        <div class="flex flex-col items-center text-center p-6 bg-[#f5f4f0] rounded-lg">
          <span class="material-symbols-outlined text-[#6b6b5a] text-[56px] mb-4">
            calendar_month
          </span>
          <h4 class="text-[20px] sm:text-[22px] font-bold mb-3">線上預約管理</h4>
          <p class="text-[14px] sm:text-[16px] text-[#8a8a7d]">
            自動化預約系統，減少電話溝通時間，提升工作效率
          </p>
        </div>

        <div class="flex flex-col items-center text-center p-6 bg-[#f5f4f0] rounded-lg">
          <span class="material-symbols-outlined text-[#6b6b5a] text-[56px] mb-4">
            star
          </span>
          <h4 class="text-[20px] sm:text-[22px] font-bold mb-3">透明評價系統</h4>
          <p class="text-[14px] sm:text-[16px] text-[#8a8a7d]">
            真實客戶評價，建立信任感，提升品牌形象與競爭力
          </p>
        </div>
      </div>
    </section>

    <section class="max-w-[1440px] mx-auto py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
      <h3 class="text-[28px] sm:text-[32px] lg:text-[36px] text-[#4a4a43] font-bold text-center mb-4">
        選擇適合您的方案
      </h3>
      <p class="text-[16px] sm:text-[18px] text-[#8a8a7d] text-center mb-12 max-w-3xl mx-auto">
        兩種方案，讓您的維修廠輕鬆上線
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard
          v-for="(plan, index) in pricingPlans"
          :key="index"
          :title="plan.title"
          :subtitle="plan.subtitle"
          :price="plan.price"
          :price-unit="plan.priceUnit"
          :features="plan.features"
          :button-text="plan.buttonText"
          :color="plan.color"
          :is-recommended="plan.isRecommended"
          @button-click="navigateToOnboarding"
        />
      </div>
    </section>

    <section class="bg-[#f5f4f0] py-16 sm:py-20">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 class="text-[28px] sm:text-[32px] lg:text-[36px] text-[#4a4a43] font-bold mb-4">
          準備好開始了嗎？
        </h3>
        <p class="text-[16px] sm:text-[18px] text-[#8a8a7d] mb-8 max-w-2xl mx-auto">
          立即註冊，三分鐘完成設定，開始接收預約
        </p>
        <button
          @click="navigateToOnboarding"
          class="inline-block px-10 py-4 text-[18px] text-white font-bold bg-[#6b6b5a] hover:bg-[#5a5a4a] rounded-lg transition-colors cursor-pointer"
        >
          立即開始
        </button>
        <p class="mt-6 text-[14px] text-[#8a8a7d]">
          有任何問題？
          <a href="#contact" class="text-[#6b6b5a] hover:underline font-bold">聯絡我們</a>
        </p>
      </div>
    </section>
  </div>
</template>

