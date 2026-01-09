<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

/* ========= 型別 ========= */
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

/* ========= 搜尋 ========= */
const keyword = ref('')

/* ========= 假資料 ========= */
const owners = reactive<Owner[]>([
  {
    id: 1,
    name: '王小明',
    phone: '0912-345-678',
    car: 'Toyota Camry 2020',
    records: [
      {
        id: 1,
        date: '2024-11-15',
        title: '定期保養',
        desc: '更換機油、濾芯',
        price: 3500,
      },
      {
        id: 2,
        date: '2024-08-20',
        title: '輪胎更換',
        desc: '四輪更換',
        price: 12000,
      },
      {
        id: 3,
        date: '2024-05-10',
        title: '煞車檢修',
        desc: '煞車皮更換',
        price: 3500,
      },
    ],
  },
  {
    id: 2,
    name: '李大華',
    phone: '0923-456-789',
    car: 'Honda CR-V 2019',
    records: [
      {
        id: 1,
        date: '2024-10-01',
        title: '冷氣檢修',
        desc: '冷媒補充',
        price: 2800,
      },
    ],
  },
])

/* ========= Tab 狀態（關鍵） ========= */
const activeTabs = reactive<Record<number, 'records' | 'stats'>>({})

const getTab = (id: number) => activeTabs[id] ?? 'records'
const setTab = (id: number, tab: 'records' | 'stats') => {
  activeTabs[id] = tab
}

/* ========= Computed ========= */
const filteredOwners = computed(() => {
  if (!keyword.value) return owners
  return owners.filter((o) => `${o.name}${o.phone}${o.car}`.includes(keyword.value))
})

const totalPrice = (owner: Owner) => owner.records.reduce((sum, r) => sum + r.price, 0)

const lastRepairDate = (owner: Owner) =>
  owner.records.slice().sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? '-'

/* ========= UI Class ========= */
const activeTabClass = 'bg-white shadow text-gray-900 font-medium'
const inactiveTabClass = 'text-gray-500 hover:text-gray-700'
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 space-y-6">
    <!-- 搜尋 -->
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <input
        v-model="keyword"
        placeholder="搜尋客戶姓名、電話或車輛..."
        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
    </div>

    <!-- 車主卡片 -->
    <div
      v-for="owner in filteredOwners"
      :key="owner.id"
      class="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      <!-- Header -->
      <div class="px-6 py-4 bg-gray-100">
        <div>
          <div class="font-semibold">{{ owner.name }}</div>
          <div class="text-sm text-gray-500">{{ owner.phone }} ・ {{ owner.car }}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-6 py-4">
        <div class="flex bg-gray-200 rounded-full p-1">
          <button
            class="flex-1 py-2 rounded-full text-sm"
            :class="getTab(owner.id) === 'records' ? activeTabClass : inactiveTabClass"
            @click="setTab(owner.id, 'records')"
          >
            維修歷程
          </button>
          <button
            class="flex-1 py-2 rounded-full text-sm"
            :class="getTab(owner.id) === 'stats' ? activeTabClass : inactiveTabClass"
            @click="setTab(owner.id, 'stats')"
          >
            統計資訊
          </button>
        </div>
      </div>

      <!-- 維修歷程 -->
      <div v-show="getTab(owner.id) === 'records'" class="px-6 pb-6 space-y-4">
        <div
          v-for="r in owner.records"
          :key="r.id"
          class="flex justify-between bg-gray-100 rounded-xl p-4"
        >
          <div>
            <div class="text-sm text-gray-500">📅 {{ r.date }}</div>
            <div class="font-medium">🔧 {{ r.title }}</div>
            <div class="text-sm text-gray-500">{{ r.desc }}</div>
          </div>
          <div class="font-semibold text-green-600">NT${{ r.price.toLocaleString() }}</div>
        </div>
      </div>

      <!-- 統計資訊（保證有內容） -->
      <div
        v-show="getTab(owner.id) === 'stats'"
        class="px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div class="bg-gray-100 rounded-xl p-4">
          <div class="text-sm text-gray-500">總維修次數</div>
          <div class="text-2xl font-semibold">
            {{ owner.records.length }}
          </div>
        </div>

        <div class="bg-gray-100 rounded-xl p-4">
          <div class="text-sm text-gray-500">總消費金額</div>
          <div class="text-2xl font-semibold">NT${{ totalPrice(owner).toLocaleString() }}</div>
        </div>

        <div class="bg-gray-100 rounded-xl p-4">
          <div class="text-sm text-gray-500">最近維修</div>
          <div class="text-2xl font-semibold">
            {{ lastRepairDate(owner) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
