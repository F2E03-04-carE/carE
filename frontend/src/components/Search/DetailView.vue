<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpenMap = ref(false)
const isOpenSurroundings = ref(false)

const goBack = () => {
  router.back()
}
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
      <div class="flex flex-col lg:flex-row gap-6 items-start">
        <div class="flex-1 w-full min-w-0 space-y-6">
          <section class="p-6 bg-white rounded-2xl shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex items-end gap-3">
                <h1 class="text-xl font-semibold text-gray-900">匠心汽車維修中心</h1>
                <span class="text-xs text-gray-500 mb-1">台北市咪咪毛毛區 123 號</span>
              </div>
              <div class="text-yellow-400">★★★★★</div>
            </div>
            <div class="mt-4 space-y-2 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <span>店長姓名:</span>
                <span>陳貓貓</span>
              </div>
              <div class="flex items-center gap-2">
                <span>聯絡電話:</span>
                <span>(02) 2345-6789</span>
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
            <div class="mt-6">
              <h3 class="mb-2 font-medium text-gray-800">專修品牌</h3>
              <div class="flex flex-wrap gap-2">
                <span class="px-4 py-1 text-sm bg-[#E8E3DB] rounded-full">Toyota</span>
                <span class="px-4 py-1 text-sm bg-[#E8E3DB] rounded-full">Honda</span>
                <span class="px-4 py-1 text-sm bg-[#E8E3DB] rounded-full">Nissan</span>
                <span class="px-4 py-1 text-sm bg-[#E8E3DB] rounded-full">Mazda</span>
                <span class="px-4 py-1 text-sm bg-[#E8E3DB] rounded-full">Lexus</span>
              </div>
            </div>
            <div class="mt-6">
              <h3 class="mb-2 font-medium text-gray-800">服務項目</h3>
              <div class="flex flex-row gap-8 text-sm text-gray-700 sm:gap-12">
                <ul class="pl-4 space-y-1 list-disc">
                  <li>定期保養</li>
                  <li>變速箱維修</li>
                  <li>冷氣系統</li>
                  <li>鈑金烤漆</li>
                </ul>
                <ul class="pl-4 space-y-1 list-disc">
                  <li>引擎維修</li>
                  <li>煞車系統</li>
                  <li>電路系統</li>
                  <li>輪胎更換</li>
                </ul>
              </div>
            </div>
            <button class="w-full mt-8 py-3 text-white bg-[#6B6B5C] rounded-xl transition hover:opacity-90">立即預約</button>
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
                    <p>地址：台北市咪咪毛毛區 123 號</p>
                  </div>
                  <button class="mt-4 w-full py-2 text-sm text-[#6B6B5C] bg-[#FAF8F5] border border-[#E8E3DB] rounded-lg hover:bg-[#E8E3DB] transition">開啟 Google Maps 導航</button>
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
              <p class="mt-4 text-sm text-gray-500">地址：台北市咪咪毛毛區 123 號</p>
              <button class="mt-4 w-full py-2 text-sm text-[#6B6B5C] bg-[#FAF8F5] border border-[#E8E3DB] rounded-lg hover:bg-[#E8E3DB] transition">開啟 Google Maps 導航</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
