<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type AppointmentStatus = `in_progress` | `completed`;
type FilterType = `all` | AppointmentStatus;

type ProgressStep = {
	name: string;
	completed: boolean;
	current: boolean;
	isFinalStep?: boolean;
	isPickupHint?: boolean;
};

type QuoteItem = {
	name: string;
	price: number;
};

type Appointment = {
	id: string;
	carModel: string;
	licensePlate: string;
	serviceType: string;
	appointmentDate: string;
	appointmentTime: string;
	status: AppointmentStatus;

	shopName: string;
	shopAddress: string;

	// ✅ 店家聯絡資訊：店長 + 電話(含手機)
	shopManagerName: string;
	shopTel: string;
	shopMobile: string;

	notes: string;
	additionalServices?: string[];

	// 純切版用：假的狀態，控制最後一步顯示「完工待取車」
	isReadyForPickup?: boolean;

	// ✅ 報價（純切版）
	quoteItems?: QuoteItem[];
};

const Tabs = [
	{ label: `全部`, value: `all` as const },
	{ label: `維修中`, value: `in_progress` as const },
	{ label: `已完成`, value: `completed` as const },
];

const ActiveFilter = ref<FilterType>(`all`);

const IsDetailModalOpen = ref<boolean>(false);
const SelectedAppointment = ref<Appointment | null>(null);

const IsQuoteModalOpen = ref<boolean>(false);
const SelectedQuoteAppointment = ref<Appointment | null>(null);

const MockAppointments: Appointment[] = [
	{
		id: `1`,
		carModel: `Toyota Altis 2020`,
		licensePlate: `ABC-1234`,
		serviceType: `定期保養・引擎機油更換`,
		appointmentDate: `2026/01/12`,
		appointmentTime: `10:30`,
		status: `in_progress`,
		shopName: `XX 保修中心`,
		shopAddress: `台北市中山區 XX 路 100 號`,
		shopManagerName: `張店長`,
		shopTel: `02-2345-6789`,
		shopMobile: `0912-000-111`,
		notes: `希望能順便檢查煞車異音。`,
		additionalServices: [`輪胎定位`, `雨刷更換`],
		isReadyForPickup: true,
		quoteItems: [
			{ name: `機油更換`, price: 1200 },
			{ name: `機油濾芯`, price: 350 },
			{ name: `工資`, price: 800 },
		],
	},
	{
		id: `2`,
		carModel: `Honda CR-V 2019`,
		licensePlate: `XYZ-5678`,
		serviceType: `煞車系統檢修`,
		appointmentDate: `2026/01/08`,
		appointmentTime: `14:00`,
		status: `completed`,
		shopName: `OO 維修站`,
		shopAddress: `新北市板橋區 OO 路 88 號`,
		shopManagerName: `林店長`,
		shopTel: `02-2988-1122`,
		shopMobile: `0988-765-432`,
		notes: `煞車踏板偏軟，請協助檢查。`,
		additionalServices: [`冷氣濾網更換`],
		quoteItems: [
			{ name: `煞車油更換`, price: 900 },
			{ name: `煞車皮（前）`, price: 2600 },
			{ name: `工資`, price: 1200 },
		],
	},
	{
		id: `3`,
		carModel: `Tesla Model 3 2022`,
		licensePlate: `EV-8888`,
		serviceType: `輪胎更換・四輪定位`,
		appointmentDate: `2026/01/15`,
		appointmentTime: `09:00`,
		status: `in_progress`,
		shopName: `ZZ 輪胎中心`,
		shopAddress: `台北市內湖區 ZZ 路 66 號`,
		shopManagerName: `陳店長`,
		shopTel: `02-2655-0099`,
		shopMobile: `0900-111-222`,
		notes: `希望使用原廠胎壓設定。`,
		additionalServices: [`氮氣充填`],
		isReadyForPickup: false,
		quoteItems: [
			{ name: `輪胎（四條）`, price: 16800 },
			{ name: `四輪定位`, price: 1200 },
			{ name: `工資`, price: 800 },
		],
	},
];

const Appointments = ref<Appointment[]>([...MockAppointments]);

const FilteredAppointments = computed(() => {
	if (ActiveFilter.value === `all`) {
		return Appointments.value;
	}
	return Appointments.value.filter((apt) => apt.status === ActiveFilter.value);
});

const InProgressAppointments = computed(() => {
	return FilteredAppointments.value.filter((apt) => apt.status === `in_progress`);
});

