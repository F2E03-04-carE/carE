<script setup lang="ts">
import { computed, ref } from "vue";
import ServiceStepper from "./ServiceStepper.vue";
import ServiceModal from "./ServiceModal.vue";
import BookingTimeSelectorView from "../BookingTimeSelectorView.vue"; //引入Booking元件

defineEmits<{
  (e: "back"): void;
}>();

type StepKey = "service" | "datetime" | "contact" | "confirm";
const steps: Array<{ key: StepKey; label: string }> = [
  { key: "service", label: "選擇服務" },
  { key: "datetime", label: "日期時段" },
  { key: "contact", label: "聯絡資訊" },
  { key: "confirm", label: "確認預約" },
];

const step = ref<number>(1);

type ServiceKey = "oil" | "tire" | "brake" | "maintain";
const serviceOptions: Array<{ key: ServiceKey; title: string; minutes: number; fa: string }> = [
  { key: "oil", title: "機油更換", minutes: 30, fa: "fa-solid fa-oil-can" },
  { key: "tire", title: "輪胎檢修", minutes: 45, fa: "fa-solid fa-car-side" },
  { key: "brake", title: "煞車系統檢查", minutes: 60, fa: "fa-solid fa-circle-check" },
  { key: "maintain", title: "定期保養", minutes: 90, fa: "fa-solid fa-screwdriver-wrench" },
];
const selectedService = ref<ServiceKey | null>(null);

const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);

const contactName = ref<string>("");
const contactPhone = ref<string>("");
const contactEmail = ref<string>("");
const contactNote = ref<string>("");

const isContactValid = computed(() => {
  return !!contactName.value.trim() && !!contactPhone.value.trim() && !!contactEmail.value.trim();
});

const maxUnlocked = computed(() => {
  if (step.value === 1) return selectedService.value ? 2 : 1;
  if (step.value === 2) return selectedDate.value && selectedTime.value ? 3 : 2;
  if (step.value === 3) return isContactValid.value ? 4 : 3;
  return 4;
});

const goToStep = (n: number) => {
  const target = Math.min(4, Math.max(1, n));
  step.value = Math.min(target, maxUnlocked.value);
};

const nextStep = () => {
  if (!canGoNext.value) return;
  step.value = Math.min(4, step.value + 1);
};

const prevStep = () => {
  step.value = Math.max(1, step.value - 1);
};

const canGoNext = computed(() => {
  if (step.value === 1) return selectedService.value !== null;
  if (step.value === 2) return selectedDate.value !== null && selectedTime.value !== null;
  if (step.value === 3) return isContactValid.value;
  return true;
});

const canFinish = computed(() => {
  return (
    selectedService.value !== null &&
    selectedDate.value !== null &&
    selectedTime.value !== null &&
    isContactValid.value
  );
});

const serviceCardClass = (key: ServiceKey) => {
  return selectedService.value === key
    ? "border-[#6B6B5C] bg-[#6B6B5C] shadow-[0_3px_0_rgba(0,0,0,0.18)]"
    : "border-[#E6E6DF] bg-white hover:border-[#CFCFC6]";
};

const prevBtnClass = computed(() => {
  return step.value === 1
    ? "border-[#E6E6DF] text-[#B5B5AD] bg-[#FBFAF7] cursor-not-allowed"
    : "border-[#E6E6DF] text-[#6B6B5C] bg-[#FBFAF7] hover:bg-white";
});
const nextBtnClass = computed(() => {
  return canGoNext.value
    ? "bg-[#6B6B5C] hover:opacity-95 active:opacity-90 shadow-[0_3px_0_rgba(0,0,0,0.18)]"
    : "bg-[#D1D1CB] cursor-not-allowed";
});

const weekdayCN = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const pad2 = (n: number) => String(n).padStart(2, "0");

const selectedDateLong = computed(() => {
  if (!selectedDate.value) return "";
  const y = selectedDate.value.getFullYear();
  const m = pad2(selectedDate.value.getMonth() + 1);
  const d = pad2(selectedDate.value.getDate());
  const w = weekdayCN[selectedDate.value.getDay()];
  return `${y}年 ${m}月 ${d}日 ${w}`;
});

