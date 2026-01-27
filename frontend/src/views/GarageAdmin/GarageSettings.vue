<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import { useGarageProfile } from '@/composables/garage/useGarageProfile';
import { useImageUpload } from '@/composables/garage/useImageUpload';
import type { GarageProfile } from '@/composables/garage/types';

const router = useRouter();

// Garage ID
const garageId = ref<number | null>(null);
const isLoadingGarage = ref(true);
const noGarageError = ref(false);

// Composables
let profileApi: ReturnType<typeof useGarageProfile>;
const uploadApi = useImageUpload();

// 車廠資料
const garageProfile = reactive<Partial<GarageProfile>>({});

// 初始化資料
async function initGarageData() {
  try {
    isLoadingGarage.value = true;

    // 取得當前用戶
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('未登入');
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }

    // 嘗試根據當前用戶查詢 garage (如果有 owner_id 欄位)
    let { data: garages, error } = await supabase
      .from('garages')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle();

    // 如果 owner_id 欄位不存在，則查詢第一筆資料（開發測試用）
    if (error && error.message.includes('owner_id')) {
      console.log('DEV MODE: owner_id 欄位不存在，查詢第一筆資料');
      const result = await supabase
        .from('garages')
        .select('id')
        .limit(1)
        .maybeSingle();
      garages = result.data;
      error = result.error;
    }

    console.log('查詢 garage 結果:', { garages, error });

    if (error) {
      console.error('查詢 garage 失敗:', error);
      noGarageError.value = true;
      isLoadingGarage.value = false;
      return;
    }

    if (garages) {
      garageId.value = garages.id;
      console.log('DEV MODE: 使用車廠 ID =', garageId.value);

      // 初始化 profile API
      if (garageId.value !== null) {
        profileApi = useGarageProfile(garageId.value);
        await profileApi.fetchProfile();
        Object.assign(garageProfile, profileApi.profile);

        console.log('Profile loaded:', garageProfile);
      }
    } else {
      console.log('No garage data found, showing empty form');
    }
  } catch (e) {
    console.error('初始化失敗:', e);
    noGarageError.value = true;
  } finally {
    isLoadingGarage.value = false;
  }
}

// 封面照片上傳
async function onCoverFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  const url = await uploadApi.uploadImage(
    file,
    'garage-covers',
    `${garageId.value}/${Date.now()}-${file.name}`
  );

  if (url) {
    garageProfile.cover_image_url = url;
    await profileApi.updateProfile({ cover_image_url: url });
  } else {
    alert('上傳失敗: ' + uploadApi.error.value);
  }
}

// 環境照片上傳
async function onEnvFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  for (const file of input.files) {
    const url = await uploadApi.uploadImage(
      file,
      'garage-environments',
      `${garageId.value}/${Date.now()}-${file.name}`
    );

    if (url) {
      await profileApi.addEnvironmentImage(url);
    }
  }
}

// 移除環境照片
async function removeEnvImage(imageUrl: string) {
  if(confirm('確定要移除這張照片嗎？')) {
    await profileApi.removeEnvironmentImage(imageUrl);
  }
}

// 儲存設定
async function saveSettings() {
  try {
    await profileApi.updateProfile({
      name: garageProfile.name,
      garage_owner_name: garageProfile.garage_owner_name,
      tax_id: garageProfile.tax_id,
      phone: garageProfile.phone,
      address: garageProfile.address,
      description: garageProfile.description
    });
    alert('儲存成功');
  } catch (e) {
    alert('儲存失敗');
  }
}

onMounted(() => {
  initGarageData();
});

async function handleSelectionPlan() {
  try{
 router.push('/garage/subscription');
  } catch (e) {
    console.error('導航到方案選擇頁面失敗:', e);
  }

}
</script>

