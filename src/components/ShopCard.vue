<script setup lang="ts">
  import Tag from './Tag.vue';
interface Props {
  shop: {
    image?: string;  // 圖片網址
    id: number;
    name: string;
    score: number;
    distance: number;
    brands: string[];
    services: string[];
  }
}
// 傳遞卡片資料
const props = defineProps<Props>();

const emit = defineEmits<{
  viewDetail: [shopId: number]
}>();
// 星等邏輯
const starIcon = `<span class="material-symbols-outlined">kid_star</span>`;
const getStars = (score: number) => {
  return starIcon.repeat(score);
};

// 決定要傳送哪些卡
const handleViewDetail = () => {
  emit('viewDetail', props.shop.id);
};

</script>

<template>
  <div class="border border-[#DBCEBD] rounded-[5px] overflow-hidden hover:shadow-md duration-300 bg-white">
    <img
      :src="shop.image || 'https://picsum.photos/300/200?random=1'"
      :alt="`${shop.name}環境圖片`"
      class="w-full aspect-[3/2] object-cover"
    />
    <div class="px-5 py-3 text-[#4a4a43]">
      <p class="my-1 font-semibold">{{ shop.name }}</p>
      <p class="my-1">
        <span v-html="getStars(shop.score)"></span>
      </p>
        <p class="flex flex-row justify-start items-center my-1">
        <span class="material-symbols-outlined">location_on</span>
        {{ shop.distance }} 公里
      </p>
      <div class="flex flex-row flex-wrap justify-start items-center gap-2 my-5">
        <!-- 用Tag元件顯示 -->
        <Tag
          v-for="(brand, index) in shop.brands"
          :key="`brand-${index}`"
          :label="brand"
          variant="filled"
        />
      </div>
      <div class="flex flex-row flex-wrap justify-start items-center gap-2 my-5">
        <Tag
          v-for="(service, index) in shop.services"
          :key="`service-${index}`"
          :label="service"
          variant="outlined"
        />
      </div>
      <button
        @click="handleViewDetail"
        class="w-full block p-3 bg-[#8b7d6b] text-[14px] text-white rounded-[8px] cursor-pointer hover:bg-[#6d6250] transition-colors"
      >
        查看詳細資料
      </button>
    </div>
  </div>
</template>
