<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';

// Stores & Router
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 未登入時導向首頁
if (!authStore.isAuthenticated) {
  router.push('/');
}

// Types
interface ProfileForm {
  name: string;
  nickname: string;
  phone: string;
  licensePlate: string;
}

// Computed
const user = computed(() => authStore.user);
const email = computed(() => user.value?.email || '');
const isFirstLogin = computed(() => route.query.firstLogin === 'true');

// State
const isLoading = ref(true);
const isEditing = ref(false);
const isSaving = ref(false);
const saveError = ref('');
const saveSuccess = ref(false);
const phoneError = ref('');

// 表單資料
const form = reactive<ProfileForm>({
  name: '',
  nickname: '',
  phone: '',
  licensePlate: '',
});

// 備份原始資料（用於取消編輯時還原）
const originalForm = reactive<ProfileForm>({
  name: '',
  nickname: '',
  phone: '',
  licensePlate: '',
});

// 從 user_metadata 載入備用資料
const loadFallbackData = () => {
  const metadata = user.value?.user_metadata;
  form.name = metadata?.name || email.value.split('@')[0];
  form.nickname = metadata?.nickname || '';
  form.phone = metadata?.phone || '';
  form.licensePlate = metadata?.licensePlate || '';
  Object.assign(originalForm, form);
};

// 從 profiles 資料表載入資料
const loadUserProfile = async () => {
  if (!user.value?.id) {
    isLoading.value = false;
    return;
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, nickname, phone, license_plate')
      .eq('user_id', user.value.id)
      .single();

    if (error) {
      console.error('載入用戶資料失敗:', error);
      loadFallbackData();
    } else if (profile) {
      form.name = profile.name || email.value.split('@')[0];
      form.nickname = profile.nickname || '';
      form.phone = profile.phone || '';
      form.licensePlate = profile.license_plate || '';
      Object.assign(originalForm, form);
    }
  } catch (error) {
    console.warn('載入用戶資料失敗:', error);
    loadFallbackData();
  } finally {
    isLoading.value = false;
  }
};

// 驗證手機號碼格式
const validatePhone = (phone: string): boolean => {
  return /^09\d{8}$/.test(phone.replace(/[-\s]/g, ''));
};

// 處理電話輸入
const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  form.phone = input.value.replace(/\D/g, '');
  validatePhoneFormat();
};

// 驗證電話格式並顯示錯誤
const validatePhoneFormat = () => {
  const phone = form.phone.replace(/[-\s]/g, '');

  if (!phone) {
    phoneError.value = '';
    return;
  }

  if (phone.length < 10) {
    phoneError.value = '手機號碼需為10位數字';
  } else if (phone.length === 10 && !validatePhone(phone)) {
    phoneError.value = '請輸入09開頭的手機號碼';
  } else if (phone.length > 10) {
    phoneError.value = '手機號碼不得超過10位數字';
  } else {
    phoneError.value = '';
  }
};

// 開始編輯
const startEditing = () => {
  isEditing.value = true;
  saveError.value = '';
  saveSuccess.value = false;
  phoneError.value = '';
};

// 取消編輯
const cancelEditing = () => {
  Object.assign(form, originalForm);
  isEditing.value = false;
  saveError.value = '';
  phoneError.value = '';
};

// 驗證表單
const validateForm = (): boolean => {
  saveError.value = '';
  phoneError.value = '';

  const name = form.name.trim();
  const nickname = form.nickname.trim();
  const phone = form.phone.replace(/[-\s]/g, '');

  if (!name) {
    saveError.value = '請輸入姓名';
    return false;
  }

  if (name.length > 10) {
    saveError.value = '姓名不得超過 10 個字';
    return false;
  }

  if (nickname && nickname.length > 8) {
    saveError.value = '暱稱不得超過 8 個字';
    return false;
  }

  if (!phone) {
    saveError.value = '請輸入電話號碼';
    return false;
  }

  if (!validatePhone(phone)) {
    saveError.value = '請輸入有效的手機號碼格式（例：0912345678）';
    return false;
  }

  return true;
};

