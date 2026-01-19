<script setup lang="ts">
// 假資料
const workshopInfo = {
  name: '我的維修廠',
  phone: '02-12345678',
  address: '台北市信義區信義路五段7號',
  taxId: '12345678',
  description: '我們提供專業的維修服務，擁有豐富的經驗和技術。',
  brands: ['Toyota', 'Honda'],
  skills: ['定期保養'],
};

// 標籤目前寫死，未盡舉，先渲染確認布局
const brandOptions = ['Toyota', 'Honda', 'Nissan', 'Ford', 'BMW', 'Benz'];
const skillOptions = ['定期保養', '引擎維修', '板金噴漆', '輪胎更換', '冷氣維修'];
</script>

<template>
  <!-- 廠房名稱 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房名稱</label>
    <input
      :value="workshopInfo.name"
      class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm"
    />
  </div>
  <!-- 電話 / 地址 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">聯絡電話</label>
      <input
        :value="workshopInfo.phone"
        class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房地址</label>
      <input
        :value="workshopInfo.address"
        class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm"
      />
    </div>
  </div>
  <!-- 統一編號 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">統一編號</label>
    <input
      :value="workshopInfo.taxId"
      class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm"
    />
  </div>
  <!-- 簡介 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房簡介</label>
    <textarea
      rows="4"
      :value="workshopInfo.description"
      class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm"
    ></textarea>
    <p class="text-xs mt-2 text-[#8a8a7d]">建議輸入您的專業特色、服務項目、經驗年資等資訊</p>
  </div>
  <!-- 車子品牌 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">服務品牌</label>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="brand in brandOptions"
        :key="brand"
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition cursor-pointer hover:opacity-80',
          workshopInfo.brands.includes(brand)
            ? 'bg-[#6b6b5a] text-white border-[#6b6b5a]'
            : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
        ]"
      >
        {{ brand }}
      </span>
    </div>
  </div>
  <!-- 擅長維修項目 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">擅長維修項目</label>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="skill in skillOptions"
        :key="skill"
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition cursor-pointer hover:opacity-80',
          workshopInfo.skills.includes(skill)
            ? 'bg-[#8b7d6b] text-white border-[#8b7d6b]'
            : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
        ]"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>
