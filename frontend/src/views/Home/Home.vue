<script setup lang="ts">
import { useRouter } from 'vue-router'
import HomeSearchBar from '@/components/Home/HomeSearchBar.vue'

const router = useRouter()

const handleCategorySearch = (category: string) => {
  router.push({
    path: '/search',
    query: { category }
  })
}
</script>

<template>
  <main class="relative mt-[60px] sm:mt-[70px]">
    <section
      class="text-center bg-[url(https://picsum.photos/id/605/1200/900)] bg-no-repeat bg-center bg-cover"
    >
      <div class="mask flex flex-col justify-center items-center py-20 bg-[#f2f1eedd]">
        <h1 class="text-[36px] text-[#4a4a43] font-black">carE 汽車維修預約平台</h1>
        <h2 class="text-[28px] text-[#4a4a43] font-bold">尋找專業的汽車維修服務</h2>
        <h3 class="mb-[50px] text-[20px] text-[#8a8a7d] font-normal">
          連結全台優質保養廠，給您的愛車最好的照顧
        </h3>

        <HomeSearchBar />
        <!-- 六大常見搜尋主題 -->
        <h3 class="mt-[50px] text-[24px] text-[#4a4a43] pb-5 font-bold">六大熱門搜尋主題</h3>
        <div
          class="flex flex-row flex-wrap lg:flex-nowrap justify-evenly items-center w-full mt-[5%] lg:mt-[0%]"
        >
          <button
            @click="handleCategorySearch('維修')"
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] hover:bg-[#e5c58e] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <span class="six-theme-icon material-symbols-outlined"> handyman </span>
              <span class="mt-[12px] text-[20px] font-bold leading-none">維修</span>
            </p>
          </button>
          <button
            @click="handleCategorySearch('保養')"
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] hover:bg-[#e5c58e] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <span class="six-theme-icon material-symbols-outlined"> directions_car </span>
              <span class="mt-[12px] text-[20px] font-bold leading-none">保養</span>
            </p>
          </button>
          <button
            @click="handleCategorySearch('改裝')"
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] hover:bg-[#e5c58e] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <span class="six-theme-icon material-symbols-outlined"> build </span>
              <span class="mt-[12px] text-[20px] font-bold leading-none">改裝</span>
            </p>
          </button>
          <button
            @click="handleCategorySearch('鈑金')"
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] hover:bg-[#e5c58e] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <span class="six-theme-icon material-symbols-outlined"> fragrance </span>
              <span class="mt-[12px] text-[20px] font-bold leading-none">鈑金</span>
            </p>
          </button>
          <button
            @click="handleCategorySearch('輪胎')"
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] hover:bg-[#e5c58e] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <span class="six-theme-icon material-symbols-outlined"> adjust </span>
              <span class="mt-[12px] text-[20px] font-bold leading-none">輪胎</span>
            </p>
          </button>
          <button
            @click="handleCategorySearch('救援')"
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] hover:bg-[#e5c58e] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <span class="six-theme-icon material-symbols-outlined"> car_crash </span>
              <span class="mt-[12px] text-[20px] font-bold leading-none">救援</span>
            </p>
          </button>
        </div>
        <!-- 信任背書 -->
        <div class="flex flex-row justify-around items-center w-[80%] my-[5%] lg:my-[3%]">
          <div class="text-center">
            <p class="text-[28px] text-[#4A4A43]">500+</p>
            <h3 class="text-[#8F8F84]">合作廠商</h3>
          </div>
          <div class="text-center">
            <p class="text-[28px] text-[#4A4A43]">5000+</p>
            <h3 class="text-[#8F8F84]">服務次數</h3>
          </div>
          <div class="text-center">
            <p class="text-[28px] text-[#4A4A43]">4.8 ★</p>
            <h3 class="text-[#8F8F84]">平均評分</h3>
          </div>
        </div>
      </div>
    </section>
    <section class="max-w-[1440px] mx-auto my-[3%] text-[#4a4a43]">
      <h4 class="text-[26px] font-bold text-center my-[3%]">您是否也有這些困擾？</h4>
      <!-- 車主角度痛點 -->
      <div class="flex flex-col lg:flex-row justify-evenly items-center">
        <div class=""><img src="https://picsum.photos/500/400?random=1" alt="" />假圖占位</div>
        <div class="w-[80%] lg:w-[30%]">
          <ul>
            <li>
              <p class="relative text-[20px]">
                <span class="material-symbols-outlined absolute top-1 left-0 issue-icon">
                  emoji_food_beverage
                </span>
                <span class="inline-block ml-7 font-bold">等待維修，只能乾等</span>
              </p>
              <p class="ml-7">送修後只能在附近耗時間，不知道要去哪裡，等待本身就成了一種壓力。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <span class="material-symbols-outlined absolute top-1 left-0 issue-icon">
                  handyman
                </span>
                <span class="inline-block ml-7 font-bold">找維修廠，全靠運氣</span>
              </p>
              <p class="ml-7">不清楚每間維修廠擅長的品牌，只能碰運氣選一家，修得好不好心裡沒底。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <span class="material-symbols-outlined absolute top-1 left-0 issue-icon">
                  cached
                </span>
                <span class="inline-block ml-7 font-bold">維修進度不明，只能一直問</span>
              </p>
              <p class="ml-7">不知道現在修到哪、什麼時候能取車，只能反覆詢問，卻始終無法安心。</p>
            </li>
          </ul>
          <!-- TODO: click 事件要到註冊頁面，並預設為車主身分 -->
          <button
            class="w-full mt-[5%] px-[5%] py-[3%] text-[#fff] text-center font-bold bg-[#6b6b5a] hover:bg-[#5a5a4a] rounded-lg sm:rounded-xl cursor-pointer"
          >
            立即體驗
          </button>
        </div>
      </div>
      <!-- 維修廠角度痛點 -->
      <div class="flex flex-col lg:flex-row justify-evenly items-center mt-[2%] lg:mt-0">
        <div class="lg:order-1 order-0">
          <img src="https://picsum.photos/500/400?random=1" alt="" />假圖占位
        </div>
        <div class="w-[80%] lg:w-[30%]">
          <ul>
            <li>
              <p class="relative text-[20px]">
                <span class="material-symbols-outlined absolute top-1 left-0 issue-icon">
                  editor_choice
                </span>
                <span class="inline-block ml-7 font-bold">明明有專長，卻要重說</span>
              </p>
              <p class="ml-7">熟悉的項目與車型，每次都得從頭解釋，時間被一點一滴消耗。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <span class="material-symbols-outlined absolute top-1 left-0 issue-icon">
                  schedule
                </span>
                <span class="inline-block ml-7 font-bold">客人一來，先算時間</span>
              </p>
              <p class="ml-7">臨時詢問不斷，卻不清楚空檔，只能邊算邊回，流程卡住。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <span class="material-symbols-outlined absolute top-1 left-0 issue-icon">
                  cognition
                </span>
                <span class="inline-block ml-7 font-bold">行程一多，腦袋不夠用</span>
              </p>
              <p class="ml-7">維修與交件時間零散，一忙起來，全靠人工排程撐著。</p>
            </li>
          </ul>
          <!-- TODO: click 事件要到註冊頁面，並預設為維修廠身分 -->
          <button
            class="w-full mt-[5%] px-[5%] py-[3%] text-[#fff] text-center font-bold bg-[#6b6b5a] hover:bg-[#5a5a4a] rounded-lg sm:rounded-xl cursor-pointer"
          >
            立即體驗
          </button>
        </div>
      </div>
    </section>
    <!-- 平台特色與簡易使用說明 -->
    <section class="py-[3%] bg-[#f5f4f0] text-[#4a4a43]">
      <div class="max-w-[1440px] mx-auto">
        <h4 class="text-[26px] font-bold text-center my-[1%]">carE 帶給您的改變</h4>
        <h5 class="text-[22px] font-bold text-center">操作只要三步驟</h5>
        <div class="flex flex-col lg:flex-row justify-around items-center my-[3%]">
          <div class="w-full lg:w-[35%] px-3 text-center">
            <h5 class="text-[24px] font-bold"><i class="fa-solid fa-car-rear"></i> 對車主來說</h5>
            <p class="my-[5%] text-[18px] font-bold">服務項目透明，筆筆維修有依據，不再靠運氣。</p>
            <ol class="text-center">
              <li class="my-[5%]">
                <h6 class="text-[20px] font-bold">1. 搜尋車廠</h6>
                <p>輸入地區或維修項目，快速找到附近車廠。</p>
              </li>
              <li class="my-[5%]">
                <h6 class="text-[20px] font-bold">2. 查看與比較</h6>
                <p>清楚查看服務內容與真實評價。</p>
              </li>
              <li class="my-[5%]">
                <h6 class="text-[20px] font-bold">3. 安心預約</h6>
                <p>選擇適合的車廠，線上完成預約維修。</p>
              </li>
            </ol>
          </div>
          <div class="w-full lg:w-[35%] px-3 text-center">
            <h5 class="text-[24px] font-bold"><i class="fa-solid fa-toolbox"></i> 對維修廠來說</h5>
            <p class="my-[5%] text-[18px] font-bold">把時間留給專業，讓信任建立在透明與流程。</p>
            <ol class="text-center">
              <li class="my-[5%]">
                <h6 class="text-[20px] font-bold">1. 建立車廠資料</h6>
                <p>填寫基本資訊、服務項目與營業時間，完成店家頁面。</p>
              </li>
              <li class="my-[5%]">
                <h6 class="text-[20px] font-bold">2. 接收維修需求</h6>
                <p>車主依需求主動找上門，平台依據營業時間自動配發。</p>
              </li>
              <li class="my-[5%]">
                <h6 class="text-[20px] font-bold">3. 完成服務、累積評價</h6>
                <p>維修完成後獲得真實評價，提升信任與曝光。</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <a href="/" class="block w-[50%] mx-auto">
        <button class="block w-[100%] py-[2%] mx-auto text-[18px] text-[#fff] font-bold bg-[#6b6b5a] hover:bg-[#5a5a4a] rounded-lg sm:rounded-xl cursor-pointer">
          立即使用
        </button>
      </a>
    </section>
  </main>
</template>
