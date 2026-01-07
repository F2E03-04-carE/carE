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
  <div class="grid ">

  </div>
</template>
