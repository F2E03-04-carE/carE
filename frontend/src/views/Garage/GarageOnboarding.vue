<script setup lang="ts">
// TODO(human): 之後會在這裡加上狀態管理和表單驗證邏輯
</script>

<template>
	<main class="relative min-h-screen bg-[#f5f4f0] pt-[60px] sm:pt-[70px]">
		<div class="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
			<!-- 步驟1: 填寫商家基本資料 -->
			<div v-if="true" class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
				<h1 class="text-[28px] sm:text-[32px] font-bold text-[#4a4a43] mb-2 text-center">
					商家基本資料
				</h1>
				<p class="text-[16px] text-[#8a8a7d] mb-8 text-center">
					請填寫您的維修廠基本資訊，我們將驗證公司統編
				</p>

				<form class="space-y-5">
					<!-- 店名 -->
					<div>
						<label for="garageName" class="block mb-1 text-[16px] font-medium text-gray-700">
							店名 <span class="text-[#c97d7d]">*</span>
						</label>
						<input
							id="garageName"
							type="text"
							placeholder="例如：阿明汽車保養廠"
							class="w-full px-4 py-2 text-[16px] transition-colors bg-white border border-[#e0ddd5] rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
						/>
					</div>

					<!-- 電話 -->
					<div>
						<label for="phone" class="block mb-1 text-[16px] font-medium text-gray-700">
							電話號碼 <span class="text-[#c97d7d]">*</span>
						</label>
						<input
							id="phone"
							type="tel"
							placeholder="0912345678 或 02-12345678"
							class="w-full px-4 py-2 text-[16px] transition-colors bg-white border border-[#e0ddd5] rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
						/>
					</div>

					<!-- 地址 -->
					<div>
						<label for="address" class="block mb-1 text-[16px] font-medium text-gray-700">
							地址 <span class="text-[#c97d7d]">*</span>
						</label>
						<input
							id="address"
							type="text"
							placeholder="請輸入完整地址"
							class="w-full px-4 py-2 text-[16px] transition-colors bg-white border border-[#e0ddd5] rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
						/>
					</div>

					<!-- 負責人姓名 -->
					<div>
						<label for="ownerName" class="block mb-1 text-[16px] font-medium text-gray-700">
							負責人姓名 <span class="text-[#c97d7d]">*</span>
						</label>
						<input
							id="ownerName"
							type="text"
							placeholder="請輸入負責人全名"
							class="w-full px-4 py-2 text-[16px] transition-colors bg-white border border-[#e0ddd5] rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
						/>
					</div>

					<!-- 公司統編 -->
					<div>
						<label for="taxId" class="block mb-1 text-[16px] font-medium text-gray-700">
							公司統編 <span class="text-[#c97d7d]">*</span>
						</label>
						<input
							id="taxId"
							type="text"
							maxlength="8"
							placeholder="請輸入8碼統一編號"
							class="w-full px-4 py-2 text-[16px] transition-colors bg-white border border-[#e0ddd5] rounded-lg outline-none placeholder:text-gray-400 focus:border-[#6B6B5C] focus:ring-2 focus:ring-[#6B6B5C]/30"
						/>
					</div>

					<!-- 送出按鈕 -->
					<button
						type="submit"
						class="w-full px-6 py-3 mt-6 text-[18px] font-bold text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#5a5a4a] shadow-md focus:outline-none focus:ring-2 focus:ring-[#6B6B5C] focus:ring-offset-2"
					>
						送出驗證
					</button>
				</form>
			</div>

			<!-- 步驟2: 驗證等待中 -->
			<div
				v-if="false"
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
				<p class="text-[16px] text-[#8a8a7d] mb-4">請稍候，我們正在查詢商業登記資料</p>
				<p class="text-[14px] text-[#8a8a7d]">此過程約需 30 秒</p>
			</div>

			<!-- 步驟3: 驗證結果 -->
			<div v-if="false" class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
				<!-- 驗證成功 -->
				<div class="text-center">
					<div
						class="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-[#70c287]/20"
					>
						<span class="material-symbols-outlined text-[#70c287] text-[56px]">
							check_circle
						</span>
					</div>
					<h2 class="text-[28px] sm:text-[32px] font-bold text-[#4a4a43] mb-3">驗證成功！</h2>
					<p class="text-[16px] text-[#8a8a7d] mb-6">
						公司統編驗證通過，即將跳轉到商家編輯頁面
					</p>
					<div class="flex items-center justify-center gap-2 text-[14px] text-[#8a8a7d]">
						<span class="material-symbols-outlined text-[20px] animate-spin">
							autorenew
						</span>
						<span>自動跳轉中...</span>
					</div>
				</div>

				<!-- 驗證失敗（暫時隱藏，切換時會用 v-if 控制顯示成功或失敗） -->
				<!--
				<div class="text-center">
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
						class="w-full px-6 py-3 text-[18px] font-bold text-white transition-colors rounded-lg bg-[#6B6B5C] hover:bg-[#5a5a4a] shadow-md"
					>
						返回修改資料
					</button>
				</div>
				-->
			</div>
		</div>
	</main>
</template>
