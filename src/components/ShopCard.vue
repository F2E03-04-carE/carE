<script setup lang="ts">
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
    brands: string[];
    services: string[];
  }
}
const props = defineProps<Props>();

const emit = defineEmits<{
  viewDetail: [shopId: number]
}>();

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
      <p class="my-2 font-semibold">{{ shop.name }}</p>
      <p class="my-2">
      <img
        v-for="i in 5"
        :key="i"
        :src="i <= shop.score ? filledStar : emptyStar"
        alt="star"
        class="w-5 h-5 inline-block"
      />
      </p>
        <p class="flex flex-row justify-start items-center my-1">
        <span class="material-symbols-outlined pr-2 mt-2">location_on</span>
        {{ shop.distance }} 公里
      </p>
      <div class="flex flex-row flex-wrap justify-start items-center gap-2 my-5">
        <Tag
          v-for="(brand, index) in shop.brands"
          :key="`brand`"
          :label="brand"
          variant="filled"
        />
      </div>
      <div class="flex flex-row flex-wrap justify-start items-center gap-2 my-5">
        <Tag
          v-for="(service, index) in shop.services"
          :key="`service`"
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
