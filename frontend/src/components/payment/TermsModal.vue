<script setup lang="ts">
import { ref, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

interface Props {
  isOpen: boolean;
  initialTab?: 'terms' | 'privacy'; 
}

const props = withDefaults(defineProps<Props>(), {
  initialTab: 'terms'
});

const emit = defineEmits<{
  close: [];
}>();
const currentTab = ref<'terms' | 'privacy'>(props.initialTab);

function switchTab(tab: 'terms' | 'privacy') {
  currentTab.value = tab;
}

function handleClose() {
  emit('close');
}

const title = computed(() => {
  return currentTab.value === 'terms' ? '服務條款' : '隱私權政策';
});
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="handleClose" class="relative z-[60]">

      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              <div class="bg-gradient-to-r from-[#6b6b5a] to-[#8a8a7d] px-6 py-5">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-2xl font-bold text-white">
                    {{ title }}
                  </DialogTitle>
                  <button
                    @click="handleClose"
                    class="rounded-full p-1 text-white hover:bg-white/20 transition-colors"
                  >
                    <span class="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>

                <div class="mt-4 flex space-x-2">
                  <button
                    @click="switchTab('terms')"
                    class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    :class="[
                      currentTab === 'terms'
                        ? 'bg-white text-[#6b6b5a]'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    ]"
                  >
                    服務條款
                  </button>
                  <button
                    @click="switchTab('privacy')"
                    class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    :class="[
                      currentTab === 'privacy'
                        ? 'bg-white text-[#6b6b5a]'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    ]"
                  >
                    隱私權政策
                  </button>
                </div>
              </div>

              <div class="max-h-[60vh] overflow-y-auto px-6 py-6">
                <div v-if="currentTab === 'terms'" class="space-y-6 text-[#4a4a43]">
                  <section>
                    <h3 class="text-lg font-bold mb-3">一、服務說明</h3>
                    <p class="text-sm leading-relaxed">
                      carE 提供車主與維修廠的資訊媒合服務，包括搜尋、預約、評價等功能。本平台僅為媒合平台，實際服務由各維修廠提供。
                    </p>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">二、會員註冊</h3>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>您必須年滿 18 歲且具有完全行為能力</li>
                      <li>應提供真實、正確且完整的註冊資訊</li>
                      <li>妥善保管帳號密碼，不得借予他人使用</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">三、使用規範</h3>
                    <p class="text-sm leading-relaxed mb-2">使用本平台時，您不得：</p>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>上傳違法、誹謗或不當內容</li>
                      <li>冒用他人名義或提供虛假資訊</li>
                      <li>濫用評價系統（刷好評、惡意負評）</li>
                      <li>干擾或破壞系統運作</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">四、訂閱方案</h3>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li><strong>免費試用：</strong>30 天試用期，期滿後僅保留基本展示功能</li>
                      <li><strong>永久會員：</strong>一次付費 NT$ 5,555，永久享有完整功能</li>
                      <li>付費後除法律另有規定外，恕不接受退款</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">五、免責聲明</h3>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>本平台不保證服務不中斷或無錯誤</li>
                      <li>不對維修廠服務品質或糾紛負責</li>
                      <li>不保證搜尋結果的完整性或準確性</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">六、準據法</h3>
                    <p class="text-sm leading-relaxed">
                      本服務條款依中華民國法律處理，並以台灣台北地方法院為第一審管轄法院。
                    </p>
                  </section>

                  <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p class="text-xs text-blue-900">
                      <strong>完整條款：</strong>詳細內容請參閱
                      <a href="/terms" target="_blank" class="text-[#6b6b5a] hover:underline font-semibold">
                        完整版服務條款
                      </a>
                    </p>
                  </div>
                </div>

                <div v-else class="space-y-6 text-[#4a4a43]">
                  <section>
                    <h3 class="text-lg font-bold mb-3">一、資料蒐集</h3>
                    <p class="text-sm leading-relaxed mb-2">我們可能蒐集以下資料：</p>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>個人資訊：姓名、Email、手機號碼</li>
                      <li>車輛資訊：車款、車牌號碼（選填）</li>
                      <li>使用紀錄：瀏覽行為、Cookie</li>
                      <li>地理位置：需經您同意</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">二、資料用途</h3>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>提供服務：會員管理、預約處理、評價發布</li>
                      <li>改善體驗：個人化推薦、距離排序</li>
                      <li>客戶支援：處理諮詢與技術支援</li>
                      <li>行銷推廣：需經您同意</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">三、資料分享</h3>
                    <p class="text-sm leading-relaxed mb-2">我們不會販售您的資料，但可能在以下情況分享：</p>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>與您預約的維修廠分享必要資訊</li>
                      <li>與第三方金流服務商（應援 Pay、LINE Pay）</li>
                      <li>基於法律要求或主管機關命令</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">四、資料安全</h3>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>使用 SSL/TLS 加密傳輸</li>
                      <li>僅授權人員可存取個人資料</li>
                      <li>定期備份與安全監控</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">五、您的權利</h3>
                    <p class="text-sm leading-relaxed mb-2">您可以：</p>
                    <ul class="text-sm space-y-2 list-disc list-inside">
                      <li>查詢或請求閱覽您的個人資料</li>
                      <li>要求補充或更正錯誤資料</li>
                      <li>要求停止處理或刪除資料</li>
                    </ul>
                  </section>

                  <section>
                    <h3 class="text-lg font-bold mb-3">六、Cookie 使用</h3>
                    <p class="text-sm leading-relaxed">
                      我們使用 Cookie 來記錄您的偏好設定與使用行為。您可以透過瀏覽器設定拒絕 Cookie，但可能影響部分功能。
                    </p>
                  </section>

                  <div class="mt-6 p-4 bg-green-50 rounded-lg">
                    <p class="text-xs text-green-900">
                      <strong>完整政策：</strong>詳細內容請參閱
                      <a href="/privacy" target="_blank" class="text-[#6b6b5a] hover:underline font-semibold">
                        完整版隱私權政策
                      </a>
                    </p>
                  </div>

                  <div class="p-4 bg-gray-50 rounded-lg">
                    <p class="text-xs text-gray-700">
                      <strong>📧 聯絡我們：</strong>privacy@care.com.tw<br>
                      <strong>📞 客服專線：</strong>0800-XXX-XXX
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <button
                  @click="handleClose"
                  class="w-full py-3 bg-[#6b6b5a] hover:bg-[#5a5a4a] text-white font-semibold rounded-lg transition-colors"
                >
                  我已了解
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
