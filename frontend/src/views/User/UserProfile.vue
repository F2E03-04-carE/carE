<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 如果未登入，重定向到首頁
if (!authStore.isAuthenticated) {
  router.push('/');
}

const user = computed(() => authStore.user);
const email = computed(() => user.value?.email || '');
const phone = computed(() => user.value?.user_metadata?.phone || '');
const name = computed(() => user.value?.user_metadata?.name || email.value.split('@')[0]);

const isEditing = ref(false);
const isSaving = ref(false);
const saveError = ref('');
const saveSuccess = ref(false);
const editForm = ref({
  name: name.value,
  phone: phone.value,
});

// 檢查是否是首次登入
const isFirstLogin = computed(() => route.query.firstLogin === 'true');

// 如果是首次登入且資料不完整，自動進入編輯模式
onMounted(() => {
  if (isFirstLogin.value && !phone.value) {
    isEditing.value = true;
  }
});

const handleEdit = () => {
  isEditing.value = true;
  saveError.value = '';
  saveSuccess.value = false;
  editForm.value = {
    name: name.value,
    phone: phone.value,
  };
};

const handleCancel = () => {
  // 如果是首次登入且資料不完整，不允許取消
  if (isFirstLogin.value && !phone.value) {
    return;
  }
  isEditing.value = false;
  saveError.value = '';
  saveSuccess.value = false;
};

const handleSave = async () => {
  saveError.value = '';
  saveSuccess.value = false;

  // 驗證手機號碼
  if (!editForm.value.phone || editForm.value.phone.trim() === '') {
    saveError.value = '請輸入手機號碼';
    return;
  }

  // 驗證姓名
  if (!editForm.value.name || editForm.value.name.trim() === '') {
    saveError.value = '請輸入姓名';
    return;
  }

  isSaving.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        name: editForm.value.name.trim(),
        phone: editForm.value.phone.trim(),
      },
    });

    if (error) throw error;

    saveSuccess.value = true;
    isEditing.value = false;

    // 如果是首次登入，3秒後導向首頁
    if (isFirstLogin.value) {
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  } catch (error: any) {
    saveError.value = error.message || '儲存失敗，請稍後再試';
    console.error('更新用戶資料失敗:', error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] pt-[80px] px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- 頁面標題 -->
        <div class="mb-8 pb-6 border-b border-gray-200">
          <h1 class="text-3xl font-bold text-[#4a4a43]">會員基本資料</h1>
          <p class="mt-2 text-gray-600">
            {{ isFirstLogin ? '請完善您的個人資訊以繼續使用' : '管理您的個人資訊' }}
          </p>
        </div>

        <!-- 成功訊息 -->
        <div v-if="saveSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <i class="fa-solid fa-check-circle text-green-500"></i>
          <p class="text-sm text-green-700 font-medium">
            {{ isFirstLogin ? '資料已儲存，即將為您跳轉...' : '資料已成功更新' }}
          </p>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="saveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <i class="fa-solid fa-exclamation-circle text-red-500"></i>
          <p class="text-sm text-red-700 font-medium">{{ saveError }}</p>
        </div>

        <!-- 用戶資訊卡片 -->
        <div class="space-y-6">
          <!-- 電子信箱 (不可編輯) -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">電子信箱</label>
            <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-gray-900">{{ email }}</span>
                <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">不可變更</span>
              </div>
            </div>
          </div>

          <!-- 姓名 -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">姓名</label>
            <input
              v-if="isEditing"
              v-model="editForm.name"
              type="text"
              class="px-4 py-3 rounded-lg border border-gray-300 focus:border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a]/30 outline-none transition-colors"
              placeholder="請輸入姓名"
            />
            <div v-else class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span class="text-gray-900">{{ name }}</span>
            </div>
          </div>

          <!-- 電話號碼 -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">
              電話號碼
              <span v-if="isEditing && !phone" class="text-red-500">*</span>
            </label>
            <input
              v-if="isEditing"
              v-model="editForm.phone"
              type="tel"
              class="px-4 py-3 rounded-lg border border-gray-300 focus:border-[#6b6b5a] focus:ring-2 focus:ring-[#6b6b5a]/30 outline-none transition-colors"
              placeholder="請輸入電話號碼（例：0912345678）"
            />
            <div v-else class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span :class="phone ? 'text-gray-900' : 'text-gray-400'">
                {{ phone || '未設定' }}
              </span>
            </div>
          </div>

          <!-- 註冊時間 -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">註冊時間</label>
            <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span class="text-gray-900">
                {{ user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-TW') : '未知' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="mt-8 flex gap-4">
          <button
            v-if="!isEditing"
            @click="handleEdit"
            class="px-6 py-3 bg-[#6b6b5a] text-white rounded-lg hover:bg-[#5a5a4a] transition-colors font-medium"
          >
            編輯資料
          </button>
          <template v-else>
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="px-6 py-3 bg-[#6b6b5a] text-white rounded-lg hover:bg-[#5a5a4a] transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isSaving">
                <i class="mr-2 fa-solid fa-spinner fa-spin"></i>儲存中...
              </span>
              <span v-else>儲存變更</span>
            </button>
            <button
              v-if="!(isFirstLogin && !phone)"
              @click="handleCancel"
              :disabled="isSaving"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              取消
            </button>
          </template>
        </div>

        <!-- 帳號安全區 -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <h2 class="text-xl font-bold text-[#4a4a43] mb-4">帳號安全</h2>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-info-circle text-blue-500 mt-1"></i>
              <div>
                <p class="text-sm text-gray-700 font-medium">使用 Magic Link 登入</p>
                <p class="text-sm text-gray-600 mt-1">
                  您的帳號使用無密碼登入方式。每次登入時，我們會發送登入連結到您的信箱。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
