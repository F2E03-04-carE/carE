<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, watch } from "vue";

type Props = {
  open: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", payload: { email: string; password: string; remember: boolean }): void;
}>();

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const touched = reactive({
  email: false,
  password: false,
});

const errors = reactive({
  email: "",
  password: "",
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resetAll() {
  form.email = "";
  form.password = "";
  form.remember = false;

  touched.email = false;
  touched.password = false;

  errors.email = "";
  errors.password = "";
}

function validateEmail() {
  if (!form.email.trim()) {
    errors.email = "請輸入 Email";
    return false;
  }
  if (!emailRegex.test(form.email.trim())) {
    errors.email = "Email 格式不正確";
    return false;
  }
  errors.email = "";
  return true;
}

function validatePassword() {
  if (!form.password.trim()) {
    errors.password = "請輸入密碼";
    return false;
  }
  if (form.password.trim().length < 8) {
    errors.password = "密碼至少 8 碼";
    return false;
  }
  errors.password = "";
  return true;
}

const canSubmit = computed(() => {
  // 只要有錯誤就不可送出；不強制 touched，避免初次就阻擋體驗
  return !errors.email && !errors.password;
});

function markTouched(field: keyof typeof touched) {
  touched[field] = true;
  if (field === "email") validateEmail();
  if (field === "password") validatePassword();
}

function close() {
  emit("close");
}

function onBackdropClick(e: MouseEvent) {
  // 點到遮罩（不是 modal 內容）才關
  if (e.target === e.currentTarget) close();
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === "Escape") close();
}

function onSubmit() {
  // 送出時一律做完整驗證 + 顯示錯誤
  touched.email = true;
  touched.password = true;

  const okEmail = validateEmail();
  const okPwd = validatePassword();

  if (!okEmail || !okPwd) return;

  emit("submit", {
    email: form.email.trim(),
    password: form.password.trim(),
    remember: form.remember,
  });

  // 這裡先不自動 close，避免未來要等 API 回應
  // 如果你想送出後關閉，可改成：close();
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetAll();
    }
  }
);

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        @click="onBackdropClick"
      >
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!-- modal -->
        <div
          class="relative z-[10000] w-[92%] max-w-md rounded-2xl bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <!-- header -->
          <div class="flex items-center justify-between px-6 pt-6">
            <h3 class="text-xl font-bold text-slate-900">會員登入</h3>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
              aria-label="Close"
              @click="close"
            >
              <span class="text-2xl leading-none text-slate-600">×</span>
            </button>
          </div>

          <!-- body -->
          <div class="px-6 pb-6 pt-4">
            <div class="space-y-4">
              <!-- Email -->
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  class="h-11 w-full rounded-xl border bg-white px-4 text-slate-900 outline-none transition
                         focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  :class="[
                    (touched.email && errors.email) ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                  ]"
                  placeholder="name@example.com"
                  @blur="markTouched('email')"
                />
                <p v-if="touched.email && errors.email" class="mt-1 text-sm text-red-600">
                  {{ errors.email }}
                </p>
              </div>

              <!-- Password -->
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700">密碼</label>
                <input
                  v-model="form.password"
                  type="password"
                  autocomplete="current-password"
                  class="h-11 w-full rounded-xl border bg-white px-4 text-slate-900 outline-none transition
                         focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  :class="[
                    (touched.password && errors.password) ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
                  ]"
                  placeholder="至少 8 碼"
                  @blur="markTouched('password')"
                />
                <p v-if="touched.password && errors.password" class="mt-1 text-sm text-red-600">
                  {{ errors.password }}
                </p>
              </div>

              <!-- remember + forgot -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    v-model="form.remember"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
                  />
                  記住我
                </label>

                <a href="#" class="text-sm font-medium text-emerald-700 hover:underline">
                  忘記密碼？
                </a>
              </div>

              <!-- submit -->
              <button
                type="button"
                class="h-11 w-full rounded-xl bg-[#6b6b5a] text-white font-semibold shadow
                       hover:bg[#5f5f50] active:bg-[#4f4f43] disabled:cursor-not-allowed disabled:opacity-60"
                @click="onSubmit"
              >
                登入
              </button>

              <!-- signup -->
              <p class="text-center text-sm text-slate-600">
                還沒有帳號？
                <a href="#" class="font-semibold text-emerald-700 hover:underline">註冊</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
