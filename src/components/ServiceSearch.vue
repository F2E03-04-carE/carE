<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref<number>(1);
const selectedServiceId = ref<string>("");
const steps = [
	{ step: 1, label: `選擇服務` },
	{ step: 2, label: `車輛類型` },
	{ step: 3, label: `選擇日期` },
	{ step: 4, label: `選擇時段` },
	{ step: 5, label: `確認預約` },
];

const serviceOptions = [
	{ id: `oil-change`, title: `機油更換`, duration: `30分鐘`, icon: `fa-wrench` },
	{ id: `tire-check`, title: `輪胎檢修`, duration: `45分鐘`, icon: `fa-car` },
	{ id: `brake-check`, title: `煞車系統檢查`, duration: `60分鐘`, icon: `fa-shield-halved` },
	{ id: `maintenance`, title: `定期保養`, duration: `90分鐘`, icon: `fa-screwdriver-wrench` },
];
</script>

<template>
	<!--新年快樂-->
	<div class="flex flex-col min-h-screen bg-[#f9f9f9] text-[#4a4a4a] font-sans">
		<header class="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100">
			<div class="flex items-center gap-4">
				<div class="flex items-center justify-center w-10 h-10 text-white rounded bg-[#6b635c]">
					<i class="text-xl fa-regular fa-calendar"></i>
				</div>
				<div>
					<h1 class="text-lg font-bold tracking-wide text-gray-800">職人維修工房</h1>
					<p class="text-xs text-gray-500">專業維修・值得信賴</p>
				</div>
			</div>
			<div class="flex items-center gap-4">
				<button class="px-4 py-2 text-sm font-medium text-white transition-colors rounded bg-[#6b635c] hover:bg-[#5a534d]">預約服務</button>
				<button class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">我的預約</button>
				<button class="flex items-center gap-2 px-4 py-2 text-sm text-white rounded bg-[#6b635c]">
					<i class="fa-solid fa-check"></i>
                    開發模式
				</button>
			</div>
		</header>
		<main class="flex-1 w-full max-w-6xl p-8 mx-auto">
			<div class="flex flex-col p-10 bg-white shadow-lg rounded-2xl min-h-[600px]">
				<div class="relative flex justify-between w-full px-12 mb-12">
					<div class="absolute top-5 left-0 right-0 w-full h-[2px] bg-gray-200 -z-10 translate-y-[-50%] mx-auto max-w-[90%]"></div>
					<div v-for="s in steps" :key="s.step" class="flex flex-col items-center gap-3 bg-white">
						<div class="flex items-center justify-center w-10 h-10 text-sm font-bold transition-all border-2 rounded-full"
							:class="[
								currentStep === s.step 
									? `bg-[#6b635c] border-[#6b635c] text-white` 
									: `bg-white border-gray-300 text-gray-400`
                                    ]"
                        >
							{{ s.step }}
						</div>
						<span 
							class="text-sm tracking-wide"
							:class="currentStep === s.step ? `text-[#6b635c] font-medium` : `text-gray-400`"
						>
							{{ s.label }}
						</span>
					</div>
				</div>
				<div class="p-6 mb-10 border border-gray-100 rounded-lg bg-gray-50">
					<p class="mb-3 text-sm font-medium text-gray-500">開發者模式 - 快速切換步驟：</p>
					<div class="flex gap-3 mb-4">
						<button 
							v-for="s in steps"
							:key="`dev-btn-${s.step}`"
							@click="currentStep = s.step"
							class="px-4 py-2 text-sm font-bold text-gray-700 transition-colors bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100"
							:class="{ '!bg-[#6b635c] !text-white !border-[#6b635c]': currentStep === s.step }"
						>
							{{ s.step }}. {{ s.label }}
						</button>
					</div>
					<p class="mb-3 text-sm font-medium text-gray-500">快速填充測試資料：</p>
					<button 
						@click="selectedServiceId = `oil-change`"
						class="px-4 py-2 text-sm font-bold text-gray-600 transition-colors bg-gray-200 rounded hover:bg-gray-300">
						填充所有欄位
					</button>
				</div>
				<div v-if="currentStep === 1" class="flex-1">
					<h2 class="mb-6 text-xl font-bold text-gray-800">選擇服務項目</h2>
					<div class="grid grid-cols-2 gap-6">
						<div v-for="service in serviceOptions"
							:key="service.id"
							@click="selectedServiceId = service.id"
							class="flex items-center gap-6 p-6 transition-all border rounded-xl cursor-pointer group hover:shadow-md"
							:class="[
								selectedServiceId === service.id 
									? `border-[#6b635c] bg-stone-50` 
									: `border-gray-200 bg-white`
                                    ]"
                        >
							<div 
								class="flex items-center justify-center w-16 h-16 transition-colors rounded-lg"
								:class="[
									selectedServiceId === service.id 
										? `bg-[#6b635c] text-white` 
										: `bg-[#6b635c] text-white opacity-80`
                                        ]"
							>
								<i class="text-2xl fa-solid" :class="service.icon"></i>
							</div>
							<div>
								<h3 class="text-lg font-bold text-gray-800">{{ service.title }}</h3>
								<p class="text-sm text-gray-500">預估時間：{{ service.duration }}</p>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="flex flex-col items-center justify-center flex-1 h-64 text-gray-400 border-2 border-dashed rounded-xl">
					<i class="mb-4 text-4xl fa-solid fa-person-digging"></i>
					<p>步驟 {{ currentStep }} 內容建置中...</p>
				</div>
				<div class="flex justify-between mt-12 pt-6 border-t border-gray-100">
                    <button 
						@click="currentStep > 1 ? currentStep-- : null"
						:disabled="currentStep === 1"
						class="px-8 py-3 text-sm font-medium transition-colors border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-500">
						上一步
					</button>
					<button 
						@click="currentStep < 5 ? currentStep++ : null"
						class="px-8 py-3 text-sm font-medium text-white transition-colors rounded shadow-md bg-[#6b635c] hover:bg-[#5a534d]">
						下一步
					</button>
				</div>
			</div>
		</main>
	</div>
</template>