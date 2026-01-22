<script setup lang="ts">
import { reactive, computed, watch, ref } from 'vue';
import type { WorkshopInfo } from '@/types/garage';
// import { mockBrandOptions, mockSkillOptions } from '@/composables/garage/mockData';

// 假資料 -> 暫時改為空陣列，等待 API
const mockBrandOptions = ref<string[]>([]);
const mockSkillOptions = ref<string[]>([]);

const info = defineModel<WorkshopInfo>('info', {
  required: true,
});

const emit = defineEmits<{
  (event: 'validation-error', hasError: boolean): void;
}>();

// 記錄欄位是否被觸碰過
const touched = reactive({
  name: false,
  phone: false,
  address: false,
});

// 驗證規則與錯誤狀態
const errors = computed(() => {
  return {
    name: !info.value.name.trim(),
    phone: !info.value.phone.trim(),
    address: !info.value.address.trim(),
    brands: info.value.brands.length === 0,
    skills: info.value.skills.length === 0,
  };
});

// 標記欄位為已觸碰
const handleBlur = (field: keyof typeof touched) => {
  touched[field] = true;
};

// 監聽整體錯誤狀態，通知父元件
watch(
  errors,
  (newErrors) => {
    const hasError = Object.values(newErrors).some((isError) => isError);
    emit('validation-error', hasError);
  },
  { immediate: true }
);

const toggleSelection = (list: string[], item: string) => {
  const index = list.indexOf(item);
  if (index === -1) {
    list.push(item);
  } else {
    list.splice(index, 1);
  }
};
</script>

<template>
  <!-- 廠房名稱 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房名稱</label>
    <div class="relative">
      <input
        v-model="info.name"
        @blur="handleBlur('name')"
        class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border shadow-sm"
        :class="touched.name && errors.name ? 'border-red-500' : 'border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a]'"
      />
      <span v-if="touched.name && errors.name" class="absolute right-3 top-3 text-sm text-red-500">請輸入</span>
    </div>
  </div>
  <!-- 電話 / 地址 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">聯絡電話</label>
      <div class="relative">
        <input
          v-model="info.phone"
          @blur="handleBlur('phone')"
          class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border shadow-sm"
          :class="touched.phone && errors.phone ? 'border-red-500' : 'border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a]'"
        />
        <span v-if="touched.phone && errors.phone" class="absolute right-3 top-3 text-sm text-red-500">請輸入</span>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房地址</label>
      <div class="relative">
        <input
          v-model="info.address"
          @blur="handleBlur('address')"
          class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border shadow-sm"
          :class="touched.address && errors.address ? 'border-red-500' : 'border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a]'"
        />
        <span v-if="touched.address && errors.address" class="absolute right-3 top-3 text-sm text-red-500">請輸入</span>
      </div>
    </div>
  </div>
  <!-- 統一編號 (唯讀) -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">統一編號</label>
    <input
      v-model="info.taxId"
      readonly
      disabled
      class="w-full rounded-2xl px-4 py-3 outline-none bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed"
    />
  </div>
  <!-- 簡介 (非必填) -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房簡介</label>
    <textarea
      rows="4"
      v-model="info.description"
      class="w-full rounded-2xl px-4 py-3 outline-none transition bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm"
    ></textarea>
    <p class="text-xs mt-2 text-[#8a8a7d]">建議輸入您的專業特色、服務項目、經驗年資等資訊</p>
  </div>
  <!-- 車子品牌 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">服務品牌</label>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="brand in mockBrandOptions"
        :key="brand"
        @click="toggleSelection(info.brands, brand)"
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition cursor-pointer hover:opacity-80 select-none',
          info.brands.includes(brand)
            ? 'bg-[#6b6b5a] text-white border-[#6b6b5a]'
            : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
        ]"
      >
        {{ brand }}
      </span>
    </div>
    <p v-if="errors.brands" class="text-xs text-red-500 mt-1 pl-1">* 請至少選擇一個品牌</p>
  </div>
  <!-- 擅長維修項目 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">擅長維修項目</label>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="skill in mockSkillOptions"
        :key="skill"
        @click="toggleSelection(info.skills, skill)"
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition cursor-pointer hover:opacity-80 select-none',
          info.skills.includes(skill)
            ? 'bg-[#8b7d6b] text-white border-[#8b7d6b]'
            : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
        ]"
      >
        {{ skill }}
      </span>
    </div>
    <p v-if="errors.skills" class="text-xs text-red-500 mt-1 pl-1">* 請至少選擇一個維修項目</p>
  </div>
</template>
