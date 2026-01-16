<script setup lang="ts">
import type { PropType } from 'vue';
import type { WorkshopProfile } from '@/stores/auth';
import { brandOptions, skillOptions } from '@/mocks/tags.mock';

const modelValue = defineModel<WorkshopProfile>({ required: true });

const props = defineProps({
  isNameDisabled: Boolean,
  isPhoneDisabled: Boolean,
  isAddressDisabled: Boolean,
  isDescriptionDisabled: Boolean,
  isTaxIdDisabled: Boolean,
  areTagsDisabled: Boolean,
  toggleBrand: Function as PropType<(brand: string) => void>,
  toggleSkill: Function as PropType<(skill: string) => void>,
});
</script>

<template>
  <!-- 廠房名稱 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房名稱</label>
    <input
      v-model="modelValue.name"
      :disabled="isNameDisabled"
      :class="[
        'w-full rounded-2xl px-4 py-3 outline-none transition',
        !isNameDisabled
          ? 'bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
          : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
      ]"
    />
  </div>
  <!-- 電話 / 地址 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">聯絡電話</label>
      <input
        v-model="modelValue.phone"
        :disabled="isPhoneDisabled"
        :class="[
          'w-full rounded-2xl px-4 py-3 outline-none transition',
          !isPhoneDisabled
            ? 'bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
            : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
        ]"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房地址</label>
      <input
        v-model="modelValue.address"
        :disabled="isAddressDisabled"
        :class="[
          'w-full rounded-2xl px-4 py-3 outline-none transition',
          !isAddressDisabled
            ? 'bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
            : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
        ]"
      />
    </div>
  </div>
  <!-- 統一編號 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">統一編號</label>
    <input
      v-model="modelValue.taxId"
      :disabled="isTaxIdDisabled"
      :class="[
        'w-full rounded-2xl px-4 py-3 outline-none transition',
        !isTaxIdDisabled
          ? 'bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
          : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
      ]"
    />
    <p v-if="isTaxIdDisabled" class="text-xs mt-2 text-[#b0afa4]">若要更改統編，請聯繫平台管理員</p>
  </div>
  <!-- 簡介 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">廠房簡介</label>
    <textarea
      v-model="modelValue.description"
      :disabled="isDescriptionDisabled"
      rows="4"
      :class="[
        'w-full rounded-2xl px-4 py-3 outline-none transition',
        !isDescriptionDisabled
          ? 'bg-white text-[#4a4a43] border border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a] shadow-sm'
          : 'bg-[#e0dfd6] text-[#8a8a7d] cursor-not-allowed',
      ]"
    ></textarea>
    <p class="text-xs mt-2 text-[#8a8a7d]">建議輸入您的專業特色、服務項目、經驗年資等資訊</p>
  </div>
  <!-- 車子品牌 -->
  <div>
    <label class="block text-sm font-medium text-[#4a4a43] mb-2">服務品牌</label>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="brand in brandOptions"
        :key="brand"
        @click="toggleBrand?.(brand)"
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition',
          modelValue.brands.includes(brand)
            ? 'bg-[#6b6b5a] text-white border-[#6b6b5a]'
            : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
          !areTagsDisabled ? 'cursor-pointer hover:opacity-80' : 'opacity-50 cursor-not-allowed',
        ]"
      >
        {{ brand }}
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
        @click="toggleSkill?.(skill)"
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-[999px] border transition',
          modelValue.skills.includes(skill)
            ? 'bg-[#8b7d6b] text-white border-[#8b7d6b]'
            : 'bg-transparent text-[#8b7d6b] border-[#8b7d6b]',
          !areTagsDisabled ? 'cursor-pointer hover:opacity-80' : 'opacity-50 cursor-not-allowed',
        ]"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>
