<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { calculateDistance, DEFAULT_LOCATION } from '@/utils/distance'
import type { GarageDetail } from '@/types/database'
import ServiceSearchFlow from '@/components/service-search/ServiceSearchFlow.vue'

const router = useRouter()
const route = useRoute()
const isOpenMap = ref(false)
const isOpenSurroundings = ref(false)
const showBookingFlow = ref(false)

// 資料狀態
const garage = ref<GarageDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// 評分星星顯示
const ratingStars = computed(() => {
  if (!garage.value) return '☆☆☆☆☆'
  const fullStars = Math.floor(garage.value.score)
  const emptyStars = 5 - fullStars
  return '★'.repeat(fullStars) + '☆'.repeat(emptyStars)
})

// 取得保養廠詳細資訊
const fetchGarageDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const garageId = Number(route.params.id)

    if (!garageId || isNaN(garageId)) {
      throw new Error('無效的保養廠 ID')
    }

    // 查詢保養廠資料（包含關聯的品牌和服務）
    const { data, error: fetchError } = await supabase
      .from('garages')
      .select(`
        *,
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
      `)
      .eq('id', garageId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    if (!data) {
      throw new Error('找不到該保養廠')
    }

    // 計算距離
    const userLocation = { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng }
    const distance = data.lat && data.lng
      ? calculateDistance(userLocation.lat, userLocation.lng, data.lat, data.lng)
      : 0

    // 提取品牌名稱 - 處理可能為 null 的情況
    const brands = (data.garage_brands || [])
      .map((gb: any) => gb.brands?.brand_zh)
      .filter((brand: any): brand is string => brand !== null && brand !== undefined)

    // 提取服務項目名稱 - 處理可能為 null 的情況
    const services = (data.garage_services || [])
      .map((gs: any) => gs.services?.name)
      .filter((service: any): service is string => service !== null && service !== undefined)

    // 轉換為前端格式
    garage.value = {
      id: data.id,
      name: data.name,
      city: data.city,
      district: data.district,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      score: data.rating ?? 0,
      distance,
      reviewCount: data.review_count ?? 0,
      brands,
      services,
      image: data.image_url ?? undefined,
      phone: data.phone ?? undefined,
      ownerName: data.garage_owner_name ?? data.garage_owner ?? undefined,
      operatingHours: data.operating_hours ?? undefined,
    }

  } catch (err) {
    console.error('查詢保養廠失敗:', err)
    error.value = err instanceof Error ? err.message : '查詢失敗，請稍後再試'
    garage.value = null
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const openGoogleMaps = () => {
  if (!garage.value) return
  const url = `https://www.google.com/maps/search/?api=1&query=${garage.value.lat},${garage.value.lng}`
  window.open(url, '_blank')
}

onMounted(() => {
  fetchGarageDetail()
})
</script>

<template>
  <div class="min-h-screen py-8 bg-[#FAF8F5] min-w-[375px]">
    <div class="max-w-6xl mx-auto px-4">
      <button
        @click="goBack"
        class="inline-flex items-center px-4 py-2 mb-4 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
      >
        ← 返回搜尋結果
      </button>

      <!-- Loading 狀態 -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8b7d6b] border-t-transparent"></div>
        <p class="text-[#4a4a43] text-lg mt-4">載入中...</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-lg font-medium">{{ error }}</p>
        <button
          @click="fetchGarageDetail"
          class="mt-4 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          重新載入
        </button>
      </div>

      <!-- 查無資料 -->
      <div v-else-if="!garage" class="text-center py-20">
        <p class="text-[#4a4a43] text-lg">找不到該保養廠</p>
      </div>

      <!-- 保養廠詳細資料 -->
      <div v-else>
      <div class="flex flex-col lg:flex-row gap-6 items-start">
        <div class="flex-1 w-full min-w-0 space-y-6">
          <section class="p-6 bg-white rounded-2xl shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex items-end gap-3">
                <h1 class="text-xl font-semibold text-gray-900">{{ garage.name }}</h1>
                <span class="text-xs text-gray-500 mb-1">{{ garage.city }}{{ garage.district }} {{ garage.address }}</span>
              </div>
              <div class="text-yellow-400">{{ ratingStars }}</div>
            </div>
            <div class="mt-4 space-y-2 text-sm text-gray-600">
              <div v-if="garage.ownerName" class="flex items-center gap-2">
                <span>店長姓名:</span>
                <span>{{ garage.ownerName }}</span>
              </div>
              <div v-if="garage.phone" class="flex items-center gap-2">
                <span>聯絡電話:</span>
                <span>{{ garage.phone }}</span>
              </div>
            </div>
            <div class="mt-6">
              <h3 class="mb-2 font-medium text-gray-800">環境照片</h3>
              <div class="grid grid-cols-4 gap-2 h-32">
                <div class="rounded-lg overflow-hidden bg-gray-100">
                  <img src="https://picsum.photos/300/200?random=10" alt="環境照片1" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <div class="rounded-lg overflow-hidden bg-gray-100">
                  <img src="https://picsum.photos/300/200?random=11" alt="環境照片2" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <div class="rounded-lg overflow-hidden bg-gray-100">
                  <img src="https://picsum.photos/300/200?random=12" alt="環境照片3" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <div class="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group">
                  <img src="https://picsum.photos/300/200?random=13" alt="環境照片4" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    +5 張
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6" v-if="garage.brands.length > 0">
              <h3 class="mb-2 font-medium text-gray-800">專修品牌</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="brand in garage.brands"
                  :key="brand"
                  class="px-4 py-1 text-sm bg-[#E8E3DB] rounded-full"
                >
                  {{ brand }}
                </span>
              </div>
            </div>
            <div class="mt-6" v-if="garage.services.length > 0">
              <h3 class="mb-2 font-medium text-gray-800">服務項目</h3>
              <div class="flex flex-row gap-8 text-sm text-gray-700 sm:gap-12">
                <ul class="pl-4 space-y-1 list-disc">
                  <li v-for="(service, index) in garage.services" :key="service" v-show="index % 2 === 0">
                    {{ service }}
                  </li>
                </ul>
                <ul class="pl-4 space-y-1 list-disc">
                  <li v-for="(service, index) in garage.services" :key="service" v-show="index % 2 === 1">
                    {{ service }}
                  </li>
                </ul>
              </div>
            </div>
            <button
              @click="showBookingFlow = true"
              class="w-full mt-8 py-3 text-white bg-[#6B6B5C] rounded-xl transition hover:opacity-90"
            >
              立即預約
            </button>
            <div class="mt-6 space-y-4 lg:hidden">
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  @click="isOpenMap = !isOpenMap"
                  class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span class="font-medium text-gray-800">維修廠地圖地點</span>
                  <span class="transform transition-transform duration-200" :class="{ 'rotate-180': isOpenMap }">▼</span>
                </button>
                <div v-show="isOpenMap" class="p-4 bg-white border-t border-gray-200">
                  <div class="w-full aspect-square bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <span class="text-4xl mb-2">🗺️</span>
                    <span class="text-sm">Google Map 載入中...</span>
                  </div>
                  <div class="mt-4 text-sm text-gray-500">
                    <p>地址：{{ garage.city }}{{ garage.district }} {{ garage.address }}</p>
                  </div>
                  <button
                    @click="openGoogleMaps"
                    class="mt-4 w-full py-2 text-sm text-[#6B6B5C] bg-[#FAF8F5] border border-[#E8E3DB] rounded-lg hover:bg-[#E8E3DB] transition"
                  >
                    開啟 Google Maps 導航
                  </button>
                </div>
              </div>
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  @click="isOpenSurroundings = !isOpenSurroundings"
                  class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span class="font-medium text-gray-800">周邊休息地點</span>
                  <span class="transform transition-transform duration-200" :class="{ 'rotate-180': isOpenSurroundings }">▼</span>
                </button>
                <div v-show="isOpenSurroundings" class="p-4 bg-white border-t border-gray-200">
                  <div class="space-y-4">
                    <div class="flex gap-3 p-3 border border-gray-100 rounded-xl transition hover:bg-gray-50">
                      <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-xl bg-[#FAF8F5] rounded-lg">☕</div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-1">
                          <h4 class="text-sm font-medium text-gray-900 truncate">路易莎咖啡 咪咪店</h4>
                          <span class="px-1.5 py-0.5 text-[10px] text-[#6B6B5C] bg-[#E8E3DB] rounded">步行 3 分鐘</span>
                        </div>
                        <p class="text-xs text-gray-600 line-clamp-2">提供免費 WiFi 與插座，不限時。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- 評價區塊 -->
          <section class="p-6 bg-white rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 mb-6">
              <h3 class="font-medium text-gray-800">顧客評價</h3>
              <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">3則評論</span>
            </div>
            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 font-medium text-gray-600 bg-gray-200 rounded-full">U</div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="flex gap-2 text-sm text-gray-700">
                      <span class="font-medium">U貓貓</span>
                      <span class="text-gray-400">2025-12-27</span>
                    </div>
                    <div class="text-yellow-400">★★★★★</div>
                  </div>
                  <p class="mt-2 text-sm leading-relaxed text-gray-600">老闆技術很好，檢查很仔細！</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- 側邊欄 (電腦版) -->
        <div class="w-full lg:w-[320px] flex-shrink-0 hidden lg:block">
          <div class="sticky top-8 space-y-6">
            <div class="p-6 bg-white rounded-2xl shadow-sm">
              <h3 class="mb-4 font-medium text-gray-800">維修廠地圖地點</h3>
              <div class="w-full aspect-square bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <span class="text-4xl mb-2">🗺️</span>
                <span class="text-sm">Google Map 載入中...</span>
              </div>
              <p class="mt-4 text-sm text-gray-500">地址：{{ garage.city }}{{ garage.district }} {{ garage.address }}</p>
              <button
                @click="openGoogleMaps"
                class="mt-4 w-full py-2 text-sm text-[#6B6B5C] bg-[#FAF8F5] border border-[#E8E3DB] rounded-lg hover:bg-[#E8E3DB] transition"
              >
                開啟 Google Maps 導航
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      <!-- End of v-else garage data -->
    </div>

    <!-- 預約流程 -->
    <div v-if="showBookingFlow && garage" class="fixed inset-0 z-50 overflow-y-auto">
      <ServiceSearchFlow
        :garage-id="garage.id"
        :garage-name="garage.name"
        :garage-address="`${garage.city}${garage.district} ${garage.address}`"
        @back="showBookingFlow = false"
      />
    </div>
  </div>
</template>
