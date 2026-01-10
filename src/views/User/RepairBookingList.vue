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
	price?: number | null;
	isAddon?: boolean;
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
	shopManagerName: string;
	shopTel: string;
	shopMobile: string;
	notes: string;
	additionalServices?: string[];
	isReadyForPickup?: boolean;
	quoteItems?: QuoteItem[];
};

const Tabs = [
	{ label: `全部`, value: `all` as const },
	{ label: `維修中`, value: `in_progress` as const },
	{ label: `已完成`, value: `completed` as const },
];

const ActiveFilter = ref<FilterType>(`all`);
const ActiveModal = ref<`none` | `detail`>(`none`);
const SelectedAppointment = ref<Appointment | null>(null);

const StatusMap: Record<AppointmentStatus, { label: string; color: string }> = {
	in_progress: { label: `維修中`, color: `text-[#2F2E2A] border-[#2F2E2A] bg-[#F7F5F0]` },
	completed: { label: `已取車`, color: `text-[#6B705C] border-[#E2DED6] bg-[#EFECE6]` },
};
// 後端處理，這段假資料直接略過review
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
			{ name: `機油更換`, price: 1200, isAddon: false },
			{ name: `機油濾芯`, price: 350, isAddon: false },
			{ name: `工資`, price: 800, isAddon: false },
			{ name: `輪胎定位`, price: 600, isAddon: true },
			{ name: `雨刷更換`, price: null, isAddon: true },
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
			{ name: `煞車油更換`, price: 900, isAddon: false },
			{ name: `煞車皮（前）`, price: 2600, isAddon: false },
			{ name: `工資`, price: 1200, isAddon: false },
			{ name: `冷氣濾網更換`, price: 450, isAddon: true },
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
			{ name: `輪胎（四條）`, price: 16800, isAddon: false },
			{ name: `四輪定位`, price: 1200, isAddon: false },
			{ name: `工資`, price: 800, isAddon: false },
			{ name: `氮氣充填`, price: null, isAddon: true },
		],
	},
];

const Appointments = ref<Appointment[]>([...MockAppointments]);

const FilteredGroups = computed(() => {
	const List = ActiveFilter.value === `all` 
		? Appointments.value 
		: Appointments.value.filter((Apt) => Apt.status === ActiveFilter.value);
	
	return [
		{ title: `進行中`, data: List.filter(Apt => Apt.status === `in_progress`) },
		{ title: `歷史訂單`, data: List.filter(Apt => Apt.status === `completed`) }
	].filter(Group => Group.data.length > 0);
});

const QuoteGroups = computed(() => {
	const Apt = SelectedAppointment.value;
	if (!Apt) return { base: [] as QuoteItem[], addon: [] as QuoteItem[] };

	const Items = Apt.quoteItems ?? [];
	const Base = Items.filter((I) => !I.isAddon);
	let Addon = Items.filter((I) => I.isAddon);

	const AddonNames = new Set(Addon.map((I) => I.name));
	const ExtraAddons = (Apt.additionalServices ?? [])
		.filter((Name) => !AddonNames.has(Name))
		.map<QuoteItem>((Name) => ({ name: Name, price: null, isAddon: true }));

	return { base: Base, addon: [...Addon, ...ExtraAddons] };
});

const QuoteTotal = computed(() => {
	const Apt = SelectedAppointment.value;
	if (!Apt) return 0;
	return (Apt.quoteItems ?? []).reduce((Sum, Item) => (typeof Item.price === `number` ? Sum + Item.price : Sum), 0);
});

const BuildProgressSteps = (Apt: Appointment): ProgressStep[] => {
	const IsPickedUp = Apt.status === `completed`;
	const IsReady = Boolean(Apt.isReadyForPickup);

	if (IsPickedUp) return [
		{ name: `接收車輛`, completed: true, current: false },
		{ name: `維修中`, completed: true, current: false },
		{ name: `已取車`, completed: true, current: false, isFinalStep: true },
	];

	return [
		{ name: `接收車輛`, completed: true, current: false },
		{ name: `維修中`, completed: IsReady, current: !IsReady },
		{ name: IsReady ? `完工待取車` : `待完工`, completed: false, current: IsReady, isFinalStep: true, isPickupHint: IsReady },
	];
};

