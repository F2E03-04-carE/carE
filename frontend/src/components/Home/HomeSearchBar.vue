<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SelectField from '@/components/Home/SelectField.vue'
import TwCitySelector from 'tw-city-selector'
import brandsData from '@/data/brands.json'
import servicesData from '@/data/services.json'

const brandOptions = computed(() =>
  brandsData.map(b => ({
    value: b.carbrand_id?.toString() || '',
    label: `${b.brand_en} ${b.brand_zh}`
  }))
)

const repairOptions = computed(() =>
  servicesData.map(s => ({
    value: s.garageservice_id?.toString() || '',
    label: s.name || '未命名服務'
  }))
)

const formRef = ref<HTMLFormElement>()
const router = useRouter()
const selectedCity = ref('')
const selectedDistrict = ref('')

onMounted(() => {
  if (formRef.value) {
    try {
      new TwCitySelector({
        el: '.city-selector-container',
        elCounty: '.county-select',
        elDistrict: '.district-select',
        hasZipcode: false,
        standardWords: true,
        onChange: (data: any) => {
          selectedCity.value = data.county
          selectedDistrict.value = data.district
          console.log('當前選擇:', selectedCity.value, selectedDistrict.value)
        }
      } as any)
      console.log('✅ 縣市選擇器初始化成功')
    } catch (error) {
      console.error('❌ 縣市選擇器初始化失敗:', error)
    }
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()

  const citySelect = document.querySelector('.county-select') as HTMLSelectElement
  const districtSelect = document.querySelector('.district-select') as HTMLSelectElement

  const city = citySelect?.value || ''
  const district = districtSelect?.value || ''

  const formData = new FormData(e.target as HTMLFormElement)
  const brand = formData.get('brand') as string
  const repair = formData.get('repair') as string

  console.log('原始表單資料:', { city, district, brand, repair })

  if (!city || !district) {
    alert('請選擇縣市和行政區')
    return
  }

  const searchParams: Record<string, string> = {
    city: city,
    district: district
  }

  if (brand) searchParams.brand = brand
  if (repair) searchParams.service = repair

  console.log('搜尋參數:', searchParams)

  router.push({
    name: 'SearchResults',
    query: searchParams
  }).catch(err => {
    console.error('路由錯誤:', err)
  })
}
</script>

<template>
  <form
    ref="formRef"
    @submit="handleSubmit"
    class="city-selector-container flex flex-col lg:flex-row justify-evenly items-end gap-x-[50px] w-[80%] p-[20px] bg-[#fff] shadow-md rounded-[8px] font-bold"
  >

    <input type="hidden" name="cityValue" :value="selectedCity" />
    <input type="hidden" name="districtValue" :value="selectedDistrict" />

    <div class="w-full lg:w-[25%]">
      <label
        for="city"
        class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
      >
        <span class="material-symbols-outlined mr-2">location_city</span>
        縣市
      </label>
      <select
        class="county-select block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
        id="city"
        name="city"
      >
      </select>
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
        class="district-select block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
        id="location"
        name="location"
      >
      </select>
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
      class="w-full lg:w-[20%] px-[20px] py-[10px] mt-[30px] lg:mt-0 flex flex-row justify-center items-center text-[#fff] bg-[#6b6b5a] rounded cursor-pointer hover:bg-[#5a5a4a] transition-colors"
    >
      <span class="material-symbols-outlined mr-1">search</span>
      搜尋
    </button>
  </form>
</template>
