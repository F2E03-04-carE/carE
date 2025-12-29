<template>
  <main class="relative mt-[70px]">
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
          <!-- TODO: 修正下拉選單 icon 位置，避免 Safari browser 跑版 -->
          <div class="w-full lg:w-[25%]">
            <label for="repair" class="block text-[16px] text-left text-[#8a8a7d]"
              >搜尋維修項目</label
            >
            <div class="relative">
              <select
                name="repair"
                id="repair"
                class="block w-full px-[35px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
              >
                <option value="" selected disabled>選擇維修項目</option>
                <option value="body_repair">板金維修／鈑金烤漆</option>
                <option value="engine_maintenance">引擎保養與維修</option>
                <option value="transmission_repair">變速箱維修</option>
                <option value="brake_system">煞車系統維修</option>
                <option value="air_conditioning">冷氣系統維修</option>
                <option value="suspension_system">底盤／懸吊系統維修</option>
              </select>
              <i
                class="fa-solid fa-wrench absolute top-[50%] left-[10px] translate-y-[-50%] text-[#8a8a7d]"
              ></i>
            </div>
          </div>

          <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
            <label for="city" class="block text-[16px] text-left text-[#8a8a7d]">
              縣市
              <span class="text-[12px]">(選項先卡位，之後抓郵局API)</span>
            </label>
            <div class="relative">
              <select
                name="city"
                id="city"
                class="block w-full px-[35px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
              >
                <option value="" selected disabled>選擇縣市</option>
                <option value="TPE">臺北市</option>
                <option value="NTPC">新北市</option>
              </select>
              <i
                class="fa-solid fa-city absolute top-[50%] left-[10px] translate-y-[-50%] text-[#8a8a7d]"
              ></i>
            </div>
          </div>

          <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
            <label for="location" class="block text-[16px] text-left text-[#8a8a7d]">
              行政區
              <span class="text-[12px]">(選項先卡位，之後抓郵局API)</span>
            </label>
            <div class="relative">
              <select
                name="location"
                id="location"
                class="block w-full px-[35px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
              >
                <option value="" selected disabled>選擇行政區</option>
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
              <i
                class="fa-solid fa-location-dot absolute top-[50%] left-[10px] translate-y-[-50%] text-[#8a8a7d]"
              ></i>
            </div>
          </div>

          <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
            <label for="brand" class="block text-[16px] text-left text-[#8a8a7d]">車子品牌</label>
            <div class="relative">
              <select
                name="brand"
                id="brand"
                class="block w-full px-[35px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
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
              <i
                class="fa-solid fa-car-side absolute top-[50%] left-[10px] translate-y-[-50%] text-[#8a8a7d]"
              ></i>
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
    <section class="max-w-[1440px] mx-auto">
      <h4 class="text-[26px] font-bold text-center">您是否也有這些困擾？</h4>
      <!-- TODO: 修改非平台功能的特點文案 -->
      <!-- 車主角度痛點 -->
      <div class="flex flex-col lg:flex-row justify-evenly items-center">
        <div class=""><img src="https://picsum.photos/500/400?random=1" alt="" />假圖占位</div>
        <div class="w-[80%] lg:w-[30%]">
          <ul>
            <li>
              <p class="relative text-[20px]">
                <i class="fa-solid fa-scale-unbalanced absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 看不懂報價，只能「相信對方說的 </span>
              </p>
              <p class="ml-7">
                面對不熟悉的項目名稱與說明，難以理解內容，只能被動相信對方的專業判斷，心裡卻始終感到不安。
              </p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-file-circle-exclamation absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 擔心被多換、不知道維修是否必要 </span>
              </p>
              <p class="ml-7">
                缺乏清楚的判斷依據，很難確認哪些處理是真的需要，哪些其實可以觀察或延後處理。
              </p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-comments-dollar absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 比價困難，每家說法都不一樣 </span>
              </p>
              <p class="ml-7">
                即使詢問多家維修廠，項目與說法仍各不相同，讓人難以站在同一基準進行比較。
              </p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-repeat absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 維修進度不透明，只能反覆詢問 </span>
              </p>
              <p class="ml-7">送修後無法掌握目前進度，只能不斷詢問狀況，卻仍難以真正放心。</p>
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
                <i class="fa-solid fa-hourglass-half absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 花大量時間解釋基本問題 </span>
              </p>
              <p class="ml-7">每天從零解釋維修常識，話說盡了，時間卻一點一滴被消耗。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-heart-crack absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 車主不信任，反覆殺價、猶豫 </span>
              </p>
              <p class="ml-7">專業說得再清楚，車主仍反覆比較、殺價，遲遲無法下決定。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-spiral absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 報價流程混亂，溝通成本高 </span>
              </p>
              <p class="ml-7">報價來回修改、訊息零散，溝通成本不斷堆高，效率越來越低。</p>
            </li>
            <li class="mt-[10px]">
              <p class="relative text-[20px]">
                <i class="fa-solid fa-user-slash absolute top-1 left-0"></i>
                <span class="inline-block ml-7"> 技術專業難以被看見，只能比低價 </span>
              </p>
              <p class="ml-7">累積多年的技術，最後卻被簡化成價格數字，被迫參與低價競爭。</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <!-- 平台特色與簡易使用說明 -->
    <section class="max-w-[1440px] mx-auto">
      <h4 class="text-[26px] font-bold text-center">carE 帶給您的改變</h4>
      <h5 class="text-[22px] font-bold text-center">操作只要三步驟</h5>
      <div class="flex flex-col lg:flex-row justify-around items-center">
        <div class="w-full lg:w-[30%] px-3 text-center">
          <h5><i class="fa-solid fa-car-rear"></i> 對車主來說</h5>
          <p>服務項目透明，每一筆維修都有依據，不再靠運氣修車。</p>
          <ol class="text-center">
            <li>
              <h6>1. 搜尋車廠</h6>
              <p>輸入地區或維修項目，快速找到附近車廠。</p>
            </li>
            <li>
              <h6>2. 查看與比較</h6>
              <p>清楚查看服務內容與真實評價。</p>
            </li>
            <li>
              <h6>3. 安心預約</h6>
              <p>選擇適合的車廠，線上完成預約維修。</p>
            </li>
          </ol>
        </div>
        <div class="w-full lg:w-[30%] px-3 text-center">
          <h5><i class="fa-solid fa-screwdriver-wrench"></i> 對維修廠來說</h5>
          <p>把時間留給專業，讓信任建立在透明與流程，而不是口頭說服。</p>
          <ol class="text-center">
            <li>
              <h6>1. 建立車廠資料</h6>
              <p>填寫基本資訊、服務項目與營業時間，完成店家頁面。</p>
            </li>
            <li>
              <h6>2. 接收維修需求</h6>
              <p>車主依需求主動找上門，平台依據營業時間自動配發。</p>
            </li>
            <li>
              <h6>3. 完成服務、累積評價</h6>
              <p>維修完成後獲得真實評價，提升信任與曝光。</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
    <section class="max-w-[1440px] mx-auto">
      <a href="/" class="block w-[50%] mx-auto">
        <button
          class="block w-[100%] py-[1%] mx-auto text-[#fff] bg-[#6b6b5a] rounded cursor-pointer"
        >
          立即使用
        </button>
      </a>
    </section>

    <button
      class="fixed right-[10px] bottom-[10px] px-[5px] py-[8px] bg-[#f5f4f0] rounded cursor-pointer"
    >
      <i class="fa-solid fa-arrow-up text-[26px] text-[#6b6b5a]"></i>
    </button>
  </main>
</template>
