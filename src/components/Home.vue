<template>
  <!-- 2026 新年快樂!! (๑•̀ㅂ•́)و✧ -->
  <main class="relative mt-[60px] sm:mt-[70px]">
    <section
      class="text-center bg-[url(https://picsum.photos/id/605/1200/900)] bg-no-repeat bg-center bg-cover"
    >
      <div class="mask flex flex-col justify-center items-center bg-[#f2f1eedd]">
        <h1 class="text-[36px] text-[#4a4a43] font-black">carE 汽車維修預約平台</h1>
        <h2 class="text-[28px] text-[#4a4a43] font-bold">尋找專業的汽車維修服務</h2>
        <h3 class="mb-[50px] text-[20px] text-[#8a8a7d] font-normal">
          連結全台優質保養廠，給您的愛車最好的照顧
        </h3>

        <form
          action=""
          method="get"
          class="flex flex-col lg:flex-row justify-evenly items-end gap-x-[50px] w-[80%] p-[20px] bg-[#fff] shadow-md rounded-[8px]"
        >
          <div class="w-full lg:w-[25%]">
            <label for="repair" class="block text-[16px] text-left text-[#8a8a7d]">
              <i class="fa-solid fa-wrench mx-[3px] text-[#8a8a7d]"></i>
              搜尋維修項目
            </label>
            <div>
              <select
                name="repair"
                id="repair"
                class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
              >
                <option value="" selected disabled>選擇維修項目</option>
                <option value="body_repair">板金維修／鈑金烤漆</option>
                <option value="engine_maintenance">引擎保養與維修</option>
                <option value="transmission_repair">變速箱維修</option>
                <option value="brake_system">煞車系統維修</option>
                <option value="air_conditioning">冷氣系統維修</option>
                <option value="suspension_system">底盤／懸吊系統維修</option>
              </select>
            </div>
          </div>

          <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
            <label for="city" class="block text-[16px] text-left text-[#8a8a7d]">
              <i class="fa-solid fa-city mx-[3px] text-[#8a8a7d]"></i>
              縣市
            </label>
            <div>
              <select
                name="city"
                id="city"
                class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
              >
                <option value="" selected disabled>選擇縣市，抓郵局API</option>
                <option value="TPE">臺北市</option>
                <option value="NTPC">新北市</option>
              </select>
            </div>
          </div>

          <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
            <label for="location" class="block text-[16px] text-left text-[#8a8a7d]">
              <i class="fa-solid fa-location-dot mx-[3px] text-[#8a8a7d]"></i>
              行政區
            </label>
            <div>
              <select
                name="location"
                id="location"
                class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
              >
                <option value="" selected disabled>選擇行政區，抓郵局API</option>
                <option value="Zhongzheng">中正區</option>
                <option value="Datong">大同區</option>
                <option value="Zhongshan">中山區</option>
                <option value="Songshan">松山區</option>
                <option value="Daan">大安區</option>
                <option value="Wanhua">萬華區</option>
                <option value="Xinyi">信義區</option>
                <option value="Shilin">士林區</option>
                <option value="Beitou">北投區</option>
                <option value="Neihu">內湖區</option>
                <option value="Nangang">南港區</option>
                <option value="Wenshan">文山區</option>
              </select>
            </div>
          </div>

          <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
            <label for="brand" class="block text-[16px] text-left text-[#8a8a7d]">
              <i class="fa-solid fa-car-side mx-[3px] text-[#8a8a7d]"></i>
              車子品牌
            </label>
            <div>
              <select
                name="brand"
                id="brand"
                class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
              >
                <option value="" selected disabled>選擇品牌</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Nissan">Nissan</option>
                <option value="Mazda">Mazda</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Lexus">Lexus</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="else">其他品牌</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            class="w-full lg:w-[20%] px-[20px] py-[10px] mt-[30px] lg:mt-0 text-[#fff] bg-[#6b6b5a] rounded cursor-pointer"
          >
            <i class="fa-solid fa-magnifying-glass mr-[5px]"></i>搜尋
          </button>
        </form>
        <!-- 六大常見搜尋主題 -->
        <!-- TODO: button 待加 click event function -->
        <h3 class="mt-[50px] text-[24px] text-[#4a4a43] font-bold">六大熱門搜尋主題</h3>
        <div
          class="flex flex-row flex-wrap lg:flex-nowrap justify-evenly items-center w-full mt-[5%] lg:mt-[0%]"
        >
          <button
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <i class="fa-solid fa-gears text-[50px]"></i>
              <span class="mt-[12px] text-[20px] font-bold leading-none">維修</span>
            </p>
          </button>
          <button
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <i class="fa-solid fa-car text-[50px]"></i>
              <span class="mt-[12px] text-[20px] font-bold leading-none">保養</span>
            </p>
          </button>
          <button
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <i class="fa-solid fa-screwdriver-wrench text-[50px]"></i>
              <span class="mt-[12px] text-[20px] font-bold leading-none">改裝</span>
            </p>
          </button>
          <button
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <i class="fa-solid fa-solid fa-spray-can-sparkles text-[50px]"></i>
              <span class="mt-[12px] text-[20px] font-bold leading-none">鈑金</span>
            </p>
          </button>
          <button
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <i class="fa-solid fa-circle-dot text-[50px]"></i>
              <span class="mt-[12px] text-[20px] font-bold leading-none">輪胎</span>
            </p>
          </button>
          <button
            class="inline-block relative w-[150px] h-[150px] m-[10px] p-[10px] bg-[#f5f4f0] rounded-[1000px] cursor-pointer"
          >
            <p class="flex flex-col justify-evenly items-center text-[#4a4a43]">
              <i class="fa-solid fa-road-circle-exclamation text-[50px]"></i>
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
                <i class="fa-solid fa-mug-hot absolute top-1 left-0"></i>
                <span class="inline-block ml-7 font-bold">等待維修，只能乾等</span>
              </p>
              <p class="ml-7">送修後只能在附近耗時間，不知道要去哪裡，等待本身就成了一種壓力。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-wrench absolute top-1 left-0"></i>
                <span class="inline-block ml-7 font-bold">找維修廠，全靠運氣</span>
              </p>
              <p class="ml-7">不清楚每間維修廠擅長的品牌，只能碰運氣選一家，修得好不好心裡沒底。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-clock-rotate-left absolute top-1 left-0"></i>
                <span class="inline-block ml-7 font-bold">維修進度不明，只能一直問</span>
              </p>
              <p class="ml-7">不知道現在修到哪、什麼時候能取車，只能反覆詢問，卻始終無法安心。</p>
            </li>
          </ul>
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
                <i class="fa-solid fa-award absolute top-1 left-0"></i>
                <span class="inline-block ml-7 font-bold">明明有專長，卻要重說</span>
              </p>
              <p class="ml-7">熟悉的項目與車型，每次都得從頭解釋，時間被一點一滴消耗。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-clock absolute top-1 left-0"></i>
                <span class="inline-block ml-7 font-bold">客人一來，先算時間</span>
              </p>
              <p class="ml-7">臨時詢問不斷，卻不清楚空檔，只能邊算邊回，流程卡住。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-spiral absolute top-1 left-0"></i>
                <span class="inline-block ml-7 font-bold">行程一多，腦袋不夠用</span>
              </p>
              <p class="ml-7">維修與交件時間零散，一忙起來，全靠人工排程撐著。</p>
            </li>
          </ul>
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
        <button
          class="block w-[100%] py-[1%] mx-auto text-[#fff] bg-[#6b6b5a] rounded cursor-pointer"
        >
          立即使用
        </button>
      </a>
    </section>
  </main>
</template>
