<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goPage = (path: string) => {
  router.push(path)
}

// 側邊欄
const activeTab = computed(() => route.path)

// 工單
const selectedOrder = ref<Order | null>(null)
const showModal = ref(false)

const selectOrder = (order: Order) => {
  selectedOrder.value = order
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

type Status = {
  label: string
  value: string
  icon: string
  color: string
}

type Order = {
  id: string
  name: string
  car: string
  time: string
  status: '進行中' | '待確認' | '已完成'
  statusColor: string
}

// 顏色設定
const statusColors: Record<'進行中' | '待確認' | '已完成', string> = {
  進行中: 'bg-green-400 text-white',
  待確認: 'bg-amber-400 text-white',
  已完成: 'bg-slate-400 text-white',
}

// 隨機時間生成
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const startDate = new Date('2025-01-01T08:00:00')
const endDate = new Date('2025-01-08T18:00:00')

// 工單資料 (ref)
const orders = ref<Order[]>([
  {
    id: 'W-2025-001',
    name: '王小明',
    car: 'Toyota Camry',
    status: '進行中',
    statusColor: statusColors['進行中'],
    time: '',
  },
  {
    id: 'W-2025-002',
    name: '李大華',
    car: 'Honda CR-V',
    status: '待確認',
    statusColor: statusColors['待確認'],
    time: '',
  },
  {
    id: 'W-2025-003',
    name: '張三',
    car: 'BMW X5',
    status: '已完成',
    statusColor: statusColors['已完成'],
    time: '',
  },
  {
    id: 'W-2025-004',
    name: '李四',
    car: 'Audi A6',
    status: '進行中',
    statusColor: statusColors['進行中'],
    time: '',
  },
  {
    id: 'W-2025-005',
    name: '王五',
    car: 'Mercedes C300',
    status: '待確認',
    statusColor: statusColors['待確認'],
    time: '',
  },
  {
    id: 'W-2025-006',
    name: '趙六',
    car: 'Tesla Model 3',
    status: '進行中',
    statusColor: statusColors['進行中'],
    time: '',
  },
  {
    id: 'W-2025-007',
    name: '陳七',
    car: 'Mazda CX-5',
    status: '已完成',
    statusColor: statusColors['已完成'],
    time: '',
  },
  {
    id: 'W-2025-008',
    name: '林八',
    car: 'Nissan X-Trail',
    status: '待確認',
    statusColor: statusColors['待確認'],
    time: '',
  },
])

// 隨機生成時間並排序 (由新到舊)
orders.value.forEach((order) => (order.time = randomDate(startDate, endDate)))
orders.value.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

watch(
  selectedOrder,
  (order) => {
    if (order) {
      order.statusColor = statusColors[order.status]
    }
  },
  { immediate: true, deep: true },
)

const waitingCount = computed(() =>
  orders.value.filter((order) => order.status === '待確認').length.toString(),
)

// 統計卡片
const stats = computed<Status[]>(() => [
  { label: '今日預約', value: '8', icon: '📅', color: 'bg-slate-200' },
  { label: '待處理工單', value: waitingCount.value, icon: '📋', color: 'bg-green-200' },
  { label: '本月完成', value: '156', icon: '📈', color: 'bg-amber-200' },
  { label: '平均處理時間', value: '2.5h', icon: '⏱️', color: 'bg-sky-200' },
])
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-700">
    <!-- 側邊欄 -->
    <aside class="fixed w-[20%] h-screen bg-stone-100 shadow-lg/30 flex flex-col">
      <div class="px-6 py-6 text-xl font-semibold">維修廠後台</div>
      <nav class="flex flex-col px-3 gap-10">
        <button
          @click="goPage('/overview')"
          :class="activeTab === '/overview' ? 'font-bold bg-[#7B8FA1] text-white' : ''"
          class="py-3 rounded-[8px] cursor-pointer hover:bg-slate-300"
        >
          🔍 總覽
        </button>
        <button
          @click="goPage('/work-orders')"
          :class="activeTab === '/work-orders' ? 'font-bold bg-[#7B8FA1] text-white' : ''"
          class="py-3 rounded-[8px] cursor-pointer hover:bg-slate-300"
        >
          📅 工單管理
        </button>
        <button
          @click="goPage('/schedule')"
          :class="activeTab === '/schedule' ? 'font-bold bg-[#7B8FA1] text-white' : ''"
          class="py-3 rounded-[8px] cursor-pointer hover:bg-slate-300"
        >
          📋 行程安排
        </button>
        <button
          @click="goPage('/records')"
          :class="activeTab === '/records' ? 'font-bold bg-[#7B8FA1] text-white' : ''"
          class="py-3 rounded-[8px] cursor-pointer hover:bg-slate-300"
        >
          📈 維修紀錄
        </button>
        <button
          @click="goPage('/facility')"
          :class="activeTab === '/facility' ? 'font-bold bg-[#7B8FA1] text-white' : ''"
          class="py-3 rounded-[8px] cursor-pointer hover:bg-slate-300"
        >
          ⏱️ 廠房資訊
        </button>
        <button
          @click="goPage('/billing')"
          :class="activeTab === '/billing' ? 'font-bold bg-[#7B8FA1] text-white' : ''"
          class="py-3 rounded-[8px] cursor-pointer hover:bg-slate-300"
        >
          💳 付費訂閱
        </button>
      </nav>
      <div class="mt-auto px-6 py-4 text-sm text-slate-400">© 2025 維修廠後台</div>
    </aside>

    <main class="w-[80%] ml-[20%] flex flex-col p-8">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold">總覽</h1>
        <p class="text-slate-400 mt-1">今日維修廠營運概況</p>
      </div>

      <!-- 統計卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div
          v-for="item in stats"
          :key="item.label"
          class="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm"
        >
          <div>
            <p class="text-slate-400 text-sm mb-1">{{ item.label }}</p>
            <p class="text-3xl font-semibold">{{ item.value }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            :class="item.color"
          >
            {{ item.icon }}
          </div>
        </div>
      </div>

      <!-- 工單列表 -->
      <section class="flex flex-col gap-5 bg-white rounded-2xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold">近期工單</h2>

        <div
          v-for="order in orders"
          :key="order.id"
          class="flex items-center justify-between bg-stone-50 rounded-xl px-6 py-4 cursor-pointer hover:bg-slate-100"
          @click="selectOrder(order)"
        >
          <div>
            <div class="font-medium">{{ order.id }} ・ {{ order.name }}</div>
            <div class="text-sm text-slate-400 mt-1">{{ order.car }}</div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-slate-400 text-sm">{{ order.time }}</span>
            <span class="px-4 py-1 rounded-full text-sm" :class="order.statusColor">{{
              order.status
            }}</span>
          </div>
        </div>
      </section>

      <!-- 浮窗 -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl w-[60%] p-6 relative">
          <button
            @click="closeModal"
            class="absolute top-3 right-3 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            ✖
          </button>
          <h2 class="text-lg font-semibold mb-4">{{ selectedOrder?.id }} 詳細資料</h2>

          <div class="space-y-2 text-slate-700">
            <p><strong>客戶：</strong>{{ selectedOrder?.name }}</p>
            <p><strong>車輛：</strong>{{ selectedOrder?.car }}</p>
            <p><strong>預約時間：</strong>{{ selectedOrder?.time }}</p>
            <p>
              <strong>狀態：</strong>
              <span class="px-4 py-1 rounded-full text-sm" :class="selectedOrder?.statusColor">{{
                selectedOrder?.status
              }}</span>
            </p>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium mb-1">更新維修狀態</label>
            <select v-model="selectedOrder!.status" class="w-full border rounded px-2 py-1">
              <option>進行中</option>
              <option>待確認</option>
              <option>已完成</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button @click="closeModal" class="px-3 py-1 bg-slate-300 rounded cursor-pointer">
              取消
            </button>
            <button
              @click="closeModal"
              class="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