const ProgressPercent = (Steps: ProgressStep[]) => {
	const CompletedCount = Steps.filter((S) => S.completed).length;
	return `${Math.max(0, Math.min(1, CompletedCount / (Steps.length - 1))) * 100}%`;
};

const OpenDetailModal = (Apt: Appointment) => {
	SelectedAppointment.value = Apt;
	ActiveModal.value = `detail`;
};

const CloseModal = () => {
	ActiveModal.value = `none`;
	SelectedAppointment.value = null;
};

const FormatCurrency = (Val: number) => new Intl.NumberFormat(`zh-TW`, { style: `currency`, currency: `TWD`, maximumFractionDigits: 0 }).format(Val);

const HandleKeydown = (E: KeyboardEvent) => {
	if (E.key === `Escape` && ActiveModal.value !== `none`) CloseModal();
};

onMounted(() => window.addEventListener(`keydown`, HandleKeydown));
onBeforeUnmount(() => window.removeEventListener(`keydown`, HandleKeydown));
</script>

<template>
	<div class="min-h-screen bg-[#EBE8E3] text-[#2F2E2A]">
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
							ActiveFilter === Tab.value ? `border-[#6B6B5C] bg-[#6B6B5C] text-white` : `border-[#E2DED6] bg-[#F7F5F0] text-[#2F2E2A] hover:border-[#6B6B5C] hover:text-[#6B6B5C]`
						]"
					>
						{{ Tab.label }}
					</button>
				</div>
			</div>
			<div v-if="FilteredGroups.length > 0" class="space-y-10">
				<section v-for="Group in FilteredGroups" :key="Group.title">
					<h2 class="mb-6 text-xl font-bold text-[#2F2E2A]">{{ Group.title }}</h2>
					<div class="grid grid-cols-1 gap-6">
						<div v-for="Apt in Group.data" :key="Apt.id" class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-7 transition-shadow duration-200 hover:shadow-md">
							<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex items-center gap-3">
										<h3 class="text-lg font-bold text-[#2F2E2A]">{{ Apt.carModel }}</h3>
										<span class="text-sm font-medium text-[#6B705C]">{{ Apt.licensePlate }}</span>
									</div>
									<p class="text-sm text-[#6B705C]">維修項目：{{ Apt.serviceType }}</p>
								</div>
								<span :class="[`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold`, StatusMap[Apt.status].color]">
									{{ StatusMap[Apt.status].label }}
								</span>
							</div>
							<div class="mb-6 rounded-2xl bg-[#EFECE6]/50 p-6">
								<div class="relative flex items-start justify-between">
									<div class="absolute top-5 left-0 h-0.5 w-full bg-[#D9D6CF]"></div>
									<div class="absolute top-5 left-0 h-0.5 bg-[#6B705C] transition-all duration-500" :style="{ width: ProgressPercent(BuildProgressSteps(Apt)) }"></div>
									<div v-for="(Step, Idx) in BuildProgressSteps(Apt)" :key="Idx" class="relative z-10 flex flex-1 flex-col items-center gap-2">
										<div :class="[`flex h-10 w-10 items-center justify-center rounded-full border-2`, Step.completed ? `bg-[#6B705C] border-[#6B705C]` : Step.current ? `bg-[#F7F5F0] border-[#6B705C]` : `bg-[#F7F5F0] border-[#D9D6CF]`]">
											<span v-if="Step.completed" class="material-symbols-outlined text-xl text-white">check</span>
											<span v-else :class="[`h-3 w-3 rounded-full`, Step.current ? `bg-[#6B705C]` : `bg-[#D9D6CF]`]"></span>
										</div>
										<span :class="[`text-xs text-center font-medium`, Step.completed || Step.current ? `text-[#2F2E2A]` : `text-[#6B705C]`]">{{ Step.name }}</span>
										<span v-if="Step.isPickupHint" class="rounded-full border border-[#6B705C]/30 bg-[#6B705C]/10 px-2 py-0.5 text-[11px] font-medium text-[#2F2E2A]">可安排取車</span>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-1 gap-y-4 border-y border-[#E2DED6] py-6 sm:grid-cols-2 lg:grid-cols-3">
								<div v-for="Info in [{icon:`calendar_today`, label:`日期`, val: Apt.appointmentDate}, {icon:`schedule`, label:`時間`, val: Apt.appointmentTime}, {icon:`store`, label:`店家`, val: Apt.shopName, sub: Apt.shopAddress}]" :key="Info.label" class="flex items-start gap-3">
									<span class="material-symbols-outlined text-xl text-[#6B705C]">{{ Info.icon }}</span>
									<div class="min-w-0">
										<p class="text-[12px] font-bold text-[#6B705C]">{{ Info.label }}</p>
										<p class="truncate text-sm font-medium text-[#2F2E2A]">{{ Info.val }}</p>
										<p v-if="Info.sub" class="truncate text-sm text-[#2F2E2A]">{{ Info.sub }}</p>
									</div>
								</div>
							</div>
							<div class="mt-6 flex justify-end">
								<button type="button" @click="OpenDetailModal(Apt)" :class="[`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors duration-200`, Apt.status === `in_progress` ? `bg-[#6B705C] text-white hover:bg-[#57574A]` : `border border-[#E2DED6] bg-[#F7F5F0] text-[#2F2E2A] hover:bg-[#EFECE6]`]">
									<span class="material-symbols-outlined text-xl" :class="Apt.status === `in_progress` ? `text-white` : `text-[#6B705C]`">info</span>查看詳情
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>
			<div v-else class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-10 text-center text-sm font-medium text-[#6B705C]">
				目前沒有符合條件的預約紀錄。
			</div>
		</main>
    <!--後端處理跳轉頁面，這整段teleport直接略過review，以畫面效果檢查為主-->>
		<teleport to="body">
			<div v-if="ActiveModal === 'detail' && SelectedAppointment" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
				<button type="button" class="absolute inset-0 bg-black/40" @click="CloseModal"></button>
				<div class="relative z-[61] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] shadow-xl">
					<div class="flex items-center justify-between border-b border-[#E2DED6] px-6 py-4">
						<h3 class="text-lg font-bold text-[#2F2E2A]">預約詳情</h3>
						<button @click="CloseModal" class="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2DED6] hover:bg-[#EFECE6]"><span class="material-symbols-outlined">close</span></button>
					</div>
					<div class="max-h-[78vh] overflow-y-auto px-6 py-6">
						<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
							<div class="min-w-0 flex-1">
								<div class="mb-2 flex items-center gap-3">
									<h4 class="text-lg font-bold text-[#2F2E2A]">{{ SelectedAppointment.carModel }}</h4>
									<span class="text-sm font-medium text-[#6B705C]">{{ SelectedAppointment.licensePlate }}</span>
								</div>
								<p class="text-sm text-[#6B705C]">維修項目：{{ SelectedAppointment.serviceType }}</p>
							</div>
							<span :class="[`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold`, StatusMap[SelectedAppointment.status].color]">
								{{ StatusMap[SelectedAppointment.status].label }}
							</span>
						</div>
						<div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
						<div class="rounded-2xl bg-[#EFECE6]/60 p-6">
							<div class="mb-4 flex items-center justify-between">
								<h5 class="text-base font-bold text-[#2F2E2A]">報價明細</h5>
								<div class="text-sm font-bold text-[#2F2E2A]">合計：{{ FormatCurrency(QuoteTotal) }}</div>
							</div>
							<div v-for="Grp in [{t:`基本維修`, d:QuoteGroups.base}, {t:`加購項目`, d:QuoteGroups.addon}]" :key="Grp.t" class="mb-6">
								<p class="mb-3 text-[12px] font-bold text-[#6B705C]">{{ Grp.t }}</p>
								<div v-if="Grp.d.length > 0" class="space-y-3">
									<div v-for="(Item, Idx) in Grp.d" :key="Idx" class="flex justify-between text-sm">
										<span>{{ Item.name }}</span>
										<span class="font-medium">{{ Item.price ? FormatCurrency(Item.price) : `待報價` }}</span>
									</div>
								</div>
							</div>
							<p class="mt-4 text-[12px] text-[#6B705C]">※ 此為展示用假資料（純切版）</p>
						</div>
					</div>
					<div class="flex justify-end border-t border-[#E2DED6] bg-[#F7F5F0] px-6 py-4">
						<button @click="CloseModal" class="rounded-xl border border-[#E2DED6] px-8 py-2.5 text-sm font-medium hover:bg-[#EFECE6]">關閉</button>
					</div>
				</div>
			</div>
		</teleport>
	</div>
</template>