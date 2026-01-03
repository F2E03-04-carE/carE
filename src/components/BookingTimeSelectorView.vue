<!-- 日期選擇器。
時段選擇器。
預約緩衝時間設定 (預設間隔1小時)
顯示剩餘可接單數
(預設2位、0位代表該時端不可預約) -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

const selectedDate = ref<Date | null>(null)

const today: Date = new Date()

const time = ref<string | null>(null)

function onDateSelected(date: Date | null): void {
  selectedDate.value = date
}

const formattedDate = computed<string | null>(() => {
  if (!selectedDate.value) return null

  return selectedDate.value.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})
</script>

<template>
  <div class="bg-[#faf8f5] p-12">
    <div
      class="container max-w-[960px] mx-auto p-8 bg-[#FFFFFF] border border-[#e9e9e7] rounded-[15px] shadow-sm"
    >
      <!-- TODO: 進度條元件 -->
      <div>進度條元件佔位區</div>
      <h2 class="mb-3 text-[20px] text-[#3a3a38] font-bold">選擇日期</h2>
      <section class="flex flex-wrap justify-between">
        <div class="w-full md:w-[40%]">
          <DatePicker
            v-model="selectedDate"
            @update:model-value="onDateSelected"
            :min-date="today"
            class="w-full border border-[#e9e9e7] rounded-[8px]"
          />
        </div>
        <div class="flex flex-col w-full md:w-[55%] my-6 md:my-0">
          <div class="p-4 bg-[#fbfbfa] border border-[#e9e9e7] rounded-[8px]">
            <div v-if="!formattedDate" class="flex flex-col justify-center items-center">
              <i class="fa-regular fa-calendar text-[50px] text-[#c2c2c0]"></i>
              <p class="mt-3 text-[14px] text-[#8a8a86]">請選擇日期</p>
            </div>
            <div v-else class="flex flex-row justify-left items-start">
              <i class="fa-regular fa-calendar text-[24px] text-[#6b6b5c]"></i>
              <div>
                <span class="ml-2 text-[18px] text-[#3a3a38] font-bold">{{ formattedDate }}</span>
                <p v-if="time" class="ml-2 text-[18px] text-[#8a8a86] font-bold">{{ time }}</p>
              </div>
            </div>
          </div>
          <div>
            <p class="my-2 text-[14px] text-[#8a8a86] font-black">選擇時段</p>
            <div
              class="p-4 border border-[#e9e9e7] rounded-[8px]"
              :class="{ 'bg-[#fbfbfa]': !formattedDate }"
            >
              <div v-if="!formattedDate" class="flex flex-col justify-center items-center">
                <i class="fa-regular fa-clock text-[50px] text-[#c2c2c0]"></i>
                <p class="mt-3 text-[14px] text-[#8a8a86]">請先選擇日期</p>
              </div>
              <div v-else>
                <div class="p-4 border border-[#e9e9e7] rounded-[8px]">
                  <label for="time09" class="w-full flex font-bold">
                    <p><i class="fa-regular fa-clock text-[#6b6b5c]"></i></p>
                    <p
                      class="flex flex-row justify-between items-center flex-grow ml-3 text-[#3a3a38]"
                    >
                      <span class="text-[16px]">09:00</span>
                      <span class="text-[14px]">剩餘 3</span>
                    </p>
                    <input
                      v-model="time"
                      type="radio"
                      name="time"
                      id="time09"
                      value="09:00 早上"
                      class="appearance-none"
                    />
                  </label>
                </div>
                <div class="p-4 mt-4 border border-[#e9e9e7] rounded-[8px]">
                  <label for="time10" class="w-full flex font-bold">
                    <p><i class="fa-regular fa-clock text-[#6b6b5c]"></i></p>
                    <p
                      class="flex flex-row justify-between items-center flex-grow ml-3 text-[#3a3a38]"
                    >
                      <span class="text-[16px]">10:00</span>
                      <span class="text-[14px]">剩餘 3</span>
                    </p>
                    <input
                      v-model="time"
                      type="radio"
                      name="time"
                      id="time10"
                      value="10:00 早上"
                      class="appearance-none"
                    />
                  </label>
                </div>
                <div class="p-4 mt-4 border border-[#e9e9e7] rounded-[8px]">
                  <label for="time11" class="w-full flex font-bold">
                    <p><i class="fa-regular fa-clock text-[#6b6b5c]"></i></p>
                    <p
                      class="flex flex-row justify-between items-center flex-grow ml-3 text-[#3a3a38]"
                    >
                      <span class="text-[16px]">11:00</span>
                      <span class="text-[14px]">剩餘 1</span>
                    </p>
                    <input
                      v-model="time"
                      type="radio"
                      name="time"
                      id="time11"
                      value="11:00 早上"
                      class="appearance-none"
                    />
                  </label>
                </div>
                <div
                  class="p-4 mt-4 bg-[#fbfbfa] border border-[#e9e9e7] rounded-[8px] cursor-not-allowed"
                >
                  <label for="time13" class="w-full flex font-bold cursor-not-allowed">
                    <p><i class="fa-regular fa-clock text-[#cdcdcb]"></i></p>
                    <p
                      class="flex flex-row justify-between items-center flex-grow ml-3 text-[#cdcdcb]"
                    >
                      <span class="text-[16px]">13:00</span>
                      <span class="text-[14px]">已額滿</span>
                    </p>
                    <input
                      v-model="time"
                      type="radio"
                      name="time"
                      id="time13"
                      value="13:00 下午"
                      class="appearance-none"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <!-- TODO: button click 事件 -->
        <div class="flex justify-between items-center mt-5">
          <button
            class="px-5 py-2 text-[14px] text-[#4A4A43] font-black bg-[#faf8f5] border border-[#c4bfb4] hover:bg-[#d4cec3] cursor-pointer duration-[0.15s] rounded-[8px]"
          >
            上一步
          </button>
          <button
            class="px-5 py-2 text-[14px] text-[#ffffff] font-black bg-[#b5b5ad] rounded-[8px]"
            disabled
          >
            下一步
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
