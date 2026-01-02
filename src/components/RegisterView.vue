<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

//   Vue3 全台縣市/鄉鎮市區套件（全台資料內建）
import { VueTwZipCodeSelector } from "@andy922200/vue-tw-zip-code-selector";

// 步驟
const step = ref<1 | 2>(1);

// 表單狀態資料
const form = reactive({
  role: "owner" as "owner" | "shop",

  // 通用欄位（不分角色都會使用）
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  // 車主
  name: "",
  nickname: "",

  // 保養廠
  shopName: "",
  taxId: "",

  //  地址（由套件回填，全台）
  city: "",
  district: "",
  zipCode: "",

  address: "",

  // 使用者同意條款狀態
  agree: false,
});

// 記錄各欄位是否被操作過及其驗證錯誤
const touched = reactive({
  email: false,
  phone: false,
  password: false,
  confirmPassword: false,

  name: false,
  nickname: false,

  shopName: false,
  taxId: false,
  city: false,
  district: false,
  address: false,

  agree: false,
});

type FieldKey = keyof typeof touched;

const errors = reactive<Record<FieldKey, string>>({
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  name: "",
  nickname: "",

  shopName: "",
  taxId: "",
  city: "",
  district: "",
  address: "",

  agree: "",
});

// 欄位群組定義（依使用者角色分類）
const ownerKeys: FieldKey[] = ["name", "nickname"];
const shopKeys: FieldKey[] = ["shopName", "taxId", "city", "district", "address"];
const agreeKeys: FieldKey[] = ["agree"];

const isShop = computed(() => form.role === "shop");

// 基本驗證
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isPhone(v: string): boolean {
  return /^(09\d{8}|\+8869\d{8})$/.test(v);
}

function showError(key: FieldKey): boolean {
  return Boolean(touched[key] && errors[key]);
}

function inputClass(key: FieldKey): string {
  const base =
    "w-full rounded-xl border px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4";
  const ok = "border-slate-200 bg-slate-50 focus:bg-white focus:ring-slate-900/5";
  const err = "border-red-500 bg-red-50 focus:ring-red-500/20";
  return [base, showError(key) ? err : ok].join(" ");
}

function markTouched(keys: FieldKey[]): void {
  keys.forEach((k) => (touched[k] = true));
}
function clearErrors(keys: FieldKey[]): void {
  keys.forEach((k) => (errors[k] = ""));
}
function resetTouchedAndErrors(keys: FieldKey[]): void {
  keys.forEach((k) => {
    touched[k] = false;
    errors[k] = "";
  });
}

// 欄位驗證的唯一來源
type Validator = () => void;

const validators: Record<FieldKey, Validator> = {
  email: () => {
    errors.email = "";
    if (!form.email) errors.email = "請輸入電子郵件";
    else if (!isEmail(form.email)) errors.email = "Email 格式錯誤";
  },
  phone: () => {
    errors.phone = "";
    if (!form.phone) errors.phone = "請輸入手機號碼";
    else if (!isPhone(form.phone))
      errors.phone = "手機格式錯誤（例：09xxxxxxxx / +8869xxxxxxxx）";
  },
  password: () => {
    errors.password = "";
    if (!form.password) errors.password = "請輸入密碼";
    else if (form.password.length < 8) errors.password = "密碼至少 8 碼";
  },
  confirmPassword: () => {
    errors.confirmPassword = "";
    if (!form.confirmPassword) errors.confirmPassword = "請再次輸入密碼";
    else if (form.confirmPassword !== form.password) errors.confirmPassword = "密碼不一致";
  },

  name: () => {
    errors.name = "";
    if (!form.name) errors.name = "請輸入姓名";
  },
  nickname: () => {
    errors.nickname = "";
    if (!form.nickname) errors.nickname = "請輸入暱稱";
  },

  shopName: () => {
    errors.shopName = "";
    if (!form.shopName) errors.shopName = "請輸入保養廠名稱";
  },
  taxId: () => {
    errors.taxId = "";
    if (!form.taxId) errors.taxId = "請輸入統一編號";
    else if (!/^\d{8}$/.test(form.taxId)) errors.taxId = "統編需 8 碼數字";
  },
  city: () => {
    errors.city = "";
    if (!form.city) errors.city = "請選擇縣市";
  },
  district: () => {
    errors.district = "";
    if (!form.district) errors.district = "請選擇區域";
  },
  address: () => {
    errors.address = "";
    if (!form.address) errors.address = "請輸入地址";
  },

  agree: () => {
    errors.agree = "";
    if (!form.agree) errors.agree = "請勾選同意服務條款與隱私權政策";
  },
};

