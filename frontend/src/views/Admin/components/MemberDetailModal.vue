<script setup lang="ts">
import { computed } from 'vue';
import type { Member } from '@/views/Admin/composables/useMemberData';
import MemberDetailCarOwner from './MemberDetailCarOwner.vue';
import MemberDetailShop from './MemberDetailShop.vue';
import { getStatusLabel, getStatusClass, useMemberActions } from '../composables/memberCore';

const props = defineProps<{ member: Member; type: string }>();
const emit = defineEmits(['close']);
const closeModal = () => emit('close');

const actionButtons = computed(() => useMemberActions(props.member, closeModal));

// 維修廠專屬頂部資訊
const shopHeaderInfo = computed(() => {
  if (props.type === 'carOwner') return [];
  const items = [
    { label: 'ID', value: `#${props.member.id}`, class: 'text-gray-900 font-medium' },
    { label: '註冊日期', value: props.member.joinDate || '無資料', class: 'text-gray-700' },
    { label: '目前狀態', value: getStatusLabel(props.member.status), isTag: true, tagClass: getStatusClass(props.member.status) }
  ];
  if (props.member.appliedPlan) {
    const isPaid = props.member.appliedPlan === 'Paid';
    items.push({
      label: '申請方案', value: isPaid ? '付費方案' : '免費方案', 
      isTag: true, tagClass: isPaid ? 'text-yellow-700 bg-yellow-50 font-bold' : 'text-blue-700 bg-blue-50 font-bold'
    });
  }
  return items;
});
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- 背景遮罩 (點擊關閉) -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
    
    <!-- Modal 主體 -->
    <article class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden transition-all">
      
      <!-- 標題區 -->
      <header class="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
        <h3 class="text-xl font-semibold text-gray-900">{{ type === 'carOwner' ? '車主詳細資料' : '維修廠詳細資料' }}</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-1"><span class="material-symbols-outlined text-2xl">close</span></button>
      </header>

      <!-- 內容區 -->
      <section class="p-6 overflow-y-auto custom-scrollbar flex-1">
        <!-- 維修廠專屬頂部資訊 -->
        <div v-if="type !== 'carOwner'" class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
          <div v-for="item in shopHeaderInfo" :key="item.label">
            <span class="text-xs text-gray-500 block uppercase tracking-wide">{{ item.label }}</span>
            <span v-if="item.isTag" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs mt-1" :class="item.tagClass">{{ item.value }}</span>
            <span v-else class="text-sm" :class="item.class">{{ item.value }}</span>
          </div>
        </div>

        <MemberDetailCarOwner v-if="type === 'carOwner'" :member="member" />
        <MemberDetailShop v-else :member="member" />
      </section>

      <!-- 底部按鈕區 -->
      <footer class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse border-t border-gray-200 gap-2">
        <button v-for="btn in actionButtons" :key="btn.label" type="button" @click="btn.onClick" class="w-full sm:w-auto px-4 py-2 rounded-md border shadow-sm text-sm font-medium transition-colors" :class="btn.class">{{ btn.label }}</button>
      </footer>

    </article>
  </div>
</template>
