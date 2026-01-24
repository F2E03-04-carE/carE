<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import ShopCard from '@/components/ui/ShopCard.vue';


const orderTitle = ref('排序');
const filterTitle = ref('篩選');
const sortBy = ref('rating');
const route = useRoute()
const router = useRouter()
const filterBy = ref('all');

// 分頁相關設定
const currentPage = ref(Number(route.query.page) || 1);
const itemsPerPage = 8; // 每頁顯示 8 筆 (一行4格 x 2行)

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

// 篩選與排序邏輯
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

// 分頁計算
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return results.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(results.value.length / itemsPerPage));
const resultsCount = computed(() => results.value.length);

// 監聽篩選或排序改變，重置頁碼
watch([sortBy, filterBy], () => {
  updatePage(1);
});

// 監聽路由參數變化（處理瀏覽器上一頁/下一頁）
watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1;
});

const updatePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    router.push({
      query: { ...route.query, page: page.toString() }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const fetchShops = async () => {
  try {
    const searchParams = {
      city: route.query.city,
      district: route.query.district,
      brand: route.query.brand,
      service: route.query.service,
      category: route.query.category
    }

    // TODO: 未來串接真實後端 API 時使用這些參數
    // const response = await fetch(`/api/search?${new URLSearchParams(searchParams).toString()}`)
    // const data = await response.json()
    // allShops.value = data

    // 擴充 Mock Data 以測試分頁 (12筆)
    const mockData: ResultItem[] = [
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
      {
        id: 4,
        name: '極速維修中心',
        score: 4.5,
        distance: 0.8,
        reviewCount: 200,
        brands: ['Tesla', 'BMW', 'Benz'],
        services: ['電池檢測', '馬達維修', '軟體更新', '底盤強化'],
        image: 'https://picsum.photos/300/200?random=4',
      },
      {
        id: 5,
        name: '安心汽修廠',
        score: 4.2,
        distance: 5.1,
        reviewCount: 30,
        brands: ['Nissan', 'Mitsubishi', 'Ford'],
        services: ['快速保養', '輪胎定位', '鈑金烤漆'],
        image: 'https://picsum.photos/300/200?random=5',
      },
      {
        id: 6,
        name: '城市車庫',
        score: 3.8,
        distance: 1.5,
        reviewCount: 65,
        brands: ['Honda', 'Toyota'],
        services: ['引擎調校', '冷氣保養', '皮帶更換'],
        image: 'https://picsum.photos/300/200?random=6',
      },
      {
        id: 7,
        name: '老張修車行',
        score: 4.8,
        distance: 0.5,
        reviewCount: 300,
        brands: ['Toyota', 'Nissan', 'Lexus'],
        services: ['老車翻新', '疑難雜症', '定期檢查'],
        image: 'https://picsum.photos/300/200?random=7',
      },
      {
        id: 8,
        name: '德系精修館',
        score: 5,
        distance: 10.2,
        reviewCount: 15,
        brands: ['Porsche', 'Audi', 'VW'],
        services: ['動力改裝', '電腦編程', '賽道設定'],
        image: 'https://picsum.photos/300/200?random=8',
      },
      {
        id: 9,
        name: '未來汽車工坊',
        score: 4.1,
        distance: 6.7,
        reviewCount: 45,
        brands: ['Hyundai', 'Kia'],
        services: ['混合動力維修', '高壓電系統', '電池更換'],
        image: 'https://picsum.photos/300/200?random=9',
      },
      {
        id: 10,
        name: '山路救援站',
        score: 4.9,
        distance: 15.3,
        reviewCount: 10,
        brands: ['Subaru', 'Suzuki'],
        services: ['越野改裝', '底盤升高', '絞盤安裝'],
        image: 'https://picsum.photos/300/200?random=10',
      },
      {
        id: 11,
        name: '濱海保養所',
        score: 3.5,
        distance: 20.0,
        reviewCount: 5,
        brands: ['Luxgen', 'Ford'],
        services: ['防鏽處理', '底盤防護', '基本保養'],
        image: 'https://picsum.photos/300/200?random=11',
      },
       {
        id: 12,
        name: '優質輪胎館',
        score: 4.6,
        distance: 1.8,
        reviewCount: 180,
        brands: ['Michelin', 'Bridgestone', 'Continental'],
        services: ['輪胎更換', '四輪定位', '補胎服務'],
        image: 'https://picsum.photos/300/200?random=12',
      },
    ];

    allShops.value = mockData;

  } catch (err) {
    console.log('沒有符合資料的結果:', err)
    allShops.value = []
  }
};

const handleViewDetail = (shopId: number) => {
  router.push(`/search/${shopId}`);
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

  <section class="pt-5 bg-[#f5f1ed] pb-20 min-h-[60vh]">
    <div class="container mx-auto px-4">
      <div v-if="!resultsCount" class="text-center py-20">
        <p class="text-[#4a4a43] text-lg">查無相關結果</p>
        <p class="text-[#4a4a43] text-sm mt-2">請嘗試調整篩選條件</p>
      </div>
      
      <div v-else>
        <!-- 一行四格 (lg:grid-cols-4) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ShopCard
            v-for="shop in paginatedResults"
            :key="shop.id"
            :shop="shop"
            @view-detail="handleViewDetail"
          />
        </div>

        <!-- 分頁 UI -->
        <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 gap-3">
          <button
            @click="updatePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="flex items-center justify-center w-10 h-10 rounded-full border border-[#DBCEBD] bg-white text-[#4a4a43] hover:bg-[#8b7d6b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="上一頁"
          >
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          
          <div class="flex gap-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="updatePage(page)"
              :class="[
                'w-10 h-10 rounded-full border transition-all font-medium text-sm',
                currentPage === page
                  ? 'bg-[#8b7d6b] text-white border-[#8b7d6b] shadow-sm' 
                  : 'bg-white text-[#4a4a43] border-[#DBCEBD] hover:border-[#8b7d6b] hover:text-[#8b7d6b]'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="updatePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center w-10 h-10 rounded-full border border-[#DBCEBD] bg-white text-[#4a4a43] hover:bg-[#8b7d6b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="下一頁"
          >
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 確保箭頭圖示垂直居中 */
.material-symbols-outlined {
  font-size: 20px;
  line-height: 1;
}
</style>
