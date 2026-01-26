<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

if (!authStore.isAuthenticated) {
  router.push('/');
}

const user = computed(() => authStore.user);
const Email = computed(() => user.value?.email || '');
const Phone = ref('');
const Name = ref('');
const Nickname = ref('');
const LicensePlate = ref('');

const IsEditing = ref(false);
const isSaving = ref(false);
const saveError = ref('');
const saveSuccess = ref(false);
const phoneError = ref('');
const isLoadingProfile = ref(true);

const isFirstLogin = computed(() => route.query.firstLogin === 'true');

const loadFallbackData = () => {
  Phone.value = user.value?.user_metadata?.phone || '';
  Name.value = user.value?.user_metadata?.name || Email.value.split('@')[0];
  Nickname.value = user.value?.user_metadata?.nickname || '';
  LicensePlate.value = user.value?.user_metadata?.licensePlate || '';
};

const loadUserProfile = async () => {
  if (!user.value?.id) {
    isLoadingProfile.value = false;
    return;
  }

  try {
    const profileQuery = supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.value.id)
      .single();

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('載入超時')), 3000)
    );

    const { data: profile, error } = await Promise.race([profileQuery, timeout as any]);

    if (error) {
      console.error('載入用戶資料失敗:', error);
      loadFallbackData();
    } else if (profile) {
      Phone.value = profile.phone || '';
      Name.value = profile.name || Email.value.split('@')[0];
      Nickname.value = profile.nickname || '';
      LicensePlate.value = profile.license_plate || '';
    }
  } catch (error) {
    console.warn('載入用戶資料超時:', error);
    loadFallbackData();
  } finally {
    isLoadingProfile.value = false;
  }
};

onMounted(async () => {
  await loadUserProfile();

  if (isFirstLogin.value && !Phone.value) {
    IsEditing.value = true;
  }
});

const ToggleEditing = (): void => {
  if (IsEditing.value) {
    handleSave();
  } else {
    IsEditing.value = true;
    saveError.value = '';
    saveSuccess.value = false;
    phoneError.value = '';
  }
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const cleanValue = input.value.replace(/\D/g, '');
  Phone.value = cleanValue;
  checkPhoneFormat();
};

const checkPhoneFormat = () => {
  if (!Phone.value) {
    phoneError.value = '';
    return;
  }

  const cleanPhone = Phone.value.replace(/[-\s]/g, '');

  if (cleanPhone.length > 0 && cleanPhone.length < 10) {
    phoneError.value = '手機號碼需為10位數字';
  } else if (cleanPhone.length === 10 && !validatePhone(cleanPhone)) {
    phoneError.value = '請輸入09開頭的手機號碼';
  } else if (cleanPhone.length === 10) {
    phoneError.value = '';
  } else if (cleanPhone.length > 10) {
    phoneError.value = '手機號碼不得超過10位數字';
  }
};

