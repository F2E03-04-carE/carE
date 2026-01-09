<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type Status = {
  label: string
  value: string
  icon: string
  color: string
}

type OrderStatus = '進行中' | '待確認' | '已完成'

type Order = {
  id: string
  name: string
  car: string
  time: string
  status: OrderStatus
  statusColor: (typeof statusColors)[OrderStatus]
}

// 浮窗
const selectedOrder = ref<Order | null>(null)
const showModal = ref(false)

const selectOrder = (order: Order) => {
  selectedOrder.value = order
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const statusColors = {
  進行中: 'bg-green-400 text-white',
  待確認: 'bg-amber-400 text-white',
  已完成: 'bg-slate-400 text-white',
} as const

// 時間格式
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function isSameDay(dateStr: string, target: Date) {
  const d = new Date(dateStr)
  return (
    d.getFullYear() === target.getFullYear() &&
    d.getMonth() === target.getMonth() &&
    d.getDate() === target.getDate()
  )
}

function isSameMonth(dateStr: string, target: Date) {
  const d = new Date(dateStr)
  return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth()
}

// 亂數時間（今天前後 2 天）
const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
startDate.setHours(8, 0, 0, 0)

const endDate = new Date()
endDate.setDate(endDate.getDate() + 2)
endDate.setHours(18, 0, 0, 0)

// 工單資料
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

// 亂數時間
orders.value.forEach((order) => (order.time = randomDate(startDate, endDate)))

// 亂數狀態
const statusPool: OrderStatus[] = ['進行中', '待確認', '已完成'] as const

orders.value.forEach((order) => {
  const status = statusPool[Math.floor(Math.random() * statusPool.length)] as OrderStatus
  order.status = status
  order.statusColor = statusColors[status]
})

// 排序
orders.value.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

watch(
  selectedOrder,
  (order) => {
    if (order) order.statusColor = statusColors[order.status]
  },
  { immediate: true, deep: true },
)

// 統計卡片邏輯
// 待確認
const waitingCount = computed(() =>
  orders.value.filter((order) => order.status === '待確認').length.toString(),
)

// 今日預約
const todayOrderCount = computed(() => {
  const today = new Date()
  return orders.value.filter((order) => isSameDay(order.time, today)).length.toString()
})

// 本月完成
const monthCompletedCount = computed(() => {
  const now = new Date()
  return orders.value
    .filter((order) => order.status === '已完成' && isSameMonth(order.time, now))
    .length.toString()
})

const stats = computed<Status[]>(() => [
  { label: '今日預約', value: todayOrderCount.value, icon: '📅', color: 'bg-slate-200' },
  { label: '待確認工單', value: waitingCount.value, icon: '📋', color: 'bg-green-200' },
  { label: '本月完成', value: monthCompletedCount.value, icon: '📈', color: 'bg-amber-200' },
])
</script>

<template>
  <div class="mb-8">
    <h1 class="text-2xl font-semibold">總覽</h1>
    <p class="text-slate-400 mt-1">今日維修廠營運概況</p>
  </div>

  <!-- 統計卡片 -->
  <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-10">
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
        <span class="px-4 py-1 rounded-full text-sm" :class="order.statusColor">
          {{ order.status }}
        </span>
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
          <span class="px-4 py-1 rounded-full text-sm" :class="selectedOrder?.statusColor">
            {{ selectedOrder?.status }}
          </span>
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
        <button @click="closeModal" class="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">
          確認
        </button>
      </div>
    </div>
  </div>
</template>
