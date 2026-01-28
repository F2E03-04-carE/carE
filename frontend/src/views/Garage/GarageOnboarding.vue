<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import FormInput from '@/components/ui/FormInput.vue';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const createError = ref<string | null>(null);
const currentStep = ref(1);
const isSubmitting = ref(false);

const verificationResult = ref<'success' | 'failure' | null>(null);

const countdown = ref(3);
let countdownTimer: ReturnType<typeof setInterval> | null = null;


type FieldKey = 'garageName' | 'phone' | 'address' | 'ownerName' | 'taxId';

const formData = reactive({
  garageName: '',
  phone: '',
  address: '',
  ownerName: '',
  taxId: '',
});

const touched = reactive<Record<FieldKey, boolean>>({
  garageName: false,
  phone: false,
  address: false,
  ownerName: false,
  taxId: false,
});

const didSubmitAttempt = ref(false);

const errors = computed<Record<FieldKey, string>>(() => {
  const result: Record<FieldKey, string> = {
    garageName: '',
    phone: '',
    address: '',
    ownerName: '',
    taxId: '',
  };

  if (!formData.garageName.trim()) {
    result.garageName = '店名為必填欄位';
  }


  if (!formData.phone.trim()) {
    result.phone = '電話號碼為必填欄位';
  } else if (!/^(?=.*\d)[\d-]+$/.test(formData.phone.trim())) {
    result.phone = '電話號碼只能包含數字和連字號';
  }


  if (!formData.address.trim()) {
    result.address = '請輸入車廠地址';
  }


  if (!formData.ownerName.trim()) {
    result.ownerName = '請輸入負責人姓名';
  }


  if (!formData.taxId.trim()) {
    result.taxId = '請輸入公司統編';
  } else if (!/^\d+$/.test(formData.taxId.trim())) {
    result.taxId = '統一編號只能包含數字';
  } else if (formData.taxId.trim().length !== 8) {
    result.taxId = '統一編號須為8碼';
  }
  return result;
});

const showError = (key: FieldKey) => {
  return (touched[key] || didSubmitAttempt.value) && !!errors.value[key];
};

const handleBlur = (key: FieldKey) => {
  touched[key] = true;
};
const markAllTouched = () => {
  Object.keys(touched).forEach((key) => {
    touched[key as FieldKey] = true;
  });
};


const handleSubmit = () => {
  if (isSubmitting.value) {
    console.log('驗證進行中，請勿重複提交');
    return;
  }

  didSubmitAttempt.value = true;
  markAllTouched();

  const hasError = Object.values(errors.value).some((msg) => msg.length > 0);
  if (hasError) {
    console.log('表單有錯誤，無法送出');
    return;
  }

  console.log('前端驗證通過，開始統編驗證！', formData);

  isSubmitting.value = true;
  currentStep.value = 2;

  // 使用環境變數的後端 API URL
  const apiUrl = import.meta.env.VITE_API_URL || '';
  fetch(`${apiUrl}/api/verify-taxid?taxId=${formData.taxId}`)
  .then((res) => {
    if (!res.ok) throw new Error('API error');
    return res.json();
  })
  .then((data) => {
    const isValid = data.exists;

    if (isValid) {
      verificationResult.value = 'success';
      console.log('統編驗證成功！');
      startCountdown();
    } else {
      verificationResult.value = 'failure';
      console.log('統編驗證失敗！');
    }

    currentStep.value = 3;
  })
  .catch((error) => {
    console.error('驗證過程發生錯誤', error);
    verificationResult.value = 'failure';
    currentStep.value = 3;
  })
  .finally(() => {
    isSubmitting.value = false;
  });
}


const clearCountdownTimer = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

const backToForm = () => {
  clearCountdownTimer();
  isSubmitting.value = false;
  currentStep.value = 1;
  verificationResult.value = null;
  didSubmitAttempt.value = false;
};

// 建立新車廠到資料庫
async function createGarage(): Promise<boolean> {
  console.log('createGarage 函數開始執行');
  try {
    // 取得當前登入用戶
    console.log('取得當前登入用戶...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log('用戶資訊:', user ? `ID: ${user.id}` : '未取得');
    
    if (authError || !user) {
      console.error('未登入或取得用戶失敗:', authError);
      createError.value = '請先登入再註冊車廠';
      return false;
    }

    // 檢查用戶是否已有車廠
    console.log('檢查用戶是否已有車廠...');
    const { data: existingGarage, error: checkError } = await supabase
      .from('garages')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('檢查現有車廠時發生錯誤:', checkError);
      createError.value = '無法驗證您的車廠資訊，請稍後再試。';
      return false;
    }
    
    if (existingGarage) {
      console.log('用戶已有車廠，直接跳轉');
      // 切換為維修廠角色
      userStore.switchRole('garage');
      return true; // 已有車廠，視為成功
    }

    // 從地址中提取城市和區域
    const address = formData.address.trim();
    let city = '';
    let district = '';

    // 嘗試解析台灣地址格式（例如：台北市內湖區...）
    const cityMatch = address.match(/^(.{2,3}[市縣])/);
    if (cityMatch && cityMatch[1]) {
      city = cityMatch[1];
      const districtMatch = address.substring(city.length).match(/^(.{2,3}[區鄉鎮市])/);
      if (districtMatch && districtMatch[1]) {
        district = districtMatch[1];
      }
    }

    // 建立新車廠
    const { data: newGarage, error: insertError } = await supabase
      .from('garages')
      .insert({
        name: formData.garageName.trim(),
        phone: formData.phone.trim(),
        address: address,
        city: city || '未設定',
        district: district || '',
        garage_owner_name: formData.ownerName.trim(),
        tax_id: formData.taxId.trim(),
        owner_id: user.id,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('建立車廠失敗:', insertError);
      createError.value = '建立車廠失敗，請稍後再試';
      return false;
    }

    console.log('車廠建立成功，ID:', newGarage.id);
    // 切換為維修廠角色
    userStore.switchRole('garage');
    return true;
  } catch (e) {
    console.error('建立車廠時發生錯誤:', e);
    createError.value = '系統錯誤，請稍後再試';
    return false;
  }
}

// 啟動倒數計時
const startCountdown = async () => {
  clearCountdownTimer();
  console.log('開始建立車廠流程...');

  // 先建立車廠
  const success = await createGarage();
  console.log('建立車廠結果:', success);
  
  if (!success) {
    console.log('建立車廠失敗，顯示失敗畫面');
    verificationResult.value = 'failure';
    return;
  }

  console.log('建立車廠成功，開始倒數計時');
  countdown.value = 3;

  countdownTimer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearCountdownTimer();
      router.push('/garage/admin/settings');
    }
  }, 1000);
};
onUnmounted(() => {
  clearCountdownTimer();
});
</script>

