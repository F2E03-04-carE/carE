<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ShopCard from '@/components/ShopCard.vue'
import { log } from 'console';

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

const results = ref<ResultItem[]>([])

const resultsCount = computed(() => results.value.length)
try{ // 範例資料，實際應從API取得
      results.value = [
      {
        id: 1,
        name: '匠心汽車維修中心',
        score: 5,
        distance: 1.2,
        brands: ['Benz', 'BMW', '奧迪', '保時捷'],
        services: ['保養維護', '故障維修', '年檢服務', '鈑金噴漆', '輪胎更換', '冷氣維修'],
        image: 'https://picsum.photos/300/200?random=1'
      },
      {
        id: 2,
        name: '職人汽車保養廠',
        score: 4,
        distance: 2.5,
        brands: ['豐田', '本田', 'Volvo', '馬自達'],
        services: ['定期保養', '引擎維修', '變速箱維修', '煞車系統', '電路檢修', '冷氣維修'],
        image: 'https://picsum.photos/300/200?random=2'
      },
      {
        id: 3,
        name: '專業汽車維修站',
        score: 4,
        distance: 3.8,
        brands: ['福斯', '奧迪', '保時捷', 'BMW'],
        services: ['專業診斷', '原廠配件', '精密維修', '性能升級', '保養套餐', '質保服務'],
        image: 'https://picsum.photos/300/200?random=3'
      },
    ];
}catch(err){
  console.log('沒有符合資料的結果:', err);

}


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