// 儲存資料
const handleSave = async () => {
  if (!validateForm()) return;

  const userId = user.value?.id;
  if (!userId) {
    saveError.value = '未找到用戶 ID，請重新登入';
    return;
  }

  isSaving.value = true;
  saveSuccess.value = false;

  try {
    // 準備更新資料
    const updateData = {
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      phone: form.phone.replace(/[-\s]/g, ''),
      license_plate: form.licensePlate.trim(),
      updated_at: new Date().toISOString(),
    };

    // 更新 profiles 資料表
    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId);

    if (profileError) throw profileError;

    // 更新成功
    Object.assign(originalForm, form);
    saveSuccess.value = true;
    isEditing.value = false;

    // 首次登入時，移除 URL 參數
    if (isFirstLogin.value) {
      setTimeout(() => {
        router.replace('/member/profile');
      }, 1500);
    }

    // 3 秒後隱藏成功訊息
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '儲存失敗，請稍後再試';
    saveError.value = errorMessage;
    console.error('更新用戶資料失敗:', error);
  } finally {
    isSaving.value = false;
  }
};

// 導航到其他頁面
const navigateTo = (path: string) => {
  router.push(path);
};

// 初始化
onMounted(async () => {
  await loadUserProfile();

  // 首次登入且未設定電話時，自動進入編輯模式
  if (isFirstLogin.value && !form.phone) {
    startEditing();
  }
});
</script>

