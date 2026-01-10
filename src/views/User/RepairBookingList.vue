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
	hasRated?: boolean;
};

const Tabs = [
	{ label: `全部`, value: `all` as const },
	{ label: `維修中`, value: `in_progress` as const },
	{ label: `已完成`, value: `completed` as const },
];

const ActiveFilter = ref<FilterType>(`all`);
const SearchQuery = ref<string>(``);
const ActiveModal = ref<`none` | `detail` | `rating`>(`none`);
const SelectedAppointment = ref<Appointment | null>(null);
const RatingScore = ref<number>(0);
const HoverScore = ref<number>(0);
const RatingComment = ref<string>(``);
const SelectedTags = ref<string[]>([]);
const ShopTags = [`技術專業`, `解說詳細`, `報價公道`, `服務親切`, `效率極高`, `原廠品質`];

const StatusMap: Record<AppointmentStatus, { label: string; color: string }> = {
	in_progress: { label: `維修中`, color: `text-[#2F2E2A] border-[#2F2E2A] bg-[#F7F5F0]` },
	completed: { label: `已取車`, color: `text-[#6B705C] border-[#E2DED6] bg-[#EFECE6]` },
};

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
		hasRated: false,
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
	let List = Appointments.value;

	if (ActiveFilter.value !== `all`) {
		List = List.filter((Apt) => Apt.status === ActiveFilter.value);
	}

	const Query = SearchQuery.value.trim().toLowerCase();
	if (Query) {
		List = List.filter((Apt) => 
			Apt.carModel.toLowerCase().includes(Query) || 
			Apt.licensePlate.toLowerCase().includes(Query) || 
			Apt.shopName.toLowerCase().includes(Query) ||
			Apt.serviceType.toLowerCase().includes(Query)
		);
	}
	
	return [
		{ title: `進行中`, data: List.filter(Apt => Apt.status === `in_progress`) },
		{ title: `歷史訂單`, data: List.filter(Apt => Apt.status === `completed`) }
	].filter(Group => Group.data.length > 0);
});

const QuoteGroups = computed(() => {
	const Apt = SelectedAppointment.value;
	if (!Apt) return { base: [], addon: [] };
	const Items = Apt.quoteItems ?? [];
	return {
		base: Items.filter((I) => !I.isAddon),
		addon: Items.filter((I) => I.isAddon)
	};
});

const QuoteTotal = computed(() => {
	const Apt = SelectedAppointment.value;
	if (!Apt) return 0;
	return (Apt.quoteItems ?? []).reduce((Sum, Item) => (typeof Item.price === `number` ? Sum + Item.price : Sum), 0);
});

