<script setup lang="ts">
import { ref } from 'vue'

interface Form {
  name: string
  phone: string
  address: string
  description: string
  taxId: string
  brands: string[]
  skills: string[]
}

// 初始表單資料
const initialForm: Form = {
  name: '專業汽車維修中心',
  phone: '02-1234-5678',
  address: '台北市中山區建國北路123號',
  description: '本廠擁有20年以上維修經驗，專業技師團隊提供各式車輛維修保養服務。',
  taxId: '12345678',
  brands: [],
  skills: [],
}

// 主表單（v-model 綁定使用）
const form = ref<Form>({ ...initialForm })

// 暫存表單，用於編輯模式
const tempForm = ref<Form>({ ...initialForm })

const isEditing = ref(false)

const onEdit = () => {
  isEditing.value = true
  // 編輯模式啟用，先複製一份暫存
  tempForm.value = { ...form.value, brands: [...form.value.brands], skills: [...form.value.skills] }
}

const onCancel = () => {
  tempForm.value = { ...form.value, brands: [...form.value.brands], skills: [...form.value.skills] }
  isEditing.value = false
}

const onSave = () => {
  Object.assign(form.value, tempForm.value)
  Object.assign(initialForm, form.value)
  isEditing.value = false
}

// 品牌選項
const brandOptions = [
  'Toyota',
  'Honda',
  'Nissan',
  'Mazda',
  'Mitsubishi',
  'Lexus',
  'BMW',
  'Mercedes-Benz',
  'Volkswagen',
  '其他品牌',
]

// 維修項目選項
const skillOptions = [
  '引擎維修',
  '變速箱維修',
  '煞車系統',
  '底盤懸吊',
  '空調冷氣維修',
  '電系/電子系統',
  '車身烤漆/鈑金',
  '輪胎更換/定位',
  '汽車保養/定期檢查',
  '電動車/混合動力維修',
]

// 暫存品牌切換
const toggleBrand = (brand: string) => {
  if (!isEditing.value) return
  const idx = tempForm.value.brands.indexOf(brand)
  if (idx === -1) tempForm.value.brands.push(brand)
  else tempForm.value.brands.splice(idx, 1)
}

// 暫存維修項目切換
const toggleSkill = (skill: string) => {
  if (!isEditing.value) return
  const idx = tempForm.value.skills.indexOf(skill)
  if (idx === -1) tempForm.value.skills.push(skill)
  else tempForm.value.skills.splice(idx, 1)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 廠房名稱 -->
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房名稱</label>
      <input
        v-model="form.name"
        disabled
        class="w-full rounded-2xl px-4 py-3 bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed outline-none border border-[#d1d1c1]"
      />
      <p class="text-xs mt-2 text-[#b0afa4]">若要更改廠房名稱，請聯繫平台管理員</p>
    </div>

    <!-- 電話 / 地址 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-[#4a4a43] mb-2">聯絡電話</label>
        <input
          v-model="tempForm.phone"
          :disabled="!isEditing"
          :class="[
            'w-full rounded-2xl px-4 py-3 outline-none transition',
            isEditing
              ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
              : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
          ]"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房地址</label>
        <input
          v-model="form.address"
          disabled
          class="w-full rounded-2xl px-4 py-3 bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed outline-none border border-[#d1d1c1]"
        />
        <p class="text-xs mt-2 text-[#b0afa4]">若要更改廠房地址，請聯繫平台管理員</p>
      </div>
    </div>

    <!-- 統一編號 -->
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">統一編號</label>
      <input
        v-model="form.taxId"
        disabled
        class="w-full rounded-2xl px-4 py-3 bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed outline-none border border-[#d1d1c1]"
      />
      <p class="text-xs mt-2 text-[#b0afa4]">若要更改統編，請聯繫平台管理員</p>
    </div>

    <!-- 簡介 -->
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房簡介</label>
      <textarea
        v-model="tempForm.description"
        :disabled="!isEditing"
        rows="4"
        :class="[
          'w-full rounded-2xl px-4 py-3 outline-none transition',
          isEditing
            ? 'bg-[#f5f4f0] text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
            : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
        ]"
      />
      <p class="text-xs mt-2" :class="isEditing ? 'text-[#8a8a7d]' : 'text-[#b0afa4]'">
        建議輸入您的專業特色、服務項目、經驗年資等資訊
      </p>
    </div>

    <!-- 車子品牌 -->
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">服務品牌</label>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="brand in brandOptions"
          :key="brand"
          @click="toggleBrand(brand)"
          :class="[
            'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition',
            tempForm.brands.includes(brand)
              ? 'bg-[#6b6b5a] text-white border-[#6b6b5a]'
              : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
            isEditing ? 'cursor-pointer hover:opacity-80' : 'opacity-50 cursor-not-allowed',
          ]"
        >
          {{ brand }}
          <span
            v-if="tempForm.brands.includes(brand) && isEditing"
            class="ml-1 text-xs font-bold cursor-pointer"
          >
            ×
          </span>
        </span>
      </div>
    </div>

    <!-- 擅長維修項目 -->
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">擅長維修項目</label>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in skillOptions"
          :key="skill"
          @click="toggleSkill(skill)"
          :class="[
            'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition',
            tempForm.skills.includes(skill)
              ? 'bg-[#8b7d6b] text-white border-[#8b7d6b]'
              : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
            isEditing ? 'cursor-pointer hover:opacity-80' : 'opacity-50 cursor-not-allowed',
          ]"
        >
          {{ skill }}
          <span
            v-if="tempForm.skills.includes(skill) && isEditing"
            class="ml-1 text-xs font-bold cursor-pointer"
          >
            ×
          </span>
        </span>
      </div>
    </div>

    <!-- 按鈕 -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        v-if="!isEditing"
        @click="onEdit"
        class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium cursor-pointer hover:bg-[#57574a] transition"
      >
        編輯
      </button>

      <template v-else>
        <button
          @click="onCancel"
          class="px-6 py-2 rounded-2xl border border-[#6b6b5a] text-[#4a4a43] cursor-pointer hover:bg-[#e6e5df] transition"
        >
          取消
        </button>
        <button
          @click="onSave"
          class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white cursor-pointer hover:bg-[#57574a] transition"
        >
          儲存變更
        </button>
      </template>
    </div>
  </div>
</template>
