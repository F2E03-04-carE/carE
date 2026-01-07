<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

const results = ref<ResultItem[]>([])

const resultsCount = computed(() => results.value.length)
const fetchShops = async () => {
try{
  //TODO:從API取得搜尋結果
  // 範例資料，實際應從API取得
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
};
// 處理排序變更
const handleSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  sortBy.value = target.value;
  fetchShops();
};

const handleViewDetail = (shopId: number) => {
  console.log('使用者要查看商店詳細，ID:', shopId);
  // TODO: 之後這裡會接路由跳轉
  alert(`查看商店 ID: ${shopId} 的詳細資料`);
};
onMounted(() => {
  fetchShops();
});

</script>

<template>
  <section class="pt-10 bg-[#f5f1ed]">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-5">
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border border-[#DBCEBD] rounded-[5px]">
          <label for="order" class="py-2 pl-3">{{ orderTitle }}：</label>
          <select
            name="order"
            id="order"
            class="grow py-2 outline-none"
            @change="handleSortChange"
            v-model="sortBy"
            >
            <option value="rating" selected>評價</option>
            <option value="distance">距離</option>
            <option value="reviewCount">評論數</option>
          </select>
        </div>
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border border-[#DBCEBD] rounded-[5px]">
          <label for="filter" class="py-2 pl-3">{{ filterTitle }}：</label>
          <select
            name="filter"
            id="filter"
            class="grow py-2 outline-none">
            <option value="all" selected>全部</option>
            <option value="nearby">附近</option>
            <option value="popular">熱門</option>
            <option value="ratingGood">評價4星以上</option>
          </select>
        </div>
      </div>
    </div>
  </section>
  <section class="pt-5 bg-[#f5f1ed] pb-10 min-h-[60vh]">
    <div class="container mx-auto">
      <div v-if="!resultsCount" class="text-center py-10">
        <p class="text-[#4a4a43] text-lg">查無相關結果</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ShopCard
          v-for="shop in results"
          :key="shop.id"
          :shop="shop"
          @view-detail="handleViewDetail"
        />
      </div>
    </div>
  </section>
</template>
