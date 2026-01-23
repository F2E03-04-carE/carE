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
          <h1 class="text-3xl font-bold text-white">隱私權政策</h1>
          <p class="text-white/80 mt-2">Privacy Policy</p>
        </div>

        <div class="px-6 py-8 space-y-8 text-[#4a4a43]">
          <section>
            <h3 class="text-xl font-bold mb-4">一、資料蒐集</h3>
            <p class="text-base leading-relaxed mb-3">我們可能蒐集以下資料：</p>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>個人資訊：姓名、Email、手機號碼</li>
              <li>車輛資訊：車款、車牌號碼（選填）</li>
              <li>使用紀錄：瀏覽行為、Cookie</li>
              <li>地理位置：需經您同意</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">二、資料用途</h3>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>提供服務：會員管理、預約處理、評價發布</li>
              <li>改善體驗：個人化推薦、距離排序</li>
              <li>客戶支援：處理諮詢與技術支援</li>
              <li>行銷推廣：需經您同意</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">三、資料分享</h3>
            <p class="text-base leading-relaxed mb-3">我們不會販售您的資料，但可能在以下情況分享：</p>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>與您預約的維修廠分享必要資訊</li>
              <li>與第三方金流服務商（應援 Pay、LINE Pay）</li>
              <li>基於法律要求或主管機關命令</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">四、資料安全</h3>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>使用 SSL/TLS 加密傳輸</li>
              <li>僅授權人員可存取個人資料</li>
              <li>定期備份與安全監控</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">五、您的權利</h3>
            <p class="text-base leading-relaxed mb-3">您可以：</p>
            <ul class="space-y-3 list-disc list-inside text-base">
              <li>查詢或請求閱覽您的個人資料</li>
              <li>要求補充或更正錯誤資料</li>
              <li>要求停止處理或刪除資料</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-4">六、Cookie 使用</h3>
            <p class="text-base leading-relaxed">
              我們使用 Cookie 來記錄您的偏好設定與使用行為。您可以透過瀏覽器設定拒絕 Cookie，但可能影響部分功能。
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