// 修正：因為組員的元件回傳的格式已經是 "09:00 早上"，不需要再額外處理
const selectedTimeLong = computed(() => {
  return selectedTime.value || "";
});

const selectedServiceObj = computed(() => serviceOptions.find((s) => s.key === selectedService.value) || null);

interface SummaryItem {
  key: string;
  icon: string;
  iconClass?: string;
  label: string;
  value: string;
  valueClass?: string;
  details?: string;
  detailsClass?: string;
}

const summaryItems = computed<SummaryItem[]>(() => [
  {
    key: "service",
    icon: "fa-solid fa-wrench",
    label: "服務項目",
    value: selectedServiceObj.value?.title || "—",
    details: `預估時間：${selectedServiceObj.value?.minutes ?? "—"}分鐘`,
  },
  {
    key: "datetime",
    icon: "fa-regular fa-calendar",
    label: "預約日期 & 時段",
    value: selectedDateLong.value || "—",
    details: selectedTimeLong.value || "—",
    detailsClass: "text-lg font-semibold text-[#7A7A7A]",
  },
  {
    key: "name",
    icon: "fa-regular fa-user",
    label: "姓名",
    value: contactName.value || "—",
  },
  {
    key: "phone",
    icon: "fa-solid fa-phone",
    label: "電話",
    value: contactPhone.value || "—",
  },
  {
    key: "email",
    icon: "fa-regular fa-envelope",
    label: "電子郵件",
    value: contactEmail.value || "—",
  },
  {
    key: "note",
    icon: "fa-regular fa-pen-to-square",
    iconClass: "text-[#6E6E6A]",
    label: "備註",
    value: contactNote.value || "—",
    valueClass: "whitespace-pre-wrap",
  },
]);

const showSuccess = ref(false);
const bookingCode = ref<string>("");

const randomBookingCode = () => {
  const n = Math.floor(10000000 + Math.random() * 90000000);
  return `BK${n}`;
};

const finish = () => {
  if (!canFinish.value) return;
  bookingCode.value = randomBookingCode();
  showSuccess.value = true;
};

