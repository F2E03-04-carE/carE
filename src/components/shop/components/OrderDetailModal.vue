<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Order, OrderStatus } from './orderTypeDefine'
import { statusClass } from './orderStatus'

const props = defineProps<{
  modelValue: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'save', status: OrderStatus): void
}>()

const tempStatus = ref<OrderStatus>('待確認')

watch(
  () => props.order,
  (o) => {
    if (o) tempStatus.value = o.status
  },
  { immediate: true },
)

const close = () => emit('update:modelValue', false)
const save = () => emit('save', tempStatus.value)
</script>

<template>
  <!-- 遮罩 -->
  <div v-if="modelValue" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" @click="close" />

  <!-- 視窗 -->
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="w-full max-w-2xl rounded-2xl bg-[#f5f4f0] p-8 shadow-xl" @click.stop>
      <!-- 標題 -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-[#4a4a43]">工單詳情</h2>
          <p class="mt-1 text-sm text-[#8a8a7d]">{{ order?.id }}</p>
        </div>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e0e0d9] cursor-pointer"
          @click="close"
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
              <p class="font-medium">{{ order?.customer.name }}</p>
            </div>
            <div v-if="order?.customer.phone">
              <p class="text-sm text-[#8a8a7d]">聯絡電話</p>
              <p class="font-medium">{{ order?.customer.phone }}</p>
            </div>
          </div>
        </div>

        <!-- 車輛資訊 -->
        <div class="rounded-xl bg-white p-5">
          <p class="mb-3 text-sm font-medium text-[#8a8a7d]">車輛資訊</p>
          <div class="grid grid-cols-2 gap-4 text-[#4a4a43]">
            <div>
              <p class="text-sm text-[#8a8a7d]">車型</p>
              <p class="font-medium">{{ order?.vehicle.model }}</p>
            </div>
            <div>
              <p class="text-sm text-[#8a8a7d]">服務項目</p>
              <p class="font-medium">{{ order?.vehicle.service }}</p>
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

            <div>
              <p class="text-sm text-[#8a8a7d]">提出申請時間</p>
              <p class="font-medium text-[#4a4a43]">
                {{ order?.requestTime }}
              </p>

              <p class="text-sm text-[#8a8a7d] mt-2">預約維修時間</p>
              <p class="font-medium text-[#4a4a43]">{{ order?.date }} {{ order?.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 按鈕 -->
      <div class="mt-8 flex justify-end gap-3">
        <button
          class="rounded-xl border border-[#4a4a43] px-6 py-3 text-[#4a4a43] hover:bg-[#f5f4f0] cursor-pointer"
          @click="close"
        >
          取消
        </button>
        <button
          class="rounded-xl bg-[#6b6b5a] px-6 py-3 text-white hover:bg-[#4a4a43] cursor-pointer"
          @click="save"
        >
          儲存更改
        </button>
      </div>
    </div>
  </div>
</template>
