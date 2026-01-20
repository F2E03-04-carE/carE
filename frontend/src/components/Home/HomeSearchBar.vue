<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SelectField from '@/components/Home/SelectField.vue'
import TwCitySelector from 'tw-city-selector'

const repairOptions = [
  { value: 'body_repair', label: '板金維修／鈑金烤漆' },
  { value: 'engine_maintenance', label: '引擎保養與維修' },
  { value: 'transmission_repair', label: '變速箱維修' },
  { value: 'brake_system', label: '煞車系統維修' },
  { value: 'air_conditioning', label: '冷氣系統維修' },
  { value: 'suspension_system', label: '底盤／懸吊系統維修' }
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

const citySelector = ref<HTMLDivElement>()
const router = useRouter()

onMounted(() => {
  if (citySelector.value) {
    new TwCitySelector({
      el: citySelector.value,
      elCounty: citySelector.value.querySelector('#city'),
      elDistrict: citySelector.value.querySelector('#location'),
      hasZipcode: false,
      standardWords: true
    })
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)

  const city = formData.get('city') as string
  const location = formData.get('location') as string
  const brand = formData.get('brand') as string
  const repair = formData.get('repair') as string

  if (!city || !location) {
    alert('請選擇縣市和行政區')
    return
  }

  const searchParams: Record<string, string> = {
    city,
    location
  }


  if (brand) searchParams.brand = brand
  if (repair) searchParams.repair = repair

  console.log('搜尋參數:', searchParams)

  router.push({
    name: 'SearchResults',
    query: searchParams
  })
}
</script>

<template>
  <form
    @submit="handleSubmit"
    class="flex flex-col lg:flex-row justify-evenly items-end gap-x-[50px] w-[80%] p-[20px] bg-[#fff] shadow-md rounded-[8px] font-bold"
  >
    <div ref="citySelector" class="contents">
      <div class="w-full lg:w-[25%]">
        <label
          for="city"
          class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
        >
          <span class="material-symbols-outlined mr-2">location_city</span>
          縣市
        </label>
        <select
          id="city"
          name="city"
          class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
        ></select>
      </div>

      <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
        <label
          for="location"
          class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
        >
          <span class="material-symbols-outlined mr-2">location_on</span>
          行政區
        </label>
        <select
          id="location"
          name="location"
          class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
        ></select>
      </div>
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

    <div class="w-full lg:w-[25%] mt-[20px] lg:mt-0">
      <SelectField
        id="repair"
        name="repair"
        label="搜尋維修項目"
        icon="build"
        placeholder="選擇維修項目"
        :options="repairOptions"
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
