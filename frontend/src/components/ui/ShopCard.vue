<script setup lang="ts">
import { computed } from 'vue';
import Tag from './Tag.vue';
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
</script>

<template>
  <div class="border border-[#D4CEC4] rounded-[5px] overflow-hidden hover:shadow-lg duration-300 bg-white">
    <img
      :src="shop.image || 'https://picsum.photos/300/200?random=1'"
      :alt="`${shop.name}環境圖片`"
      class="w-full aspect-[3/2] object-cover"
    />
    <div class="px-5 py-3 text-[#4a4a43]">
      <p class="my-2 font-semibold text-lg">{{ shop.name }}</p>
      <p class="my-2">
        <img
          v-for="i in 5"
          :key="i"
          :src="i <= shop.score ? filledStar : emptyStar"
          alt="star"
          class="w-5 h-5 inline-block"
        />
      </p>
      <span class="px-2 text-[#8a8a7d] text-xs">({{ shop.reviewCount }})</span>
      <p class="flex flex-row justify-start items-center my-1">
        <span class="material-symbols-outlined pr-2 mt-2">location_on</span>
        {{ shop.distance }} 公里
      </p>
      <!-- 品牌標籤（最多3個） -->
      <div v-if="displayedBrands.length > 0" class="flex flex-row flex-wrap justify-start items-center gap-2 my-3">
        <Tag v-for="brand in displayedBrands" :key="brand" :label="brand" variant="filled" />
        <span v-if="shop.brands.length > 3" class="text-xs text-[#8a8a7d]">+{{ shop.brands.length - 3 }}</span>
      </div>
      <!-- 服務標籤（最多3個） -->
      <div v-if="displayedServices.length > 0" class="flex flex-row flex-wrap justify-start items-center gap-2 my-3">
        <Tag
          v-for="service in displayedServices"
          :key="service"
          :label="service"
          variant="outlined"
        />
        <span v-if="shop.services.length > 3" class="text-xs text-[#8a8a7d]">+{{ shop.services.length - 3 }}</span>
      </div>
      <button
        @click="handleViewDetail"
        class="w-full block p-3 bg-[#6B6B5C] text-[14px] text-white rounded-[8px] cursor-pointer hover:bg-[#5A5A4D] transition-colors"
      >
        查看詳細資料
      </button>
    </div>
  </div>
</template>
