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
        }
      } as any)
    } catch (error) {
      console.error('縣市選擇器初始化失敗:', error)
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

  if (!city) {
    alert('請至少選擇縣市')
    return
  }

  const searchParams: Record<string, string> = {
    city: city
  }

  if (district) {
    searchParams.district = district
  }

  if (brand) searchParams.brand = brand
  if (repair) searchParams.service = repair

  router.push({
    name: 'SearchResults',
    query: searchParams
  })
}
</script>

<template>
  <form
    ref="formRef"
    @submit="handleSubmit"
    class="city-selector-container flex flex-col xl:flex-row xl:items-end gap-4 xl:gap-3 w-full max-w-[1400px] mx-auto p-4 bg-[#fff] shadow-md rounded-[8px] font-bold"
  >
    <input type="hidden" name="cityValue" :value="selectedCity" />
    <input type="hidden" name="districtValue" :value="selectedDistrict" />

    <div class="flex-1 min-w-0">
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

    <div class="flex-1 min-w-0">
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

    <div class="flex-1 min-w-0">
      <SelectField
        id="brand"
        name="brand"
        label="車子品牌"
        icon="directions_car"
        placeholder="選擇品牌"
        :options="brandOptions"
      />
    </div>

    <div class="flex-1 min-w-0">
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
      class="w-full xl:w-auto xl:flex-shrink-0 px-8 py-[11px] xl:mt-[32px] flex flex-row justify-center items-center text-[#fff] bg-[#6b6b5a] rounded cursor-pointer hover:bg-[#5a5a4a] transition-colors whitespace-nowrap"
    >
      <span class="material-symbols-outlined mr-1">search</span>
      搜尋
    </button>
  </form>
</template>
