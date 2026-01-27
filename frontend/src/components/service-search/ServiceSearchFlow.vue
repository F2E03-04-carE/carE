<script setup lang="ts">
import { computed, ref } from 'vue';
import ServiceModal from './ServiceModal.vue';
import BookingTimeSelectorView from '@/components/Search/BookingTimeSelectorView.vue';

const props = defineProps<{
  garageId: number;
  garageName?: string;
  garageAddress?: string;
}>();

defineEmits<{
  (e: 'back'): void;
}>();

// 2 步驟流程
const step = ref<number>(1);

// 維修服務選項
const serviceOptions = [
  '定期保養',
  '機油更換',
  '煞車系統檢查/維修',
  '輪胎檢查/更換',
  '電瓶檢測/更換',
  '冷氣系統維修',
  '引擎故障診斷',
  '變速箱維修',
  '底盤檢查',
  '排氣系統維修',
  '燈光系統維修',
  '雨刷更換',
  '其他維修服務',
];

// 表單資料
// 聯絡人資訊
const contactName = ref<string>('');
const contactPhone = ref<string>('');
const contactEmail = ref<string>('');

// 車輛資訊
const licensePlate = ref<string>('');
const carBrand = ref<string>('');
const carModel = ref<string>('');
const carYear = ref<string>('');
const vin = ref<string>('');

// 預約資訊
const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);

// 服務需求
const selectedService = ref<string>('');
const serviceDescription = ref<string>('');

// 表單驗證
const isFormValid = computed(() => {
  return (
    !!contactName.value.trim() &&
    !!contactPhone.value.trim() &&
    !!licensePlate.value.trim() &&
    !!carModel.value.trim() &&
    selectedDate.value !== null &&
    selectedTime.value !== null &&
    !!selectedService.value &&
    !!serviceDescription.value.trim()
  );
});

const canGoNext = computed(() => {
  if (step.value === 1) return isFormValid.value;
  return true;
});

const nextBtnClass = computed(() => {
  return canGoNext.value
    ? 'bg-[#6B6B5C] hover:opacity-95 active:opacity-90 shadow-[0_3px_0_rgba(0,0,0,0.18)]'
    : 'bg-[#D1D1CB] cursor-not-allowed';
});

const nextStep = () => {
  if (!canGoNext.value) return;
  step.value = 2;
};

const prevStep = () => {
  step.value = 1;
};

// 格式化函數
const selectedDateLong = computed(() => {
  if (!selectedDate.value) return '';
  return selectedDate.value.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
});

const selectedTimeLong = computed(() => selectedTime.value || '');

interface SummaryItem {
  label: string;
  value: string;
  hide?: boolean;
}

const summaryItems = computed<SummaryItem[]>(() => [
  {
    label: '聯絡人姓名',
    value: contactName.value,
  },
  {
    label: '聯絡電話',
    value: contactPhone.value,
  },
  {
    label: '電子郵件',
    value: contactEmail.value || '—',
    hide: !contactEmail.value,
  },
  {
    label: '車牌號碼',
    value: licensePlate.value,
  },
  {
    label: '品牌/廠牌',
    value: carBrand.value || '—',
    hide: !carBrand.value,
  },
  {
    label: '車型',
    value: carModel.value,
  },
  {
    label: '年份',
    value: carYear.value || '—',
    hide: !carYear.value,
  },
  {
    label: '車身碼/VIN',
    value: vin.value || '—',
    hide: !vin.value,
  },
  {
    label: '預約日期',
    value: selectedDateLong.value,
  },
  {
    label: '預約時段',
    value: selectedTimeLong.value,
  },
  {
    label: '維修服務項目',
    value: selectedService.value,
  },
  {
    label: '問題描述',
    value: serviceDescription.value,
  },
]);

// 提交相關
const showSuccess = ref(false);
const bookingCode = ref<string>('');
const isSubmitting = ref(false);
const submitError = ref<string>('');

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (time: string): string => {
  // 提取 HH:mm 格式的時間（忽略後面的文字如 "早上"、"下午"）
  const timeMatch = time.match(/^(\d{2}:\d{2})/);
  if (timeMatch) {
    return `${timeMatch[1]}:00`;
  }
  // 如果已經是 HH:mm:ss 格式，直接返回
  if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return time;
  }
  // 其他情況，嘗試添加 :00
  return `${time}:00`;
};

const finish = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;
  submitError.value = '';

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // 組合車輛資訊
    const carInfoParts = [carBrand.value, carModel.value, carYear.value].filter(Boolean);
    const carModelStr = carInfoParts.join(' ');

    const requestBody = {
      garage_id: props.garageId,
      customer_name: contactName.value.trim(),
      customer_phone: contactPhone.value.trim(),
      car_model: carModelStr,
      license_plate: licensePlate.value.trim(),
      service_type: selectedService.value,
      scheduled_date: formatDate(selectedDate.value!),
      scheduled_time: formatTime(selectedTime.value!),
      notes: [
        `問題描述：${serviceDescription.value.trim()}`,
        vin.value ? `車身碼：${vin.value}` : '',
        contactEmail.value ? `Email：${contactEmail.value}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    };

    const response = await fetch(`${apiUrl}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '預約建立失敗');
    }

    bookingCode.value = `BK${String(result.data.id).padStart(8, '0')}`;
    showSuccess.value = true;
  } catch (error) {
    console.error('預約失敗:', error);
    submitError.value = error instanceof Error ? error.message : '預約時發生錯誤，請稍後再試';
  } finally {
    isSubmitting.value = false;
  }
};