<template>
  <main class="relative min-h-screen bg-[#f5f4f0]">
    <div class="w-full max-w-[800px] mx-auto px-4 sm:px-6 py-12">
      <div v-if="currentStep === 1" class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 class="text-[28px] sm:text-[32px] font-bold text-[#4a4a43] mb-2 text-center">
          商家基本資料
        </h1>
        <p class="text-[16px] text-[#8a8a7d] mb-6 text-center">
          請填寫您的維修廠基本資訊，我們將驗證公司統編
        </p>

        <form @submit.prevent="handleSubmit" class="flex flex-col space-y-4">
          <FormInput
            v-model="formData.garageName"
            label="店名"
            placeholder="例如：阿明汽車保養廠"
            required
            :error="showError('garageName') ? errors.garageName : ''"
            @blur="handleBlur('garageName')"
          />

          <FormInput
            v-model="formData.phone"
            label="電話號碼"
            type="tel"
            placeholder="0912345678 或 02-12345678"
            inputmode="numeric"
            pattern="[0-9\-]*"
            required
            :error="showError('phone') ? errors.phone : ''"
            @blur="handleBlur('phone')"
          />

          <FormInput
            v-model="formData.address"
            label="商家地址"
            placeholder="請輸入完整地址"
            required
            :error="showError('address') ? errors.address : ''"
            @blur="handleBlur('address')"
          />

          <FormInput
            v-model="formData.ownerName"
            label="負責人姓名"
            placeholder="請輸入負責人全名"
            required
            :error="showError('ownerName') ? errors.ownerName : ''"
            @blur="handleBlur('ownerName')"
          />

          <FormInput
            v-model="formData.taxId"
            label="公司統編"
            placeholder="請輸入8碼統一編號"
            inputmode="numeric"
            pattern="[0-9]*"
            :maxlength="8"
            required
            :error="showError('taxId') ? errors.taxId : ''"
            @blur="handleBlur('taxId')"
          />
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full px-6 py-3 mt-2 text-[18px] font-bold text-white transition-colors rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="
              isSubmitting
                ? 'bg-[#8a8a7d] cursor-not-allowed'
                : 'bg-[#6B6B5C] hover:bg-[#5a5a4a] focus:ring-[#6B6B5C]'
            "
          >
            {{ isSubmitting ? '驗證中...' : '送出驗證' }}
          </button>
          <p class="text-[10px] sm:text-[10px] mt-2">資料來源：<a href="https://data.gcis.nat.gov.tw/od/rule" class="hover:text-[#e9c667]">經濟部商工行政資料開放平臺 [統編查是否為公司、分公司及商業] API</a></p>
        </form>
      </div>

      <div
        v-if="currentStep === 2"
        class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
      >
        <div class="flex justify-center mb-6">
          <div
            class="w-16 h-16 border-4 border-[#6B6B5C] border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
        <h2 class="text-[24px] sm:text-[28px] font-bold text-[#4a4a43] mb-3">
          正在驗證統編...
        </h2>
        <p class="text-[16px] text-[#8a8a7d] mb-4">請稍候，我們正在查詢</p>
      </div>

      <div v-if="currentStep === 3" class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div v-if="verificationResult === 'success'" class="text-center">
          <div
            class="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-[#70c287]/20"
          >
            <span class="material-symbols-outlined text-[#70c287] text-[56px]">
              check_circle
            </span>
          </div>
          <h2 class="text-[28px] sm:text-[32px] font-bold text-[#4a4a43] mb-3">驗證成功！</h2>
          <p class="text-[16px] text-[#8a8a7d] mb-6">
            驗證通過，即將跳轉到商家編輯頁面
          </p>
          <div class="flex items-center justify-center gap-2 text-[16px] text-[#8a8a7d]">
            <span class="material-symbols-outlined text-[20px] animate-spin">
              autorenew
            </span>
            <span>倒數 <span class="font-bold text-[#6B6B5C]">{{ countdown }}</span> 秒</span>
          </div>
        </div>

        <div v-else class="text-center">
          <div
            class="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-[#c97d7d]/20"
          >
            <span class="material-symbols-outlined text-[#c97d7d] text-[56px]">
              cancel
            </span>
          </div>
          <h2 class="text-[28px] sm:text-[32px] font-bold text-[#4a4a43] mb-3">驗證失敗</h2>
          <p class="text-[16px] text-[#8a8a7d] mb-6">
            無法驗證公司統編，請確認資料是否正確
          </p>
          <button
            @click="backToForm"
            class="w-full px-6 py-3 text-[18px] font-bold text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#5a5a4a] shadow-md"
          >
            返回修改資料
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
