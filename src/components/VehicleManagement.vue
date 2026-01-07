<script setup lang="ts">
import { computed } from "vue";

type Vehicle = {
	id: string;
	brand: string;
	model: string;
	plate: string;
	isDefault?: boolean;
};

const props = withDefaults(
	defineProps<{
		title?: string;
		subtitle?: string;
		vehicles?: Vehicle[];
		defaultId?: string | null;
		showAddButton?: boolean;
		useDemoWhenEmpty?: boolean;
	}>(),
	{
		title: `車主車輛管理`,
		subtitle: `管理您的車輛資訊,設定預設車輛以便快速預約`,
		vehicles: () => [],
		defaultId: null,
		showAddButton: true,
		useDemoWhenEmpty: true,
	},
);

const emit = defineEmits<{
	(e: `add`): void;
	(e: `edit`, id: string): void;
	(e: `remove`, id: string): void;
	(e: `set-default`, id: string): void;
}>();

const demoVehicles: Vehicle[] = [
	{ id: `1`, brand: `Toyota`, model: `Camry`, plate: `ABC-1234`, isDefault: true },
	{ id: `2`, brand: `Honda`, model: `Accord`, plate: `XYZ-5678` },
];

const vehicles = computed(() => {
	if (props.vehicles?.length) return props.vehicles;
	return props.useDemoWhenEmpty ? demoVehicles : [];
});

const defaultVehicleId = computed(() => {
	if (props.defaultId) return props.defaultId;
	return vehicles.value.find((v) => v.isDefault)?.id ?? null;
});

const isDefault = (v: Vehicle) => defaultVehicleId.value === v.id;
</script>

<template>
	<section class="w-full bg-[#F5F3F0]">
		<div class="mx-auto max-w-4xl px-5 py-8">
			<header class="mb-6">
				<h1 class="text-[32px] font-extrabold text-[#2F2F2F]">
					{{ title }}
				</h1>
				<p class="mt-2 text-base font-medium text-[#7B7B7B]">
					{{ subtitle }}
				</p>
			</header>

			<button
				v-if="showAddButton"
				class="inline-flex items-center gap-2 mb-8 px-6 py-3 text-base font-bold text-white transition-colors rounded-full bg-[#7A8B9A] hover:bg-[#6a7b8a]"
				@click="emit(`add`)"
			>
				<span class="material-symbols-outlined text-[24px]">add</span>
				新增車輛
			</button>

			<div class="flex flex-col gap-6">
				<article
					v-for="v in vehicles"
					:key="v.id"
					class="relative px-6 py-6 overflow-hidden bg-white rounded-[24px] shadow-sm"
				>
					<div
						v-if="isDefault(v)"
						class="absolute top-0 right-0 flex items-center gap-1 px-4 py-2 text-sm font-bold text-white rounded-bl-2xl bg-[#A0B4C0]"
					>
						<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1">
							star
						</span>
						預設車輛
					</div>

					<div class="flex items-start gap-5 mb-6">
						<div class="grid shrink-0 place-items-center w-20 h-20 rounded-3xl bg-[#E7E1DA]">
							<span class="material-symbols-outlined text-[40px] text-[#6E7A86]">
								directions_car
							</span>
						</div>

						<div class="flex flex-col pt-1">
							<h2 class="text-[26px] font-extrabold leading-tight text-[#2F2F2F]">
								{{ v.brand }}
							</h2>
							<p class="text-lg font-medium text-[#7B7B7B]">
								{{ v.model }}
							</p>

							<div class="mt-3">
								<span
									class="inline-block px-4 py-1.5 text-base font-bold tracking-wider text-[#2F2F2F] rounded-xl bg-[#E7E1DA]"
								>
									{{ v.plate }}
								</span>
							</div>
						</div>
					</div>

					<div class="w-full h-px mb-6 bg-[#F0F0F0]" />

					<div class="flex gap-3">
						<button
							v-if="!isDefault(v)"
							class="flex-1 flex justify-center items-center gap-2 px-4 py-3 text-base font-bold text-[#2F2F2F] transition-colors border border-[#E2E2E2] rounded-full bg-white hover:bg-[#F9F9F9]"
							@click="emit(`set-default`, v.id)"
						>
							<span class="material-symbols-outlined text-[20px]">star</span>
							設為預設
						</button>

						<button
							class="flex-1 flex justify-center items-center gap-2 px-4 py-3 text-base font-bold text-[#2F2F2F] transition-colors border border-[#E2E2E2] rounded-full bg-white hover:bg-[#F9F9F9]"
							@click="emit(`edit`, v.id)"
						>
							<span class="material-symbols-outlined text-[20px]">edit_square</span>
							編輯
						</button>

						<button
							class="flex justify-center items-center w-[52px] h-[52px] text-[#B06A6A] transition-colors border border-[#E2E2E2] rounded-full bg-white hover:bg-[#FFF5F5]"
							@click="emit(`remove`, v.id)"
						>
							<span class="material-symbols-outlined text-[24px]">delete</span>
						</button>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>