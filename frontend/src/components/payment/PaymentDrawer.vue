<script setup lang="ts">
import { ref, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import TermsModal from './TermsModal.vue';

export interface PaymentDrawerProps {
  isOpen: boolean;
  plan: {
    title: string;
    subtitle: string;
    price: number;
    priceUnit: string;
    features: string[];
    color: 'orange' | 'green';
    type: 'trial' | 'lifetime';
  };
}

const props = defineProps<PaymentDrawerProps>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select-payment', paymentMethod: 'oen' | 'linepay' | 'trial'): void;
}>();

const agreedToTerms = ref(false);

const isProcessing = ref(false);


const selectedPaymentMethod = ref<'oen' | 'linepay' | null>(null);

const canSubmit = computed(() => {
  if (props.plan.type === 'trial') {
    return agreedToTerms.value && !isProcessing.value;
  } else {
    return agreedToTerms.value && selectedPaymentMethod.value && !isProcessing.value;
  }
});

const isTermsModalOpen = ref(false);
const termsModalTab = ref<'terms' | 'privacy'>('terms');

function openTermsModal(tab: 'terms' | 'privacy') {
  termsModalTab.value = tab;
  isTermsModalOpen.value = true;
}

function closeTermsModal() {
  isTermsModalOpen.value = false;
  agreedToTerms.value = true;
}

function selectPaymentMethod(method: 'oen' | 'linepay') {
  selectedPaymentMethod.value = method;
}

async function handleConfirm() {
  if (!canSubmit.value || !props.plan) return;

  isProcessing.value = true;

  if (props.plan.type === 'trial') {
    // 免費試用方案，傳遞 'trial' 作為識別
    emit('select-payment', 'trial');
  } else {
    // 付費方案，傳遞使用者選擇的付款方式
    emit('select-payment', selectedPaymentMethod.value!);
  }
}

function handleClose() {
  if (isProcessing.value || isTermsModalOpen.value) return;
  agreedToTerms.value = false;
  selectedPaymentMethod.value = null;
  emit('close');
}
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-400"
        enter-from="opacity-25"
        enter-to="opacity-0"
        leave="ease-in-out duration-400"
        leave-from="opacity-50"
        leave-to="opacity-50"
      >
        <div class="fixed inset-0 bg-black opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-400"
              enter-from="-translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-400"
              leave-from="translate-x-0"
              leave-to="-translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col bg-white shadow-xl">
                  <div class="bg-gradient-to-r from-[#6b6b5a] to-[#8a8a7d] px-6 py-6">
                    <div class="flex items-center justify-between">
                      <DialogTitle class="text-2xl font-bold text-white">
                        確認訂單
                      </DialogTitle>
                      <button
                        @click="handleClose"
                        :disabled="isProcessing"
                        class="rounded-md text-white hover:text-gray-200 focus:outline-none"
                      >
                        <span class="material-symbols-outlined text-3xl">close</span>
                      </button>
                    </div>
                  </div>

                  <div class="flex-1 overflow-y-auto px-6 py-4">
                    <div class="space-y-4">
                      <div class="rounded-lg border-2 border-gray-200 p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">
                          {{ plan.title }}
                        </h3>

                        <div class="mt-4 mb-2 pb-2 ">
                          <div class="flex items-baseline">
                            <span class="text-4xl font-bold text-gray-900">
                              NT$ {{ plan.price.toLocaleString() }}
                            </span>
                            <span class="ml-6 text-gray-600">
                              {{ plan.priceUnit }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div v-if="plan.type === 'lifetime'" class="space-y-2">
                        <h4 class="font-semibold text-gray-900">選擇付款方式</h4>

                        <button
                          @click="selectPaymentMethod('oen')"
                          class="w-full p-4 rounded-lg border-2 transition-all text-left"
                          :class="[
                            selectedPaymentMethod === 'oen'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          ]"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center">
                              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                                <span class="text-white font-bold text-lg">應援</span>
                              </div>
                              <div>
                                <p class="font-semibold text-gray-900">應援 Pay</p>
                                <p class="text-sm text-gray-600">支援信用卡、ATM、超商付款</p>
                              </div>
                            </div>
                            <div
                              v-if="selectedPaymentMethod === 'oen'"
                              class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                            >
                              <span class="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                          </div>
                        </button>

                        <button
                          @click="selectPaymentMethod('linepay')"
                          class="w-full p-4 rounded-lg border-2 transition-all text-left"
                          :class="[
                            selectedPaymentMethod === 'linepay'
                              ? 'border-[#00B900] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          ]"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center">
                              <div class="w-12 h-12 bg-[#00B900] rounded-lg flex items-center justify-center mr-4">
                                <span class="text-white font-bold text-lg">LINE</span>
                              </div>
                              <div>
                                <p class="font-semibold text-gray-900">LINE Pay</p>
                                <p class="text-sm text-gray-600">使用 LINE Pay 快速付款</p>
                              </div>
                            </div>
                            <div
                              v-if="selectedPaymentMethod === 'linepay'"
                              class="w-6 h-6 rounded-full bg-[#00B900] flex items-center justify-center"
                            >
                              <span class="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                          </div>
                        </button>
                      </div>

                      <div v-if="plan.type === 'trial'" class="bg-blue-50 rounded-lg p-4">
                        <div class="flex items-start">
                          <span class="material-symbols-outlined text-blue-600 text-2xl mr-3">
                            info
                          </span>
                          <div>
                            <p class="text-sm font-semibold text-blue-900 mb-1">
                              免費試用說明
                            </p>
                            <p class="text-sm text-blue-800">
                              試用期 30 天,期間可使用所有功能。試用結束後僅保留「商家資料展示」功能。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="bg-gray-50 rounded-lg p-2">
                        <label class="flex items-start">
                          <input
                            v-model="agreedToTerms"
                            type="checkbox"
                            class="mt-1 w-5 h-5 text-[#6b6b5a] rounded border-gray-300 focus:ring-[#6b6b5a]"
                          />
                          <span class="ml-3 text-sm text-gray-700">
                            我已閱讀並同意
                            <button
                              type="button"
                              @click.stop="openTermsModal('terms')"
                              class="text-[#6b6b5a] hover:underline font-semibold"
                            >
                              服務條款
                            </button>
                            及
                            <button
                              type="button"
                              @click.stop="openTermsModal('privacy')"
                              class="text-[#6b6b5a] hover:underline font-semibold"
                            >
                              隱私權政策
                            </button>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 px-6 py-6 bg-gray-50">
                    <button
                      @click="handleConfirm"
                      :disabled="!canSubmit"
                      class="w-full py-4 rounded-xl font-bold text-white text-lg transition-all"
                      :class="[
                        canSubmit
                          ? 'bg-gradient-to-r from-[#6b6b5a] to-[#8a8a7d] hover:from-[#5a5a4a] hover:to-[#7a7a6d] active:scale-95'
                          : 'bg-gray-300 cursor-not-allowed'
                      ]"
                    >
                      <span v-if="isProcessing" class="flex items-center justify-center">
                        <span class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        處理中...
                      </span>
                      <span v-else>
                        {{ plan.type === 'trial' ? '開始免費試用' : '前往付款' }}
                      </span>
                    </button>

                    <p class="text-xs text-gray-500 text-center mt-4">
                      🔒 採用 SSL 加密傳輸,您的資料安全無虞
                    </p>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <TermsModal
    :is-open="isTermsModalOpen"
    :initial-tab="termsModalTab"
    @close="closeTermsModal"
  />
</template>
