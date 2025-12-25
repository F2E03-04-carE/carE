<script setup lang="ts">
import { computed, reactive, ref } from "vue";

/* ---------- step control ---------- */
const step = ref(1);

/* ---------- form state ---------- */
const form = reactive({
  role: "owner", // owner | shop

  /* common */
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  /* owner */
  name: "",
  nickname: "",

  /* shop */
  shopName: "",
  taxId: "",
  city: "",
  district: "",
  address: "",

  agree: false,
});

/* ---------- touched / submitted flags ---------- */
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

/** ✅ TS：讓 key 索引合法化 */
type FieldKey = keyof typeof touched;

/* ---------- error state ---------- */
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

/* ---------- computed ---------- */
const isShop = computed(() => form.role === "shop");

/* ---------- helpers ---------- */
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isPhone(v: string): boolean {
  return /^(09\d{8}|\+8869\d{8})$/.test(v);
}
function showError(key: FieldKey): boolean {
  return Boolean(touched[key] && errors[key]);
}

/**
 * ✅ class 直接回傳完整 Tailwind（不透過 ui 物件）
 * ✅ 並依你們規範順序排列
 */
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

/* ---------- validation (per field) ---------- */
function validateEmail() {
  errors.email = "";
  if (!form.email) errors.email = "請輸入電子郵件";
  else if (!isEmail(form.email)) errors.email = "Email 格式錯誤";
}
function validatePhone() {
  errors.phone = "";
  if (!form.phone) errors.phone = "請輸入手機號碼";
  else if (!isPhone(form.phone))
    errors.phone = "手機格式錯誤（例：09xxxxxxxx / +8869xxxxxxxx）";
}
function validatePassword() {
  errors.password = "";
  if (!form.password) errors.password = "請輸入密碼";
  else if (form.password.length < 8) errors.password = "密碼至少 8 碼";
}
function validateConfirmPassword() {
  errors.confirmPassword = "";
  if (!form.confirmPassword) errors.confirmPassword = "請再次輸入密碼";
  else if (form.confirmPassword !== form.password) errors.confirmPassword = "密碼不一致";
}
function validateOwnerFields() {
  errors.name = "";
  errors.nickname = "";
  if (!form.name) errors.name = "請輸入姓名";
  if (!form.nickname) errors.nickname = "請輸入暱稱";
}
function validateShopFields() {
  errors.shopName = "";
  errors.taxId = "";
  errors.city = "";
  errors.district = "";
  errors.address = "";

  if (!form.shopName) errors.shopName = "請輸入保養廠名稱";

  if (!form.taxId) errors.taxId = "請輸入統一編號";
  else if (!/^\d{8}$/.test(form.taxId)) errors.taxId = "統編需 8 碼數字";

  if (!form.city) errors.city = "請輸入縣市";
  if (!form.district) errors.district = "請輸入區域";
  if (!form.address) errors.address = "請輸入地址";
}
function validateAgree() {
  errors.agree = "";
  if (!form.agree) errors.agree = "請勾選同意服務條款與隱私權政策";
}

/* ---------- step validators ---------- */
function validateStep1() {
  const keys: FieldKey[] = ["email"];
  markTouched(keys);
  clearErrors(keys);
  validateEmail();
  return !errors.email;
}

function validateStep2() {
  const commonKeys: FieldKey[] = ["phone", "password", "confirmPassword"];
  const ownerKeys: FieldKey[] = ["name", "nickname"];
  const shopKeys: FieldKey[] = ["shopName", "taxId", "city", "district", "address"];

  if (isShop.value) markTouched([...commonKeys, ...shopKeys]);
  else markTouched([...commonKeys, ...ownerKeys]);

  clearErrors([...commonKeys, ...ownerKeys, ...shopKeys]);

  validatePhone();
  validatePassword();
  validateConfirmPassword();

  if (isShop.value) validateShopFields();
  else validateOwnerFields();

  const keysToCheck: FieldKey[] = isShop.value
    ? [...commonKeys, ...shopKeys]
    : [...commonKeys, ...ownerKeys];

  return !keysToCheck.some((k) => Boolean(errors[k]));
}

/* ---------- actions ---------- */
function next() {
  // ✅ 只剩 2 步：1 -> 2
  if (step.value === 1 && validateStep1()) step.value = 2;
}
function back() {
  if (step.value > 1) step.value--;
}
function submit() {
  // ✅ Step3 已整合到 Step2：送出時一起驗證 Step2 + agree
  if (!validateStep2()) return;

  const keys: FieldKey[] = ["agree"];
  markTouched(keys);
  clearErrors(keys);
  validateAgree();
  if (errors.agree) return;

  alert("註冊完成（示範）");
}

/* ---------- input blur handlers ---------- */
function onBlur(key: FieldKey) {
  touched[key] = true;

  if (key === "email") validateEmail();
  if (key === "phone") validatePhone();
  if (key === "password") validatePassword();
  if (key === "confirmPassword") validateConfirmPassword();

  if (key === "name" || key === "nickname") validateOwnerFields();

  if (
    key === "shopName" ||
    key === "taxId" ||
    key === "city" ||
    key === "district" ||
    key === "address"
  ) {
    validateShopFields();
  }

  // 同意條款 blur 也要驗證（原本在 step3，現在在 step2）
  if (key === "agree") validateAgree();
}
</script>

<template>
  <!-- page -->
  <div class="min-h-screen px-4 py-10 bg-slate-50">
    <!-- wrap -->
    <div class="mx-auto w-full max-w-md">
      <h1 class="mb-2 text-xl font-semibold text-slate-900">註冊</h1>
      <p class="mb-4 text-xs text-slate-500">步驟 {{ step }} / 2</p>

      <!-- card -->
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

        <!-- STEP 2  -->
        <section v-if="step === 2" class="space-y-6">
          <h2 class="text-sm font-semibold text-slate-900">帳號資料</h2>

          <!-- role -->
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

          <!-- owner required -->
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

          <!-- common -->
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

          <!-- 密碼 -->
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

          <!-- 確認密碼 -->
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

          <!-- shop required -->
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

            <!-- grid2 (keep responsive) -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-slate-700">縣市</label>
                <input v-model="form.city" :class="inputClass('city')" @blur="onBlur('city')" />
                <p v-if="showError('city')" class="mt-1 text-xs text-red-600">{{ errors.city }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700">區域</label>
                <input
                  v-model="form.district"
                  :class="inputClass('district')"
                  @blur="onBlur('district')"
                />
                <p v-if="showError('district')" class="mt-1 text-xs text-red-600">
                  {{ errors.district }}
                </p>
              </div>
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
          <p v-if="touched.agree && errors.agree" class="mt-1 text-xs text-red-600">
            {{ errors.agree }}
          </p>

          <!-- actions -->
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
