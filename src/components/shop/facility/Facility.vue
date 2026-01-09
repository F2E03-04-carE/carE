<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* ===== 表單資料（示意，可自行擴充） ===== */
const form = ref({
  name: '安心汽車維修廠',
  phone: '02-1234-5678',
  address: '台北市中正區忠孝西路一段 100 號',
  businessHours: '09:00 - 18:00',
})

/* ===== 浮窗狀態 ===== */
const showModal = ref(false)
const countdown = ref(5)
let timer: number | null = null

/* ===== 儲存 ===== */
const saveFacilityInfo = () => {
  // 👉 這裡未來接 API
  console.log('save form:', form.value)

  openModal()
}

/* ===== 浮窗控制 ===== */
const openModal = () => {
  showModal.value = true
  countdown.value = 5

  timer = window.setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      goFacilityPage()
    }
  }, 1000)
}

const goFacilityPage = () => {
  clearTimer()
  showModal.value = false
  router.push('/facilityInfo')
}

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onUnmounted(() => {
  clearTimer()
})
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-semibold">廠房資訊</h1>
      <p class="text-slate-400 mt-1">編輯車廠後台相關基本資料</p>
    </div>

    <!-- 表單 -->
    <div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">車廠名稱</label>
        <input v-model="form.name" class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">聯絡電話</label>
        <input v-model="form.phone" class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">地址</label>
        <input v-model="form.address" class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">營業時間</label>
        <input v-model="form.businessHours" class="w-full border rounded px-3 py-2" />
      </div>

      <div class="flex justify-end">
        <button
          @click="saveFacilityInfo"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          儲存設定
        </button>
      </div>
    </div>
  </div>

  <!-- 浮窗提示 -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
  >
    <div class="bg-white rounded-2xl w-[420px] p-6 text-center space-y-4">
      <h2 class="text-lg font-semibold">設定已完成 ✅</h2>

      <p class="text-slate-600">{{ countdown }} 秒後將自動前往車廠資訊頁面</p>

      <button
        @click="goFacilityPage"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900"
      >
        立即前往
      </button>
    </div>
  </div>
</template>
