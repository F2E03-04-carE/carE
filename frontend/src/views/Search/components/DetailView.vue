<template>
  <div class="min-h-screen py-8 bg-[#FAF8F5] min-w-[450px]">
    <div class="max-w-6xl mx-auto px-4">
      <div class="inline-flex items-center px-4 py-2 mb-4 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">← 返回搜尋結果</div>
      <div class="flex flex-col lg:flex-row gap-6 items-start">
        <div class="flex-1 w-full min-w-0 space-y-6">
          <section class="p-6 bg-white rounded-2xl shadow-sm">
            <div class="flex items-start justify-between">
              <h1 class="text-xl font-semibold text-gray-900">匠心汽車維修中心</h1>
              <div class="text-yellow-400">★★★★★</div>
            </div>
            <div class="mt-4 space-y-2 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <span>店家地址:</span>
                <span>台北市咪咪毛毛區 123 號</span>
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
                <span class="px-16 py-1 text-sm bg-[#E8E3DB] rounded-full">Toyota</span>
                <span class="px-16 py-1 text-sm bg-[#E8E3DB] rounded-full">Honda</span>
                <span class="px-16 py-1 text-sm bg-[#E8E3DB] rounded-full">Nissan</span>
                <span class="px-16 py-1 text-sm bg-[#E8E3DB] rounded-full">Mazda</span>
                <span class="px-16 py-1 text-sm bg-[#E8E3DB] rounded-full">Lexus</span>
              </div>
            </div>
            <div class="mt-6">
              <h3 class="mb-2 font-medium text-gray-800">服務項目</h3>
              <div class="flex flex-col gap-2 text-sm text-gray-700 sm:flex-row sm:gap-12">
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
          </section>
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
                  <p class="mt-2 text-sm leading-relaxed text-gray-600">
                    老闆技術很好，檢查很仔細，雖然是老車但也修得跟新的一樣！原本以為變速箱要大修，結果只是小零件問題，非常誠實的店家，大推！
                  </p>
                  <div class="mt-3 p-3 bg-[#F5F4F1] rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-bold text-gray-700">店家回覆</span>
                      <span class="text-[10px] text-gray-400">2025-12-27</span>
                    </div>
                    <p class="text-xs text-gray-600">
                      感謝U先生的支持！能幫您省下不必要的罐罐是我們應該做的，老車好好保養還能開很久的，有問題隨時回來！
                    </p>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-100"></div>
              <div class="flex gap-4">
                <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 font-medium text-gray-600 bg-[#E8E3DB] rounded-full">D</div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="flex gap-2 text-sm text-gray-700">
                      <span class="font-medium">D貓貓</span>
                      <span class="text-gray-400">2025-12-20</span>
                    </div>
                    <div class="text-yellow-400">★★★★★</div>
                  </div>
                  <p class="mt-2 text-sm leading-relaxed text-gray-600">
                    冷氣突然不冷，跑了好幾家都說要換整組，這裡師傅幫我抓到是管路洩漏，補好灌冷媒就超級冷，省了一大筆錢！休息區還有路易莎咖啡可以喝，很貼心。
                  </p>
                  <div class="mt-3 p-3 bg-[#F5F4F1] rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-bold text-gray-700">店家回覆</span>
                      <span class="text-[10px] text-gray-400">2025-12-21</span>
                    </div>
                    <p class="text-xs text-gray-600">
                      謝謝D小姐的肯定！夏天冷氣真的很重要，很高興能解決您的困擾。
                    </p>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-100"></div>
              <div class="flex gap-4">
                <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 font-medium text-white bg-[#6B6B5C] rounded-full">T</div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="flex gap-2 text-sm text-gray-700">
                      <span class="font-medium">T貓貓</span>
                      <span class="text-gray-400">2025-12-15</span>
                    </div>
                    <div class="text-yellow-400">★★★★☆</div>
                  </div>
                  <p class="mt-2 text-sm leading-relaxed text-gray-600">
                    定期保養速度很快，價格公道透明。唯一的缺點是假日人有點多，建議大家要提早預約才不會等太久。
                  </p>
                  </div>
              </div>
            </div>
            <button class="w-full mt-6 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">查看更多評論</button>
          </section>
        </div>
        <div class="w-full lg:w-[320px] flex-shrink-0">
          <div class="sticky top-8 space-y-6">
            <div class="p-6 bg-white rounded-2xl shadow-sm">
              <h3 class="mb-4 font-medium text-gray-800">維修廠地圖地點</h3>
              <div class="w-full aspect-square bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <span class="text-4xl mb-2">🗺️</span>
                <span class="text-sm">Google Map 載入中...</span>
              </div>
              <div class="mt-4 text-sm text-gray-500">
                <p>地址：台北市咪咪毛毛區 123 號</p>
              </div>
              <button class="mt-4 w-full py-2 text-sm text-[#6B6B5C] bg-[#FAF8F5] border border-[#E8E3DB] rounded-lg hover:bg-[#E8E3DB] transition">開啟 Google Maps 導航</button>
            </div>
            <section class="p-6 bg-white rounded-2xl shadow-sm">
              <h3 class="mb-4 font-medium text-gray-800">周邊休息地點</h3>
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
                <div class="flex gap-3 p-3 border border-gray-100 rounded-xl transition hover:bg-gray-50">
                  <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-xl bg-[#FAF8F5] rounded-lg">🏪</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="text-sm font-medium text-gray-900 truncate">7-11 毛毛門市</h4>
                      <span class="px-1.5 py-0.5 text-[10px] text-[#6B6B5C] bg-[#E8E3DB] rounded">步行 1 分鐘</span>
                    </div>
                    <p class="text-xs text-gray-600 line-clamp-2">店內設有寬敞用餐區與廁所。</p>
                  </div>
                </div>
                <div class="flex gap-3 p-3 border border-gray-100 rounded-xl transition hover:bg-gray-50">
                  <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-xl bg-[#FAF8F5] rounded-lg">🌳</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="text-sm font-medium text-gray-900 truncate">毛毛防災公園</h4>
                      <span class="px-1.5 py-0.5 text-[10px] text-[#6B6B5C] bg-[#E8E3DB] rounded">步行 8 分鐘</span>
                    </div>
                    <p class="text-xs text-gray-600 line-clamp-2">天氣好時適合散步。</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>