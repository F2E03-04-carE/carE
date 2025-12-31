<template>
	<div class="min-h-screen bg-[#faf9f7]">
		<nav class="border-b border-[#ede9e4] bg-white">
			<div class="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b7e6b] text-white">
						<i class="fa-solid fa-calendar"></i>
					</div>
					<div>
						<p class="text-base font-semibold text-[#3f3a34]">職人維修工房</p>
						<p class="text-sm text-[#8b8378]">專業維修・值得信賴</p>
					</div>
				</div>
				<div class="hidden items-center gap-3 md:flex">
					<button type="button" class="rounded-lg bg-[#8b7e6b] px-4 py-2 text-sm text-white">預約服務</button>
					<button type="button" class="rounded-lg border border-[#d6d0c8] px-4 py-2 text-sm text-[#3f3a34]">我的預約</button>
					<button type="button" class="rounded-lg bg-[#6f665a] px-4 py-2 text-sm text-white">✓ 開發模式</button>
				</div>
			</div>
		</nav>
		<main class="mx-auto max-w-[1200px] px-4 py-8">
			<section class="mb-8 hidden md:block">
				<div class="flex items-center justify-between">
					<div v-for="step in 5" :key="step" class="flex flex-1 items-center">
						<div class="flex flex-col items-center">
							<div :class="[
									'flex h-8 w-8 items-center justify-center rounded-full text-sm',
									step === 1
										? 'bg-[#8b7e6b] text-white'
										: 'border border-[#d6d0c8] text-[#8b8378]'
								]">
								{{ step }}
							</div>
							<p class="mt-2 text-sm text-[#6f665a]">
								{{ ['選擇服務','車輛類型','選擇日期','選擇時段','確認預約'][step - 1] }}
							</p>
						</div>
						<div v-if="step !== 5" class="mx-2 h-px flex-1 bg-[#ede9e4]"></div>
					</div>
				</div>
			</section>
			<!-- Dev Mode -->
			<section class="mb-10 rounded-xl border border-[#ede9e4] bg-white p-6">
				<p class="mb-4 text-sm text-[#6f665a]">開發者模式・快速切換步驟：</p>
				<div class="mb-6 flex flex-wrap gap-2">
					<button
						v-for="item in ['選擇服務','車輛類型','選擇日期','選擇時段','確認預約']"
						:key="item"
						type="button"
						class="rounded-lg border border-[#d6d0c8] px-4 py-2 text-sm text-[#3f3a34]"
					>
						{{ item }}
					</button>
				</div>
				<button type="button" class="rounded-lg bg-[#d6d0c8] px-4 py-2 text-sm text-[#3f3a34]">填充所有欄位</button>
			</section>
			<section>
				<h2 class="mb-6 text-xl font-semibold text-[#3f3a34]">選擇服務項目</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<div
						v-for="service in [
							{ icon: 'wrench', title: '機油更換', time: '30分鐘' },
							{ icon: 'car', title: '輪胎檢修', time: '45分鐘' },
							{ icon: 'circle-check', title: '煞車系統檢查', time: '60分鐘' },
							{ icon: 'wrench', title: '定期保養', time: '90分鐘' }
						]"
						:key="service.title"
						class="flex items-center gap-4 rounded-xl border border-[#ede9e4] bg-white p-6"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f3f1ee] text-[#6f665a]">
							<i :class="`fa-solid fa-${service.icon}`"></i>
						</div>
						<div>
							<p class="text-base font-semibold text-[#3f3a34]">
								{{ service.title }}
							</p>
							<p class="text-sm text-[#8b8378]">
								預估時間：{{ service.time }}
							</p>
						</div>
					</div>
				</div>
				<div class="mt-10 flex items-center justify-between">
					<button type="button" class="rounded-lg border border-[#d6d0c8] px-6 py-2 text-sm text-[#8b8378]">上一步</button>
					<button type="button" class="rounded-lg bg-[#b7afa5] px-6 py-2 text-sm text-white">下一步</button>
				</div>
			</section>
		</main>
	</div>
</template>
