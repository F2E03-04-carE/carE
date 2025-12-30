<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

// 步驟控制
const step = ref(1);

// 表單資料
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

/*  touched / submitted flags  */
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

/**  TS：讓 key 索引合法化 */
type FieldKey = keyof typeof touched;

/*  error state  */
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

/*  computed  */
const isShop = computed(() => form.role === "shop");

// 切換身分時避免觸發 blur 驗證
const isSwitchingRole = ref(false);

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
 *  class 直接回傳完整 Tailwind（不透過 ui 物件）
 *  並依你們規範順序排列
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

//切換身分時清掉另一邊身分的 touched / errors，避免切回來立刻紅框
function resetFields(keys: FieldKey[]): void {
  keys.forEach((k) => {
    touched[k] = false;
    errors[k] = "";
  });
}

watch(
  () => form.role,
  (role) => {
    const ownerKeys: FieldKey[] = ["name", "nickname"];
    const shopKeys: FieldKey[] = ["shopName", "taxId", "city", "district", "address"];

    if (role === "shop") resetFields(ownerKeys);
    else resetFields(shopKeys);
  }
);



/* -------------------------------
 *  縣市 / 區域（下拉選單）— 全台版
 * ------------------------------- */
const cityOptions = [
  "台北市","新北市","桃園市","台中市","台南市","高雄市","基隆市","新竹市","嘉義市","宜蘭縣",
  "新竹縣","苗栗縣","彰化縣","南投縣","雲林縣","嘉義縣","屏東縣","台東縣","花蓮縣","澎湖縣",
  "金門縣","連江縣",
] as const;

type City = (typeof cityOptions)[number];

const districtMap: Record<City, string[]> = {
  台北市: ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
  新北市: ["萬里區", "金山區", "板橋區", "汐止區", "深坑區", "石碇區", "瑞芳區", "平溪區", "雙溪區", "貢寮區", "新店區", "坪林區", "烏來區", "永和區", "中和區", "土城區", "三峽區", "樹林區", "鶯歌區", "三重區", "新莊區", "泰山區", "林口區", "蘆洲區", "五股區", "八里區", "淡水區", "三芝區", "石門區"],
  桃園市: ["中壢區", "平鎮區", "龍潭區", "楊梅區", "新屋區", "觀音區", "桃園區", "龜山區", "八德區", "大溪區", "復興區", "大園區", "蘆竹區"],
  台中市: ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "太平區", "大里區", "霧峰區", "烏日區", "豐原區", "后里區", "石岡區", "東勢區", "和平區", "新社區", "潭子區", "大雅區", "神岡區", "大肚區", "沙鹿區", "龍井區", "梧棲區", "清水區", "大甲區", "外埔區", "大安區"],
  台南市: ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "歸仁區", "新化區", "左鎮區", "玉井區", "楠西區", "南化區", "仁德區", "關廟區", "龍崎區", "官田區", "麻豆區", "佳里區", "西港區", "七股區", "將軍區", "學甲區", "北門區", "新營區", "後壁區", "白河區", "東山區", "六甲區", "下營區", "柳營區", "鹽水區", "善化區", "大內區", "山上區", "新市區", "安定區"],
  高雄市: ["新興區", "前金區", "苓雅區", "鹽埕區", "鼓山區", "旗津區", "前鎮區", "三民區", "楠梓區", "小港區", "左營區", "仁武區", "大社區", "岡山區", "路竹區", "阿蓮區", "田寮區", "燕巢區", "橋頭區", "梓官區", "彌陀區", "永安區", "湖內區", "鳳山區", "大寮區", "林園區", "鳥松區", "大樹區", "旗山區", "美濃區", "六龜區", "內門區", "杉林區", "甲仙區", "桃源區", "那瑪夏區", "茂林區", "茄萣區"],
  基隆市: ["仁愛區", "信義區", "中正區", "中山區", "安樂區", "暖暖區", "七堵區"],
  新竹市: ["東區", "北區", "香山區"],
  嘉義市: ["東區", "西區"],
  宜蘭縣: ["宜蘭市", "頭城鎮", "礁溪鄉", "壯圍鄉", "員山鄉", "羅東鎮", "三星鄉", "大同鄉", "五結鄉", "冬山鄉", "蘇澳鎮", "南澳鄉"],
  新竹縣: ["竹北市", "湖口鄉", "新豐鄉", "新埔鎮", "關西鎮", "芎林鄉", "寶山鄉", "竹東鎮", "五峰鄉", "橫山鄉", "尖石鄉", "北埔鄉", "峨眉鄉"],
  苗栗縣: ["竹南鎮", "頭份市", "三灣鄉", "南庄鄉", "獅潭鄉", "後龍鎮", "通霄鎮", "苑裡鎮", "苗栗市", "造橋鄉", "頭屋鄉", "公館鄉", "大湖鄉", "泰安鄉", "銅鑼鄉", "三義鄉", "西湖鄉", "卓蘭鎮"],
  彰化縣: ["彰化市", "芬園鄉", "花壇鄉", "秀水鄉", "鹿港鎮", "福興鄉", "線西鄉", "和美鎮", "伸港鄉", "員林市", "社頭鄉", "永靖鄉", "埔心鄉", "溪湖鎮", "大村鄉", "埔鹽鄉", "田中鎮", "北斗鎮", "田尾鄉", "埤頭鄉", "溪州鄉", "竹塘鄉", "二林鎮", "大城鄉", "芳苑鄉", "二水鄉"],
  南投縣: ["南投市", "中寮鄉", "草屯鎮", "國姓鄉", "埔里鎮", "仁愛鄉", "名間鄉", "集集鎮", "水里鄉", "魚池鄉", "信義鄉", "竹山鎮", "鹿谷鄉"],
  雲林縣: ["斗南鎮", "大埤鄉", "虎尾鎮", "土庫鎮", "褒忠鄉", "東勢鄉", "台西鄉", "崙背鄉", "麥寮鄉", "斗六市", "林內鄉", "古坑鄉", "莿桐鄉", "西螺鎮", "二崙鄉", "北港鎮", "水林鄉", "口湖鄉", "四湖鄉", "元長鄉"],
  嘉義縣: ["番路鄉", "梅山鄉", "竹崎鄉", "阿里山鄉", "中埔鄉", "大埔鄉", "水上鄉", "鹿草鄉", "太保市", "朴子市", "東石鄉", "六腳鄉", "新港鄉", "民雄鄉", "大林鎮", "溪口鄉", "義竹鄉", "布袋鎮"],
  屏東縣: ["屏東市", "三地門鄉", "霧台鄉", "瑪家鄉", "九如鄉", "里港鄉", "高樹鄉", "鹽埔鄉", "長治鄉", "麟洛鄉", "竹田鄉", "內埔鄉", "萬丹鄉", "潮州鎮", "泰武鄉", "來義鄉", "萬巒鄉", "崁頂鄉", "新埤鄉", "南州鄉", "林邊鄉", "東港鎮", "琉球鄉", "佳冬鄉", "新園鄉", "枋寮鄉", "枋山鄉", "春日鄉", "獅子鄉", "車城鄉", "牡丹鄉", "恆春鎮", "滿州鄉"],
  台東縣: ["台東市", "綠島鄉", "蘭嶼鄉", "延平鄉", "卑南鄉", "鹿野鄉", "關山鎮", "海端鄉", "池上鄉", "東河鄉", "成功鎮", "長濱鄉", "太麻里鄉", "金峰鄉", "大武鄉", "達仁鄉"],
  花蓮縣: ["花蓮市", "新城鄉", "秀林鄉", "吉安鄉", "壽豐鄉", "鳳林鎮", "光復鄉", "豐濱鄉", "瑞穗鄉", "萬榮鄉", "玉里鎮", "卓溪鄉", "富里鄉"],
  澎湖縣: ["馬公市", "西嶼鄉", "望安鄉", "七美鄉", "白沙鄉", "湖西鄉"],
  金門縣: ["金沙鎮", "金湖鎮", "金寧鄉", "金城鎮", "烈嶼鄉", "烏坵鄉"],
  連江縣: ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"],
};

