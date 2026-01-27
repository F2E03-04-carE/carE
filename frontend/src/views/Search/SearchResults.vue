<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ShopCard from '@/components/ui/ShopCard.vue';
import { supabase } from '@/lib/supabase';
import { calculateDistance, DEFAULT_LOCATION } from '@/utils/distance';
import type { GarageItem } from '@/types/database';

const route = useRoute();
const router = useRouter();

// 排序和篩選
const sortBy = ref('rating');
const filterBy = ref('all');

// 分頁
const currentPage = ref(Number(route.query.page) || 1);
const itemsPerPage = 8;

// 資料狀態
const allShops = ref<GarageItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// 搜尋條件顯示
const searchConditions = computed(() => {
  const conditions: string[] = [];
  if (route.query.city) conditions.push(route.query.city as string);
  if (route.query.district) conditions.push(route.query.district as string);
  if (route.query.brand) conditions.push(`品牌：${route.query.brand}`);
  if (route.query.service) conditions.push(`服務：${route.query.service}`);
  return conditions.join(' / ');
});

// 篩選與排序邏輯
const results = computed(() => {
  let filtered = [...allShops.value];

  // 前端篩選
  if (filterBy.value === 'nearby') {
    filtered = filtered.filter((shop) => shop.distance < 3);
  } else if (filterBy.value === 'ratingGood') {
    filtered = filtered.filter((shop) => shop.score >= 4);
  }

  // 排序
  if (sortBy.value === 'rating') {
    filtered.sort((a, b) => b.score - a.score);
  } else if (sortBy.value === 'distance') {
    filtered.sort((a, b) => a.distance - b.distance);
  } else if (sortBy.value === 'reviewCount') {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return filtered;
});

// 分頁計算
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return results.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(results.value.length / itemsPerPage));
const resultsCount = computed(() => results.value.length);

// 監聽篩選或排序改變，重置頁碼
watch([sortBy, filterBy], () => {
  updatePage(1);
});

// 監聽路由參數變化
watch(
  () => route.query,
  () => {
    currentPage.value = Number(route.query.page) || 1;
    fetchShops();
  }
);

const updatePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    router.push({
      query: { ...route.query, page: page.toString() },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 正規化城市名稱（臺 -> 台）
const normalizeCity = (city: string | undefined): string | undefined => {
  if (!city) return undefined;
  return city.replace(/臺/g, '台');
};

// 主要搜尋函數
const fetchShops = async () => {
  loading.value = true;
  error.value = null;

  try {
    const searchParams = {
      city: normalizeCity(route.query.city as string | undefined),
      district: route.query.district as string | undefined,
      brand: route.query.brand as string | undefined,
      service: route.query.service as string | undefined,
    };

    const userLocation = { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng };

    // 步驟 1: 根據品牌/服務條件取得符合的 garage IDs
    let matchingGarageIds: number[] | null = null;

    if (searchParams.brand) {
      const { data, error: err } = await supabase
        .from('garage_brands')
        .select('garage_id, brands!inner(brand_zh)')
        .eq('brands.brand_zh', searchParams.brand);

      if (err) throw err;
      matchingGarageIds = data?.map((d: any) => d.garage_id) || [];
    }

    if (searchParams.service) {
      const { data, error: err } = await supabase
        .from('garage_services')
        .select('garage_id, services!inner(name)')
        .eq('services.name', searchParams.service);

      if (err) throw err;

      const serviceGarageIds = data?.map((d: any) => d.garage_id) || [];

      if (matchingGarageIds !== null) {
        // 取交集
        matchingGarageIds = matchingGarageIds.filter((id) => serviceGarageIds.includes(id));
      } else {
        matchingGarageIds = serviceGarageIds;
      }
    }

    // 如果有篩選但沒有匹配結果，直接返回空
    if (matchingGarageIds !== null && matchingGarageIds.length === 0) {
      allShops.value = [];
      return;
    }

    // 步驟 2: 查詢保養廠主資料（包含所有品牌和服務）
    let query = supabase.from('garages').select(`
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
        garage_brands ( brands ( brand_zh, brand_en ) ),
        garage_services ( services ( name, category ) )
      `);

    // 套用 ID 篩選
    if (matchingGarageIds !== null) {
      query = query.in('id', [...new Set(matchingGarageIds)]);
    }

    // 套用地區篩選
    if (searchParams.city) {
      query = query.eq('city', searchParams.city);
    }
    if (searchParams.district) {
      query = query.eq('district', searchParams.district);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;

    if (!data || data.length === 0) {
      allShops.value = [];
      return;
    }

    // 步驟 3: 轉換資料格式
    const garages: GarageItem[] = data.map((garage: any) => {
      const distance =
        garage.lat && garage.lng
          ? calculateDistance(userLocation.lat, userLocation.lng, garage.lat, garage.lng)
          : 0;

      const brands = (garage.garage_brands || [])
        .map((gb: any) => gb.brands?.brand_zh)
        .filter(Boolean);

      const services = (garage.garage_services || [])
        .map((gs: any) => gs.services?.name)
        .filter(Boolean);

      return {
        id: garage.id,
        name: garage.name,
        score: garage.rating ?? 0,
        distance,
        reviewCount: garage.review_count ?? 0,
        brands,
        services,
        image: garage.image_url ?? undefined,
        address: garage.address,
        city: garage.city,
        district: garage.district,
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
  <!-- 搜尋條件與排序 -->
  <section class="pt-10 bg-[#EBE8E3]">
    <div class="container mx-auto px-4">
      <!-- 搜尋條件顯示 -->
      <div v-if="searchConditions" class="mb-4">
        <div class="bg-white/70 px-4 py-3 rounded-lg inline-flex items-center gap-2 border border-[#D4CEC4]">
          <span class="material-symbols-outlined text-[#6B6B5C]">search</span>
          <span class="text-[#4a4a43] font-medium">{{ searchConditions }}</span>
        </div>
      </div>

      <!-- 排序與篩選 -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-5">
        <div class="w-full flex text-[#4a4a43] bg-white border-2 border-[#D4CEC4] rounded-[8px] hover:border-[#6B6B5C] transition-colors">
          <label for="order" class="py-2 pl-3 font-medium">排序：</label>
          <select
            id="order"
            v-model="sortBy"
            class="grow py-2 pr-3 outline-none bg-transparent cursor-pointer"
          >
            <option value="rating">依評價</option>
            <option value="distance">依距離</option>
            <option value="reviewCount">依評論數</option>
          </select>
        </div>
        <div class="w-full flex text-[#4a4a43] bg-white border-2 border-[#D4CEC4] rounded-[8px] hover:border-[#6B6B5C] transition-colors">
          <label for="filter" class="py-2 pl-3 font-medium">篩選：</label>
          <select
            id="filter"
            v-model="filterBy"
            class="grow py-2 pr-3 outline-none bg-transparent cursor-pointer"
          >
            <option value="all">全部</option>
            <option value="nearby">附近 (3公里內)</option>
            <option value="ratingGood">評價 4 星以上</option>
          </select>
        </div>
      </div>

      <!-- 結果數量 -->
      <div v-if="!loading && allShops.length > 0" class="mt-4 text-[#6B6B5C] text-sm">
        <span class="text-[#8a8a7d]">共找到 {{ resultsCount }} 間保養廠</span>
      </div>
    </div>
  </section>

  <!-- 搜尋結果 -->
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
      <div v-else-if="resultsCount === 0" class="text-center py-20">
        <div class="max-w-md mx-auto p-8 bg-white border-2 border-[#D4CEC4] rounded-lg">
          <span class="material-symbols-outlined text-6xl text-[#D4CEC4] mb-4">search_off</span>
          <p class="text-[#6B6B5C] text-xl font-medium">查無相關結果</p>
          <p class="text-[#8a8a7d] text-sm mt-3">請嘗試調整篩選條件或更換搜尋地區</p>
          <button
            @click="router.push('/')"
            class="mt-6 px-6 py-2 text-sm text-white bg-[#6B6B5C] rounded-lg hover:bg-[#5a5a4a] transition-colors"
          >
            返回首頁重新搜尋
          </button>
        </div>
      </div>

      <!-- 搜尋結果列表 -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ShopCard
            v-for="shop in paginatedResults"
            :key="shop.id"
            :shop="shop"
            @view-detail="handleViewDetail"
          />
        </div>

        <!-- 分頁 -->
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
                  : 'bg-white text-[#4a4a43] border-[#D4CEC4] hover:border-[#6B6B5C] hover:text-[#6B6B5C]',
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
.material-symbols-outlined {
  font-size: 20px;
  line-height: 1;
}
</style>
