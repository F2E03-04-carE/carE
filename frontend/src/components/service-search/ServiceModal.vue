<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{ bookingCode: string }>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'again'): void;
}>();

const router = useRouter();

const goToBookings = () => {
  router.push('/member/bookings');
};
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/40">
    <div class="absolute inset-0 flex items-center justify-center p-6">
      <div class="relative w-full max-w-[680px] rounded-2xl border border-[#E6E6DF] bg-[#FBFAF7] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          class="absolute right-5 top-5 text-[#6B6B5C] hover:opacity-80"
          aria-label="close"
          @click="$emit('close')"
        >
          <i class="fa-solid fa-xmark text-xl" aria-hidden="true"></i>
        </button>
        <div class="px-10 pb-10 pt-12 text-center">
          <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#F2F1EC] text-[#6B6B5C]">
            <!-- <i class="fa-regular fa-circle-check text-4xl" aria-hidden="true"></i> -->
            <span class="material-symbols-outlined text-[50px] search-modal-check-icon">
              check_circle
            </span>
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
            class="mt-8 w-full rounded-xl bg-[#6B6B5C] px-6 py-4 text-base font-bold text-white hover:opacity-95 active:opacity-90"
            @click="goToBookings"
          >
            查看預約狀態
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