const CompletedAppointments = computed(() => {
	return FilteredAppointments.value.filter((apt) => apt.status === `completed`);
});

const StatusConfig = (status: AppointmentStatus) => {
	switch (status) {
		case `in_progress`:
			return { label: `維修中`, color: `text-[#2F2E2A] border-[#2F2E2A] bg-[#F7F5F0]` };
		case `completed`:
			return { label: `已取車`, color: `text-[#6B705C] border-[#E2DED6] bg-[#EFECE6]` };
	}
};

const BuildProgressSteps = (appointment: Appointment): ProgressStep[] => {
	const IsPickedUp = appointment.status === `completed`;
	const IsReadyForPickup = Boolean(appointment.isReadyForPickup);

	if (IsPickedUp) {
		return [
			{ name: `接收車輛`, completed: true, current: false },
			{ name: `維修中`, completed: true, current: false },
			{ name: `已取車`, completed: true, current: false, isFinalStep: true },
		];
	}

	const FinalLabel = IsReadyForPickup ? `完工待取車` : `待完工`;

	return [
		{ name: `接收車輛`, completed: true, current: false },
		{ name: `維修中`, completed: IsReadyForPickup, current: !IsReadyForPickup },
		{
			name: FinalLabel,
			completed: false,
			current: IsReadyForPickup,
			isFinalStep: true,
			isPickupHint: IsReadyForPickup,
		},
	];
};

const StepsFor = (appointment: Appointment) => {
	return BuildProgressSteps(appointment);
};

const ProgressPercent = (steps: ProgressStep[]) => {
	if (!steps || steps.length < 2) {
		return 0;
	}
	const completedCount = steps.filter((s) => s.completed).length;
	const denom = steps.length - 1;
	const ratio = completedCount / denom;
	const percent = Math.max(0, Math.min(1, ratio)) * 100;
	return percent;
};

const OpenDetailModal = (appointment: Appointment) => {
	SelectedAppointment.value = appointment;
	IsDetailModalOpen.value = true;
};

const CloseDetailModal = () => {
	IsDetailModalOpen.value = false;
	SelectedAppointment.value = null;
};

const OpenQuoteModal = (appointment: Appointment) => {
	SelectedQuoteAppointment.value = appointment;
	IsQuoteModalOpen.value = true;
};

const CloseQuoteModal = () => {
	IsQuoteModalOpen.value = false;
	SelectedQuoteAppointment.value = null;
};

const QuoteTotal = computed(() => {
	const items = SelectedQuoteAppointment.value?.quoteItems ?? [];
	return items.reduce((sum, item) => sum + item.price, 0);
});

const FormatCurrency = (value: number) => {
	return new Intl.NumberFormat(`zh-TW`, { style: `currency`, currency: `TWD`, maximumFractionDigits: 0 }).format(value);
};

const HandleKeydown = (event: KeyboardEvent) => {
	if (event.key !== `Escape`) {
		return;
	}
	if (IsQuoteModalOpen.value) {
		CloseQuoteModal();
		return;
	}
	if (IsDetailModalOpen.value) {
		CloseDetailModal();
	}
};

