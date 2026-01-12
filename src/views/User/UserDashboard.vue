<script setup lang="ts">
import { ref } from "vue";

const IsEditing = ref(false);
const Nickname = ref(`咪毛`);
const Name = ref(`王貓貓`);
const Email = ref(`mimimoumou@gmail.com`);
const Phone = ref(`0912-345-678`);
const LicensePlate = ref(`ABC-1234`);

const ToggleEditing = (): void => {
	IsEditing.value = !IsEditing.value;
};
</script>

<template>
	<div class="min-h-screen bg-[#f4f1eb]">
		<header class="bg-[#f9f7f4] border-b border-[#e0dbd3]">
			<div class="max-w-5xl mx-auto px-6 py-5">
				<h1 class="text-[#4a4540] tracking-wide">會員中心</h1>
			</div>
		</header>

		<main class="max-w-5xl mx-auto px-6 py-8 md:py-10">
			<div class="space-y-8">
				<!-- 個人資料區塊 -->
				<section class="space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-[#4a4540]">個人資料</h2>

						<button
							type="button"
							@click="ToggleEditing"
							:class="[
								'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200',
								IsEditing
									? 'bg-[#8b7f6f] text-[#f9f7f4] hover:bg-[#7a6f5f]'
									: 'bg-[#e8e4dc] text-[#6b6460] hover:bg-[#d9d3c9]',
							]"
						>
							<template v-if="IsEditing">
								<span class="material-symbols-outlined text-[18px] leading-none">save</span>
								儲存
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
								<label class="block text-sm text-[#6b6460]">姓名</label>
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
								<label class="block text-sm text-[#6b6460]">電子郵件</label>
								<input
									v-if="IsEditing"
									type="email"
									v-model="Email"
									class="w-full border border-[#e0dbd3] rounded-lg bg-[#f9f7f4] px-4 py-3 text-[#4a4540] focus:outline-none focus:ring-2 focus:ring-[#8b7f6f]/30"
								/>
								<p v-else class="px-4 py-3 text-[#4a4540]">
									{{ Email }}
								</p>
							</div>

							<div class="space-y-2">
								<label class="block text-sm text-[#6b6460]">電話</label>
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

				<!-- 移除：車輛管理（管理車輛登記） -->

				<!-- 其他功能區塊 -->
				<section class="space-y-4">
					<button
						type="button"
						class="group flex w-full items-center justify-between border border-[#e8e4dc] rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
					>
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

						<span
							class="material-symbols-outlined text-[20px] leading-none text-[#8b7f6f] transition-transform duration-200 group-hover:translate-x-1"
						>
							chevron_right
						</span>
					</button>
				</section>
			</div>
		</main>
	</div>
</template>
