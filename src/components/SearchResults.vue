<script setup lang="ts">
import { ref, computed } from 'vue'
import ShopCard from '@/components/ShopCard.vue'

const orderTitle = ref('排序')
const filterTitle = ref('篩選')
const sortBy = ref('rating');

interface ResultItem {
  image?: string;
  id: number;
  name: string;
  score: number;
  distance: number;
  brands: string[];
  services: string[];
}

const results = ref<ResultItem[]>([
  {
    name: '咪咪毛毛',
    score: 5,
    distance: 1,
    brands: ['咪咪', '毛毛'],
    services: ['保養', '維修'],
  },
])

const resultsCount = computed(() => results.value.length)
</script>

<template>
  <section class="pt-10 bg-[#f5f1ed]">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center gap-5">
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border border-[#DBCEBD] rounded-[5px]">
          <label for="order" class="py-2 pl-3">{{ orderTitle }}：</label>
          <select name="order" id="order" class="grow py-2 outline-none">
            <!-- TODO: 選項待補齊 -->
            <option value="distance" selected>距離</option>
            <option value="">評價</option>
            <option value="">？？</option>
            <option value="">？？？</option>
          </select>
        </div>
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border border-[#DBCEBD] rounded-[5px]">
          <label for="filter" class="py-2 pl-3">{{ filterTitle }}：</label>
          <select name="filter" id="filter" class="grow py-2 outline-none">
            <!-- TODO: 選項待補齊 -->
            <option value="all" selected>全部</option>
            <option value="">？</option>
            <option value="">？？</option>
            <option value="">？？？</option>
          </select>
        </div>
      </div>
    </div>
  </section>
  <section class="pt-5 bg-[#f5f1ed]">
    <div class="container mx-auto flex flex-wrap gap-5">
      <div v-if="!resultsCount">
        <p class="text-[#4a4a43]">查無相關結果</p>
      </div>
    </div>
  </section>
</template>
