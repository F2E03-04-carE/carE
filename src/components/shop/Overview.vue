<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type OrderStatus = '進行中' | '待確認' | '已完成'

interface Order {
  id: string
  name: string
  car: string
  service: string
  status: OrderStatus
  statusColor: string
  requestTime: string
  date: string
  time: string
}

// 狀態顏色對應
const statusColors = {
  進行中: 'bg-green-400 text-white',
  待確認: 'bg-amber-400 text-white',
  已完成: 'bg-slate-400 text-white',
} as const

const statusClass = (status: OrderStatus) => statusColors[status] || 'bg-gray-400 text-white'

// 浮窗控制
const selectedOrder = ref<Order | null>(null)
const showDetailModal = ref(false)
const tempStatus = ref<OrderStatus>('待確認')

const openModal = (order: Order) => {
  selectedOrder.value = order
  tempStatus.value = order.status
  showDetailModal.value = true
}

const closeModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

// 儲存浮窗狀態
const saveStatus = () => {
  if (selectedOrder.value) {
    selectedOrder.value.status = tempStatus.value
  }
  closeModal()
}

// 範例工單資料
const orders = ref<Order[]>([
  {
    id: 'W-2026-001',
    name: '王小明',
    car: 'Toyota Camry',
    service: '定期保養',
    status: '進行中',
    statusColor: statusColors['進行中'],
    requestTime: '2026-01-07 14:20',
    date: '2026-01-09',
    time: '09:30',
  },
  {
    id: 'W-2026-002',
    name: '李大華',
    car: 'Honda CR-V',
    service: '引擎檢修',
    status: '待確認',
    statusColor: statusColors['待確認'],
    requestTime: '2026-01-06 09:50',
    date: '2026-01-09',
    time: '10:00',
  },
  {
    id: 'W-2026-003',
    name: '張三',
    car: 'BMW X5',
    service: '煞車檢修',
    status: '已完成',
    statusColor: statusColors['已完成'],
    requestTime: '2026-01-05 11:15',
    date: '2026-01-08',
    time: '13:00',
  },
  {
    id: 'W-2026-004',
    name: '林小七',
    car: 'Audi A6',
    service: '輪胎更換',
    status: '已完成',
    statusColor: statusColors['已完成'],
    requestTime: '2026-01-02 10:00',
    date: '2026-01-09',
    time: '14:00',
  },
])

// 日期工具
const today = new Date()
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

// 統計卡片（動態綁訂 orders）
const todayOrderCount = computed(
  () => orders.value.filter((order) => isSameDay(order.date, today)).length,
)
const waitingCount = computed(
  () => orders.value.filter((order) => order.status === '待確認').length,
)
const monthCompletedCount = computed(
  () =>
    orders.value.filter((order) => order.status === '已完成' && isSameMonth(order.date, today))
      .length,
)

const stats = computed(() => [
  { label: '今日預約', value: todayOrderCount.value.toString(), icon: '📅', color: 'bg-slate-200' },
  { label: '待確認工單', value: waitingCount.value.toString(), icon: '📋', color: 'bg-green-200' },
  {
    label: '本月完成',
    value: monthCompletedCount.value.toString(),
    icon: '📈',
    color: 'bg-amber-200',
  },
])

// 當浮窗更新狀態時，也更新 orders 裡的狀態顏色
watch(
  orders,
  (ordersList) => {
    ordersList.forEach((order) => {
      order.statusColor = statusColors[order.status]
    })
  },
  { deep: true },
)
</script>

<template>
  <!-- 標題 -->
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
  <section class="space-y-6">
    <div
      v-for="order in orders"
      :key="order.id"
      class="rounded-2xl border border-gray-200 bg-white p-8"
    >
      <div class="mb-6 flex items-center gap-4">
        <span class="text-gray-500">{{ order.id }}</span>
        <span
          class="flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium text-white"
          :class="statusClass(order.status)"
        >
          {{ order.status }}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- 客戶資訊 -->
        <div class="space-y-2">
          <p class="mb-2 text-gray-400 font-medium">客戶資訊</p>
          <p class="text-lg font-medium text-gray-800">{{ order.name }}</p>
        </div>

        <!-- 維修資訊 -->
        <div class="space-y-2 border-l border-gray-200 pl-6">
          <p class="mb-2 text-gray-400 font-medium">車輛資訊</p>
          <p class="text-lg font-medium text-gray-800">{{ order.car }}</p>
          <p class="mt-4 mb-1 text-gray-400 font-medium">維修項目</p>
          <p class="text-gray-500">{{ order.service }}</p>
        </div>

        <!-- 時間與操作 -->
        <div class="space-y-4 border-l border-gray-200 pl-6 flex flex-col justify-between">
          <div class="space-y-1">
            <p class="text-sm text-gray-400 font-medium">提出申請時間</p>
            <p class="font-medium text-gray-700">{{ order.requestTime }}</p>

            <p class="text-sm text-gray-400 mt-2">預約維修時間</p>
            <p class="font-medium text-gray-700">{{ order.date }} {{ order.time }}</p>
          </div>
          <div>
            <button
              class="w-36 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              @click="openModal(order)"
            >
              查看詳情
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 浮窗遮罩 -->
  <div
    v-if="showDetailModal"
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    @click="closeModal"
  ></div>

  <!-- 浮窗 -->
  <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl" @click.stop>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">工單詳情</h2>
          <p class="mt-1 text-sm text-gray-500">{{ selectedOrder?.id }}</p>
        </div>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <div class="space-y-6">
        <!-- 客戶資訊 -->
        <div class="rounded-xl bg-gray-50 p-5">
          <p class="mb-3 text-sm font-medium text-gray-500">客戶資訊</p>
          <div class="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p class="text-sm text-gray-400">姓名</p>
              <p class="font-medium">{{ selectedOrder?.name }}</p>
            </div>
          </div>
        </div>

        <!-- 維修資訊 -->
        <div class="rounded-xl bg-gray-50 p-5">
          <p class="mb-3 text-sm font-medium text-gray-500">維修資訊</p>
          <div class="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p class="text-sm text-gray-400">維修項目</p>
              <p class="font-medium">{{ selectedOrder?.service }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">車輛</p>
              <p class="font-medium">{{ selectedOrder?.car }}</p>
            </div>
          </div>
        </div>

        <!-- 工單資訊 -->
        <div class="rounded-xl bg-gray-50 p-5">
          <p class="mb-3 text-sm font-medium text-gray-500">工單資訊</p>
          <div class="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p class="text-sm text-gray-400">狀態</p>
              <select
                v-model="tempStatus"
                class="mt-1 block w-full rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-800 cursor-pointer"
              >
                <option value="進行中">進行中</option>
                <option value="待確認">待確認</option>
                <option value="已完成">已完成</option>
              </select>
              <div
                class="inline-block mt-2 rounded-full px-3 py-1 text-sm font-medium text-white"
                :class="statusClass(tempStatus)"
              >
                {{ tempStatus }}
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-400">提出申請時間</p>
              <p class="font-medium text-gray-700">{{ selectedOrder?.requestTime }}</p>

              <p class="text-sm text-gray-400 mt-2">預約維修時間</p>
              <p class="font-medium text-gray-700">
                {{ selectedOrder?.date }} {{ selectedOrder?.time }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 按鈕 -->
      <div class="mt-8 flex justify-end gap-3">
        <button
          class="rounded-xl border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer"
          @click="closeModal"
        >
          取消
        </button>
        <button
          class="rounded-xl bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 cursor-pointer"
          @click="saveStatus"
        >
          儲存更改
        </button>
      </div>
    </div>
  </div>
</template>