const resetAll = () => {
  showSuccess.value = false;

  step.value = 1;
  selectedService.value = null;
  selectedDate.value = null;
  selectedTime.value = null;

  contactName.value = "";
  contactPhone.value = "";
  contactEmail.value = "";
  contactNote.value = "";
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] px-6 py-10 text-[#2B2B2B]">
    <div class="mx-auto mb-6 w-full max-w-6xl">
      <button
        type="button"
        class="flex items-center gap-2 rounded-xl border border-[#E6E6DF] bg-white px-6 py-3 text-sm font-semibold text-[#6B6B5C] transition hover:bg-[#F5F4EF]"
        @click="$emit('back')"
      >
        <i class="fa-solid fa-arrow-left"></i>
        返回維修廠介紹頁面
      </button>
    </div>
    <div class="mx-auto w-full max-w-6xl rounded-[28px] border border-[#E6E6DF] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <div class="p-10">
        <ServiceStepper :step="step" :steps="steps" @go="goToStep" />
        <div class="mt-16">
          <div v-if="step === 1">
            <h2 class="text-3xl font-bold tracking-tight">選擇服務項目</h2>
            <div class="mt-10 grid grid-cols-2 gap-6">
              <button
                v-for="item in serviceOptions"
                :key="item.key"
                type="button"
                class="flex items-center gap-5 rounded-2xl border bg-white px-7 py-6 text-left transition"
                :class="serviceCardClass(item.key)"
                @click="selectedService = item.key"
              >
                <div 
                  class="grid h-14 w-14 place-items-center rounded-2xl transition"
                  :class="selectedService === item.key ? 'bg-white/20 text-white' : 'bg-[#F5F4EF] text-[#6B6B5C]'"
                >
                  <i :class="item.fa" class="text-xl" aria-hidden="true"></i>
                </div>
                <div class="min-w-0">
                  <div 
                    class="text-lg font-semibold transition"
                    :class="selectedService === item.key ? 'text-white' : 'text-[#2B2B2B]'"
                  >
                    {{ item.title }}
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          <div v-else-if="step === 2">
            <BookingTimeSelectorView 
              v-model:date="selectedDate" 
              v-model:time="selectedTime" 
            />
          </div>

          <div v-else-if="step === 3">
            <h2 class="text-3xl font-bold tracking-tight">聯絡資訊</h2>
            <div class="mt-10 rounded-2xl border border-[#E6E6DF] bg-white px-10 py-6">
              <div class="grid grid-cols-[44px_1fr] gap-6 py-7">
                <div class="pt-1 text-[#6B6B5C]">
                  <i class="fa-regular fa-user text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6B6B5C]">姓名</div>
                  <input
                    v-model.trim="contactName"
                    class="mt-3 h-11 w-full rounded-xl bg-[#F5F4EF] px-4 text-sm outline-none placeholder:text-[#B5B5AD]"
                    placeholder="請輸入姓名"
                  />
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-7">
                <div class="pt-1 text-[#6B6B5C]">
                  <i class="fa-solid fa-phone text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6B6B5C]">電話</div>
                  <input
                    v-model.trim="contactPhone"
                    inputmode="tel"
                    class="mt-3 h-11 w-full rounded-xl bg-[#F5F4EF] px-4 text-sm outline-none placeholder:text-[#B5B5AD]"
                    placeholder="請輸入電話"
                  />
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-7">
                <div class="pt-1 text-[#6B6B5C]">
                  <i class="fa-regular fa-envelope text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6B6B5C]">電子郵件</div>
                  <input
                    v-model.trim="contactEmail"
                    inputmode="email"
                    class="mt-3 h-11 w-full rounded-xl bg-[#F5F4EF] px-4 text-sm outline-none placeholder:text-[#B5B5AD]"
                    placeholder="請輸入電子郵件"
                  />
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-7">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-regular fa-pen-to-square text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6B6B5C]">備註</div>
                  <textarea
                    v-model.trim="contactNote"
                    rows="3"
                    class="mt-3 w-full resize-none rounded-xl bg-[#F5F4EF] px-4 py-3 text-sm outline-none placeholder:text-[#B5B5AD]"
                    placeholder="如有特殊需求請在此填寫"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div v-else>
            <h2 class="text-3xl font-bold tracking-tight">確認預約資訊</h2>
            <div class="mt-10 rounded-2xl border border-[#E6E6DF] bg-white px-10 py-2">
              <div v-for="(item, index) in summaryItems" :key="item.key">
                <div class="grid grid-cols-[44px_1fr] gap-6 py-8">
                  <div class="pt-1" :class="item.iconClass || 'text-[#6B6B5C]'">
                    <i :class="[item.icon, 'text-2xl']" aria-hidden="true"></i>
                  </div>
                  <div>
                    <div class="text-base font-semibold text-[#6B6B5C]">{{ item.label }}</div>
                    <div class="mt-2 text-lg font-semibold" :class="item.valueClass">
                      {{ item.value }}
                    </div>
                    <div 
                      v-if="item.details" 
                      class="mt-2"
                      :class="item.detailsClass || 'text-sm text-[#7A7A7A]'"
                    >
                      {{ item.details }}
                    </div>
                  </div>
                </div>
                <div v-if="index < summaryItems.length - 1" class="h-px bg-[#E6E6DF]" />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-14 flex items-center justify-between">
          <button
            type="button"
            class="rounded-xl border px-10 py-3 text-sm font-semibold transition"
            :class="prevBtnClass"
            :disabled="step === 1"
            @click="prevStep"
          >
            上一步
          </button>
          <button
            v-if="step < 4"
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
            class="rounded-xl bg-[#6B6B5C] px-10 py-3 text-sm font-semibold text-white shadow-[0_3px_0_rgba(0,0,0,0.18)] hover:opacity-95 active:opacity-90"
            :disabled="!canFinish"
            @click="finish"
          >
            完成預約
          </button>
        </div>
      </div>
    </div>
        <ServiceModal v-if="showSuccess" :bookingCode="bookingCode" @close="showSuccess = false" @again="resetAll" />
  </div>
</template>