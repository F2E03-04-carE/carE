<script setup lang="ts">
// 方案假資料，和 JoinGarage.vue 對齊文案內容
const plans = [
  {
    id: 'trial',
    title: '免費試用方案',
    subtitle: '先試用，滿意再升級',
    price: 'NT$ 0',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示 （試用期滿僅剩此功能）'],
    buttonText: '選擇此方案',
    borderColor: 'border-[#e0dfd6] hover:border-[#6b6b5a]',
    buttonClass: 'bg-[#8b7d6b] hover:bg-[#7a6d5b]',
    tag: null,
  },
  {
    id: 'paid',
    title: '永久會員方案',
    subtitle: '一次付費，終身使用',
    price: 'NT$ 5,555',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示', '永久使用權限'],
    buttonText: '選擇此方案',
    borderColor: 'border-[#6b6b5a]',
    buttonClass: 'bg-[#6b6b5a] hover:bg-[#57574a]',
    tag: '一次性買斷',
  },
];
</script>

<template>
  <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm mt-6">
    <h2 class="text-2xl font-semibold text-[#4a4a43] mb-6">訂閱付費方案</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="border rounded-2xl p-6 flex flex-col items-center text-center transition relative bg-white hover:shadow-md"
        :class="plan.borderColor"
      >
        <div
          v-if="plan.tag"
          class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6b6b5a] text-white text-xs font-bold px-3 py-1 rounded-full"
        >
          {{ plan.tag }}
        </div>
        <h3 class="text-xl font-bold text-[#6b6b5a] mb-2">{{ plan.title }}</h3>
        <p class="text-[#4a4a43] font-medium mb-2">{{ plan.subtitle }}</p>
        <p class="text-2xl font-bold text-[#4a4a43] mb-4">{{ plan.price }}</p>
        <ul class="text-[#4a4a43] text-sm space-y-2 mb-6">
          <li v-for="(feature, idx) in plan.features" :key="idx">{{ feature }}</li>
        </ul>
        <button
          type="button"
          class="mt-auto px-6 py-2 rounded-2xl text-white font-medium transition"
          :class="plan.buttonClass"
        >
          {{ plan.buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>
