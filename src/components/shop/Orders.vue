<script setup lang="ts">
import { ref } from 'vue'

interface Order {
  id: string
  status: '待處理' | '進行中' | '已完成'
  customer: {
    name: string
    phone: string
  }
  vehicle: {
    model: string
    service: string
  }
  date: string // 預約日期
  time: string // 預約時間
  requestTime: string // 提出申請時間
}

const keyword = ref('')

// 工單資料
const orders = ref<Order[]>([
  {
    id: 'W-2024-001',
    status: '待處理',
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

// 狀態顏色對應（列表標籤）
const statusColors = {
  待處理: 'bg-amber-400 text-white',
  進行中: 'bg-green-400 text-white',
  已完成: 'bg-slate-400 text-white',
} as const

const statusClass = (status: Order['status']) => statusColors[status] || 'bg-gray-400 text-white'

// 浮窗控制
const showDetailModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const tempStatus = ref<Order['status']>('待處理') // 浮窗暫存狀態

const openModal = (order: Order) => {
  selectedOrder.value = order
  tempStatus.value = order.status
  showDetailModal.value = true
}

const closeModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

// 儲存浮窗狀態變更
const saveStatus = () => {
  if (selectedOrder.value) {
    selectedOrder.value.status = tempStatus.value
  }
  closeModal()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-8 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-800">工單管理</h1>
      <p class="mt-1 text-gray-500">系統工單配對、查詢</p>
    </div>

    <!-- 搜尋欄 -->
    <div class="mb-8 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6">
      <div class="flex flex-1 items-center gap-3 rounded-full bg-gray-100 px-5 py-3">
        <svg
          class="h-5 w-5 text-gray-400"
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
          class="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
        />
      </div>
    </div>

    <!-- 工單列表 -->
    <div class="space-y-6">
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
            <p class="text-lg font-medium text-gray-800">{{ order.customer.name }}</p>
            <p class="text-gray-500">{{ order.customer.phone }}</p>
          </div>

          <!-- 車輛資訊 -->
          <div class="space-y-2 border-l border-gray-200 pl-6">
            <p class="mb-2 text-gray-400 font-medium">車輛資訊</p>
            <p class="text-lg font-medium text-gray-800">{{ order.vehicle.model }}</p>

            <p class="mt-4 mb-1 text-gray-400 font-medium">服務項目</p>
            <p class="text-gray-500">{{ order.vehicle.service }}</p>
          </div>

          <!-- 時間與操作 -->
          <div class="space-y-4 border-l border-gray-200 pl-6 flex flex-col justify-between">
            <div class="space-y-1">
              <p class="text-sm text-gray-400 font-medium">提出申請時間</p>
              <p class="font-medium text-gray-700">{{ order.requestTime }}</p>

              <p class="text-sm text-gray-400 font-medium mt-2">預約時間</p>
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
              <p class="font-medium">{{ selectedOrder?.customer.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">聯絡電話</p>
              <p class="font-medium">{{ selectedOrder?.customer.phone }}</p>
            </div>
          </div>
        </div>

        <!-- 車輛資訊 -->
        <div class="rounded-xl bg-gray-50 p-5">
          <p class="mb-3 text-sm font-medium text-gray-500">車輛資訊</p>
          <div class="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p class="text-sm text-gray-400">車型</p>
              <p class="font-medium">{{ selectedOrder?.vehicle.model }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">服務項目</p>
              <p class="font-medium">{{ selectedOrder?.vehicle.service }}</p>
            </div>
          </div>
        </div>

        <!-- 工單資訊（可編輯狀態） -->
        <div class="rounded-xl bg-gray-50 p-5">
          <p class="mb-3 text-sm font-medium text-gray-500">工單資訊</p>
          <div class="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p class="text-sm text-gray-400">狀態</p>
              <select
                v-model="tempStatus"
                class="mt-1 block w-full rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-800 cursor-pointer"
              >
                <option value="待處理">待處理</option>
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
              <p class="text-sm text-gray-400">提出申請時間</p>
              <p class="font-medium text-gray-700">{{ selectedOrder?.requestTime }}</p>

              <p class="text-sm text-gray-400 mt-2">預約時間</p>
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