<template>
  <div class="min-h-screen bg-[#EBE8E3]">
    <!-- Header -->
    <header class="border-b border-[#e0dbd3] bg-[#f9f7f4]">
      <div class="mx-auto max-w-5xl px-6 py-5">
        <h1 class="tracking-wide text-[#4a4540]">會員中心</h1>
        <p v-if="isFirstLogin" class="mt-2 text-sm text-[#6B6B5C]">
          歡迎加入！請完善您的個人資訊以繼續使用
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-5xl px-6 py-8 md:py-10">
      <div class="space-y-8">
        <!-- Success Message -->
        <div
          v-if="saveSuccess"
          class="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
        >
          <span class="material-symbols-outlined text-green-500">check_circle</span>
          <p class="text-sm font-medium text-green-700">
            {{ isFirstLogin ? '資料已儲存！歡迎使用 carE' : '資料已成功更新' }}
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="saveError"
          class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <span class="material-symbols-outlined text-red-500">error</span>
          <p class="text-sm font-medium text-red-700">{{ saveError }}</p>
        </div>

        <!-- Profile Section -->
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-[#4a4540]">個人資料</h2>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center gap-2 text-[#6B6B5C]">
              <span class="material-symbols-outlined animate-spin text-[18px] leading-none">
                progress_activity
              </span>
              <span class="text-sm">載入中...</span>
            </div>

            <!-- Action Buttons -->
            <div v-else class="flex items-center gap-2">
              <template v-if="isEditing">
                <button
                  type="button"
                  @click="cancelEditing"
                  :disabled="isSaving"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e0dbd3] bg-white px-4 py-2 text-[#6b6460] transition-colors duration-200 hover:bg-[#f5f4f0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  @click="handleSave"
                  :disabled="isSaving"
                  class="flex cursor-pointer items-center gap-2 rounded-lg bg-[#6B6B5C] px-4 py-2 text-[#f9f7f4] transition-colors duration-200 hover:bg-[#5a5a4d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span
                    v-if="isSaving"
                    class="material-symbols-outlined animate-spin text-[18px] leading-none"
                  >
                    progress_activity
                  </span>
                  <span v-else class="material-symbols-outlined text-[18px] leading-none">
                    save
                  </span>
                  {{ isSaving ? '儲存中...' : '儲存' }}
                </button>
              </template>
              <button
                v-else
                type="button"
                @click="startEditing"
                class="flex cursor-pointer items-center gap-2 rounded-lg bg-[#e8e4dc] px-4 py-2 text-[#6b6460] transition-colors duration-200 hover:bg-[#d9d3c9]"
              >
                <span class="material-symbols-outlined text-[18px] leading-none">edit</span>
                編輯
              </button>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="rounded-2xl border border-[#e8e4dc] bg-white p-6 shadow-sm">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <!-- Nickname -->
              <div class="space-y-2">
                <label for="nickname" class="block text-sm text-[#6b6460]">會員暱稱</label>
                <input
                  v-if="isEditing"
                  id="nickname"
                  v-model="form.nickname"
                  type="text"
                  maxlength="8"
                  class="w-full rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#6B6B5C]/30"
                  placeholder="請輸入暱稱"
                />
                <p
                  v-else
                  class="rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540]"
                >
                  {{ form.nickname || '未設定' }}
                </p>
              </div>

              <!-- Name -->
              <div class="space-y-2">
                <label for="name" class="block text-sm text-[#6b6460]">
                  姓名
                  <span v-if="isEditing" class="text-red-500">*</span>
                </label>
                <input
                  v-if="isEditing"
                  id="name"
                  v-model="form.name"
                  type="text"
                  maxlength="10"
                  class="w-full rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#6B6B5C]/30"
                  placeholder="請輸入姓名"
                />
                <p
                  v-else
                  class="rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540]"
                >
                  {{ form.name || '未設定' }}
                </p>
              </div>

              <!-- Email (Read-only) -->
              <div class="space-y-2">
                <label class="block text-sm text-[#6b6460]">
                  電子郵件
                  <span v-if="isEditing" class="text-xs text-[#6B6B5C]">（不可變更）</span>
                </label>
                <p
                  class="rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540]"
                >
                  {{ email }}
                </p>
              </div>

              <!-- Phone -->
              <div class="space-y-2">
                <label for="phone" class="block text-sm text-[#6b6460]">
                  電話
                  <span v-if="isEditing" class="text-red-500">*</span>
                </label>
                <div v-if="isEditing">
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    maxlength="10"
                    inputmode="numeric"
                    @input="handlePhoneInput"
                    :class="[
                      'w-full rounded-lg border bg-[#f9f7f4] px-4 py-3 text-[#4a4540] transition-colors focus:outline-none focus:ring-2',
                      phoneError
                        ? 'border-red-500 focus:ring-red-500/30'
                        : 'border-[#e0dbd3] focus:ring-[#6B6B5C]/30',
                    ]"
                    placeholder="請輸入手機號碼（例：0912345678）"
                  />
                  <p v-if="phoneError" class="mt-1 text-xs text-red-600">
                    {{ phoneError }}
                  </p>
                </div>
                <p
                  v-else
                  class="rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540]"
                >
                  {{ form.phone || '未設定' }}
                </p>
              </div>

              <!-- License Plate -->
              <div class="space-y-2">
                <label for="licensePlate" class="block text-sm text-[#6b6460]">車牌登記</label>
                <input
                  v-if="isEditing"
                  id="licensePlate"
                  v-model="form.licensePlate"
                  type="text"
                  class="w-full rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#6B6B5C]/30"
                  placeholder="請輸入車牌號碼（例：ABC-1234）"
                />
                <p
                  v-else
                  class="rounded-lg border border-[#e0dbd3] bg-[#f9f7f4] px-4 py-3 text-[#4a4540]"
                >
                  {{ form.licensePlate || '未設定' }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Navigation -->
        <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            type="button"
            @click="navigateTo('/member/bookings')"
            class="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-[#e8e4dc] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-xl bg-[#f9f7f4] p-3">
                <span class="material-symbols-outlined text-[24px] leading-none text-[#6B6B5C]">
                  event_note
                </span>
              </div>
              <div class="text-left">
                <h3 class="mb-1 font-semibold text-[#4a4540]">預約記錄</h3>
                <p class="text-sm text-[#6b6460]">查看所有預約與狀態</p>
              </div>
            </div>
            <span
              class="material-symbols-outlined text-[20px] leading-none text-[#6B6B5C] transition-transform duration-200 group-hover:translate-x-1"
            >
              chevron_right
            </span>
          </button>

          <button
            type="button"
            @click="navigateTo('/member/history')"
            class="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-[#e8e4dc] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-xl bg-[#f9f7f4] p-3">
                <span class="material-symbols-outlined text-[24px] leading-none text-[#6B6B5C]">
                  history
                </span>
              </div>
              <div class="text-left">
                <h3 class="mb-1 font-semibold text-[#4a4540]">維修歷史</h3>
                <p class="text-sm text-[#6b6460]">查看所有送修紀錄與維修進度</p>
              </div>
            </div>
            <span
              class="material-symbols-outlined text-[20px] leading-none text-[#6B6B5C] transition-transform duration-200 group-hover:translate-x-1"
            >
              chevron_right
            </span>
          </button>
        </section>
      </div>
    </main>
  </div>
</template>