const resetAll = () => {
  showSuccess.value = false;
  step.value = 1;
  contactName.value = '';
  contactPhone.value = '';
  contactEmail.value = '';
  licensePlate.value = '';
  carBrand.value = '';
  carModel.value = '';
  carYear.value = '';
  vin.value = '';
  selectedDate.value = null;
  selectedTime.value = null;
  selectedService.value = '';
  serviceDescription.value = '';
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] px-6 py-10 text-[#2B2B2B]">
    <div class="mx-auto mb-6 w-full max-w-4xl">
      <button
        type="button"
        class="flex items-center gap-2 rounded-xl border border-[#E6E6DF] bg-white px-6 py-3 text-sm font-semibold text-[#6B6B5C] transition hover:bg-[#F5F4EF]"
        @click="$emit('back')"
      >
        <span class="material-symbols-outlined"> arrow_left_alt </span>
        返回維修廠介紹頁面
      </button>
    </div>

    <!-- 維修廠資訊 -->
    <div v-if="garageName" class="mx-auto mb-6 w-full max-w-4xl">
      <div class="rounded-2xl border border-[#E6E6DF] bg-white p-6 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6B6B5C] text-white">
            <span class="material-symbols-outlined text-2xl">store</span>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-bold text-[#2B2B2B]">{{ garageName }}</h2>
            <p v-if="garageAddress" class="mt-1 text-sm text-[#7A7A7A]">
              <span class="material-symbols-outlined text-base align-text-bottom">location_on</span>
              {{ garageAddress }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto w-full max-w-4xl rounded-[28px] border border-[#E6E6DF] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <div class="p-10">
        <div>
          <!-- 步驟 1: 填寫預約資訊 -->
          <div v-if="step === 1" class="space-y-8">
            <!-- 聯絡人資訊 -->
            <div>
              <h3 class="mb-4 text-xl font-bold text-[#2B2B2B]">聯絡人資訊</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <!-- 姓名 -->
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">
                      姓名
                      <span class="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      v-model.trim="contactName"
                      type="text"
                      class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                      placeholder="請輸入姓名"
                    />
                  </div>

                  <!-- 手機號碼 -->
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">
                      手機號碼
                      <span class="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      v-model.trim="contactPhone"
                      type="tel"
                      inputmode="tel"
                      class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                      placeholder="請輸入手機號碼"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">電子郵件（選填）</label>
                  <input
                    v-model.trim="contactEmail"
                    type="email"
                    inputmode="email"
                    class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                    placeholder="請輸入電子郵件"
                  />
                </div>
              </div>
            </div>

            <div class="h-px bg-[#E6E6DF]"></div>

            <!-- 車輛資訊 -->
            <div>
              <h3 class="mb-4 text-xl font-bold text-[#2B2B2B]">車輛資訊</h3>
              <div class="space-y-4">
                <!-- 車牌號碼 -->
                <div>
                  <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">
                    車牌號碼
                    <span class="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    v-model.trim="licensePlate"
                    type="text"
                    class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                    placeholder="例：ABC-1234"
                  />
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <!-- 品牌/廠牌 -->
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">品牌/廠牌（選填）</label>
                    <input
                      v-model.trim="carBrand"
                      type="text"
                      class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                      placeholder="例：Toyota、Honda"
                    />
                  </div>

                  <!-- 車型 -->
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">
                      車型
                      <span class="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      v-model.trim="carModel"
                      type="text"
                      class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                      placeholder="例：Camry、Accord"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <!-- 年份 -->
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">年份（選填）</label>
                    <input
                      v-model.trim="carYear"
                      type="text"
                      class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                      placeholder="例：2020"
                    />
                  </div>

                  <!-- 車身碼 -->
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">車身碼/VIN（選填）</label>
                    <input
                      v-model.trim="vin"
                      type="text"
                      class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                      placeholder="方便零件查詢"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-[#E6E6DF]"></div>

            <!-- 預約日期時段 -->
            <div>
              <h3 class="mb-4 text-xl font-bold text-[#2B2B2B]">預約日期時段</h3>
              <BookingTimeSelectorView v-model:date="selectedDate" v-model:time="selectedTime" />
            </div>

            <div class="h-px bg-[#E6E6DF]"></div>

            <!-- 服務需求 -->
            <div>
              <h3 class="mb-2 text-xl font-bold text-[#2B2B2B]">服務需求</h3>
              <p class="mb-4 text-sm text-[#7A7A7A]">請選擇維修服務項目並簡單敘述車輛問題與狀況</p>
              <div class="space-y-4">
                <!-- 維修服務項目下拉選單 -->
                <div>
                  <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">
                    維修服務項目
                    <span class="ml-1 text-red-500">*</span>
                  </label>
                  <select
                    v-model="selectedService"
                    class="h-11 w-full rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 text-sm outline-none transition focus:border-[#6B6B5C]"
                  >
                    <option value="" disabled>請選擇維修服務項目</option>
                    <option v-for="service in serviceOptions" :key="service" :value="service">
                      {{ service }}
                    </option>
                  </select>
                </div>

                <!-- 問題描述 -->
                <div>
                  <label class="mb-2 block text-sm font-semibold text-[#6B6B5C]">
                    問題描述
                    <span class="ml-1 text-red-500">*</span>
                  </label>
                  <textarea
                    v-model.trim="serviceDescription"
                    rows="5"
                    class="w-full resize-none rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] px-4 py-3 text-sm outline-none transition focus:border-[#6B6B5C] placeholder:text-[#B5B5AD]"
                    placeholder="請詳細描述車輛狀況，例如：需要更換機油和濾芯、煞車踩下有異音、引擎故障燈亮起需檢查等"
                  />
                  <p class="mt-2 text-xs text-[#B5B5AD]">
                    詳細的描述可以幫助技師更快速診斷問題
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 步驟 2: 確認預約資訊 -->
          <div v-else>
            <h2 class="mb-2 text-2xl font-bold tracking-tight">確認預約資訊</h2>
            <p class="mb-8 text-sm text-[#7A7A7A]">請確認以下資訊是否正確</p>

            <div class="space-y-6">
              <!-- 聯絡人資訊 -->
              <div class="rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] p-6">
                <h3 class="mb-4 text-base font-bold text-[#2B2B2B]">聯絡人資訊</h3>
                <div class="space-y-3">
                  <div v-for="item in summaryItems.slice(0, 3)" :key="item.label" class="flex">
                    <div class="w-32 text-sm font-semibold text-[#6B6B5C]">{{ item.label }}</div>
                    <div class="flex-1 text-sm text-[#2B2B2B]">{{ item.value }}</div>
                  </div>
                </div>
              </div>

              <!-- 車輛資訊 -->
              <div class="rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] p-6">
                <h3 class="mb-4 text-base font-bold text-[#2B2B2B]">車輛資訊</h3>
                <div class="space-y-3">
                  <div
                    v-for="item in summaryItems.slice(3, 9)"
                    :key="item.label"
                    v-show="!item.hide"
                    class="flex"
                  >
                    <div class="w-32 text-sm font-semibold text-[#6B6B5C]">{{ item.label }}</div>
                    <div class="flex-1 text-sm text-[#2B2B2B]">{{ item.value }}</div>
                  </div>
                </div>
              </div>

              <!-- 預約資訊 -->
              <div class="rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] p-6">
                <h3 class="mb-4 text-base font-bold text-[#2B2B2B]">預約資訊</h3>
                <div class="space-y-3">
                  <div v-for="item in summaryItems.slice(9, 12)" :key="item.label" class="flex">
                    <div class="w-32 text-sm font-semibold text-[#6B6B5C]">{{ item.label }}</div>
                    <div class="flex-1 text-sm text-[#2B2B2B]">{{ item.value }}</div>
                  </div>
                </div>
              </div>

              <!-- 問題描述 -->
              <div class="rounded-xl border border-[#E6E6DF] bg-[#F5F4EF] p-6">
                <h3 class="mb-4 text-base font-bold text-[#2B2B2B]">問題描述</h3>
                <div class="text-sm text-[#2B2B2B] whitespace-pre-wrap">{{ serviceDescription }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 按鈕區 -->
        <div class="mt-10">
          <!-- 錯誤訊息 -->
          <div v-if="submitError" class="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p class="text-sm text-red-600">{{ submitError }}</p>
          </div>

          <div class="flex items-center justify-between">
            <button
              v-if="step === 2"
              type="button"
              class="rounded-xl border border-[#E6E6DF] bg-[#FBFAF7] px-10 py-3 text-sm font-semibold text-[#6B6B5C] transition hover:bg-white"
              :disabled="isSubmitting"
              @click="prevStep"
            >
              上一步
            </button>
            <div v-else></div>

            <button
              v-if="step === 1"
              type="button"
              class="rounded-xl px-10 py-3 text-sm font-semibold text-white transition"
              :class="nextBtnClass"
              :disabled="!canGoNext"
              @click="nextStep"
            >
              下一步
            </button>
            <button
              v-else
              type="button"
              class="rounded-xl bg-[#6B6B5C] px-10 py-3 text-sm font-semibold text-white shadow-[0_3px_0_rgba(0,0,0,0.18)] transition"
              :class="{ 'opacity-50 cursor-not-allowed': !isFormValid || isSubmitting }"
              :disabled="!isFormValid || isSubmitting"
              @click="finish"
            >
              {{ isSubmitting ? '提交中...' : '確定送出' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <ServiceModal v-if="showSuccess" :bookingCode="bookingCode" @close="showSuccess = false" @again="resetAll" />
  </div>
</template>