function validateKeys(keys: FieldKey[]): boolean {
  clearErrors(keys);
  keys.forEach((k) => validators[k]());
  return !keys.some((k) => Boolean(errors[k]));
}

// 角色切換邏輯
watch(
  () => form.role,
  (role) => {
    if (role === "shop") resetTouchedAndErrors(ownerKeys);
    else resetTouchedAndErrors(shopKeys);
  }
);

// 套件選擇地址後回填（全台縣市/鄉鎮市區）
function onSelectedZone(zone: {
  name?: string;
  zipCode?: number | string;
  county?: string;
  countyName?: string;
}) {
  form.city = zone.countyName || zone.county || "";
  form.district = zone.name || "";
  form.zipCode = zone.zipCode != null ? String(zone.zipCode) : "";

  // 已 touched 才即時驗證（維持你原本 UX）
  if (touched.city || touched.district) {
    touched.city = true;
    touched.district = true;
    validateKeys(["city", "district"]);
  }
}

// 使用者行為
function next() {
  if (step.value !== 1) return;

  markTouched(["email"]);
  const ok = validateKeys(["email"]);
  if (ok) step.value = 2;
}

function back() {
  if (step.value === 2) step.value = 1;
}

function submit() {
  if (step.value !== 2) return;

  const step2Keys: FieldKey[] = isShop.value
    ? ["phone", "password", "confirmPassword", ...shopKeys]
    : ["phone", "password", "confirmPassword", ...ownerKeys];

  markTouched([...step2Keys, ...agreeKeys]);

  const okStep2 = validateKeys(step2Keys);
  const okAgree = validateKeys(agreeKeys);

  if (!okStep2 || !okAgree) return;

  alert("註冊完成（示範）");
}

// 欄位事件（失焦處理）
function onBlur(key: FieldKey) {
  touched[key] = true;

  if (key === "city" || key === "district") {
    validateKeys(["city", "district"]);
    return;
  }

  validateKeys([key]);

  if (key === "password" && (touched.confirmPassword || form.confirmPassword)) {
    touched.confirmPassword = true;
    validateKeys(["confirmPassword"]);
  }
}
</script>

