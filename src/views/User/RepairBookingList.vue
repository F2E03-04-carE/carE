<script setup lang="ts">
import { computed, ref } from 'vue';

type AppointmentStatus = `in_progress` | `completed`;
type FilterType = `all` | AppointmentStatus;

type Appointment = {
	id: string;
	carModel: string;
	licensePlate: string;
	serviceType: string;
	appointmentDate: string;
	appointmentTime: string;
	status: AppointmentStatus;
	location: string;
	estimatedDuration: string;
	estimatedCost: string;
	customerName: string;
	customerPhone: string;
	additionalServices: string[];
	notes?: string;
	progressSteps?: {
		name: string;
		completed: boolean;
		current: boolean;
	}[];
};

const MockAppointments: Appointment[] = [
	{
		id: `1`,
		carModel: `Toyota Camry 2020`,
		licensePlate: `ABC-1234`,
		serviceType: `定期保養・機油更換・煞車系統檢查`,
		appointmentDate: `2026-01-10`,
		appointmentTime: `10:30`,
		status: `in_progress`,
		location: `台北市信義區忠孝東路五段 68 號`,
		estimatedDuration: `2 小時`,
		estimatedCost: `3,500`,
		customerName: `王小明`,
		customerPhone: `0912-345-678`,
		additionalServices: [`輪胎胎壓檢查`, `雨刷更換`],
		notes: `請檢查煞車有異音`,
		progressSteps: [
			{ name: `接收車輛`, completed: true, current: false },
			{ name: `檢測診斷`, completed: true, current: false },
			{ name: `維修中`, completed: false, current: true },
			{ name: `完工待取車`, completed: false, current: false },
		],
	},
	{
		id: `2`,
		carModel: `Honda CR-V 2019`,
		licensePlate: `XYZ-5678`,
		serviceType: `冷氣系統檢修・冷媒補充`,
		appointmentDate: `2026-01-09`,
		appointmentTime: `14:00`,
		status: `in_progress`,
		location: `新北市板橋區文化路一段 188 號`,
		estimatedDuration: `1.5 小時`,
		estimatedCost: `2,200`,
		customerName: `李美麗`,
		customerPhone: `0988-765-432`,
		additionalServices: [`冷氣濾網更換`],
		progressSteps: [
			{ name: `接收車輛`, completed: true, current: false },
			{ name: `檢測診斷`, completed: false, current: true },
			{ name: `維修中`, completed: false, current: false },
			{ name: `完工待取車`, completed: false, current: false },
		],
	},
	{
		id: `3`,
		carModel: `Tesla Model 3 2022`,
		licensePlate: `EV-8888`,
		serviceType: `輪胎更換・四輪定位`,
		appointmentDate: `2026-01-05`,
		appointmentTime: `09:00`,
		status: `completed`,
		location: `桃園市中壢區中華路二段 100 號`,
		estimatedDuration: `1 小時`,
		estimatedCost: `8,600`,
		customerName: `陳大華`,
		customerPhone: `0900-111-222`,
		additionalServices: [`輪胎氮氣填充`],
	},
	{
		id: `4`,
		carModel: `Mazda CX-5 2021`,
		licensePlate: `MAZ-9527`,
		serviceType: `引擎警示燈診斷・電腦檢測`,
		appointmentDate: `2026-01-03`,
		appointmentTime: `11:00`,
		status: `completed`,
		location: `台中市西屯區台灣大道三段 99 號`,
		estimatedDuration: `2.5 小時`,
		estimatedCost: `4,800`,
		customerName: `林小芳`,
		customerPhone: `0977-333-444`,
		additionalServices: [`火星塞檢查`, `電瓶健康檢測`],
	},
];

const Appointments = ref<Appointment[]>([...MockAppointments]);
const ActiveFilter = ref<FilterType>(`all`);
const SelectedAppointment = ref<Appointment | null>(null);
const DetailDialogOpen = ref(false);

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
			return { label: `已完成`, color: `text-[#6B6B5C] border-[#E2DED6] bg-[#EFECE6]` };
	}
};

const Tabs = [
	{ label: `全部訂單`, value: `all` as const },
	{ label: `維修中`, value: `in_progress` as const },
	{ label: `已完成`, value: `completed` as const },
];

const HandleViewDetail = (appointment: Appointment) => {
	SelectedAppointment.value = appointment;
	DetailDialogOpen.value = true;
};

