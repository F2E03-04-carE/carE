<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

type FieldKey = `Email` | `Phone` | `Password` | `ConfirmPassword`;

const Router = useRouter();

const IsSubmitted = ref(false);
const DidSubmitAttempt = ref(false);
const IsLoading = ref(false);

const Countdown = ref(5);
let Timer: number | undefined;

const Form = reactive({
	Email: ``,
	Phone: ``,
	Password: ``,
	ConfirmPassword: ``,
});

const Touched = reactive<Record<FieldKey, boolean>>({
	Email: false,
	Phone: false,
	Password: false,
	ConfirmPassword: false,
});

const Errors = computed<Record<FieldKey, string>>(() => {
	const Next: Record<FieldKey, string> = {
		Email: ``,
		Phone: ``,
		Password: ``,
		ConfirmPassword: ``,
	};

	if (!Form.Email) {
		Next.Email = `請輸入電子信箱`;
	} else {
		const EmailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		if (!EmailPattern.test(Form.Email)) {
			Next.Email = `請輸入有效的電子信箱格式`;
		}
	}

	if (!Form.Phone) {
		Next.Phone = `請輸入電話號碼`;
	} else {
		const PhonePattern = /^09\d{8}$/;
		if (!PhonePattern.test(Form.Phone)) {
			Next.Phone = `請輸入有效的手機號碼格式（09開頭，共10碼）`;
		}
	}

	if (!Form.Password) {
		Next.Password = `請輸入密碼`;
	} else if (Form.Password.length < 8) {
		Next.Password = `密碼長度至少需要8個字元`;
	} else {
		const PasswordPattern = /[A-Z]/;
		if (!PasswordPattern.test(Form.Password)) {
			Next.Password = `密碼需包含至少一個大寫字母`;
		}
	}

	if (!Form.ConfirmPassword) {
		Next.ConfirmPassword = `請再次輸入密碼`;
	} else if (Form.ConfirmPassword !== Form.Password) {
		Next.ConfirmPassword = `兩次輸入的密碼不相符`;
	}

	return Next;
});

function ShowError(Key: FieldKey) {
	return (Touched[Key] || DidSubmitAttempt.value) && !!Errors.value[Key];
}

function InputBorderClass(Key: FieldKey) {
	return ShowError(Key)
		? `border-[#c97d7d] focus:border-[#c97d7d] focus:ring-[#c97d7d]/30`
		: `border-[#e0ddd5]`;
}

function MarkAllTouched() {
	Touched.Email = true;
	Touched.Phone = true;
	Touched.Password = true;
	Touched.ConfirmPassword = true;
}

function HandleClose() {
	if (Timer) clearInterval(Timer);

	IsSubmitted.value = false;
	DidSubmitAttempt.value = false;

	Form.Email = ``;
	Form.Phone = ``;
	Form.Password = ``;
	Form.ConfirmPassword = ``;

	Object.keys(Touched).forEach((key) => {
		Touched[key as FieldKey] = false;
	});

	try {
		Router.push(`/`);
	} catch (error) {
		console.warn(`Navigation failed`, error);
	}
}

function StartRedirectTimer() {
	Countdown.value = 5;

	if (Timer) clearInterval(Timer);

	Timer = window.setInterval(() => {
		Countdown.value -= 1;
		if (Countdown.value <= 0) {
			HandleClose();
		}
	}, 1000);
}

async function HandleSubmit() {
	if (IsLoading.value) return;

	DidSubmitAttempt.value = true;
	MarkAllTouched();

	const HasError = Object.values(Errors.value).some((Msg) => Msg.length > 0);
	if (HasError) return;

	IsLoading.value = true;

	try {
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log(`註冊成功 (Safe Log):`, {
			email: Form.Email,
			phone: Form.Phone,
		});

		IsSubmitted.value = true;
		StartRedirectTimer();
	} catch (error) {
		console.error(`註冊失敗`, error);
		alert(`發生錯誤，請稍後再試`);
	} finally {
		IsLoading.value = false;
	}
}

onUnmounted(() => {
	if (Timer) clearInterval(Timer);
});
</script>

