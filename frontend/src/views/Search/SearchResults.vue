<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import ShopCard from '@/components/ui/ShopCard.vue';


const orderTitle = ref('排序');
const filterTitle = ref('篩選');
const sortBy = ref('rating');
const route = useRoute()
const router = useRouter()
const filterBy = ref('all');

interface ResultItem {
  image?: string;
  id: number;
  name: string;
  score: number;
  distance: number;
  reviewCount: number;
  brands: string[];
  services: string[];
}

const allShops = ref<ResultItem[]>([]);

const results = computed(() => {
  let filtered = [...allShops.value];
  if (filterBy.value === 'nearby') {
    filtered = filtered.filter((shop) => shop.distance < 3);
  } else if (filterBy.value === 'ratingGood') {
    filtered = filtered.filter((shop) => shop.score >= 4);
  }
  if (filterBy.value === 'all') {
    if (sortBy.value === 'rating') {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortBy.value === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (sortBy.value === 'reviewCount') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  } else {
    if (sortBy.value !== 'rating') {
      if (sortBy.value === 'distance') {
        filtered.sort((a, b) => a.distance - b.distance);
      } else if (sortBy.value === 'reviewCount') {
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      }
    }
  }
  return filtered;
});
const resultsCount = computed(() => results.value.length);

const fetchShops = async () => {
  try {
    const searchParams = {
      city: route.query.city,
      district: route.query.district,
      brand: route.query.brand,
      service: route.query.service
    }

    console.log('搜尋參數:', searchParams)

    // 暫時使用 Mock Data (資料庫尚未建立時測試用)
    // TODO: 資料庫建立後改用真實 API
    allShops.value = [
      {
        id: 1,
        name: '匠心汽車維修中心',
        score: 5,
        distance: 1.2,
        reviewCount: 120,
        brands: ['Benz', 'BMW', '奧迪', '保時捷'],
        services: ['保養維護', '故障維修', '年檢服務', '鈑金噴漆', '輪胎更換', '冷氣維修'],
        image: 'https://picsum.photos/300/200?random=1',
      },
      {
        id: 2,
        name: '職人汽車保養廠',
        score: 4,
        distance: 2.5,
        reviewCount: 85,
        brands: ['豐田', '本田', 'Volvo', '馬自達'],
        services: ['定期保養', '引擎維修', '變速箱維修', '煞車系統', '電路檢修', '冷氣維修'],
        image: 'https://picsum.photos/300/200?random=2',
      },
      {
        id: 3,
        name: '專業汽車維修站',
        score: 3,
        distance: 3.8,
        reviewCount: 50,
        brands: ['福斯', '奧迪', '保時捷', 'BMW'],
        services: ['專業診斷', '原廠配件', '精密維修', '性能升級', '保養套餐', '質保服務'],
        image: 'https://picsum.photos/300/200?random=3',
      },
    ]

    // 真實 API 呼叫 (資料庫建立後使用)
    /*
    const params = new URLSearchParams(searchParams as Record<string, string>)
    const response = await fetch(`/api/search?${params.toString()}`)

    if (!response.ok) {
      throw new Error('搜尋失敗')
    }

    const data = await response.json()
    allShops.value = data.data || []
    */

  } catch (err) {
    console.log('沒有符合資料的結果:', err)
    allShops.value = []
  }
};

const handleViewDetail = (shopId: number) => {
  console.log('使用者要查看商店詳細，ID:', shopId);
  router.push({ name: 'GarageDetail', params: { id: shopId } });
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
          <select name="order" id="order" class="grow py-2 outline-none" v-model="sortBy">
            <option value="rating" selected>依評價</option>
            <option value="distance">依距離</option>
            <option value="reviewCount">依評論數</option>
          </select>
        </div>
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border border-[#DBCEBD] rounded-[5px]">
          <label for="filter" class="py-2 pl-3">{{ filterTitle }}：</label>
          <select name="filter" id="filter" class="grow py-2 outline-none" v-model="filterBy">
            <option value="all" selected>全部</option>
            <option value="nearby">附近(3公里內)</option>
            <option value="ratingGood">評價 4 星以上</option>
          </select>
        </div>
      </div>
      <div class="mt-4 text-[#4a4a43] text-sm" v-if="allShops.length > 0">
        <p>
          <span class="font-semibold">顯示：</span>
          <span v-if="filterBy === 'all'">全部</span>
          <span v-else-if="filterBy === 'nearby'">附近（3公里內）</span>
          <span v-else-if="filterBy === 'ratingGood'">評價 4 星以上</span>
          <span class="mx-2">|</span>
          <span class="font-semibold">排序：</span>
          <span v-if="filterBy === 'all'">
            <span v-if="sortBy === 'rating'">依評價</span>
            <span v-else-if="sortBy === 'distance'">依距離</span>
            <span v-else>依評論數</span>
          </span>
          <span v-else>
            <!-- 篩選後 -->
            <span v-if="sortBy === 'rating'">原始順序</span>
            <span v-else-if="sortBy === 'distance'">依距離</span>
            <span v-else>依評論數</span>
          </span>
          <span class="ml-2 text-gray-600">(共 {{ resultsCount }} 間)</span>
        </p>
      </div>
    </div>
  </section>

  <section class="pt-5 bg-[#f5f1ed] pb-10 min-h-[60vh]">
    <div class="container mx-auto">
      <div v-if="!resultsCount" class="text-center py-10">
        <p class="text-[#4a4a43] text-lg">查無相關結果</p>
        <p class="text-[#4a4a43] text-sm mt-2">請嘗試調整篩選條件</p>
      </div>
      <div v-else class="grid grid-cols-1 mx-2 md:grid-cols-2 mx-2 gap-3 lg:grid-cols-3 gap-5">
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
