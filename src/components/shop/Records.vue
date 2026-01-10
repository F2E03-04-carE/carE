<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

type RecordItem = {
  id: number
  date: string
  title: string
  desc: string
  price: number
}

type Owner = {
  id: number
  name: string
  phone: string
  car: string
  records: RecordItem[]
}

const keyword = ref('')

// 假資料
const owners = reactive<Owner[]>([
  {
    id: 1,
    name: '王小明',
    phone: '0912-345-678',
    car: 'Toyota Camry 2020',
    records: [
      { id: 1, date: '2024-11-15', title: '定期保養', desc: '更換機油、濾芯', price: 3500 },
      { id: 2, date: '2024-08-20', title: '輪胎更換', desc: '四輪更換', price: 12000 },
      { id: 3, date: '2024-05-10', title: '煞車檢修', desc: '煞車皮更換', price: 3500 },
    ],
  },
  {
    id: 2,
    name: '李大華',
    phone: '0923-456-789',
    car: 'Honda CR-V 2019',
    records: [{ id: 1, date: '2024-10-01', title: '冷氣檢修', desc: '冷媒補充', price: 2800 }],
  },
])

const activeTabs = reactive<Record<number, 'records' | 'stats'>>({})

const getTab = (id: number) => activeTabs[id] ?? 'records'
const setTab = (id: number, tab: 'records' | 'stats') => {
  activeTabs[id] = tab
}

const filteredOwners = computed(() => {
  if (!keyword.value) return owners
  return owners.filter((owner) => `${owner.name}${owner.phone}${owner.car}`.includes(keyword.value))
})

const totalPrice = (owner: Owner) => owner.records.reduce((sum, r) => sum + r.price, 0)
const lastRepairDate = (owner: Owner) =>
  owner.records.slice().sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? '-'
</script>

<template>
  <div class="min-h-screen space-y-6">
    <!-- 標題 -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-[#4a4a43]">維修紀錄</h1>
      <p class="mt-1 text-[#8a8a7d]">查詢車主過往維修紀錄</p>
    </div>

    <!-- 搜尋欄 -->
    <div class="mb-8 flex items-center gap-4 rounded-2xl bg-[#f5f4f0] p-6 shadow-sm">
      <div class="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3">
        <svg
          class="h-5 w-5 text-[#8a8a7d]"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋客戶姓名、電話或車輛..."
          class="w-full bg-transparent text-[#4a4a43] placeholder-[#8a8a7d] outline-none"
        />
      </div>
    </div>

    <!-- 客戶卡片 -->
    <div
      v-for="owner in filteredOwners"
      :key="owner.id"
      class="bg-white rounded-2xl shadow overflow-hidden"
    >
      <!-- 客戶基本資料 -->
      <div class="px-6 py-4 bg-[#f5f4f0]">
        <div>
          <div class="font-semibold text-[#4a4a43]">{{ owner.name }}</div>
          <div class="text-sm text-[#8a8a7d]">{{ owner.phone }} ・ {{ owner.car }}</div>
        </div>
      </div>

      <!-- Tab 切換 -->
      <div class="px-6 py-4">
        <div class="flex gap-2 bg-[#f5f4f0] rounded-full p-1">
          <button
            class="flex-1 py-2 rounded-full text-sm font-medium cursor-pointer"
            :class="
              getTab(owner.id) === 'records'
                ? 'bg-[#6b6b5a] text-white shadow'
                : 'bg-[#f5f4f0] text-[#4a4a43] hover:bg-[#e3e2dc]'
            "
            @click="setTab(owner.id, 'records')"
          >
            維修歷程
          </button>
          <button
            class="flex-1 py-2 rounded-full text-sm font-medium cursor-pointer"
            :class="
              getTab(owner.id) === 'stats'
                ? 'bg-[#6b6b5a] text-white shadow'
                : 'bg-[#f5f4f0] text-[#4a4a43] hover:bg-[#e3e2dc]'
            "
            @click="setTab(owner.id, 'stats')"
          >
            統計資訊
          </button>
        </div>
      </div>

      <!-- 維修歷程 -->
      <div v-show="getTab(owner.id) === 'records'" class="px-6 pb-6 space-y-4">
        <div
          v-for="record in owner.records"
          :key="record.id"
          class="flex justify-between bg-[#f5f4f0] rounded-xl p-4"
        >
          <div>
            <div class="text-sm text-[#8a8a7d]">📅 {{ record.date }}</div>
            <div class="font-medium text-[#4a4a43]">🔧 {{ record.title }}</div>
            <div class="text-sm text-[#8a8a7d]">{{ record.desc }}</div>
          </div>
          <div class="font-semibold text-green-600">NT${{ record.price.toLocaleString() }}</div>
        </div>
      </div>

      <!-- 統計資訊 -->
      <div
        v-show="getTab(owner.id) === 'stats'"
        class="px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div class="bg-[#f5f4f0] rounded-xl p-4">
          <div class="text-sm text-[#8a8a7d]">總維修次數</div>
          <div class="text-2xl font-semibold text-[#4a4a43]">{{ owner.records.length }}</div>
        </div>
        <div class="bg-[#f5f4f0] rounded-xl p-4">
          <div class="text-sm text-[#8a8a7d]">總消費金額</div>
          <div class="text-2xl font-semibold text-[#4a4a43]">
            NT${{ totalPrice(owner).toLocaleString() }}
          </div>
        </div>
        <div class="bg-[#f5f4f0] rounded-xl p-4">
          <div class="text-sm text-[#8a8a7d]">最近維修</div>
          <div class="text-2xl font-semibold text-[#4a4a43]">{{ lastRepairDate(owner) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