<template>
	<div class="flex items-center justify-center min-h-screen px-4 py-12 text-[#3d3d3d] bg-[#FAF8F5]">
		<div class="w-full max-w-md">
			<div
				v-if="IsSubmitted"
				class="relative p-8 text-center bg-white border border-[#e0ddd5] rounded-2xl shadow-sm md:p-10"
			>
				<button
					type="button"
					class="absolute top-4 right-4 text-[#8a8a7e] transition-colors hover:text-[#3d3d3d]"
					@click="HandleClose"
				>
					<i class="text-xl fa-solid fa-xmark"></i>
				</button>
				<div class="mb-6">
					<div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#6B6B5C]/10">
						<i class="text-2xl fa-solid fa-check text-[#6B6B5C]" aria-hidden="true"></i>
					</div>
					<h2 class="mb-2 text-2xl font-medium text-[#3d3d3d]">註冊成功</h2>
					<p class="mb-4 text-[#8a8a7e]">感謝您的註冊，我們已收到您的資料</p>
					<p class="text-[#8a8a7e]">
						將在 <span class="font-bold text-[#6B6B5C]">{{ Countdown }}</span> 秒後返回首頁...
					</p>
				</div>
				<button
					type="button"
					@click="HandleClose"
					class="w-full px-6 py-2 mt-2 font-medium text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#6B6B5C]/90"
				>
					立即返回
				</button>
			</div>
			<div v-else class="p-8 bg-white border border-[#e0ddd5] rounded-2xl shadow-sm md:p-10">
				<div class="mb-8">
					<h1 class="mb-2 text-3xl font-medium text-[#3d3d3d]">會員註冊</h1>
					<p class="text-[#8a8a7e]">請填寫以下資訊完成註冊</p>
				</div>
				<form class="space-y-6" @submit.prevent="HandleSubmit">
					<div>
						<label for="email" class="block mb-2 text-base font-medium text-[#3d3d3d]">電子信箱</label>
						<input
							id="email"
							v-model.trim="Form.Email"
							type="email"
							autocomplete="username"
							placeholder="example@email.com"
							class="w-full px-4 py-3 text-base transition-colors bg-white border rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
							:class="InputBorderClass(`Email`)"
							@blur="Touched.Email = true"
						/>
						<p v-if="ShowError(`Email`)" class="mt-2 text-[#c97d7d]">{{ Errors.Email }}</p>
					</div>
					<div>
						<label for="phone" class="block mb-2 text-base font-medium text-[#3d3d3d]">電話號碼</label>
						<input
							id="phone"
							v-model.trim="Form.Phone"
							type="tel"
							autocomplete="tel"
							placeholder="0912345678"
							class="w-full px-4 py-3 text-base transition-colors bg-white border rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
							:class="InputBorderClass(`Phone`)"
							@blur="Touched.Phone = true"
						/>
						<p v-if="ShowError(`Phone`)" class="mt-2 text-[#c97d7d]">{{ Errors.Phone }}</p>
					</div>
					<div>
						<label for="password" class="block mb-2 text-base font-medium text-[#3d3d3d]">密碼</label>
						<input
							id="password"
							v-model="Form.Password"
							type="password"
							autocomplete="new-password"
							placeholder="至少8個字元"
							class="w-full px-4 py-3 text-base transition-colors bg-white border rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
							:class="InputBorderClass(`Password`)"
							@blur="Touched.Password = true"
						/>
						<p v-if="ShowError(`Password`)" class="mt-2 text-[#c97d7d]">{{ Errors.Password }}</p>
					</div>
					<div>
						<label for="confirmPassword" class="block mb-2 text-base font-medium text-[#3d3d3d]">
							確認密碼
						</label>
						<input
							id="confirmPassword"
							v-model="Form.ConfirmPassword"
							type="password"
							autocomplete="new-password"
							placeholder="再次輸入密碼"
							class="w-full px-4 py-3 text-base transition-colors bg-white border rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
							:class="InputBorderClass(`ConfirmPassword`)"
							@blur="Touched.ConfirmPassword = true"
						/>
						<p v-if="ShowError(`ConfirmPassword`)" class="mt-2 text-[#c97d7d]">
							{{ Errors.ConfirmPassword }}
						</p>
					</div>
					<button
						type="submit"
						:disabled="IsLoading"
						class="w-full px-6 py-3 mt-8 text-base font-medium text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#6B6B5C]/90 focus:outline-none focus:ring-2 focus:ring-[#6B6B5C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
					>
						<span v-if="IsLoading">
							<i class="mr-2 fa-solid fa-spinner fa-spin"></i>處理中...
						</span>
						<span v-else>確認送出</span>
					</button>
				</form>
			</div>
		</div>
	</div>
</template>