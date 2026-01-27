<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import TwCitySelector from 'tw-city-selector';
import brandsData from '@/data/brands.json';
import servicesData from '@/data/services.json';

// 品牌選項 - 使用 brand_zh 作為 value（與資料庫匹配）
const brandOptions = computed(() =>
  brandsData.map((b) => ({
    value: b.brand_zh,
    label: `${b.brand_en} ${b.brand_zh}`,
  }))
);

// 服務選項 - 使用 name 作為 value（與資料庫匹配）
const serviceOptions = computed(() =>
  servicesData.map((s) => ({
    value: s.name,
    label: s.name,
  }))
);

const formRef = ref<HTMLFormElement>();
const router = useRouter();
const selectedCity = ref('');
const selectedDistrict = ref('');
const selectedBrand = ref('');
const selectedService = ref('');

onMounted(() => {
  if (formRef.value) {
    try {
      new TwCitySelector({
        el: '.city-selector-container',
        elCounty: '.county-select',
        elDistrict: '.district-select',
        hasZipcode: false,
        standardWords: true,
        onChange: (data: any) => {
          selectedCity.value = data.county;
          selectedDistrict.value = data.district;
        },
      } as any);
    } catch (error) {
      console.error('縣市選擇器初始化失敗:', error);
    }
  }
});

const handleSubmit = (e: Event) => {
  e.preventDefault();

  const citySelect = document.querySelector('.county-select') as HTMLSelectElement;
  const districtSelect = document.querySelector('.district-select') as HTMLSelectElement;

  const city = citySelect?.value || '';
  const district = districtSelect?.value || '';

  const searchParams: Record<string, string> = {};

  // 只有選擇了才加入搜尋參數
  if (city) {
    searchParams.city = city;
  }
  if (district) {
    searchParams.district = district;
  }
  if (selectedBrand.value) {
    searchParams.brand = selectedBrand.value;
  }
  if (selectedService.value) {
    searchParams.service = selectedService.value;
  }

  router.push({
    name: 'SearchResults',
    query: searchParams,
  });
};
</script>

<template>
  <form
    ref="formRef"
    @submit="handleSubmit"
    class="city-selector-container flex flex-col xl:flex-row xl:items-end gap-4 xl:gap-3 w-full max-w-[1400px] mx-auto p-4 bg-[#fff] shadow-md rounded-[8px] font-bold"
  >
    <!-- 縣市選擇 -->
    <div class="flex-1 min-w-0">
      <label
        for="city"
        class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
      >
        <span class="material-symbols-outlined mr-2">location_city</span>
        縣市
      </label>
      <select
        class="county-select block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
        id="city"
        name="city"
      ></select>
    </div>

    <!-- 行政區選擇 -->
    <div class="flex-1 min-w-0">
      <label
        for="location"
        class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
      >
        <span class="material-symbols-outlined mr-2">location_on</span>
        行政區
      </label>
      <select
        class="district-select block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
        id="location"
        name="location"
      ></select>
    </div>

    <!-- 車子品牌選擇 -->
    <div class="flex-1 min-w-0">
      <label
        for="brand"
        class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
      >
        <span class="material-symbols-outlined mr-2">directions_car</span>
        車子品牌
      </label>
      <select
        v-model="selectedBrand"
        id="brand"
        class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
      >
        <option value="">全部品牌</option>
        <option v-for="option in brandOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- 維修項目選擇 -->
    <div class="flex-1 min-w-0">
      <label
        for="service"
        class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
      >
        <span class="material-symbols-outlined mr-2">build</span>
        維修項目
      </label>
      <select
        v-model="selectedService"
        id="service"
        class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
      >
        <option value="">全部項目</option>
        <option v-for="option in serviceOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- 搜尋按鈕 -->
    <button
      type="submit"
      class="w-full xl:w-auto xl:flex-shrink-0 px-8 py-[11px] xl:mt-[32px] flex flex-row justify-center items-center text-[#fff] bg-[#6b6b5a] rounded cursor-pointer hover:bg-[#5a5a4a] transition-colors whitespace-nowrap"
    >
      <span class="material-symbols-outlined mr-1">search</span>
      搜尋
    </button>
  </form>
</template>
