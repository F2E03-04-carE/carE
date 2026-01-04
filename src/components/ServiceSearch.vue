<template>
  <div class="min-h-screen bg-[#FAF8F5] px-6 py-10 text-[#2B2B2B]">
    <div class="mx-auto w-full max-w-6xl rounded-[28px] border border-[#E6E6DF] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <div class="p-10">
        <div class="relative">
          <div class="absolute left-0 right-0 top-[18px] h-px bg-[#E6E6DF]" />
          <div
            v-if="step > 1"
            class="absolute left-0 top-[18px] h-px bg-[#6E6E6A]"
            :style="{ width: progressWidth }"
          />
          <div class="grid grid-cols-5 items-start gap-0">
            <button
              v-for="(s, idx) in steps"
              :key="s.key"
              type="button"
              class="group relative flex flex-col items-center gap-3"
              @click="goToStep(idx + 1)"
            >
              <span
                class="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition"
                :class="circleClass(idx + 1)"
              >
                <template v-if="idx + 1 < step">
                  <i class="fa-solid fa-check text-[14px]" aria-hidden="true"></i>
                </template>
                <template v-else>
                  {{ idx + 1 }}
                </template>
              </span>
              <span class="text-sm transition" :class="labelClass(idx + 1)">
                {{ s.label }}
              </span>
            </button>
          </div>
        </div>
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
                <div class="grid h-14 w-14 place-items-center rounded-2xl bg-[#F5F4EF] text-[#6E6E6A]">
                  <i :class="item.fa" class="text-xl" aria-hidden="true"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-lg font-semibold">{{ item.title }}</div>
                  <div class="mt-1 text-sm text-[#7A7A7A]">預估時間：{{ item.minutes }}分鐘</div>
                </div>
              </button>
            </div>
          </div>
          <div v-else-if="step === 2">
            <h2 class="text-3xl font-bold tracking-tight">選擇車輛類型</h2>
            <div class="mt-10 grid grid-cols-2 gap-6">
              <button
                v-for="v in vehicleOptions"
                :key="v.key"
                type="button"
                class="flex items-center gap-6 rounded-2xl border px-8 py-7 text-left transition"
                :class="vehicleCardClass(v.key)"
                @click="selectedVehicle = v.key"
              >
                <span
                  class="relative grid h-5 w-5 place-items-center rounded-full border"
                  :class="selectedVehicle === v.key ? 'border-[#6E6E6A]' : 'border-[#E6E6DF]'"
                >
                  <span v-if="selectedVehicle === v.key" class="h-2.5 w-2.5 rounded-full bg-[#6E6E6A]" />
                </span>
                <div>
                  <div class="text-lg font-semibold">{{ v.title }}</div>
                  <div class="mt-1 text-sm text-[#7A7A7A]">{{ v.subtitle }}</div>
                </div>
              </button>
            </div>
          </div>
          <div v-else-if="step === 3">
            <h2 class="text-3xl font-bold tracking-tight">選擇日期</h2>
            <div class="mt-10 grid grid-cols-2 gap-8">
              <div class="rounded-2xl border border-[#E6E6DF] bg-white p-8">
                <div class="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-xl bg-[#F5F4EF] text-lg text-[#6E6E6A] hover:opacity-90"
                    @click="prevMonth"
                    aria-label="prev month"
                  >
                    <i class="fa-solid fa-chevron-left text-sm" aria-hidden="true"></i>
                  </button>
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <select
                        v-model.number="viewYear"
                        class="h-10 appearance-none rounded-xl bg-[#F5F4EF] px-4 pr-10 text-sm font-semibold text-[#2B2B2B] outline-none"
                      >
                        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                      </select>
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                        >▾</span
                      >
                    </div>
                    <div class="relative">
                      <select
                        v-model.number="viewMonth"
                        class="h-10 appearance-none rounded-xl bg-[#F5F4EF] px-4 pr-10 text-sm font-semibold text-[#2B2B2B] outline-none"
                      >
                        <option v-for="(m, idx) in monthOptions" :key="m" :value="idx">{{ m }}</option>
                      </select>
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                        >▾</span
                      >
                    </div>
                  </div>
                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-xl bg-[#F5F4EF] text-lg text-[#6E6E6A] hover:opacity-90"
                    @click="nextMonth"
                    aria-label="next month"
                  >
                    <i class="fa-solid fa-chevron-right text-sm" aria-hidden="true"></i>
                  </button>
                </div>
                <div class="mt-10 grid grid-cols-7 gap-4 text-center text-sm font-semibold text-[#6E6E6A]">
                  <div v-for="d in weekDaysMon" :key="d">{{ d }}</div>
                </div>
                <div class="mt-6 grid grid-cols-7 gap-4 text-center">
                  <button
                    v-for="cell in calendarCellsMon42"
                    :key="cell.key"
                    type="button"
                    class="h-11 w-11 rounded-xl text-base font-semibold transition"
                    :class="dayBtnClass(cell.date, cell.inMonth)"
                    @click="onPickDate(cell.date)"
                  >
                    {{ cell.date.getDate() }}
                  </button>
                </div>
              </div>
              <div class="space-y-6">
                <div class="rounded-2xl border border-[#E6E6DF] bg-white px-6 py-5">
                  <div class="flex items-start gap-4">
                    <div class="mt-0.5 text-[#6E6E6A]">
                      <i class="fa-regular fa-calendar text-xl" aria-hidden="true"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="text-lg font-bold">{{ selectedDateLong || "尚未選擇日期" }}</div>
                      <div class="mt-2 text-lg font-semibold text-[#7A7A7A]">
                        {{ selectedTimeLong || "請選擇時段" }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-sm font-semibold text-[#6E6E6A]">選擇時段</div>
                <div class="rounded-2xl border border-[#E6E6DF] bg-white p-4">
                  <div class="max-h-[320px] overflow-y-auto pr-2">
                    <button
                      v-for="t in timeOptions"
                      :key="t.time"
                      type="button"
                      class="mb-3 flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition"
                      :class="timeRowClass(t.time)"
                      @click="selectedTime = t.time"
                    >
                      <div class="flex items-center gap-3">
                        <span :class="selectedTime === t.time ? 'text-white' : 'text-[#6E6E6A]'" class="shrink-0">
                          <i class="fa-regular fa-clock text-lg" aria-hidden="true"></i>
                        </span>
                        <div
                          class="text-base font-bold"
                          :class="selectedTime === t.time ? 'text-white' : 'text-[#2B2B2B]'"
                        >
                          {{ t.time }}
                        </div>
                      </div>
                      <div
                        class="text-sm font-semibold"
                        :class="selectedTime === t.time ? 'text-white/90' : 'text-[#7A7A7A]'"
                      >
                        剩餘 {{ t.remain }}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="step === 4">
            <h2 class="text-3xl font-bold tracking-tight">聯絡資訊</h2>
            <div class="mt-10 rounded-2xl border border-[#E6E6DF] bg-white px-10 py-6">
              <div class="grid grid-cols-[44px_1fr] gap-6 py-7">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-regular fa-user text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">姓名</div>
                  <input
                    v-model.trim="contactName"
                    class="mt-3 h-11 w-full rounded-xl bg-[#F5F4EF] px-4 text-sm outline-none placeholder:text-[#B5B5AD]"
                    placeholder="請輸入姓名"
                  />
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-7">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-solid fa-phone text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">電話</div>
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
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-regular fa-envelope text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">電子郵件</div>
                  <input
                    v-model.trim="contactEmail"
                    inputmode="email"
                    class="mt-3 h-11 w-full rounded-xl bg-[#F5F4EF] px-4 text-sm outline-none placeholder:text-[#B5B5AD]"
                    placeholder="請輸入電子郵件"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <h2 class="text-3xl font-bold tracking-tight">確認預約資訊</h2>
            <div class="mt-10 rounded-2xl border border-[#E6E6DF] bg-white px-10 py-2">
              <div class="grid grid-cols-[44px_1fr] gap-6 py-8">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-solid fa-wrench text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">服務項目</div>
                  <div class="mt-2 text-lg font-semibold">{{ selectedServiceObj?.title || "—" }}</div>
                  <div class="mt-2 text-sm text-[#7A7A7A]">預估時間：{{ selectedServiceObj?.minutes ?? "—" }}分鐘</div>
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-8">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-solid fa-car text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">車輛類型</div>
                  <div class="mt-2 text-lg font-semibold">{{ selectedVehicleObj?.title || "—" }}</div>
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-8">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-regular fa-calendar text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">預約日期 &amp; 時段</div>
                  <div class="mt-2 text-lg font-semibold">{{ selectedDateLong || "—" }}</div>
                  <div class="mt-2 text-lg font-semibold text-[#7A7A7A]">{{ selectedTimeLong || "—" }}</div>
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-8">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-regular fa-user text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">姓名</div>
                  <div class="mt-2 text-lg font-semibold">{{ contactName || "—" }}</div>
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-8">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-solid fa-phone text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">電話</div>
                  <div class="mt-2 text-lg font-semibold">{{ contactPhone || "—" }}</div>
                </div>
              </div>
              <div class="h-px bg-[#E6E6DF]" />
              <div class="grid grid-cols-[44px_1fr] gap-6 py-8">
                <div class="pt-1 text-[#6E6E6A]">
                  <i class="fa-regular fa-envelope text-2xl" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-base font-semibold text-[#6E6E6A]">電子郵件</div>
                  <div class="mt-2 text-lg font-semibold">{{ contactEmail || "—" }}</div>
                </div>
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
            v-if="step < 5"
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
            class="rounded-xl bg-[#6E6E6A] px-10 py-3 text-sm font-semibold text-white shadow-[0_3px_0_rgba(0,0,0,0.18)] hover:opacity-95 active:opacity-90"
            :disabled="!canFinish"
            @click="finish"
          >
            完成預約
          </button>
        </div>
      </div>
    </div>
    <div v-if="showSuccess" class="fixed inset-0 z-50 bg-black/40">
      <div class="absolute inset-0 flex items-center justify-center p-6">
        <div
          class="relative w-full max-w-[680px] rounded-2xl border border-[#E6E6DF] bg-[#FBFAF7] shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        >
          <button
            type="button"
            class="absolute right-5 top-5 text-[#6E6E6A] hover:opacity-80"
            aria-label="close"
            @click="showSuccess = false"
          >
            <i class="fa-solid fa-xmark text-xl" aria-hidden="true"></i>
          </button>
          <div class="px-10 pb-10 pt-12 text-center">
            <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#F2F1EC] text-[#6E6E6A]">
              <i class="fa-regular fa-circle-check text-4xl" aria-hidden="true"></i>
            </div>
            <div class="mt-6 text-3xl font-extrabold">預約成功！</div>
            <div class="mt-3 text-lg font-semibold text-[#7A7A7A]">您的預約已送出</div>
            <div class="mx-auto mt-8 w-full max-w-[260px] rounded-2xl border border-[#E6E6DF] bg-[#F6F5F0] px-6 py-5">
              <div class="text-sm font-semibold text-[#7A7A7A]">預約編號</div>
              <div class="mt-2 text-lg font-extrabold tracking-wide text-[#2B2B2B]">
                {{ bookingCode }}
              </div>
            </div>
            <div class="mt-8 text-sm leading-7 text-[#7A7A7A]">
              我們已發送確認信至您的電子郵件，請留意相關通知。
            </div>
            <button
              type="button"
              class="mt-8 w-full rounded-xl bg-[#6E6E6A] px-6 py-4 text-base font-bold text-white hover:opacity-95 active:opacity-90"
              @click="resetAll"
            >
              再次預約
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

/** Steps */
type StepKey = "service" | "vehicle" | "datetime" | "contact" | "confirm";
const steps: Array<{ key: StepKey; label: string }> = [
  { key: "service", label: "選擇服務" },
  { key: "vehicle", label: "車輛類型" },
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

type VehicleKey = "sedan" | "suv" | "truck" | "motor";
const vehicleOptions: Array<{ key: VehicleKey; title: string; subtitle: string }> = [
  { key: "sedan", title: "轎車", subtitle: "一般房車" },
  { key: "suv", title: "SUV/休旅車", subtitle: "運動休旅車" },
  { key: "truck", title: "貨車", subtitle: "小型貨車" },
  { key: "motor", title: "機車", subtitle: "機車類" },
];
const selectedVehicle = ref<VehicleKey | null>(null);

const weekDaysMon = ["一", "二", "三", "四", "五", "六", "日"];
const monthOptions = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const viewYear = ref<number>(2026);
const viewMonth = ref<number>(0); // Jan
const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);

const yearOptions = computed(() => [2025, 2026, 2027, 2028]);
const timeOptions = [
  { time: "09:00", remain: 3 },
  { time: "10:00", remain: 5 },
  { time: "11:00", remain: 2 },
  { time: "13:00", remain: 4 },
  { time: "14:00", remain: 1 },
  { time: "15:00", remain: 6 },
];

const contactName = ref<string>("");
const contactPhone = ref<string>("");
const contactEmail = ref<string>("");

const isContactValid = computed(() => {
  return !!contactName.value.trim() && !!contactPhone.value.trim() && !!contactEmail.value.trim();
});

const maxUnlocked = computed(() => {
  if (step.value === 1) return selectedService.value ? 2 : 1;
  if (step.value === 2) return selectedVehicle.value ? 3 : 2;
  if (step.value === 3) return selectedDate.value && selectedTime.value ? 4 : 3;
  if (step.value === 4) return isContactValid.value ? 5 : 4;
  return 5;
});

const goToStep = (n: number) => {
  const target = Math.min(5, Math.max(1, n));
  step.value = Math.min(target, maxUnlocked.value);
};

const nextStep = () => {
  if (!canGoNext.value) return;
  step.value = Math.min(5, step.value + 1);
};

const prevStep = () => {
  step.value = Math.max(1, step.value - 1);
};

const canGoNext = computed(() => {
  if (step.value === 1) return selectedService.value !== null;
  if (step.value === 2) return selectedVehicle.value !== null;
  if (step.value === 3) return selectedDate.value !== null && selectedTime.value !== null;
  if (step.value === 4) return isContactValid.value;
  return true;
});

const canFinish = computed(() => {
  return (
    selectedService.value !== null &&
    selectedVehicle.value !== null &&
    selectedDate.value !== null &&
    selectedTime.value !== null &&
    isContactValid.value
  );
});

const progressWidth = computed(() => {
  const segments = steps.length - 1;
  const done = Math.max(0, step.value - 1);
  return `${(done / segments) * 100}%`;
});

const circleClass = (n: number) => {
  if (n <= step.value) return "bg-[#6E6E6A] text-white";
  return "bg-white text-[#7A7A7A] border border-[#E6E6DF]";
};
const labelClass = (n: number) => {
  if (n === step.value) return "text-[#2B2B2B] font-semibold";
  return "text-[#7A7A7A]";
};

const serviceCardClass = (key: ServiceKey) => {
  return selectedService.value === key ? "border-[#6E6E6A]" : "border-[#E6E6DF] hover:border-[#CFCFC6]";
};
const vehicleCardClass = (key: VehicleKey) => {
  return selectedVehicle.value === key
    ? "border-[#6E6E6A] bg-[#FAFAF8]"
    : "border-[#E6E6DF] bg-white hover:border-[#CFCFC6]";
};

const prevBtnClass = computed(() => {
  return step.value === 1
    ? "border-[#E6E6DF] text-[#B5B5AD] bg-[#FBFAF7] cursor-not-allowed"
    : "border-[#E6E6DF] text-[#6E6E6A] bg-[#FBFAF7] hover:bg-white";
});
const nextBtnClass = computed(() => {
  return canGoNext.value
    ? "bg-[#6E6E6A] hover:opacity-95 active:opacity-90 shadow-[0_3px_0_rgba(0,0,0,0.18)]"
    : "bg-[#D1D1CB] cursor-not-allowed";
});

const toMonIndex = (jsDay: number) => (jsDay + 6) % 7;

const calendarCellsMon42 = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1);
  const firstMonIdx = toMonIndex(first.getDay());
  const start = new Date(viewYear.value, viewMonth.value, 1 - firstMonIdx);

  const cells: Array<{ key: string; date: Date; inMonth: boolean }> = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({
      key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      date: d,
      inMonth: d.getMonth() === viewMonth.value,
    });
  }
  return cells;
});

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const dayBtnClass = (d: Date, inMonth: boolean) => {
  const sel = selectedDate.value && sameDay(d, selectedDate.value);
  if (sel) return "bg-[#6E6E6A] text-white";
  if (!inMonth) return "text-[#D1D1CB] hover:bg-transparent";
  return "text-[#2B2B2B] hover:bg-[#F5F4EF]";
};

const onPickDate = (d: Date) => {
  selectedDate.value = new Date(d);
};

const prevMonth = () => {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value -= 1;
  } else {
    viewMonth.value -= 1;
  }
};
const nextMonth = () => {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value += 1;
  } else {
    viewMonth.value += 1;
  }
};

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

const selectedTimeLong = computed(() => {
  if (!selectedTime.value) return "";
  const hour = Number(selectedTime.value.split(":")[0] || 0);
  const period = hour < 12 ? "早上" : hour < 18 ? "下午" : "晚上";
  return `${selectedTime.value} ${period}`;
});

const timeRowClass = (t: string) => {
  const active = selectedTime.value === t;
  return active ? "border-transparent bg-[#6E6E6A]" : "border-[#E6E6DF] bg-white hover:border-[#CFCFC6]";
};

const selectedServiceObj = computed(() => serviceOptions.find((s) => s.key === selectedService.value) || null);
const selectedVehicleObj = computed(() => vehicleOptions.find((v) => v.key === selectedVehicle.value) || null);

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
  selectedVehicle.value = null;
  selectedDate.value = null;
  selectedTime.value = null;

  contactName.value = "";
  contactPhone.value = "";
  contactEmail.value = "";
};
</script>