const handleSave = async () => {
  saveError.value = '';
  saveSuccess.value = false;
  phoneError.value = '';

  if (!Name.value || Name.value.trim() === '') {
    saveError.value = '請輸入姓名';
    return;
  }

  if (Name.value.trim().length > 10) {
    saveError.value = '姓名不得超過 10 個字';
    return;
  }

  if (Nickname.value && Nickname.value.trim().length > 8) {
    saveError.value = '暱稱不得超過 8 個字';
    return;
  }

  if (!Phone.value || Phone.value.trim() === '') {
    saveError.value = '請輸入電話號碼';
    return;
  }

  const cleanPhone = Phone.value.replace(/[-\s]/g, '');
  if (!validatePhone(cleanPhone)) {
    saveError.value = '請輸入有效的手機號碼格式（例：0912345678）';
    return;
  }

  Phone.value = cleanPhone;

  isSaving.value = true;

  try {
    const userId = authStore.user?.id;
    if (!userId) {
      throw new Error('未找到用戶 ID');
    }

    const userData = {
      name: Name.value.trim(),
      phone: Phone.value.trim(),
      nickname: Nickname.value.trim(),
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        ...userData,
        license_plate: LicensePlate.value.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (profileError) throw profileError;

    const updateMetadata = supabase.auth.updateUser({
      data: {
        ...userData,
        licensePlate: LicensePlate.value.trim(),
      },
    });

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    try {
      await Promise.race([updateMetadata, timeout]);
    } catch (metadataError) {
      console.warn('user_metadata 更新失敗或超時，但 profiles 已更新:', metadataError);
    }

    saveSuccess.value = true;
    IsEditing.value = false;

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
	<div class="min-h-screen bg-[#EBE8E3]">
		<header class="bg-[#f9f7f4] border-b border-[#e0dbd3]">
			<div class="max-w-5xl mx-auto px-6 py-5">
				<h1 class="text-[#4a4540] tracking-wide">會員中心</h1>
				<p v-if="isFirstLogin" class="text-sm text-[#6B6B5C] mt-2">
					歡迎加入！請完善您的個人資訊以繼續使用
				</p>
			</div>
		</header>
		<main class="max-w-5xl mx-auto px-6 py-8 md:py-10">
			<div class="space-y-8">
				<div v-if="saveSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
					<span class="material-symbols-outlined text-green-500">check_circle</span>
					<p class="text-sm text-green-700 font-medium">
						{{ isFirstLogin ? '資料已儲存！歡迎使用 carE' : '資料已成功更新' }}
					</p>
				</div>
				<div v-if="saveError" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
					<span class="material-symbols-outlined text-red-500">error</span>
					<p class="text-sm text-red-700 font-medium">{{ saveError }}</p>
				</div>
				<section class="space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-[#4a4540]">個人資料</h2>
						<div v-if="isLoadingProfile" class="flex items-center gap-2 text-[#6B6B5C]">
							<span class="material-symbols-outlined text-[18px] leading-none animate-spin">progress_activity</span>
							<span class="text-sm">載入中...</span>
						</div>
						<button
							v-else
							type="button"
							@click="ToggleEditing"
							:disabled="isSaving"
							:class="[
								'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer',
								IsEditing
									? 'bg-[#6B6B5C] text-[#f9f7f4] hover:bg-[#5a5a4d]'
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
									maxlength="8"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#6B6B5C]/30"
									placeholder="請輸入暱稱"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540] bg-[#f9f7f4] rounded-lg border border-[#e0dbd3]">
									{{ Nickname || '未設定' }}
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
									maxlength="10"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#6B6B5C]/30"
									placeholder="請輸入姓名"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540] bg-[#f9f7f4] rounded-lg border border-[#e0dbd3]">
									{{ Name }}
								</p>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">
									電子郵件
									<span v-if="IsEditing" class="text-xs text-[#6B6B5C]">（不可變更）</span>
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
								<div v-if="IsEditing">
									<input
										type="tel"
										v-model="Phone"
										@input="handlePhoneInput"
										:class="[
											'w-full border rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 transition-colors',
											phoneError ? 'border-red-500 focus:ring-red-500/30' : 'border-[#e0dbd3] focus:ring-[#6B6B5C]/30'
										]"
										placeholder="請輸入手機號碼（例：0912345678）"
										maxlength="10"
										inputmode="numeric"
									/>
									<p v-if="phoneError" class="mt-1 text-xs text-red-600">
										{{ phoneError }}
									</p>
								</div>
								<p v-else class="px-4 py-3 text-[#4a4540] bg-[#f9f7f4] rounded-lg border border-[#e0dbd3]">
									{{ Phone || '未設定' }}
								</p>
							</div>
							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">車牌登記</label>
								<input
									v-if="IsEditing"
									type="text"
									v-model="LicensePlate"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#6B6B5C]/30"
									placeholder="請輸入車牌號碼（例：ABC-1234）"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540] bg-[#f9f7f4] rounded-lg border border-[#e0dbd3]">
									{{ LicensePlate || '未設定' }}
								</p>
							</div>
						</div>
					</div>
				</section>

				<!-- 快速跳轉按鈕 -->
				<section class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<button
						@click="router.push('/member/bookings')"
						type="button"
						class="group flex w-full items-center justify-between border border-[#e8e4dc] rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
					>
						<div class="flex items-center gap-4">
							<div class="rounded-xl bg-[#f9f7f4] p-3">
								<span class="material-symbols-outlined text-[24px] leading-none text-[#6B6B5C]">
									event_note
								</span>
							</div>
							<div class="text-left">
								<h3 class="mb-1 text-[#4a4540] font-semibold">預約記錄</h3>
								<p class="text-sm text-[#6b6460]">查看所有預約與狀態</p>
							</div>
						</div>
						<span class="material-symbols-outlined text-[20px] leading-none text-[#6B6B5C] transition-transform duration-200 group-hover:translate-x-1">
							chevron_right
						</span>
					</button>

					<button
						@click="router.push('/member/history')"
						type="button"
						class="group flex w-full items-center justify-between border border-[#e8e4dc] rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
					>
						<div class="flex items-center gap-4">
							<div class="rounded-xl bg-[#f9f7f4] p-3">
								<span class="material-symbols-outlined text-[24px] leading-none text-[#6B6B5C]">
									history
								</span>
							</div>
							<div class="text-left">
								<h3 class="mb-1 text-[#4a4540] font-semibold">維修歷史</h3>
								<p class="text-sm text-[#6b6460]">查看所有送修紀錄與維修進度</p>
							</div>
						</div>
						<span class="material-symbols-outlined text-[20px] leading-none text-[#6B6B5C] transition-transform duration-200 group-hover:translate-x-1">
							chevron_right
						</span>
					</button>
				</section>
			</div>
		</main>
	</div>
</template>