<template>
  <div class="min-h-[calc(100vh-140px)] bg-[#f5f4f0] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#4a4a43]">編輯維修廠</h1>
        <p class="mt-2 text-stone-500">維護維修廠的基本資料與簡介</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingGarage" class="flex h-[50vh] w-full items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#6B6B5C] border-t-transparent"></div>
          <div class="text-xl font-bold text-[#6B6B5C]">系統載入中...</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="noGarageError" class="flex h-[50vh] w-full items-center justify-center p-6">
      <div class="max-w-md text-center">
        <h2 class="mb-4 text-2xl font-bold text-[#4A4A45]">找不到任何車廠資料</h2>
        <p class="mb-6 text-stone-500">
          資料庫可能是空的，請先在資料庫建立至少一筆車廠資料。
        </p>
      </div>
    </div>

    <!-- Settings Content -->
    <div v-else class="mx-auto max-w-4xl px-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-500 sm:px-8 sm:py-10">
      <div class="rounded-xl border border-[#DCD9D3] bg-white p-8 shadow-sm">
        <div class="space-y-6">
          <h3 class="text-base font-bold text-[#4A4A45]">維修廠照片</h3>
          <div>
            <label class="text-sm font-bold text-[#4A4A45]">封面照片 (建議尺寸 1200x600)</label>
            <div v-if="!garageProfile.cover_image_url" class="relative mt-2 h-48 w-full overflow-hidden rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] transition-colors hover:border-[#6B6B5C]">
              <input type="file" accept="image/jpeg,image/png,image/webp" @change="onCoverFileChange" class="absolute inset-0 cursor-pointer opacity-0" />
              <div class="flex h-full items-center justify-center">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p class="mt-2 text-sm text-stone-500">點擊上傳封面照片</p>
                  <p class="mt-1 text-xs text-stone-400">支援 JPG, PNG, WebP</p>
                </div>
              </div>
            </div>
            <div v-else class="group relative mt-2 overflow-hidden rounded-xl border border-[#DCD9D3]">
              <img :src="garageProfile.cover_image_url" alt="封面照片" class="h-48 w-full object-cover" />
              <button type="button" @click="garageProfile.cover_image_url = ''; profileApi.updateProfile({ cover_image_url: '' })" class="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="text-sm font-bold text-[#4A4A45]">環境照片 (展示工位、休息區等)</label>
            <div class="relative mt-2 h-32 w-full overflow-hidden rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] transition-colors hover:border-[#6B6B5C]">
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="onEnvFileChange" class="absolute inset-0 cursor-pointer opacity-0" />
              <div class="flex h-full items-center justify-center">
                <div class="text-center">
                  <svg class="mx-auto h-10 w-10 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p class="mt-2 text-sm text-stone-500">點擊上傳環境照片 (可多選)</p>
                </div>
              </div>
            </div>
            <div v-if="garageProfile.environment_images && garageProfile.environment_images.length > 0" class="mt-4 grid grid-cols-3 gap-4">
              <div v-for="(img, idx) in garageProfile.environment_images" :key="idx" class="group relative overflow-hidden rounded-lg border border-[#DCD9D3]">
                <img :src="img" alt="環境照片" class="h-32 w-full object-cover" />
                <button type="button" @click="removeEnvImage(img)" class="absolute right-1 top-1 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="my-8 border-t border-[#F0EEE9]"></div>

        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">維修廠名稱</label>
            <input
              v-model="garageProfile.name"
              type="text"
              class="w-full rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
              placeholder="請輸入維修廠名稱"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">負責人姓名</label>
            <input
              v-model="garageProfile.garage_owner_name"
              type="text"
              class="w-full rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
              placeholder="請輸入負責人姓名"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">統一編號</label>
            <input
              v-model="garageProfile.tax_id"
              type="text"
              class="w-full rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
              placeholder="請輸入統一編號"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">聯絡電話</label>
            <input
              v-model="garageProfile.phone"
              type="tel"
              class="w-full rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
              placeholder="請輸入聯絡電話"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">地址</label>
            <input
              v-model="garageProfile.address"
              type="text"
              class="w-full rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
              placeholder="請輸入地址"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-[#4A4A45]">維修廠簡介</label>
            <textarea
              v-model="garageProfile.description"
              rows="4"
              class="w-full resize-none rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
              placeholder="請輸入維修廠簡介..."
            ></textarea>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-end gap-3 border-t border-[#F0EEE9] pt-6">
          <button
            @click="saveSettings"
            type="button"
            class="rounded-lg bg-[#6B6B5C] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] active:scale-95 cursor-pointer"
          >
            儲存變更
          </button>
          <button
            @click="handleSelectionPlan"
            type="button"
            class="rounded-lg bg-[#6B6B5C] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] active:scale-95 cursor-pointer "
          >
            選擇方案
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
