<script setup lang="ts">
import type { Member } from '@/views/Admin/composables/useMemberData';
import MemberDetailCarOwner from './MemberDetailCarOwner.vue';
import MemberDetailShop from './MemberDetailShop.vue';
import { getStatusLabel, getStatusClass } from '../utils/statusHelpers';

defineProps<{
  member: Member;
  type: string;
}>();

const emit = defineEmits(['close']);
const closeModal = () => emit('close');
</script>

<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-200">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                  <h3 class="text-xl font-semibold leading-6 text-gray-900">
                    {{ type === 'carOwner' ? '車主詳細資料' : '維修廠詳細資料' }}
                  </h3>
                  <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <span class="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>
                <div class="mt-2 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div v-if="type !== 'carOwner'" class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <span class="text-xs text-gray-500 block uppercase tracking-wide">ID</span>
                      <span class="text-sm font-medium text-gray-900">#{{ member.id }}</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 block uppercase tracking-wide">註冊日期</span>
                      <span class="text-sm text-gray-700">{{ member.joinDate || '2026-01-01' }}</span>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                      <span class="text-xs text-gray-500 block uppercase tracking-wide">目前狀態</span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1" :class="getStatusClass(member.status)">
                        {{ getStatusLabel(member.status) }}
                      </span>
                    </div>
                    <div v-if="member.appliedPlan" class="col-span-2 sm:col-span-1">
                      <span class="text-xs text-gray-500 block uppercase tracking-wide">申請方案</span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1" :class="member.appliedPlan === 'Paid' ? 'text-yellow-700 bg-yellow-50' : 'text-blue-700 bg-blue-50'">
                        {{ member.appliedPlan === 'Paid' ? '付費方案' : '免費方案' }}
                      </span>
                    </div>
                  </div>
                  <MemberDetailCarOwner v-if="type === 'carOwner'" :member="member" />
                  <MemberDetailShop v-else :member="member" />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 gap-2">
            <button type="button" @click="closeModal" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm transition-colors">關閉</button>
            <template v-if="member.status === 'Pending'">
              <button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:w-auto sm:text-sm transition-colors">
                通過審核 ({{ member.appliedPlan === 'Paid' ? '付費' : '免費' }})
              </button>
            </template>
            <button v-if="['Active', 'VerifiedFree', 'VerifiedPaid', 'Expired'].includes(member.status)" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm transition-colors">停權會員</button>
            <button v-if="member.status === 'Expired'" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 sm:w-auto sm:text-sm transition-colors">開通付費</button>
            <button v-if="member.status === 'Suspended'" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:w-auto sm:text-sm transition-colors">恢復權限</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
