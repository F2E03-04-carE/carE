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
const Email = computed(() => user.value?.email || '');
const Phone = ref(user.value?.user_metadata?.phone || '');
const Name = ref(user.value?.user_metadata?.name || Email.value.split('@')[0]);
const Nickname = ref(user.value?.user_metadata?.nickname || '');
const LicensePlate = ref(user.value?.user_metadata?.licensePlate || '');

const IsEditing = ref(false);
const isSaving = ref(false);
const saveError = ref('');
const saveSuccess = ref(false);

// 檢查是否是首次登入
const isFirstLogin = computed(() => route.query.firstLogin === 'true');

// 如果是首次登入且資料不完整，自動進入編輯模式
onMounted(() => {
  if (isFirstLogin.value && !Phone.value) {
    IsEditing.value = true;
  }
});

const ToggleEditing = (): void => {
  if (IsEditing.value) {
    // 儲存
    handleSave();
  } else {
    // 進入編輯模式
    IsEditing.value = true;
    saveError.value = '';
    saveSuccess.value = false;
  }
};

const handleSave = async () => {
  saveError.value = '';
  saveSuccess.value = false;

  // 驗證必填欄位
  if (!Phone.value || Phone.value.trim() === '') {
    saveError.value = '請輸入電話號碼';
    return;
  }

  if (!Name.value || Name.value.trim() === '') {
    saveError.value = '請輸入姓名';
    return;
  }

  isSaving.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        name: Name.value.trim(),
        phone: Phone.value.trim(),
        nickname: Nickname.value.trim(),
        licensePlate: LicensePlate.value.trim(),
      },
    });

    if (error) throw error;

    saveSuccess.value = true;
    IsEditing.value = false;

    // 如果是首次登入，2秒後移除查詢參數
    if (isFirstLogin.value) {
      setTimeout(() => {
        router.replace('/member/profile');
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
	<div class="min-h-screen bg-[#f4f1eb] pt-[60px] sm:pt-[70px]">
		<header class="bg-[#f9f7f4] border-b border-[#e0dbd3]">
			<div class="max-w-5xl mx-auto px-6 py-5">
				<h1 class="text-[#4a4540] tracking-wide">會員中心</h1>
				<p v-if="isFirstLogin" class="text-sm text-[#8b7f6f] mt-2">
					歡迎加入！請完善您的個人資訊以繼續使用
				</p>
			</div>
		</header>
		<main class="max-w-5xl mx-auto px-6 py-8 md:py-10">
			<div class="space-y-8">
				<!-- 成功訊息 -->
				<div v-if="saveSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
					<span class="material-symbols-outlined text-green-500">check_circle</span>
					<p class="text-sm text-green-700 font-medium">
						{{ isFirstLogin ? '資料已儲存！歡迎使用 carE' : '資料已成功更新' }}
					</p>
				</div>

				<!-- 錯誤訊息 -->
				<div v-if="saveError" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
					<span class="material-symbols-outlined text-red-500">error</span>
					<p class="text-sm text-red-700 font-medium">{{ saveError }}</p>
				</div>

				<section class="space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-[#4a4540]">個人資料</h2>
						<button
							type="button"
							@click="ToggleEditing"
							:disabled="isSaving"
							:class="[
								'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer',
								IsEditing
									? 'bg-[#8b7f6f] text-[#f9f7f4] hover:bg-[#7a6f5f]'
									: 'bg-[#e8e4dc] text-[#6b6460] hover:bg-[#d9d3c9]',
								isSaving ? 'opacity-60 cursor-not-allowed' : ''
							]"
						>
							<template v-if="IsEditing">
								<span v-if="isSaving" class="material-symbols-outlined text-[18px] leading-none animate-spin">progress_activity</span>
								<span v-else class="material-symbols-outlined text-[18px] leading-none">save</span>
								{{ isSaving ? '儲存中...' : '儲存' }}
							</template>
							<template v-else>
								<span class="material-symbols-outlined text-[18px] leading-none">edit</span>
								編輯
							</template>
						</button>
					</div>
					<div class="bg-white border border-[#e8e4dc] rounded-2xl p-6 shadow-sm">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">會員暱稱</label>
								<input
									v-if="IsEditing"
									type="text"
									v-model="Nickname"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#8b7f6f]/30"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540]">
									{{ Nickname }}
								</p>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">
									姓名
									<span v-if="IsEditing" class="text-red-500">*</span>
								</label>
								<input
									v-if="IsEditing"
									type="text"
									v-model="Name"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#8b7f6f]/30"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540]">
									{{ Name }}
								</p>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">
									電子郵件
									<span v-if="IsEditing" class="text-xs text-[#8b7f6f]">（不可變更）</span>
								</label>
								<p class="px-4 py-3 text-[#4a4540] bg-[#f9f7f4] rounded-lg border border-[#e0dbd3]">
									{{ Email }}
								</p>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">
									電話
									<span v-if="IsEditing" class="text-red-500">*</span>
								</label>
								<input
									v-if="IsEditing"
									type="tel"
									v-model="Phone"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#8b7f6f]/30"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540]">
									{{ Phone }}
								</p>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">車牌登記</label>
								<input
									v-if="IsEditing"
									type="text"
									v-model="LicensePlate"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#8b7f6f]/30"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540]">
									{{ LicensePlate }}
								</p>
							</div>
						</div>
					</div>
				</section>
				<section class="space-y-4">
					<button type="button" class="group flex w-full items-center justify-between border border-[#e8e4dc] rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
						<div class="flex items-center gap-4">
							<div class="rounded-xl bg-[#f9f7f4] p-3">
								<span class="material-symbols-outlined text-[24px] leading-none text-[#8b7f6f]">
									handyman
								</span>
							</div>
							<div class="text-left">
								<h3 class="mb-1 text-[#4a4540]">送修記錄</h3>
								<p class="text-sm text-[#6b6460]">查看所有送修紀錄與維修進度</p>
							</div>
						</div>
						<span class="material-symbols-outlined text-[20px] leading-none text-[#8b7f6f] transition-transform duration-200 group-hover:translate-x-1">
							chevron_right
						</span>
					</button>
				</section>
			</div>
		</main>
	</div>
</template>
