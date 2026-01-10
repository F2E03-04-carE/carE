<script setup lang="ts">
import { ref, computed } from 'vue'

interface Order {
  id: string
  status: '待確認' | '進行中' | '已完成'
  customer: {
    name: string
    phone: string
  }
  vehicle: {
    model: string
    service: string
  }
  date: string
  time: string
  requestTime: string
}

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

// 狀態顏色對應
const statusColors = {
  進行中: 'bg-green-400 text-white',
  待確認: 'bg-amber-400 text-white',
  已完成: 'bg-[#6b6b5a] text-white',
} as const

const statusClass = (status: Order['status']) => statusColors[status] || 'bg-gray-400 text-white'

// 🔍 搜尋過濾（只影響資料，不影響 UI）
const filteredOrders = computed(() => {
  if (!keyword.value.trim()) return orders.value

  const k = keyword.value.toLowerCase()

  return orders.value.filter((order) => {
    return (
      order.id.toLowerCase().includes(k) ||
      order.customer.name.toLowerCase().includes(k) ||
      order.customer.phone.includes(k) ||
      order.vehicle.model.toLowerCase().includes(k) ||
      order.vehicle.service.toLowerCase().includes(k)
    )
  })
})

// 浮窗控制
const showDetailModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const tempStatus = ref<Order['status']>('待確認')

const openModal = (order: Order) => {
  selectedOrder.value = order
  tempStatus.value = order.status
  showDetailModal.value = true
}

const closeModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const saveStatus = () => {
  if (selectedOrder.value) {
    selectedOrder.value.status = tempStatus.value
  }
  closeModal()
}
</script>

<template>
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
    <div
      v-for="order in filteredOrders"
      :key="order.id"
      class="rounded-2xl border border-[#6b6b5a]/20 bg-[#f5f4f0] p-8 shadow-right-md"
    >
      <div class="mb-6 flex items-center gap-4">
        <span class="text-[#8a8a7d]">{{ order.id }}</span>
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
          <p class="mb-2 font-medium text-[#8a8a7d]">客戶資訊</p>
          <p class="text-lg font-medium text-[#4a4a43]">{{ order.customer.name }}</p>
          <p class="text-[#8a8a7d]">{{ order.customer.phone }}</p>
        </div>

        <!-- 車輛資訊 -->
        <div class="space-y-2 border-l border-[#6b6b5a]/20 pl-6">
          <p class="mb-2 font-medium text-[#8a8a7d]">車輛資訊</p>
          <p class="text-lg font-medium text-[#4a4a43]">{{ order.vehicle.model }}</p>
          <p class="mt-4 mb-1 font-medium text-[#8a8a7d]">服務項目</p>
          <p class="text-[#4a4a43]">{{ order.vehicle.service }}</p>
        </div>

        <!-- 時間與操作 -->
        <div class="space-y-4 border-l border-[#6b6b5a]/20 pl-6 flex flex-col justify-between">
          <div class="space-y-1">
            <p class="text-sm font-medium text-[#8a8a7d]">提出申請時間</p>
            <p class="font-medium text-[#4a4a43]">{{ order.requestTime }}</p>

            <p class="text-sm font-medium text-[#8a8a7d] mt-2">預約時間</p>
            <p class="font-medium text-[#4a4a43]">{{ order.date }} {{ order.time }}</p>
          </div>

          <div>
            <button
              class="w-36 rounded-xl border border-[#4a4a43] px-4 py-3 font-medium text-[#4a4a43] hover:bg-[#f5f4f0] cursor-pointer"
              @click="openModal(order)"
            >
              查看詳情
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 浮窗遮罩 -->
  <div
    v-if="showDetailModal"
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    @click="closeModal"
  ></div>

  <!-- 浮窗 -->
  <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="w-full max-w-2xl rounded-2xl bg-[#f5f4f0] p-8 shadow-xl" @click.stop>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-[#4a4a43]">工單詳情</h2>
          <p class="mt-1 text-sm text-[#8a8a7d]">{{ selectedOrder?.id }}</p>
        </div>

        <button
          class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e0e0d9] cursor-pointer"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <div class="space-y-6">
        <!-- 客戶資訊 -->
        <div class="rounded-xl bg-white p-5">
          <p class="mb-3 text-sm font-medium text-[#8a8a7d]">客戶資訊</p>
          <div class="grid grid-cols-2 gap-4 text-[#4a4a43]">
            <div>
              <p class="text-sm text-[#8a8a7d]">姓名</p>
              <p class="font-medium">{{ selectedOrder?.customer.name }}</p>
            </div>
            <div>
              <p class="text-sm text-[#8a8a7d]">聯絡電話</p>
              <p class="font-medium">{{ selectedOrder?.customer.phone }}</p>
            </div>
          </div>
        </div>

        <!-- 車輛資訊 -->
        <div class="rounded-xl bg-white p-5">
          <p class="mb-3 text-sm font-medium text-[#8a8a7d]">車輛資訊</p>
          <div class="grid grid-cols-2 gap-4 text-[#4a4a43]">
            <div>
              <p class="text-sm text-[#8a8a7d]">車型</p>
              <p class="font-medium">{{ selectedOrder?.vehicle.model }}</p>
            </div>
            <div>
              <p class="text-sm text-[#8a8a7d]">服務項目</p>
              <p class="font-medium">{{ selectedOrder?.vehicle.service }}</p>
            </div>
          </div>
        </div>

        <!-- 工單資訊 -->
        <div class="rounded-xl bg-white p-5">
          <p class="mb-3 text-sm font-medium text-[#8a8a7d]">工單資訊</p>
          <div class="grid grid-cols-2 gap-4 text-[#4a4a43]">
            <div>
              <p class="text-sm text-[#8a8a7d]">狀態</p>
              <select
                v-model="tempStatus"
                class="mt-1 block w-full rounded-full border border-[#4a4a43] bg-[#f5f4f0] px-4 py-1 text-sm font-medium text-[#4a4a43] cursor-pointer"
              >
                <option value="待確認">待確認</option>
                <option value="進行中">進行中</option>
                <option value="已完成">已完成</option>
              </select>
              <div
                class="inline-block mt-2 rounded-full px-3 py-1 text-sm font-medium text-white"
                :class="statusClass(tempStatus)"
              >
                {{ tempStatus }}
              </div>
            </div>

            <div class="space-y-2">
              <p class="text-sm text-[#8a8a7d]">提出申請時間</p>
              <p class="font-medium text-[#4a4a43]">{{ selectedOrder?.requestTime }}</p>

              <p class="text-sm text-[#8a8a7d] mt-2">預約時間</p>
              <p class="font-medium text-[#4a4a43]">
                {{ selectedOrder?.date }} {{ selectedOrder?.time }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end gap-3">
        <button
          class="rounded-xl border border-[#4a4a43] px-6 py-3 text-[#4a4a43] hover:bg-[#f5f4f0] cursor-pointer"
          @click="closeModal"
        >
          取消
        </button>
        <button
          class="rounded-xl bg-[#6b6b5a] px-6 py-3 text-white hover:bg-[#4a4a43] cursor-pointer"
          @click="saveStatus"
        >
          儲存更改
        </button>
      </div>
    </div>
  </div>
</template>
