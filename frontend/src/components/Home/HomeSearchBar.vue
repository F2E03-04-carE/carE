<script setup lang="ts">
import SelectField from '@/components/Home/SelectField.vue'

const repairOptions = [
  { value: 'body_repair', label: '板金維修／鈑金烤漆' },
  { value: 'engine_maintenance', label: '引擎保養與維修' },
  { value: 'transmission_repair', label: '變速箱維修' },
  { value: 'brake_system', label: '煞車系統維修' },
  { value: 'air_conditioning', label: '冷氣系統維修' },
  { value: 'suspension_system', label: '底盤／懸吊系統維修' }
]

const cityOptions = [
  { value: 'TPE', label: '臺北市' },
  { value: 'NTPC', label: '新北市' }
]

const locationOptions = [
  { value: 'Zhongzheng', label: '中正區' },
  { value: 'Datong', label: '大同區' },
  { value: 'Zhongshan', label: '中山區' },
  { value: 'Songshan', label: '松山區' },
  { value: 'Daan', label: '大安區' },
  { value: 'Wanhua', label: '萬華區' },
  { value: 'Xinyi', label: '信義區' },
  { value: 'Shilin', label: '士林區' },
  { value: 'Beitou', label: '北投區' },
  { value: 'Neihu', label: '內湖區' },
  { value: 'Nangang', label: '南港區' },
  { value: 'Wenshan', label: '文山區' }
]

const brandOptions = [
  { value: 'Toyota', label: 'Toyota' },
  { value: 'Honda', label: 'Honda' },
  { value: 'Nissan', label: 'Nissan' },
  { value: 'Mazda', label: 'Mazda' },
  { value: 'Mitsubishi', label: 'Mitsubishi' },
  { value: 'Lexus', label: 'Lexus' },
  { value: 'BMW', label: 'BMW' },
  { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
  { value: 'Volkswagen', label: 'Volkswagen' },
  { value: 'else', label: '其他品牌' }
]
</script>

<template>
  <form
    action=""
    method="get"
    class="flex flex-col lg:flex-row justify-evenly items-end gap-x-[50px] w-[80%] p-[20px] bg-[#fff] shadow-md rounded-[8px] font-bold"
  >
    <div class="w-full lg:w-[25%]">
      <SelectField
        id="repair"
        name="repair"
        label="搜尋維修項目"
        icon="build"
        placeholder="選擇維修項目"
        :options="repairOptions"
      />
    </div>

    <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
      <SelectField
        id="city"
        name="city"
        label="縣市"
        icon="location_city"
        placeholder="選擇縣市，抓郵局API"
        :options="cityOptions"
      />
    </div>

    <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
      <SelectField
        id="location"
        name="location"
        label="行政區"
        icon="location_on"
        placeholder="選擇行政區，抓郵局API"
        :options="locationOptions"
      />
    </div>

    <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
      <SelectField
        id="brand"
        name="brand"
        label="車子品牌"
        icon="directions_car"
        placeholder="選擇品牌"
        :options="brandOptions"
      />
    </div>

    <button
      type="submit"
      class="w-full lg:w-[20%] px-[20px] py-[10px] mt-[30px] lg:mt-0 flex flex-row justify-center items-center text-[#fff] bg-[#6b6b5a] rounded cursor-pointer"
    >
      <span class="material-symbols-outlined mr-1"> search </span>
      搜尋
    </button>
  </form>
</template>