onMounted(() => {
	window.addEventListener(`keydown`, HandleKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener(`keydown`, HandleKeydown);
});
</script>

<template>
	<div class="min-h-screen bg-[#EBE8E3] text-[#2F2E2A]">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

		<main class="container mx-auto max-w-6xl px-4 py-8">
			<div class="mb-8">
				<div class="flex flex-wrap gap-3">
					<button
						v-for="Tab in Tabs"
						:key="Tab.value"
						type="button"
						@click="ActiveFilter = Tab.value"
						:class="[
							`inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-medium transition-colors duration-200`,
							ActiveFilter === Tab.value
								? `border-[#6B6B5C] bg-[#6B6B5C] text-white`
								: `border-[#E2DED6] bg-[#F7F5F0] text-[#2F2E2A] hover:border-[#6B6B5C] hover:text-[#6B6B5C]`,
						]"
					>
						{{ Tab.label }}
					</button>
				</div>
			</div>

			<div class="space-y-10">
				<div v-if="InProgressAppointments.length > 0">
					<h2 class="mb-6 text-xl font-bold text-[#2F2E2A]">進行中</h2>

					<div class="grid grid-cols-1 gap-6">
						<div
							v-for="Appointment in InProgressAppointments"
							:key="Appointment.id"
							class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-7 transition-shadow duration-200 hover:shadow-md"
						>
							<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex items-center gap-3">
										<h3 class="text-lg font-bold text-[#2F2E2A]">{{ Appointment.carModel }}</h3>
										<span class="text-sm font-medium text-[#6B705C]">{{ Appointment.licensePlate }}</span>
									</div>
									<p class="text-sm text-[#6B705C]">維修項目：{{ Appointment.serviceType }}</p>
								</div>
								<span class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold" :class="StatusConfig(Appointment.status).color">
									{{ StatusConfig(Appointment.status).label }}
								</span>
							</div>

							<div class="rounded-2xl bg-[#EFECE6]/50 p-6">
								<div class="relative flex items-start justify-between">
									<div class="absolute top-5 left-0 h-0.5 w-full bg-[#D9D6CF]"></div>
									<div class="absolute top-5 left-0 h-0.5 bg-[#6B705C] transition-all duration-500" :style="{ width: `${ProgressPercent(StepsFor(Appointment))}%` }"></div>

									<div v-for="(Step, Index) in StepsFor(Appointment)" :key="`${Appointment.id}-${Index}`" class="relative z-10 flex flex-1 flex-col items-center gap-2">
										<div
											:class="[
												`flex h-10 w-10 items-center justify-center rounded-full border-2`,
												Step.completed ? `bg-[#6B705C] border-[#6B705C]` : Step.current ? `bg-[#F7F5F0] border-[#6B705C]` : `bg-[#F7F5F0] border-[#D9D6CF]`,
											]"
										>
											<span v-if="Step.completed" class="material-symbols-outlined text-xl text-white">check</span>
											<span v-else :class="[`h-3 w-3 rounded-full`, Step.current ? `bg-[#6B705C]` : `bg-[#D9D6CF]`]"></span>
										</div>

										<span :class="[`text-xs text-center font-medium`, Step.completed || Step.current ? `text-[#2F2E2A]` : `text-[#6B705C]`]">
											{{ Step.name }}
										</span>

										<span
											v-if="Step.isFinalStep && Step.isPickupHint"
											class="rounded-full border border-[#6B705C]/30 bg-[#6B705C]/10 px-2 py-0.5 text-[11px] font-medium text-[#2F2E2A]"
										>
											可安排取車
										</span>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-y-4 border-y border-[#E2DED6] py-6 sm:grid-cols-2 lg:grid-cols-3">
								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">calendar_today</span>
									<div>
										<p class="text-[12px] font-bold text-[#6B705C]">日期</p>
										<p class="text-sm font-medium text-[#2F2E2A]">{{ Appointment.appointmentDate }}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">schedule</span>
									<div>
										<p class="text-[12px] font-bold text-[#6B705C]">時間</p>
										<p class="text-sm font-medium text-[#2F2E2A]">{{ Appointment.appointmentTime }}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">store</span>
									<div class="min-w-0">
										<p class="text-[12px] font-bold text-[#6B705C]">店家</p>
										<p class="truncate text-sm font-medium text-[#2F2E2A]">{{ Appointment.shopName }}</p>
										<p class="truncate text-sm text-[#2F2E2A]">{{ Appointment.shopAddress }}</p>
									</div>
								</div>
							</div>

							<!-- ✅ 操作列：新增「報價」 -->
							<div class="mt-6 flex flex-wrap justify-end gap-3">
								<button
									type="button"
									@click="OpenQuoteModal(Appointment)"
									class="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2DED6] bg-[#F7F5F0] px-5 py-2.5 text-sm font-medium text-[#2F2E2A] transition-colors duration-200 hover:bg-[#EFECE6]"
								>
									<span class="material-symbols-outlined text-xl text-[#6B705C]">receipt_long</span>
									報價
								</button>

								<button
									type="button"
									@click="OpenDetailModal(Appointment)"
									class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B705C] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#57574A]"
								>
									<span class="material-symbols-outlined text-xl">info</span>
									查看詳情
								</button>
							</div>
						</div>
					</div>
				</div>

				<div v-if="CompletedAppointments.length > 0">
					<h2 class="mb-6 text-xl font-bold text-[#2F2E2A]">歷史訂單</h2>

					<div class="grid grid-cols-1 gap-6">
						<div
							v-for="Appointment in CompletedAppointments"
							:key="Appointment.id"
							class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-7 transition-shadow duration-200 hover:shadow-md"
						>
							<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex items-center gap-3">
										<h3 class="text-lg font-bold text-[#2F2E2A]">{{ Appointment.carModel }}</h3>
										<span class="text-sm font-medium text-[#6B705C]">{{ Appointment.licensePlate }}</span>
									</div>
									<p class="text-sm text-[#6B705C]">維修項目：{{ Appointment.serviceType }}</p>
								</div>
								<span class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold" :class="StatusConfig(Appointment.status).color">
									{{ StatusConfig(Appointment.status).label }}
								</span>
							</div>

							<div class="rounded-2xl bg-[#EFECE6]/50 p-6">
								<div class="relative flex items-start justify-between">
									<div class="absolute top-5 left-0 h-0.5 w-full bg-[#D9D6CF]"></div>
									<div class="absolute top-5 left-0 h-0.5 bg-[#6B705C] transition-all duration-500" :style="{ width: `${ProgressPercent(StepsFor(Appointment))}%` }"></div>

									<div v-for="(Step, Index) in StepsFor(Appointment)" :key="`${Appointment.id}-${Index}`" class="relative z-10 flex flex-1 flex-col items-center gap-2">
										<div
											:class="[
												`flex h-10 w-10 items-center justify-center rounded-full border-2`,
												Step.completed ? `bg-[#6B705C] border-[#6B705C]` : Step.current ? `bg-[#F7F5F0] border-[#6B705C]` : `bg-[#F7F5F0] border-[#D9D6CF]`,
											]"
										>
											<span v-if="Step.completed" class="material-symbols-outlined text-xl text-white">check</span>
											<span v-else :class="[`h-3 w-3 rounded-full`, Step.current ? `bg-[#6B705C]` : `bg-[#D9D6CF]`]"></span>
										</div>

										<span :class="[`text-xs text-center font-medium`, Step.completed || Step.current ? `text-[#2F2E2A]` : `text-[#6B705C]`]">
											{{ Step.name }}
										</span>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-y-4 border-y border-[#E2DED6] py-6 sm:grid-cols-2 lg:grid-cols-3">
								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">calendar_today</span>
									<div>
										<p class="text-[12px] font-bold text-[#6B705C]">日期</p>
										<p class="text-sm font-medium text-[#2F2E2A]">{{ Appointment.appointmentDate }}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">schedule</span>
									<div>
										<p class="text-[12px] font-bold text-[#6B705C]">時間</p>
										<p class="text-sm font-medium text-[#2F2E2A]">{{ Appointment.appointmentTime }}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">store</span>
									<div class="min-w-0">
										<p class="text-[12px] font-bold text-[#6B705C]">店家</p>
										<p class="truncate text-sm font-medium text-[#2F2E2A]">{{ Appointment.shopName }}</p>
										<p class="truncate text-sm text-[#2F2E2A]">{{ Appointment.shopAddress }}</p>
									</div>
								</div>
							</div>

							<div class="mt-6 flex flex-wrap justify-end gap-3">
								<button
									type="button"
									@click="OpenQuoteModal(Appointment)"
									class="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2DED6] bg-[#F7F5F0] px-5 py-2.5 text-sm font-medium text-[#2F2E2A] transition-colors duration-200 hover:bg-[#EFECE6]"
								>
									<span class="material-symbols-outlined text-xl text-[#6B705C]">receipt_long</span>
									報價
								</button>

								<button
									type="button"
									@click="OpenDetailModal(Appointment)"
									class="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2DED6] bg-[#F7F5F0] px-5 py-2.5 text-sm font-medium text-[#2F2E2A] transition-colors duration-200 hover:bg-[#EFECE6]"
								>
									<span class="material-symbols-outlined text-xl text-[#6B705C]">info</span>
									查看詳情
								</button>
							</div>
						</div>
					</div>
				</div>

				<div v-if="FilteredAppointments.length === 0" class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-10 text-center">
					<p class="text-sm font-medium text-[#6B705C]">目前沒有符合條件的預約紀錄。</p>
				</div>
			</div>
		</main>

		<!-- 詳情彈窗 -->
		<teleport to="body">
			<div v-if="IsDetailModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="預約詳情">
				<button type="button" class="absolute inset-0 bg-black/40" @click="CloseDetailModal"></button>

				<div class="relative z-[61] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] shadow-xl">
					<div class="flex items-center justify-between gap-3 border-b border-[#E2DED6] px-6 py-4">
						<h3 class="text-lg font-bold text-[#2F2E2A]">預約詳情</h3>
						<button
							type="button"
							@click="CloseDetailModal"
							class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2DED6] bg-[#F7F5F0] text-[#2F2E2A] transition-colors duration-200 hover:bg-[#EFECE6]"
							aria-label="關閉"
						>
							<span class="material-symbols-outlined text-xl">close</span>
						</button>
					</div>

					<div class="max-h-[78vh] overflow-y-auto px-6 py-6">
						<div v-if="SelectedAppointment">
							<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex items-center gap-3">
										<h4 class="text-lg font-bold text-[#2F2E2A]">{{ SelectedAppointment.carModel }}</h4>
										<span class="text-sm font-medium text-[#6B705C]">{{ SelectedAppointment.licensePlate }}</span>
									</div>
									<p class="text-sm text-[#6B705C]">維修項目：{{ SelectedAppointment.serviceType }}</p>
								</div>
								<span class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold" :class="StatusConfig(SelectedAppointment.status).color">
									{{ StatusConfig(SelectedAppointment.status).label }}
								</span>
							</div>

							<div class="mb-6 rounded-2xl bg-[#EFECE6]/50 p-6">
								<div class="relative flex items-start justify-between">
									<div class="absolute top-5 left-0 h-0.5 w-full bg-[#D9D6CF]"></div>
									<div class="absolute top-5 left-0 h-0.5 bg-[#6B705C] transition-all duration-500" :style="{ width: `${ProgressPercent(StepsFor(SelectedAppointment))}%` }"></div>

									<div v-for="(Step, Index) in StepsFor(SelectedAppointment)" :key="`${SelectedAppointment.id}-${Index}`" class="relative z-10 flex flex-1 flex-col items-center gap-2">
										<div
											:class="[
												`flex h-10 w-10 items-center justify-center rounded-full border-2`,
												Step.completed ? `bg-[#6B705C] border-[#6B705C]` : Step.current ? `bg-[#F7F5F0] border-[#6B705C]` : `bg-[#F7F5F0] border-[#D9D6CF]`,
											]"
										>
											<span v-if="Step.completed" class="material-symbols-outlined text-xl text-white">check</span>
											<span v-else :class="[`h-3 w-3 rounded-full`, Step.current ? `bg-[#6B705C]` : `bg-[#D9D6CF]`]"></span>
										</div>

										<span :class="[`text-xs text-center font-medium`, Step.completed || Step.current ? `text-[#2F2E2A]` : `text-[#6B705C]`]">
											{{ Step.name }}
										</span>

										<span
											v-if="Step.isFinalStep && Step.isPickupHint"
											class="rounded-full border border-[#6B705C]/30 bg-[#6B705C]/10 px-2 py-0.5 text-[11px] font-medium text-[#2F2E2A]"
										>
											可安排取車
										</span>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-y-4 border-y border-[#E2DED6] py-6 sm:grid-cols-2 lg:grid-cols-3">
								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">calendar_today</span>
									<div>
										<p class="text-[12px] font-bold text-[#6B705C]">日期</p>
										<p class="text-sm font-medium text-[#2F2E2A]">{{ SelectedAppointment.appointmentDate }}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">schedule</span>
									<div>
										<p class="text-[12px] font-bold text-[#6B705C]">時間</p>
										<p class="text-sm font-medium text-[#2F2E2A]">{{ SelectedAppointment.appointmentTime }}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">store</span>
									<div class="min-w-0">
										<p class="text-[12px] font-bold text-[#6B705C]">店家</p>
										<p class="truncate text-sm font-medium text-[#2F2E2A]">{{ SelectedAppointment.shopName }}</p>
										<p class="truncate text-sm text-[#2F2E2A]">{{ SelectedAppointment.shopAddress }}</p>
									</div>
								</div>
							</div>

							<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
								<!-- ✅ 店家聯絡資訊：店長 + 電話(含手機) -->
								<div class="rounded-2xl bg-[#EFECE6]/60 p-6">
									<h5 class="mb-4 text-base font-bold text-[#2F2E2A]">店家聯絡資訊</h5>
									<p class="text-sm font-medium text-[#2F2E2A]">{{ SelectedAppointment.shopManagerName }}</p>
									<p class="text-sm text-[#6B705C]">{{ SelectedAppointment.shopTel }}</p>
									<p class="text-sm text-[#6B705C]">{{ SelectedAppointment.shopMobile }}</p>
								</div>

								<div class="rounded-2xl bg-[#EFECE6]/60 p-6">
									<h5 class="mb-4 text-base font-bold text-[#2F2E2A]">備註</h5>
									<p class="text-sm text-[#2F2E2A]">{{ SelectedAppointment.notes }}</p>
								</div>
							</div>

							<div v-if="SelectedAppointment.additionalServices && SelectedAppointment.additionalServices.length > 0" class="mt-6 rounded-2xl bg-[#EFECE6]/60 p-6">
								<h5 class="mb-4 text-base font-bold text-[#2F2E2A]">加購項目</h5>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="(Service, Index) in SelectedAppointment.additionalServices"
										:key="`${SelectedAppointment.id}-service-${Index}`"
										class="rounded-full border border-[#E2DED6] bg-[#F7F5F0] px-3 py-1 text-sm text-[#2F2E2A]"
									>
										{{ Service }}
									</span>
								</div>
							</div>
						</div>

						<div v-else class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-7">
							<p class="text-sm text-[#6B705C]">查無詳情，請關閉後重新選擇。</p>
						</div>
					</div>

					<div class="flex justify-end gap-3 border-t border-[#E2DED6] bg-[#F7F5F0] px-6 py-4">
						<button
							type="button"
							@click="CloseDetailModal"
							class="inline-flex items-center justify-center rounded-xl border border-[#E2DED6] bg-[#F7F5F0] px-5 py-2.5 text-sm font-medium text-[#2F2E2A] transition-colors duration-200 hover:bg-[#EFECE6]"
						>
							關閉
						</button>
					</div>
				</div>
			</div>
		</teleport>

		<!-- ✅ 報價彈窗（純切版） -->
		<teleport to="body">
			<div v-if="IsQuoteModalOpen" class="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="報價">
				<button type="button" class="absolute inset-0 bg-black/40" @click="CloseQuoteModal"></button>

				<div class="relative z-[71] w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] shadow-xl">
					<div class="flex items-center justify-between gap-3 border-b border-[#E2DED6] px-6 py-4">
						<h3 class="text-lg font-bold text-[#2F2E2A]">報價</h3>
						<button
							type="button"
							@click="CloseQuoteModal"
							class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2DED6] bg-[#F7F5F0] text-[#2F2E2A] transition-colors duration-200 hover:bg-[#EFECE6]"
							aria-label="關閉"
						>
							<span class="material-symbols-outlined text-xl">close</span>
						</button>
					</div>

					<div class="max-h-[70vh] overflow-y-auto px-6 py-6">
						<div v-if="SelectedQuoteAppointment">
							<div class="mb-5">
								<p class="text-base font-bold text-[#2F2E2A]">
									{{ SelectedQuoteAppointment.carModel }}
									<span class="ml-2 text-sm font-medium text-[#6B705C]">{{ SelectedQuoteAppointment.licensePlate }}</span>
								</p>
								<p class="mt-1 text-sm text-[#6B705C]">維修項目：{{ SelectedQuoteAppointment.serviceType }}</p>
							</div>

							<div class="rounded-2xl bg-[#EFECE6]/60 p-5">
								<p class="mb-4 text-sm font-bold text-[#2F2E2A]">項目明細</p>

								<div class="space-y-3">
									<div v-for="(Item, Index) in (SelectedQuoteAppointment.quoteItems ?? [])" :key="`${SelectedQuoteAppointment.id}-q-${Index}`" class="flex items-center justify-between">
										<p class="text-sm text-[#2F2E2A]">{{ Item.name }}</p>
										<p class="text-sm font-medium text-[#2F2E2A]">{{ FormatCurrency(Item.price) }}</p>
									</div>
								</div>

								<div class="mt-5 border-t border-[#E2DED6] pt-4 flex items-center justify-between">
									<p class="text-sm font-bold text-[#2F2E2A]">合計</p>
									<p class="text-base font-bold text-[#2F2E2A]">{{ FormatCurrency(QuoteTotal) }}</p>
								</div>

								<p class="mt-3 text-[12px] text-[#6B705C]">※ 此為展示用假資料（純切版）</p>
							</div>
						</div>

						<div v-else class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-7">
							<p class="text-sm text-[#6B705C]">查無報價內容，請關閉後重新選擇。</p>
						</div>
					</div>

					<div class="flex justify-end gap-3 border-t border-[#E2DED6] bg-[#F7F5F0] px-6 py-4">
						<button
							type="button"
							@click="CloseQuoteModal"
							class="inline-flex items-center justify-center rounded-xl border border-[#E2DED6] bg-[#F7F5F0] px-5 py-2.5 text-sm font-medium text-[#2F2E2A] transition-colors duration-200 hover:bg-[#EFECE6]"
						>
							關閉
						</button>
					</div>
				</div>
			</div>
		</teleport>
	</div>
</template>