<template>
  <div class="min-h-screen px-4 py-10 bg-slate-50">
    <div class="mx-auto w-full max-w-md">
      <h1 class="mb-2 text-xl font-semibold text-slate-900">註冊</h1>
      <p class="mb-4 text-xs text-slate-500">步驟 {{ step }} / 2</p>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <!-- STEP 1 -->
        <section v-if="step === 1" class="space-y-4">
          <h2 class="text-sm font-semibold text-slate-900">註冊第一步</h2>

          <div>
            <label class="block text-sm font-medium text-slate-700">Email</label>
            <input
              v-model="form.email"
              :class="inputClass('email')"
              @blur="onBlur('email')"
              placeholder="name@example.com"
            />
            <p v-if="showError('email')" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <button
            class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white bg-[#6B705C] hover:bg-[#5F6653] active:bg-[#4F5646] disabled:opacity-50"
            @click="next"
          >
            下一步
          </button>
        </section>

        <!-- STEP 2 -->
        <section v-else class="space-y-6">
          <h2 class="text-sm font-semibold text-slate-900">帳號資料</h2>

          <!-- 身分 -->
          <div class="flex gap-3">
            <label class="flex items-center gap-2 text-sm text-slate-800">
              <input type="radio" value="owner" v-model="form.role" />
              車主（一般消費）
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-800">
              <input type="radio" value="shop" v-model="form.role" />
              保養廠（店家）
            </label>
          </div>

          <!-- 車主 -->
          <div v-if="!isShop" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">姓名</label>
              <input v-model="form.name" :class="inputClass('name')" @blur="onBlur('name')" />
              <p v-if="showError('name')" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">暱稱</label>
              <input
                v-model="form.nickname"
                :class="inputClass('nickname')"
                @blur="onBlur('nickname')"
              />
              <p v-if="showError('nickname')" class="mt-1 text-xs text-red-600">
                {{ errors.nickname }}
              </p>
            </div>
          </div>

          <!-- 通用資料欄位 -->
          <div>
            <label class="block text-sm font-medium text-slate-700">手機號碼</label>
            <input
              v-model="form.phone"
              :class="inputClass('phone')"
              @blur="onBlur('phone')"
              placeholder="例如：09xxxxxxxx 或 +8869xxxxxxxx"
            />
            <p v-if="showError('phone')" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">密碼</label>
            <input
              type="password"
              v-model="form.password"
              :class="inputClass('password')"
              @blur="onBlur('password')"
              placeholder="至少 8 碼"
            />
            <p v-if="showError('password')" class="mt-1 text-xs text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">確認密碼</label>
            <input
              type="password"
              v-model="form.confirmPassword"
              :class="inputClass('confirmPassword')"
              @blur="onBlur('confirmPassword')"
              placeholder="再輸入一次"
            />
            <p v-if="showError('confirmPassword')" class="mt-1 text-xs text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- 保養廠 -->
          <div v-if="isShop" class="space-y-4">
            <hr class="my-6 border-t border-slate-100" />

            <div>
              <label class="block text-sm font-medium text-slate-700">保養廠名稱</label>
              <input
                v-model="form.shopName"
                :class="inputClass('shopName')"
                @blur="onBlur('shopName')"
                placeholder="例如：XX 汽車保修中心"
              />
              <p v-if="showError('shopName')" class="mt-1 text-xs text-red-600">
                {{ errors.shopName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">統一編號</label>
              <input
                v-model="form.taxId"
                :class="inputClass('taxId')"
                @blur="onBlur('taxId')"
                placeholder="8 碼數字"
              />
              <p v-if="showError('taxId')" class="mt-1 text-xs text-red-600">{{ errors.taxId }}</p>
            </div>

            <!--  全台縣市 / 鄉鎮市區（Vue3 套件） -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">縣市 / 區域</label>

              <VueTwZipCodeSelector @getSelectedZone="onSelectedZone" />


            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">地址</label>
              <input
                v-model="form.address"
                :class="inputClass('address')"
                @blur="onBlur('address')"
                placeholder="路名/巷弄/號/樓"
              />
              <p v-if="showError('address')" class="mt-1 text-xs text-red-600">
                {{ errors.address }}
              </p>
            </div>
          </div>

          <!-- agree -->
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" v-model="form.agree" @blur="onBlur('agree')" />
            我已閱讀並同意服務條款與隱私權政策
          </label>
          <p v-if="showError('agree')" class="mt-1 text-xs text-red-600">{{ errors.agree }}</p>

          <!-- 送出行為選擇 -->
          <div class="grid grid-cols-2 gap-3">
            <button
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800"
              @click="back"
            >
              上一步
            </button>
            <button
              class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white bg-[#6B705C] hover:bg-[#5F6653] active:bg-[#4F5646] disabled:opacity-50"
              @click="submit"
            >
              建立帳號
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
