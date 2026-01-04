<script setup lang="ts">
import { computed } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

const props = defineProps<{
  date: Date | null
  time: string | null
}>()

const emits = defineEmits<{
  (e: 'update:date', val: Date | null): void
  (e: 'update:time', val: string | null): void
}>()

const selectedDate = computed({
  get: () => props.date,
  set: (val) => emits('update:date', val),
})

const localTime = computed({
  get: () => props.time,
  set: (val) => emits('update:time', val),
})

const today: Date = new Date()

const formattedDate = computed<string | null>(() => {
  if (!selectedDate.value) return null
  return selectedDate.value.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

// TODO: API串接
const buttons = [
  { time: '09:00 早上', status: '剩餘 3' },
  { time: '10:00 早上', status: '剩餘 3' },
  { time: '11:00 早上', status: '剩餘 3' },
  { time: '13:00 下午', status: '已額滿' },
]

const setActive = (btnTime: string, status: string) => {
  if (status === '已額滿') return
  localTime.value = btnTime
}
</script>

<template>
  <div class="w-full">
    <h2 class="mb-6 text-[20px] text-[#3a3a38] font-bold">選擇日期與時段</h2>
    <section class="flex flex-wrap justify-between gap-8 md:flex-nowrap">
      <div class="w-full md:w-[45%]">
        <DatePicker
          v-model="selectedDate"
          :min-date="today"
          expanded
          borderless
          transparent
          class="w-full rounded-[16px] border border-[#E6E6DF] bg-white p-4"
          :attributes="[
            {
              key: 'today',
              highlight: {
                color: 'gray',
                fillMode: 'light',
              },
              dates: new Date(),
            },
          ]"
        />
      </div>
      <div class="flex w-full flex-col md:w-[55%]">
        <div class="mb-6 rounded-[16px] border border-[#E6E6DF] bg-[#FBFBFA] p-5">
          <div v-if="!formattedDate" class="flex flex-col items-center justify-center py-4">
            <i class="fa-regular fa-calendar text-[40px] text-[#D1D1CB]"></i>
            <p class="mt-3 text-[14px] text-[#8A8A86]">請先選擇日期</p>
          </div>
          <div v-else class="flex items-start gap-3">
            <i class="fa-regular fa-calendar mt-1 text-[24px] text-[#6B6B5C]"></i>
            <div>
              <div class="text-[18px] font-bold text-[#3A3A38]">{{ formattedDate }}</div>
              <div v-if="localTime" class="mt-1 text-[16px] font-bold text-[#6B6B5C]">{{ localTime }}</div>
              <div v-else class="mt-1 text-[14px] text-[#8A8A86]">請選擇下方時段</div>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-3 text-[14px] font-bold text-[#8A8A86]">選擇時段</p>
          <div
            class="rounded-[16px] border border-[#E6E6DF] p-4 transition-colors"
            :class="{ 'bg-[#FBFBFA]': !formattedDate }"
          >
            <div v-if="!formattedDate" class="flex flex-col items-center justify-center py-8">
              <i class="fa-regular fa-clock text-[40px] text-[#D1D1CB]"></i>
              <p class="mt-3 text-[14px] text-[#8A8A86]">請先選擇日期以查看時段</p>
            </div>
            <div v-else class="flex flex-col gap-3">
              <button
                v-for="btn in buttons"
                :key="btn.time"
                type="button"
                @click="setActive(btn.time, btn.status)"
                :disabled="btn.status === '已額滿'"
                class="group flex w-full items-center justify-between rounded-[12px] border p-4 text-left transition-all"
                :class="[
                  btn.status === '已額滿'
                    ? 'cursor-not-allowed border-[#E6E6DF] bg-[#F5F5F0] text-[#B5B5AD]'
                    : localTime === btn.time
                      ? 'border-[#6B6B5C] bg-[#6B6B5C] text-white shadow-md'
                      : 'border-[#E6E6DF] bg-white text-[#3A3A38] hover:border-[#B5B5AD] hover:shadow-sm',
                ]"
              >
                <div class="flex items-center gap-3">
                  <i
                    class="fa-regular fa-clock text-lg"
                    :class="[
                      localTime === btn.time
                        ? 'text-white'
                        : btn.status === '已額滿'
                          ? 'text-[#B5B5AD]'
                          : 'text-[#6B6B5C]',
                    ]"
                  ></i>
                  <span class="text-[16px] font-bold">{{ btn.time }}</span>
                </div>
                <span class="text-[13px] font-medium opacity-90">{{ btn.status }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
</template>