const CloseDetail = () => {
	DetailDialogOpen.value = false;
	SelectedAppointment.value = null;
};
</script>

<template>
	<div class="min-h-screen bg-[#F4F1EC] text-[#2F2E2A]">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<header class="bg-[#F7F5F0] border-b border-[#E2DED6]">
			<div class="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
				<div>
					<h1 class="text-xl font-semibold">我的維修訂單</h1>
					<p class="mt-1 text-sm text-[#6B6B5C]">查看與管理你的汽車維修訂單</p>
				</div>
			</div>
		</header>
		<main class="container mx-auto max-w-6xl px-4 py-8">
			<div class="mb-7">
				<div class="flex flex-wrap gap-2">
					<button
						v-for="Tab in Tabs"
						:key="Tab.value"
						type="button"
						@click="ActiveFilter = Tab.value"
						:class="[
							`inline-flex items-center justify-center rounded-xl border border-[#E2DED6] px-5 py-2.5 text-sm font-medium transition-colors duration-200`,
							ActiveFilter === Tab.value ? `bg-[#2F2E2A] text-[#F7F5F0]` : `bg-[#F7F5F0] text-[#6B6B5C] hover:bg-[#EFECE6]`
						]"
					>
						{{ Tab.label }}
					</button>
				</div>
			</div>
			<div v-if="InProgressAppointments.length > 0" class="mb-8">
				<h2 class="mb-4 text-base font-semibold text-[#2F2E2A]">維修中</h2>
				<div class="grid grid-cols-1 gap-6">
					<div
						v-for="Appointment in InProgressAppointments"
						:key="Appointment.id"
						class="rounded-2xl border-2 border-[#2F2E2A] bg-[#F7F5F0] p-6"
					>
						<div class="flex flex-col gap-5">
							<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex items-center gap-2">
										<h3 class="text-base font-semibold text-[#2F2E2A]">{{ Appointment.carModel }}</h3>
										<span class="text-sm text-[#6B6B5C]">{{ Appointment.licensePlate }}</span>
									</div>
									<p class="text-sm text-[#6B6B5C]">{{ Appointment.serviceType }}</p>
								</div>
								<span class="shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium" :class="StatusConfig(Appointment.status).color">
									{{ StatusConfig(Appointment.status).label }}
								</span>
							</div>
							<div v-if="Appointment.progressSteps" class="rounded-xl bg-[#EFECE6] p-4">
								<div class="relative flex items-start justify-between gap-2">
									<div v-for="(Step, Index) in Appointment.progressSteps" :key="Index" class="flex flex-1 flex-col items-center gap-2">
										<div :class="[`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2`, Step.completed ? `border-[#2F2E2A] bg-[#2F2E2A]` : Step.current ? `border-[#2F2E2A] bg-[#F7F5F0]` : `border-[#D9D6CF] bg-[#F7F5F0]`]">
											<span v-if="Step.completed" class="material-symbols-outlined text-xl text-white">check</span>
											<span v-else :class="[`h-3 w-3 rounded-full`, Step.current ? `bg-[#2F2E2A]` : `bg-[#D9D6CF]`]"></span>
										</div>
										<span :class="[`text-xs text-center`, Step.completed || Step.current ? `font-medium text-[#2F2E2A]` : `text-[#6B6B5C]`]">{{ Step.name }}</span>
									</div>
									<div class="absolute left-0 right-0 top-5 flex">
										<div v-for="(Step, Index) in Appointment.progressSteps.slice(0, -1)" :key="Index" :class="[`h-0.5 flex-1 mx-5`, Step.completed ? `bg-[#2F2E2A]` : `bg-[#D9D6CF]`]"></div>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-3 border-y border-[#E2DED6] py-4">
								<div class="flex items-center gap-2 text-sm">
									<span class="material-symbols-outlined text-xl text-[#6B6B5C]">calendar_today</span>
									<div>
										<p class="text-xs text-[#6B6B5C]">日期</p>
										<p class="text-[#2F2E2A]">{{ Appointment.appointmentDate }}</p>
									</div>
								</div>
								<div class="flex items-center gap-2 text-sm">
									<span class="material-symbols-outlined text-xl text-[#6B6B5C]">schedule</span>
									<div>
										<p class="text-xs text-[#6B6B5C]">時間</p>
										<p class="text-[#2F2E2A]">{{ Appointment.appointmentTime }}</p>
									</div>
								</div>
								<div class="col-span-2 flex items-center gap-2 text-sm">
									<span class="material-symbols-outlined text-xl text-[#6B6B5C]">location_on</span>
									<div>
										<p class="text-xs text-[#6B6B5C]">地點</p>
										<p class="text-[#2F2E2A]">{{ Appointment.location }}</p>
									</div>
								</div>
							</div>
							<div class="flex justify-end">
								<button type="button" @click="HandleViewDetail(Appointment)" class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F2E2A] px-5 py-3 text-sm font-medium text-[#F7F5F0] transition-colors duration-200 hover:bg-[#1F1E1B]">
									<span class="material-symbols-outlined text-xl">info</span>
									查看詳情
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="CompletedAppointments.length > 0">
				<h2 class="mb-4 text-base font-semibold text-[#2F2E2A]">歷史訂單</h2>
				<div class="grid grid-cols-1 gap-6">
					<div v-for="Appointment in CompletedAppointments" :key="Appointment.id" class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-6 transition-colors duration-200 hover:bg-[#EFECE6]">
						<div class="flex flex-col gap-5">
							<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex items-center gap-2">
										<h3 class="text-base font-semibold text-[#2F2E2A]">{{ Appointment.carModel }}</h3>
										<span class="text-sm text-[#6B6B5C]">{{ Appointment.licensePlate }}</span>
									</div>
									<p class="text-sm text-[#6B6B5C]">{{ Appointment.serviceType }}</p>
								</div>
								<span class="shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium" :class="StatusConfig(Appointment.status).color">
									{{ StatusConfig(Appointment.status).label }}
								</span>
							</div>
							<div class="grid grid-cols-2 gap-3 border-y border-[#E2DED6] py-4">
								<div class="flex items-center gap-2 text-sm">
									<span class="material-symbols-outlined text-xl text-[#6B6B5C]">calendar_today</span>
									<div>
										<p class="text-xs text-[#6B6B5C]">日期</p>
										<p class="text-[#2F2E2A]">{{ Appointment.appointmentDate }}</p>
									</div>
								</div>
								<div class="flex items-center gap-2 text-sm">
									<span class="material-symbols-outlined text-xl text-[#6B6B5C]">schedule</span>
									<div>
										<p class="text-xs text-[#6B6B5C]">時間</p>
										<p class="text-[#2F2E2A]">{{ Appointment.appointmentTime }}</p>
									</div>
								</div>
								<div class="col-span-2 flex items-center gap-2 text-sm">
									<span class="material-symbols-outlined text-xl text-[#6B6B5C]">location_on</span>
									<div>
										<p class="text-xs text-[#6B6B5C]">地點</p>
										<p class="text-[#2F2E2A]">{{ Appointment.location }}</p>
									</div>
								</div>
							</div>
							<div class="flex justify-end">
								<button type="button" @click="HandleViewDetail(Appointment)" class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#EFECE6] px-5 py-3 text-sm font-medium text-[#2F2E2A] transition-colors duration-200 hover:bg-[#E2DED6]">
									<span class="material-symbols-outlined text-xl">info</span>
									查看詳情
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="FilteredAppointments.length === 0" class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-12 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFECE6] text-[#6B6B5C]">
					<span class="material-symbols-outlined text-3xl">event_busy</span>
				</div>
				<h2 class="mb-2 text-lg font-semibold text-[#2F2E2A]">沒有符合條件的訂單</h2>
				<p class="text-[#6B6B5C]">請切換篩選條件,或稍後再試。</p>
			</div>
		</main>
		<Teleport to="body">
			<div v-if="DetailDialogOpen && SelectedAppointment" class="fixed inset-0 z-50">
				<div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="CloseDetail"></div>
				<div class="absolute inset-0 flex items-center justify-center p-4">
					<div class="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] shadow-2xl">
						<div class="flex shrink-0 items-center justify-between gap-4 border-b border-[#E2DED6] px-6 py-4">
							<h3 class="text-lg font-semibold text-[#2F2E2A]">訂單詳情</h3>
							<div class="flex items-center gap-3">
								<span class="rounded-full border px-3 py-1.5 text-sm font-medium" :class="StatusConfig(SelectedAppointment.status).color">{{ StatusConfig(SelectedAppointment.status).label }}</span>
								<button type="button" @click="CloseDetail" class="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6B5C] transition-colors duration-200 hover:bg-[#E2DED6]">
									<span class="material-symbols-outlined text-xl">close</span>
								</button>
							</div>
						</div>
						<div class="overflow-y-auto px-6 py-4">
							<div class="space-y-4">
								<div class="rounded-xl border border-[#E2DED6] bg-white p-4">
									<h4 class="mb-3 text-sm font-semibold text-[#2F2E2A]">車輛資訊</h4>
									<div class="grid grid-cols-2 gap-3 text-sm">
										<div><p class="mb-1 text-xs text-[#6B6B5C]">車型</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.carModel }}</p></div>
										<div><p class="mb-1 text-xs text-[#6B6B5C]">車牌號碼</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.licensePlate }}</p></div>
									</div>
								</div>
								<div class="rounded-xl border border-[#E2DED6] bg-white p-4">
									<h4 class="mb-3 text-sm font-semibold text-[#2F2E2A]">預約資訊</h4>
									<div class="space-y-3 text-sm">
										<div class="flex items-center gap-3 rounded-lg bg-[#F4F1EC] p-3">
											<span class="material-symbols-outlined text-xl text-[#2F2E2A]">calendar_today</span>
											<div><p class="text-xs text-[#6B6B5C]">日期</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.appointmentDate }}</p></div>
										</div>
										<div class="flex items-center gap-3 rounded-lg bg-[#F4F1EC] p-3">
											<span class="material-symbols-outlined text-xl text-[#2F2E2A]">schedule</span>
											<div><p class="text-xs text-[#6B6B5C]">時間</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.appointmentTime }}</p></div>
										</div>
										<div class="flex items-start gap-3 rounded-lg bg-[#F4F1EC] p-3">
											<span class="material-symbols-outlined shrink-0 text-xl text-[#2F2E2A]">build</span>
											<div class="min-w-0"><p class="text-xs text-[#6B6B5C]">項目</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.serviceType }}</p></div>
										</div>
									</div>
								</div>
								<div class="rounded-xl border border-[#E2DED6] bg-white p-4">
									<h4 class="mb-3 text-sm font-semibold text-[#2F2E2A]">客戶資訊</h4>
									<div class="grid grid-cols-2 gap-3 text-sm">
										<div><p class="mb-1 text-xs text-[#6B6B5C]">姓名</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.customerName }}</p></div>
										<div><p class="mb-1 text-xs text-[#6B6B5C]">電話</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.customerPhone }}</p></div>
									</div>
								</div>
								<div class="rounded-xl border border-[#E2DED6] bg-white p-4">
									<h4 class="mb-3 text-sm font-semibold text-[#2F2E2A]">服務項目</h4>
									<p class="mb-3 text-sm text-[#2F2E2A]">{{ SelectedAppointment.serviceType }}</p>
									<div class="flex items-center justify-between rounded-lg bg-[#EFECE6] px-3 py-2 text-sm">
										<div class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-[#2F2E2A]">payments</span><span class="text-xs font-medium text-[#2F2E2A]">預估費用</span></div>
										<span class="font-semibold text-[#2F2E2A]">NT$ {{ SelectedAppointment.estimatedCost }}</span>
									</div>
									<div v-if="SelectedAppointment.additionalServices.length" class="mt-3 flex flex-wrap gap-2">
										<span v-for="(Service, Index) in SelectedAppointment.additionalServices" :key="Index" class="rounded-full border border-[#E2DED6] bg-[#F4F1EC] px-3 py-1 text-xs text-[#2F2E2A]">{{ Service }}</span>
									</div>
								</div>
								<div class="rounded-xl border border-[#E2DED6] bg-white p-4">
									<h4 class="mb-3 text-sm font-semibold text-[#2F2E2A]">門市資訊</h4>
									<div class="text-sm"><p class="mb-1 text-xs text-[#6B6B5C]">門市名稱</p><p class="font-medium text-[#2F2E2A]">{{ SelectedAppointment.location }}</p></div>
								</div>
								<div v-if="SelectedAppointment.notes" class="rounded-xl border border-[#E2DED6] bg-white p-4">
									<h4 class="mb-3 text-sm font-semibold text-[#2F2E2A]">備註</h4>
									<p class="text-sm text-[#2F2E2A]">{{ SelectedAppointment.notes }}</p>
								</div>
							</div>
						</div>
						<div class="flex shrink-0 justify-end gap-3 border-t border-[#E2DED6] px-6 py-4">
							<button type="button" @click="CloseDetail" class="rounded-lg bg-[#2F2E2A] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1F1E1B]">關閉</button>
						</div>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>