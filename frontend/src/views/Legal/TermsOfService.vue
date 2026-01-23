<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-[#6b6b5a] to-[#8a8a7d] px-6 py-8">
          <h1 class="text-3xl font-bold text-white">服務條款</h1>
          <p class="text-white/80 mt-2">Terms of Service</p>
        </div>

        <div class="px-6 py-8 space-y-8 text-[#4a4a43]">
          <section>
            <h3 class="text-xl font-bold mb-4">一、服務說明</h3>
            <p class="text-base leading-relaxed">
              carE 提供車主與維修廠的資訊媒合服務，包括搜尋、預約、評價等功能。本平台僅為媒合平台，實際服務由各維修廠提供。
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">二、會員註冊</h3>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>您必須年滿 18 歲且具有完全行為能力</li>
              <li>應提供真實、正確且完整的註冊資訊</li>
              <li>妥善保管帳號密碼，不得借予他人使用</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">三、使用規範</h3>
            <p class="text-base leading-relaxed mb-3">使用本平台時，您不得：</p>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>上傳違法、誹謗或不當內容</li>
              <li>冒用他人名義或提供虛假資訊</li>
              <li>濫用評價系統（刷好評、惡意負評）</li>
              <li>干擾或破壞系統運作</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">四、訂閱方案</h3>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li><strong>免費試用：</strong>30 天試用期，期滿後僅保留基本展示功能</li>
              <li><strong>永久會員：</strong>一次付費 NT$ 5,555，永久享有完整功能</li>
              <li>付費後除法律另有規定外，恕不接受退款</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">五、免責聲明</h3>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>本平台不保證服務不中斷或無錯誤</li>
              <li>不對維修廠服務品質或糾紛負責</li>
              <li>不保證搜尋結果的完整性或準確性</li>
              <li>對於因使用本平台所產生的任何直接、間接、附帶或衍生性損害不負任何責任</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">六、準據法</h3>
            <p class="text-base leading-relaxed">
              本服務條款依中華民國法律處理，並以台灣台北地方法院為第一審管轄法院。
            </p>
          </section>

          <section class="text-sm text-gray-500 pt-4 border-t">
            <p>最後更新日期：2026年1月</p>
          </section>
        </div>

        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            @click="goBack"
            class="w-full py-3 bg-[#6b6b5a] hover:bg-[#5a5a4a] text-white font-semibold rounded-lg transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