const districtOptions = computed<string[]>(() => {
  const c = form.city as City | "";
  return c ? districtMap[c] ?? [] : [];
});

// 換縣市時，清空區域避免殘留
watch(
  () => form.city,
  () => {
    form.district = "";
    if (touched.city || touched.district) {
      touched.city = true;
      validateShopFields();
    }
  }
);


//欄位個別驗證
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

  if (!form.city) errors.city = "請選擇縣市";
  if (!form.district) errors.district = "請選擇區域";
  if (!form.address) errors.address = "請輸入地址";
}
function validateAgree() {
  errors.agree = "";
  if (!form.agree) errors.agree = "請勾選同意服務條款與隱私權政策";
}

//步驟驗證器（每一個步驟的檢查）
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

//動作處理
function next() {
  //  只剩 2 步：1 -> 2
  if (step.value === 1 && validateStep1()) step.value = 2;
}
function back() {
  if (step.value > 1) step.value--;
}
function submit() {
  //  Step3 已整合到 Step2：送出時一起驗證 Step2 + agree
  if (!validateStep2()) return;

  const keys: FieldKey[] = ["agree"];
  markTouched(keys);
  clearErrors(keys);
  validateAgree();
  if (errors.agree) return;

  alert("註冊完成（示範）");
}

//輸入欄位事件處理
function onBlur(key: FieldKey) {
  if (isSwitchingRole.value) return;

  touched[key] = true;

  if (key === "email") validateEmail();
  if (key === "phone") validatePhone();
  if (key === "password") validatePassword();
  if (key === "confirmPassword") validateConfirmPassword();

  if (key === "name" || key === "nickname") validateOwnerFields();

  if (key === "shopName" || key === "taxId" || key === "city" || key === "district" || key === "address") {
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
              <input
                type="radio"
                value="owner"
                v-model="form.role"
                @mousedown="isSwitchingRole = true"
                @change="isSwitchingRole = false"
              />
              車主（一般消費）
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="radio"
                value="shop"
                v-model="form.role"
                @mousedown="isSwitchingRole = true"
                @change="isSwitchingRole = false"
              />
              保養廠（店家）
            </label>
          </div>

          <!-- (必填）負責人欄位 -->
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

          <!-- （必填）店家資料 -->
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

            <!-- 網格排列（保持響應式） -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-slate-700">縣市</label>

                <select
                  v-model="form.city"
                  :class="inputClass('city')"
                  @change="
                    touched.city = true;
                    validateShopFields();
                  "
                  @blur="onBlur('city')"
                >
                  <option value="" disabled>選擇縣市</option>
                  <option v-for="c in cityOptions" :key="c" :value="c">{{ c }}</option>
                </select>

                <p v-if="showError('city')" class="mt-1 text-xs text-red-600">{{ errors.city }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700">區域</label>

                <select
                  v-model="form.district"
                  :class="inputClass('district')"
                  :disabled="!form.city"
                  @change="
                    touched.district = true;
                    validateShopFields();
                  "
                  @blur="onBlur('district')"
                >
                  <option value="" disabled>選擇區域</option>
                  <option v-for="d in districtOptions" :key="d" :value="d">{{ d }}</option>
                </select>

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
