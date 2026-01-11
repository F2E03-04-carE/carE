<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order } from './components/OrderTypeDefine'
import OrderCard from './components/OrderCard.vue'
import OrderDetailModal from './components/OrderDetailModal.vue'

// 搜尋關鍵字
const keyword = ref('')

// 工單資料
const orders = ref<Order[]>([
  {
    id: 'W-2024-001',
    status: '待確認',
    customer: { name: '王小明', phone: '0912-345-678' },
    vehicle: { model: 'Toyota Camry 2020', service: '定期保養' },
    date: '2024-12-18',
    time: '09:30',
    requestTime: '2024-12-10 14:20',
  },
  {
    id: 'W-2024-002',
    status: '進行中',
    customer: { name: '李大華', phone: '0923-456-789' },
    vehicle: { model: 'Honda CR-V 2019', service: '引擎檢修' },
    date: '2024-12-18',
    time: '10:00',
    requestTime: '2024-12-11 09:50',
  },
  {
    id: 'W-2024-003',
    status: '已完成',
    customer: { name: '張三', phone: '0933-222-333' },
    vehicle: { model: 'BMW X5 2021', service: '換剎車皮' },
    date: '2024-12-17',
    time: '15:00',
    requestTime: '2024-12-12 11:30',
  },
])

// 浮窗控制
const selectedOrder = ref<Order | null>(null)
const showModal = ref(false)

// 開啟浮窗
const open = (order: Order) => {
  selectedOrder.value = order
  showModal.value = true
}

// 儲存修改
const save = (status: Order['status']) => {
  if (!selectedOrder.value) return

  orders.value = orders.value.map((order) =>
    order.id === selectedOrder.value!.id ? { ...order, status } : order,
  )

  showModal.value = false
}

// 搜尋過濾
const filteredOrders = computed(() => {
  if (!keyword.value.trim()) return orders.value
  const key = keyword.value.toLowerCase()
  return orders.value.filter((order) => {
    return (
      order.id.toLowerCase().includes(key) ||
      order.customer.name.toLowerCase().includes(key) ||
      order.customer.phone.includes(key) ||
      order.vehicle.model.toLowerCase().includes(key) ||
      order.vehicle.service.toLowerCase().includes(key)
    )
  })
})
</script>

<template>
  <!-- 標題 -->
  <div class="mb-8">
    <h1 class="text-2xl font-semibold text-[#4a4a43]">工單管理</h1>
    <p class="mt-1 text-[#8a8a7d]">系統工單配對、查詢</p>
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
        placeholder="搜尋工單號、客戶姓名或車輛..."
        class="w-full bg-transparent text-[#4a4a43] placeholder-[#8a8a7d] outline-none"
      />
    </div>
  </div>

  <!-- 工單列表 -->
  <div class="space-y-6">
    <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" @open="open" />
  </div>

  <!-- 浮窗 -->
  <OrderDetailModal v-model="showModal" :order="selectedOrder" @save="save" />
</template>
