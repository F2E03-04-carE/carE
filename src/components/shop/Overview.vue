<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order } from './components/OrderTypeDefine'
import OrderCard from './components/OrderCard.vue'
import OrderDetailModal from './components/OrderDetailModal.vue'

// 工單資料，寫死的假資料
const orders = ref<Order[]>([
  {
    id: 'W-2026-001',
    status: '進行中',
    customer: {
      name: '王小明',
      phone: '0912-345-678',
    },
    vehicle: { model: 'Toyota Camry', service: '定期保養' },
    requestTime: '2026-01-07 14:20',
    date: '2026-01-09',
    time: '09:30',
  },
  {
    id: 'W-2026-002',
    status: '待確認',
    customer: {
      name: '李大華',
      phone: '0923-456-789',
    },
    vehicle: { model: 'Honda CR-V', service: '引擎檢修' },
    requestTime: '2026-01-06 09:50',
    date: '2026-01-09',
    time: '10:00',
  },
  {
    id: 'W-2026-003',
    status: '已完成',
    customer: {
      name: '張三',
      phone: '0933-222-333',
    },
    vehicle: { model: 'BMW X5', service: '煞車檢修' },
    requestTime: '2026-01-05 11:15',
    date: '2026-01-08',
    time: '13:00',
  },
  {
    id: 'W-2026-004',
    status: '已完成',
    customer: {
      name: '林小七',
      phone: '0988-777-666',
    },
    vehicle: { model: 'Audi A6', service: '輪胎更換' },
    requestTime: '2026-01-02 10:00',
    date: '2026-01-09',
    time: '14:00',
  },
])

const today = new Date()

const isSameDay = (dateStr: string, target: Date) => {
  const date = new Date(dateStr)
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  )
}

const isSameMonth = (dateStr: string, target: Date) => {
  const date = new Date(dateStr)
  return date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth()
}

// 統計卡
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
  { label: '今日預約', value: todayOrderCount.value, icon: '📅' },
  { label: '待確認工單', value: waitingCount.value, icon: '📋' },
  { label: '本月完成', value: monthCompletedCount.value, icon: '📈' },
])

// 浮窗
const showModal = ref(false)
const selectedOrder = ref<Order | null>(null)

const open = (order: Order) => {
  selectedOrder.value = order
  showModal.value = true
}

const save = (status: Order['status']) => {
  if (!selectedOrder.value) return

  orders.value = orders.value.map((order) =>
    order.id === selectedOrder.value!.id ? { ...order, status } : order,
  )

  showModal.value = false
}
</script>

<template>
  <!-- 標題 -->
  <div class="mb-8">
    <h1 class="text-2xl font-semibold text-[#4a4a43]">總覽</h1>
    <p class="mt-1 text-[#8a8a7d]">今日維修廠營運概況</p>
  </div>

  <!-- 統計卡片 -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <div
      v-for="item in stats"
      :key="item.label"
      class="bg-[#f5f4f0] rounded-2xl p-6 flex items-center justify-between shadow-sm"
    >
      <div>
        <p class="text-[#8a8a7d] text-sm mb-1">{{ item.label }}</p>
        <p class="text-3xl font-semibold text-[#4a4a43]">{{ item.value }}</p>
      </div>
      <div class="w-12 h-12 flex items-center justify-center text-xl bg-white rounded-xl">
        {{ item.icon }}
      </div>
    </div>
  </div>

  <!-- 工單列表 -->
  <section class="space-y-6">
    <OrderCard v-for="order in orders" :key="order.id" :order="order" @open="open" />
  </section>

  <!-- 浮窗 -->
  <OrderDetailModal v-model="showModal" :order="selectedOrder" @save="save" />
</template>
