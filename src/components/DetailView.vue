<template>
  <div class="min-h-screen py-8 bg-[#FAF8F5] min-w-[450px]">
    <div class="max-w-3xl mx-auto px-4">
      <div class="inline-flex items-center px-4 py-2 mb-4 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">← 返回搜尋結果</div>
      <section class="p-6 bg-white rounded-2xl shadow-sm">
        <div class="flex items-start justify-between">
          <h1 class="text-xl font-semibold text-gray-900">匠心汽車維修中心</h1>
          <div class="text-gray-500">★★★★★</div>
        </div>
        <div class="mt-4 space-y-2 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span>地標svg</span>
            <span>台北市咪咪毛毛區 123 號</span>
          </div>
          <div class="flex items-center gap-2">
            <span>電話svg</span>
            <span>(02) 2345-6789</span>
          </div>
        </div>
        <!-- 需要串資料，這邊僅切版 -->
        <div class="mt-6">
          <h3 class="mb-2 font-medium text-gray-800">專修品牌</h3>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-sm bg-[#E8E3DB] rounded-full">Toyota</span>
            <span class="px-3 py-1 text-sm bg-[#E8E3DB] rounded-full">Honda</span>
            <span class="px-3 py-1 text-sm bg-[#E8E3DB] rounded-full">Nissan</span>
            <span class="px-3 py-1 text-sm bg-[#E8E3DB] rounded-full">Mazda</span>
            <span class="px-3 py-1 text-sm bg-[#E8E3DB] rounded-full">Lexus</span>
          </div>
        </div>
        <!-- 需要串資料，這邊僅切版 -->
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
        <!-- 需要串資料，這邊僅切版 -->
      <section class="mt-6 p-6 bg-white rounded-2xl shadow-sm">
        <h3 class="mb-4 font-medium text-gray-800">顧客評價</h3>
        <div class="flex gap-3">
          <div class="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">毛</div>
          <div class="text-sm">
            <div class="flex gap-2 text-gray-700">
              <span class="font-medium">王貓貓</span>
              <span class="text-gray-400">2025-12-27</span>
              <div class="text-[#4A4A44]"> ★★★★★ </div>
            </div>
            <p class="mt-2 text-gray-600 leading-relaxed">213123123</p>
            <div class="mt-3 p-3 bg-[#F5F4F1] rounded-lg">
              <span class="block mb-1 text-xs font-bold text-gray-500">店家回覆：</span>
              <p class="text-xs text-gray-600">感謝王OO的支持！能處理您咪咪毛毛的問題是我們的榮幸。</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div>車廠周邊休息地點</div>
      </section>
    </div>
  </div>
</template>