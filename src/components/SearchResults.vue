<script setup lang="ts">
import { ref } from 'vue'
const orderString = ref<string>('排序')
const filterString = ref<string>('篩選')
const results = ref<object[]>([])
const resultsCount = ref<number>(results.value.length)
</script>
<template>
  <section class="pt-10 bg-[#f5f1ed]">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center gap-5">
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border border-[#DBCEBD] rounded-[5px]">
          <label for="order" class="py-2 pl-3">{{ orderString }}：</label>
          <select name="order" id="order" class="grow py-2 outline-none">
            <!-- TODO: 選項待補齊 -->
            <option value="distance" selected>距離</option>
            <option value="">評價</option>
            <option value="">？？</option>
            <option value="">？？？</option>
          </select>
        </div>
        <div class="w-full flex text-[#4a4a43] bg-[#ffffff] border border-[#DBCEBD] rounded-[5px]">
          <label for="filter" class="py-2 pl-3">{{ filterString }}：</label>
          <select name="filter" id="filter" class="grow py-2 outline-none">
            <!-- TODO: 選項待補齊 -->
            <option value="all" selected>全部</option>
            <option value="">？</option>
            <option value="">？？</option>
            <option value="">？？？</option>
          </select>
        </div>
      </div>
    </div>
  </section>
  <section class="pt-5 bg-[#f5f1ed]">
    <div class="container mx-auto flex flex-wrap gap-5">
      <div v-if="!resultsCount">
        <p class="text-[#4a4a43]">查無相關結果</p>
      </div>
      <div
        v-for="result in results"
        class="w-full md:w-[33.3%] lg:w-[25%] border border-[#DBCEBD] rounded-[5px] overflow-hidden hover:shadow-md duration-300"
      >
        <img
          src="https://picsum.photos/300/200?random=1"
          alt="車廠環境圖片"
          class="w-full aspect-3/2 object-cover"
        />
        <div class="px-5 py-3 text-[#4a4a43]">
          <p class="my-1">維修廠名字</p>
          <p class="my-1">
            <span class="material-symbols-outlined"> kid_star </span>
          </p>
          <p class="flex flex-row justify-start items-center my-1">
            <span class="material-symbols-outlined"> location_on </span>
            N 公里
          </p>
          <!-- FIXME: 一行中，最左與最右標籤貼齊外容器 -->
          <p class="flex flex-row flex-wrap justify-start items-center gap-2 my-5">
            <span
              class="inline-block px-3 py-1 bg-[#8b7d6b] text-[14px] text-white rounded-[999px]"
            >
              品牌
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#8b7d6b] text-[14px] text-white rounded-[999px]"
            >
              品牌
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#8b7d6b] text-[14px] text-white rounded-[999px]"
            >
              品牌
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#8b7d6b] text-[14px] text-white rounded-[999px]"
            >
              品牌
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#8b7d6b] text-[14px] text-white rounded-[999px]"
            >
              品牌
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#8b7d6b] text-[14px] text-white rounded-[999px]"
            >
              品牌
            </span>
          </p>
          <!-- FIXME: 一行中，最左與最右標籤貼齊外容器 -->
          <p class="flex flex-row flex-wrap justify-start items-center gap-2 my-5">
            <span
              class="inline-block px-3 py-1 bg-[#f5f1ed] text-[14px] text-[#8b7d6b] border border-[#8b7d6b] rounded-[999px]"
            >
              服務項目
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#f5f1ed] text-[14px] text-[#8b7d6b] border border-[#8b7d6b] rounded-[999px]"
            >
              服務項目
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#f5f1ed] text-[14px] text-[#8b7d6b] border border-[#8b7d6b] rounded-[999px]"
            >
              服務項目
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#f5f1ed] text-[14px] text-[#8b7d6b] border border-[#8b7d6b] rounded-[999px]"
            >
              服務項目
            </span>
            <span
              class="inline-block px-3 py-1 bg-[#f5f1ed] text-[14px] text-[#8b7d6b] border border-[#8b7d6b] rounded-[999px]"
            >
              服務項目
            </span>
          </p>
          <!-- TODO: click 事件 -->
          <button
            class="w-full block p-3 bg-[#8b7d6b] text-[14px] text-white rounded-[8px] cursor-pointer"
          >
            立即預約
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
