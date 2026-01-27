<script setup lang="ts">
import { computed } from 'vue';
import emptyStar from '@/assets/icons/emptyStar.svg';
import filledStar from '@/assets/icons/fillStar.svg';

interface Props {
  shop: {
    image?: string;
    id: number;
    name: string;
    score: number;
    distance: number;
    reviewCount: number;
    brands: string[];
    services: string[];
    address: string;
    city: string;
    district: string;
  };
}
const props = defineProps<Props>();

const emit = defineEmits<{
  viewDetail: [shopId: number];
}>();

// 限制顯示的品牌數量（最多3個）
const displayedBrands = computed(() => props.shop.brands.slice(0, 3));

// 限制顯示的服務數量（最多3個）
const displayedServices = computed(() => props.shop.services.slice(0, 3));

const handleViewDetail = () => {
  emit('viewDetail', props.shop.id);
};

// Tag 樣式
const getTagClass = (variant: 'filled' | 'outlined') => {
  const baseClass = 'inline-block px-3 py-1 text-[14px] rounded-full';
  if (variant === 'filled') {
    return `${baseClass} bg-[#6B6B5C] text-white`;
  } else {
    return `${baseClass} bg-[#F5F2EE] text-[#6B6B5C] border border-[#6B6B5C]`;
  }
};
</script>

<template>
  <div class="border border-[#D4CEC4] rounded-[5px] overflow-hidden hover:shadow-lg duration-300 bg-white">
    <img
      :src="shop.image || 'https://picsum.photos/300/200?random=1'"
      :alt="`${shop.name}環境圖片`"
      class="w-full aspect-[3/2] object-cover"
    />
    <div class="px-5 py-3 text-[#4a4a43]">
      <!-- 保養廠名稱 -->
      <h3 class="my-2 font-semibold text-lg truncate" :title="shop.name">{{ shop.name }}</h3>

      <!-- 評分和評論數 -->
      <div class="flex items-center gap-2 my-2">
        <div class="flex items-center">
          <img
            v-for="i in 5"
            :key="i"
            :src="i <= shop.score ? filledStar : emptyStar"
            alt="star"
            class="w-4 h-4"
          />
        </div>
        <span class="text-[#8a8a7d] text-xs">({{ shop.reviewCount }})</span>
      </div>

      <!-- 距離 -->
      <div class="flex items-center gap-1 text-sm my-1">
        <span class="material-symbols-outlined text-base">location_on</span>
        <span>{{ shop.distance }} 公里</span>
      </div>

      <!-- 地址 -->
      <div class="flex items-start gap-1 text-xs text-[#6B6B5C] my-1">
        <span class="material-symbols-outlined text-base flex-shrink-0">home</span>
        <span class="line-clamp-1" :title="shop.address">
          {{ shop.address }}
        </span>
      </div>
      <!-- 品牌標籤（最多3個） -->
      <div v-if="displayedBrands.length > 0" class="flex flex-row flex-wrap justify-start items-center gap-2 mt-3 mb-2">
        <span v-for="brand in displayedBrands" :key="brand" :class="getTagClass('filled')">{{ brand }}</span>
        <span v-if="shop.brands.length > 3" class="text-xs text-[#8a8a7d]">+{{ shop.brands.length - 3 }}</span>
      </div>

      <!-- 服務標籤（最多3個） -->
      <div v-if="displayedServices.length > 0" class="flex flex-row flex-wrap justify-start items-center gap-2 my-2">
        <span v-for="service in displayedServices" :key="service" :class="getTagClass('outlined')">{{ service }}</span>
        <span v-if="shop.services.length > 3" class="text-xs text-[#8a8a7d]">+{{ shop.services.length - 3 }}</span>
      </div>

      <!-- 查看詳細資料按鈕 -->
      <button
        @click="handleViewDetail"
        class="w-full mt-3 p-3 bg-[#6B6B5C] text-[14px] text-white rounded-[8px] cursor-pointer hover:bg-[#5A5A4D] transition-colors"
      >
        查看詳細資料
      </button>
    </div>
  </div>
</template>
