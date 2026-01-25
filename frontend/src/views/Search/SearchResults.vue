<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ShopCard from '@/components/ui/ShopCard.vue';
import { supabase } from '@/lib/supabase';
import { calculateDistance, getUserLocation, DEFAULT_LOCATION } from '@/utils/distance';
import type { GarageItem } from '@/types/database';


const orderTitle = ref('排序');
const filterTitle = ref('篩選');
const sortBy = ref('rating');
const route = useRoute()
const router = useRouter()
const filterBy = ref('all');

// 分頁相關設定
const currentPage = ref(Number(route.query.page) || 1);
const itemsPerPage = 8; // 每頁顯示 8 筆 (一行4格 x 2行)

// 資料狀態
const allShops = ref<GarageItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

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
  loading.value = true;
  error.value = null;

  try {
    // 取得搜尋參數，並將繁體「臺」轉換為簡體「台」以匹配資料庫
    const normalizeCity = (city: string | undefined) => {
      if (!city) return city;
      return city.replace(/臺/g, '台');
    };

    const searchParams = {
      city: normalizeCity(route.query.city as string | undefined),
      district: route.query.district as string | undefined,
      brand: route.query.brand as string | undefined,
      service: route.query.service as string | undefined,
    };

    // 取得使用者位置（用於計算距離）
    let userLocation = { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng };

    // 建立 Supabase 查詢
    let query = supabase
      .from('garages')
      .select(`
        id,
        name,
        city,
        district,
        address,
        lat,
        lng,
        rating,
        review_count,
        image_url,
        garage_brands (
          brands (
            brand_zh,
            brand_en
          )
        ),
        garage_services (
          services (
            name,
            category
          )
        )
      `);

    // 套用篩選條件
    if (searchParams.city) {
      query = query.eq('city', searchParams.city);
    }

    if (searchParams.district) {
      query = query.eq('district', searchParams.district);
    }

    // 品牌篩選
    if (searchParams.brand) {
      query = query.eq('garage_brands.brands.brand_zh', searchParams.brand);
    }

    // 服務項目篩選
    if (searchParams.service) {
      query = query.eq('garage_services.services.name', searchParams.service);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    if (!data || data.length === 0) {
      allShops.value = [];
      return;
    }

    // 轉換資料格式並計算距離
    const garages: GarageItem[] = data.map((garage: any) => {
      // 計算距離
      const distance =
        garage.lat && garage.lng
          ? calculateDistance(userLocation.lat, userLocation.lng, garage.lat, garage.lng)
          : 0;

      // 提取品牌名稱（中文）- 處理可能為 null 的情況
      const brands = (garage.garage_brands || [])
        .map((gb: any) => gb.brands?.brand_zh)
        .filter((brand: any): brand is string => brand !== null && brand !== undefined);

      // 提取服務項目名稱 - 處理可能為 null 的情況
      const services = (garage.garage_services || [])
        .map((gs: any) => gs.services?.name)
        .filter((service: any): service is string => service !== null && service !== undefined);

      return {
        id: garage.id,
        name: garage.name,
        score: garage.rating ?? 0,
        distance,
        reviewCount: garage.review_count ?? 0,
        brands,
        services,
        image: garage.image_url ?? undefined,
      };
    });

    allShops.value = garages;

  } catch (err) {
    console.error('查詢保養廠失敗:', err);
    error.value = err instanceof Error ? err.message : '查詢失敗，請稍後再試';
    allShops.value = [];
  } finally {
    loading.value = false;
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
  <section class="pt-10 bg-[#EBE8E3]">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-5">
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border-2 border-[#D4CEC4] rounded-[8px] hover:border-[#6B6B5C] transition-colors">
          <label for="order" class="py-2 pl-3 font-medium">{{ orderTitle }}：</label>
          <select name="order" id="order" class="grow py-2 pr-3 outline-none bg-transparent cursor-pointer" v-model="sortBy">
            <option value="rating" selected>依評價</option>
            <option value="distance">依距離</option>
            <option value="reviewCount">依評論數</option>
          </select>
        </div>
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border-2 border-[#D4CEC4] rounded-[8px] hover:border-[#6B6B5C] transition-colors">
          <label for="filter" class="py-2 pl-3 font-medium">{{ filterTitle }}：</label>
          <select name="filter" id="filter" class="grow py-2 pr-3 outline-none bg-transparent cursor-pointer" v-model="filterBy">
            <option value="all" selected>全部</option>
            <option value="nearby">附近(3公里內)</option>
            <option value="ratingGood">評價 4 星以上</option>
          </select>
        </div>
      </div>
      <div class="mt-4 text-[#6B6B5C] text-sm" v-if="allShops.length > 0">
        <div class="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg inline-block border border-[#D4CEC4]">
          <span class="font-semibold">顯示：</span>
          <span v-if="filterBy === 'all'">全部</span>
          <span v-else-if="filterBy === 'nearby'">附近（3公里內）</span>
          <span v-else-if="filterBy === 'ratingGood'">評價 4 星以上</span>
          <span class="mx-2 text-[#D4CEC4]">|</span>
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
          <span class="ml-2 text-[#8a8a7d]">(共 {{ resultsCount }} 間)</span>
        </div>
      </div>
    </div>
  </section>

  <section class="pt-5 bg-[#EBE8E3] pb-20 min-h-[60vh]">
    <div class="container mx-auto px-4">
      <!-- Loading 狀態 -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#6B6B5C] border-t-transparent"></div>
        <p class="text-[#4a4a43] text-lg mt-4">載入中...</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-lg font-medium">{{ error }}</p>
        <button
          @click="fetchShops"
          class="mt-4 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          重新載入
        </button>
      </div>

      <!-- 查無結果 -->
      <div v-else-if="!resultsCount && !loading" class="text-center py-20">
        <div class="max-w-md mx-auto p-8 bg-white border-2 border-[#D4CEC4] rounded-lg">
          <p class="text-[#6B6B5C] text-xl font-medium">查無相關結果</p>
          <p class="text-[#8a8a7d] text-sm mt-3">請嘗試調整篩選條件或更換搜尋地區</p>
        </div>
      </div>

      <!-- 搜尋結果 -->
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
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#D4CEC4] bg-white text-[#4a4a43] hover:bg-[#6B6B5C] hover:text-white hover:border-[#6B6B5C] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                'w-10 h-10 rounded-full border-2 transition-all font-medium text-sm',
                currentPage === page
                  ? 'bg-[#6B6B5C] text-white border-[#6B6B5C] shadow-md'
                  : 'bg-white text-[#4a4a43] border-[#D4CEC4] hover:border-[#6B6B5C] hover:text-[#6B6B5C]'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="updatePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#D4CEC4] bg-white text-[#4a4a43] hover:bg-[#6B6B5C] hover:text-white hover:border-[#6B6B5C] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