const BuildProgressSteps = (Apt: Appointment): ProgressStep[] => {
	const IsCompleted = Apt.status === `completed`;
	const IsReady = Boolean(Apt.isReadyForPickup);
	if (IsCompleted) return [
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

const GetProgressWidth = (Steps: ProgressStep[]) => {
	const CompletedCount = Steps.filter((S) => S.completed).length;
	return `${Math.max(0, Math.min(1, CompletedCount / (Steps.length - 1))) * 100}%`;
};

const OpenDetailModal = (Apt: Appointment) => {
	SelectedAppointment.value = Apt;
	ActiveModal.value = `detail`;
};

const OpenRatingModal = (Apt: Appointment) => {
	SelectedAppointment.value = Apt;
	RatingScore.value = 0;
	RatingComment.value = ``;
	SelectedTags.value = [];
	ActiveModal.value = `rating`;
};

const CloseModal = () => {
	ActiveModal.value = `none`;
	SelectedAppointment.value = null;
};

const ToggleTag = (Tag: string) => {
	const Index = SelectedTags.value.indexOf(Tag);
	if (Index > -1) SelectedTags.value.splice(Index, 1);
	else SelectedTags.value.push(Tag);
};

const SubmitRating = () => {
	console.log(`提交評價按鈕被點擊(切版)`);
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
			<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex flex-wrap gap-3">
					<button v-for="Tab in Tabs" :key="Tab.value" @click="ActiveFilter = Tab.value" :class="[`inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-medium transition-colors duration-200`, ActiveFilter === Tab.value ? `border-[#6B6B5C] bg-[#6B6B5C] text-white` : `border-[#E2DED6] bg-[#F7F5F0] text-[#2F2E2A] hover:border-[#6B6B5C] hover:text-[#6B6B5C]`]">
						{{ Tab.label }}
					</button>
				</div>
				<div class="relative w-full sm:w-72">
					<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B705C] select-none">search</span>
					<input 
						v-model="SearchQuery" 
						type="text" 
						placeholder="搜尋車型、車牌或店家..." 
						class="w-full rounded-xl border border-[#E2DED6] bg-[#F7F5F0] py-3 pl-10 pr-4 text-sm text-[#2F2E2A] placeholder-[#6B705C] transition-colors focus:border-[#6B6B5C] focus:outline-none"
					/>
				</div>
			</div>
			<div v-if="FilteredGroups.length > 0" class="space-y-10">
				<section v-for="Group in FilteredGroups" :key="Group.title">
					<h2 class="mb-6 text-xl font-bold">{{ Group.title }}</h2>
					<div class="grid grid-cols-1 gap-6">
						<div v-for="Apt in Group.data" :key="Apt.id" class="rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-7 transition-shadow hover:shadow-md">
							<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
								<div class="min-w-0 flex-1">
									<div class="mb-2 flex items-center gap-3">
										<h3 class="text-lg font-bold">{{ Apt.carModel }}</h3>
										<span class="text-sm font-medium text-[#6B705C]">{{ Apt.licensePlate }}</span>
									</div>
									<p class="text-sm text-[#6B705C]">維修項目：{{ Apt.serviceType }}</p>
								</div>
								<span :class="[`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold self-start`, StatusMap[Apt.status].color]">
									{{ StatusMap[Apt.status].label }}
								</span>
							</div>
							<div class="mb-6 rounded-2xl bg-[#EFECE6]/50 p-6">
								<div class="relative flex items-start justify-between">
									<div class="absolute top-5 left-0 h-0.5 w-full bg-[#D9D6CF]"></div>
									<div class="absolute top-5 left-0 h-0.5 bg-[#6B705C] transition-all duration-500" :style="{ width: GetProgressWidth(BuildProgressSteps(Apt)) }"></div>
									<div v-for="(Step, Idx) in BuildProgressSteps(Apt)" :key="Idx" class="relative z-10 flex flex-1 flex-col items-center gap-2">
										<div :class="[`flex h-10 w-10 items-center justify-center rounded-full border-2`, Step.completed ? `bg-[#6B705C] border-[#6B705C]` : Step.current ? `bg-[#F7F5F0] border-[#6B6B5C]` : `bg-[#F7F5F0] border-[#D9D6CF]`]">
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
							<div class="mt-6 flex flex-wrap justify-end gap-3">
								<button v-if="Apt.status === 'completed' && !Apt.hasRated" @click="OpenRatingModal(Apt)" class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B705C] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#57574A]">
									<span class="material-symbols-outlined text-xl">star</span>給予評價
								</button>
								<button @click="OpenDetailModal(Apt)" :class="[`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium border transition-colors duration-200`, Apt.status === 'in_progress' ? 'bg-[#6B705C] text-white border-none hover:bg-[#57574A]' : 'bg-[#F7F5F0] text-[#2F2E2A] border-[#E2DED6] hover:bg-[#EFECE6]']">
									<span class="material-symbols-outlined text-xl" :class="Apt.status === 'in_progress' ? 'text-white' : 'text-[#6B705C]'">info</span>查看詳情
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
		<teleport to="body">
			<div v-if="ActiveModal === 'detail' && SelectedAppointment" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
				<div class="absolute inset-0 bg-black/40" @click="CloseModal"></div>
				<div class="relative z-[61] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] shadow-xl">
					<div class="flex items-center justify-between border-b border-[#E2DED6] px-6 py-4">
						<h3 class="text-lg font-bold text-[#2F2E2A]">預約詳情</h3>
						<button @click="CloseModal" class="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2DED6] transition-colors hover:bg-[#EFECE6]"><span class="material-symbols-outlined">close</span></button>
					</div>
					<div class="max-h-[78vh] overflow-y-auto px-6 py-6">
						<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
							<div class="min-w-0 flex-1">
								<div class="mb-2 flex items-center gap-3">
									<h4 class="text-lg font-bold">{{ SelectedAppointment.carModel }}</h4>
									<span class="text-sm font-medium text-[#6B705C]">{{ SelectedAppointment.licensePlate }}</span>
								</div>
								<p class="text-sm text-[#6B705C]">維修項目：{{ SelectedAppointment.serviceType }}</p>
							</div>
							<span :class="[`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold self-start`, StatusMap[SelectedAppointment.status].color]">{{ StatusMap[SelectedAppointment.status].label }}</span>
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
						<div class="rounded-2xl bg-[#EFECE6]/60 p-6 text-[#2F2E2A]">
							<div class="mb-4 flex items-center justify-between">
								<h5 class="text-base font-bold">報價明細</h5>
								<div class="text-sm font-bold">合計：{{ FormatCurrency(QuoteTotal) }}</div>
							</div>
							<div v-for="Grp in [{t:`基本維修`, d:QuoteGroups.base}, {t:`加購項目`, d:QuoteGroups.addon}]" :key="Grp.t" class="mb-6">
								<p class="mb-3 text-[12px] font-bold text-[#6B705C]">{{ Grp.t }}</p>
								<div v-if="Grp.d.length > 0" class="space-y-3">
									<div v-for="(Item, Idx) in Grp.d" :key="Idx" class="flex justify-between text-sm py-1">
										<span>{{ Item.name }}</span>
										<span class="font-medium">{{ Item.price ? FormatCurrency(Item.price) : `待報價` }}</span>
									</div>
								</div>
							</div>
							<p class="mt-4 text-[12px] text-[#6B705C]">※ 此為展示用假資料（純切版）</p>
						</div>
					</div>
					<div class="flex justify-end border-t border-[#E2DED6] bg-[#F7F5F0] px-6 py-4">
						<button @click="CloseModal" class="rounded-xl border border-[#E2DED6] px-8 py-2.5 text-sm font-medium transition-colors hover:bg-[#EFECE6]">關閉</button>
					</div>
				</div>
			</div>
		</teleport>
		<teleport to="body">
			<div v-if="ActiveModal === 'rating' && SelectedAppointment" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
				<div class="absolute inset-0 bg-black/40" @click="CloseModal"></div>
				<div class="relative z-[71] w-full max-w-xl rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] shadow-2xl">
					<div class="flex items-center justify-between border-b border-[#E2DED6] px-6 py-4">
						<h3 class="text-lg font-bold text-[#2F2E2A]">給予評價</h3>
						<button @click="CloseModal" class="text-[#6B705C] hover:text-[#2F2E2A]"><span class="material-symbols-outlined">close</span></button>
					</div>
					<div class="max-h-[80vh] overflow-y-auto px-8 py-8">
						<div class="mb-8 flex items-center gap-4">
							<div class="flex h-14 w-14 items-center justify-center rounded-full bg-[#6B705C] text-white">
								<span class="material-symbols-outlined text-3xl">store</span>
							</div>
							<div>
								<h4 class="font-bold text-[#2F2E2A]">{{ SelectedAppointment.shopName }}</h4>
								<p class="text-xs text-[#6B705C]">{{ SelectedAppointment.serviceType }}</p>
							</div>
						</div>
						<div class="mb-10 text-center">
							<p class="mb-4 text-sm font-bold text-[#2F2E2A]">您對本次維修服務滿意嗎？</p>
							<div class="flex justify-center gap-2">
								<button v-for="i in 5" :key="i" @click="RatingScore = i" @mouseenter="HoverScore = i" @mouseleave="HoverScore = 0" class="transition-transform active:scale-90">
									<span :class="[`material-symbols-outlined text-4xl transition-colors`, (HoverScore || RatingScore) >= i ? `text-[#6B705C]` : `text-[#D9D6CF]`]" :style="`font-variation-settings: 'FILL' ${ (HoverScore || RatingScore) >= i ? 1 : 0 }` ">star</span>
								</button>
							</div>
							<p v-if="RatingScore > 0" class="mt-3 text-xs font-bold text-[#6B705C]">{{ [`請評分`, `非常不滿意`, `需要改進`, `服務一般`, `滿意推薦`, `完美體驗！`][RatingScore] }}</p>
						</div>
						<div class="mb-8">
							<p class="mb-4 text-sm font-bold text-[#2F2E2A]">選擇店家印象標籤</p>
							<div class="flex flex-wrap gap-2">
								<button v-for="Tag in ShopTags" :key="Tag" @click="ToggleTag(Tag)" :class="[`rounded-full border px-4 py-1.5 text-xs font-medium transition-all`, SelectedTags.includes(Tag) ? `border-[#6B705C] bg-[#6B705C] text-white` : `border-[#E2DED6] bg-white text-[#6B705C] hover:border-[#6B6B5C]`]">
									{{ Tag }}
								</button>
							</div>
						</div>
						<div class="mb-8">
							<p class="mb-3 text-sm font-bold text-[#2F2E2A]">詳細評論內容</p>
							<textarea v-model="RatingComment" placeholder="分享您的維修心得與感受..." class="h-32 w-full resize-none rounded-xl border border-[#E2DED6] bg-white p-4 text-sm focus:border-[#6B705C] focus:outline-none"></textarea>
						</div>
						<div>
							<p class="mb-3 text-sm font-bold text-[#2F2E2A]">上傳照片 (選填)</p>
							<div class="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D9D6CF] text-[#6B705C] hover:bg-[#EFECE6]">
								<span class="material-symbols-outlined text-2xl">add_a_photo</span>
								<span class="text-[10px] mt-1">點擊上傳</span>
							</div>
						</div>
					</div>
					<div class="flex gap-3 border-t border-[#E2DED6] bg-[#F7F5F0] px-8 py-5">
						<button @click="CloseModal" class="flex-1 rounded-xl border border-[#E2DED6] py-3 text-sm font-medium hover:bg-[#EFECE6]">暫時不評</button>
						<button @click="SubmitRating" class="flex-1 rounded-xl bg-[#6B705C] py-3 text-sm font-medium text-white hover:bg-[#57574A] cursor-default">提交評價</button>
					</div>
				</div>
			</div>
		</teleport>
	</div>
</template>