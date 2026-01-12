<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const ReceiveMethods = [
  { id: `Email`, label: `電子郵件` },
  { id: `Phone`, label: `手機號碼` },
] as const;

type ReceiveMethod = (typeof ReceiveMethods)[number][`id`];

const ReceiveMethodValue = ref<ReceiveMethod>(`Email`);
const Email = ref<string>(``);
const Phone = ref<string>(``);

const IsSubmitting = ref<boolean>(false);
const IsModalOpen = ref<boolean>(false);

const Countdown = ref<number>(5);
let CountdownTimer: number | null = null;

const IsEmailMode = computed<boolean>(() => ReceiveMethodValue.value === `Email`);

const CurrentValue = computed<string>(() => {
  return IsEmailMode.value ? Email.value : Phone.value;
});

const CanSubmit = computed<boolean>(() => {
  return CurrentValue.value.trim().length > 0 && !IsSubmitting.value;
});

const ClearCountdownTimer = (): void => {
  if (CountdownTimer === null) return;
  window.clearInterval(CountdownTimer);
  CountdownTimer = null;
};

const StartCountdown = (): void => {
  ClearCountdownTimer();
  Countdown.value = 5;

  CountdownTimer = window.setInterval(() => {
    if (Countdown.value <= 1) {
      ClearCountdownTimer();
      IsModalOpen.value = false;
      return;
    }
    Countdown.value = Countdown.value - 1;
  }, 1000);
};

const HandleSubmit = async (): Promise<void> => {
  if (!CanSubmit.value) return;

  IsSubmitting.value = true;

  try {
    // 假 API 延遲
    await new Promise((Resolve) => setTimeout(Resolve, 600));
    IsModalOpen.value = true;
  } finally {
    IsSubmitting.value = false;
  }
};

const CloseModal = (): void => {
  IsModalOpen.value = false;
};

watch(
  () => IsModalOpen.value,
  (IsOpen) => {
    if (IsOpen) {
      StartCountdown();
      return;
    }
    ClearCountdownTimer();
  },
);

onBeforeUnmount(() => {
  ClearCountdownTimer();
});
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] px-4 py-10">
    <div class="mx-auto w-full max-w-[900px]">
      <div class="rounded-2xl bg-white p-10 shadow-[0_6px_18px_rgba(0,0,0,0.08)] ring-1 ring-[#E7E3DD]">
        <h1 class="text-[40px] font-semibold text-[#3E3E3E]">忘記密碼</h1>
        <p class="mt-3 text-base text-[#8C8C8C]">請選擇您想要接收密碼重設連結的方式</p>
        <div class="mt-12">
          <p class="text-2xl font-semibold text-[#3E3E3E]">接收方式</p>
          <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <button
              v-for="method in ReceiveMethods"
              :key="method.id"
              class="flex items-center justify-center gap-4 rounded-xl border px-6 py-5 text-xl font-semibold transition"
              :class="
                ReceiveMethodValue === method.id
                  ? `border-[#6B6B5C] bg-[#6B6B5C] text-white`
                  : `border-[#E7E3DD] bg-white text-[#3E3E3E] hover:bg-[#F4F2EE]`
              "
              type="button"
              @click="ReceiveMethodValue = method.id"
            >
              <span
                class="grid h-7 w-7 place-items-center rounded-full border"
                :class="ReceiveMethodValue === method.id ? `border-white` : `border-[#CFC8C0]`"
              >
                <span
                  class="h-3.5 w-3.5 rounded-full"
                  :class="ReceiveMethodValue === method.id ? `bg-white` : `bg-transparent`"
                ></span>
              </span>
              {{ method.label }}
            </button>
          </div>
          <div class="mt-10">
            <p class="text-2xl font-semibold text-[#3E3E3E]">
              {{ IsEmailMode ? `電子郵件` : `手機號碼` }}
            </p>
            <input
              v-if="IsEmailMode"
              v-model="Email"
              class="mt-4 w-full rounded-xl border border-[#E7E3DD] bg-white px-6 py-5 text-xl text-[#3E3E3E] placeholder:text-[#C8C8C8]"
              type="email"
              placeholder="example@email.com"
            />
            <input
              v-else
              v-model="Phone"
              class="mt-4 w-full rounded-xl border border-[#E7E3DD] bg-white px-6 py-5 text-xl text-[#3E3E3E] placeholder:text-[#C8C8C8]"
              type="tel"
              placeholder="09xx-xxx-xxx"
            />
            <button
              class="mt-10 w-full rounded-xl bg-[#6B6B5C] px-6 py-5 text-2xl font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.10)] transition hover:opacity-95 disabled:opacity-60"
              :disabled="!CanSubmit"
              type="button"
              @click="HandleSubmit"
            >
              {{ IsSubmitting ? `發送中...` : `發送重設連結` }}
            </button>
            <button
              class="mt-8 w-full text-center text-xl font-semibold text-[#9A9A9A] hover:opacity-80"
              type="button"
            >
              返回登入頁面
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="IsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        class="absolute inset-0 bg-black/40"
        type="button"
        aria-label="Close modal background"
        @click="CloseModal"
      />
      <div class="relative w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.25)] ring-1 ring-[#E7E3DD]">
        <div class="mx-auto h-20 w-20 rounded-full bg-[#ECEAE6]" />
        <h2 class="mt-6 text-center text-3xl font-semibold text-[#3E3E3E]">發送成功</h2>
        <p class="mt-3 text-center text-base font-semibold text-[#8C8C8C]">
          我們已將密碼重設連結寄送給您
        </p>
        <p class="mt-2 text-center text-lg font-semibold text-[#8C8C8C]">
          將在 {{ Countdown }} 秒後返回登入頁面...
        </p>
        <button
          class="mt-8 w-full rounded-xl bg-[#6B6B5C] px-6 py-4 text-xl font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.10)] transition hover:opacity-95"
          type="button"
          @click="CloseModal"
        >
          立即返回
        </button>
      </div>
    </div>
  </div>
</template>
