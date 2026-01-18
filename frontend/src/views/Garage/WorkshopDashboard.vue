<script setup lang="ts">
import { computed, ref, reactive } from 'vue';

type NavKey = 'dashboard' | 'appointments' | 'records' | 'settings';

type ApptStatus = 'pending' | 'confirmed' | 'servicing' | 'cancelled';

type Appointment = {
	id: string;
	customerName: string;
	phone: string;
	carModel: string;
	licensePlate: string;
	serviceType: string;
	date: string;
	time: string;
	status: ApptStatus;
	notes?: string;
	estimatedCost: number;
	quotationImage?: string;
};

type RecordItem = {
	id: string;
	customerName: string;
	carModel: string;
	licensePlate: string;
	date: string;
	items: Array<{ name: string; price: number; type: 'base' | 'addon' }>;
	total: number;
	tech: string;
	notes: string;
};

type ShopSettings = {
	name: string;
	ownerName: string;
	address: string;
	phone: string;
	taxId: string;
	description: string;
	coverImage: string;
	environmentImages: string[];
};

const activeNav = ref<NavKey>('dashboard');
const sidebarOpen = ref(false);

function toggleSidebar() {
	sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebar() {
	sidebarOpen.value = false;
}

function handleNavClick(key: NavKey) {
	activeNav.value = key;
	closeSidebar();
}

const shopSettings = reactive<ShopSettings>({
	name: '晴天自動車',
	ownerName: '店長 Admin',
	address: '台北市中山區職人路 100 號',
	phone: '02-1234-5678',
	taxId: '12345678',
	description: '我們專注於提供最優質的日系車維修服務，擁有超過 10 年的專業經驗。',
	coverImage: '',
	environmentImages: [],
});

function onCoverFileChange(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files && input.files[0]) {
		const file = input.files[0];
		shopSettings.coverImage = URL.createObjectURL(file);
	}
}

function onEnvFileChange(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files) {
		for (const file of input.files) {
			shopSettings.environmentImages.push(URL.createObjectURL(file));
		}
	}
}

function removeEnvImage(index: number) {
	shopSettings.environmentImages.splice(index, 1);
}

const appointments = ref<Appointment[]>([
	{
		id: 'APT-2026-001',
		customerName: '王貓貓',
		phone: '0912-345-678',
		carModel: 'Toyota Camry',
		licensePlate: 'ABC-1234',
		serviceType: '定期保養',
		date: '2026-01-18',
		time: '09:30',
		status: 'servicing',
		estimatedCost: 3500,
		notes: '自備機油',
	},
	{
		id: 'APT-2026-002',
		customerName: '李貓貓',
		phone: '0923-456-789',
		carModel: 'Honda CR-V',
		licensePlate: 'KLM-7788',
		serviceType: '煞車異音檢查',
		date: '2026-01-18',
		time: '10:30',
		status: 'confirmed',
		estimatedCost: 1200,
		notes: '右前輪有異音',
	},
	{
		id: 'APT-2026-003',
		customerName: '陳貓貓',
		phone: '0988-112-233',
		carModel: 'Tesla Model 3',
		licensePlate: 'EAA-9999',
		serviceType: '輪胎更換',
		date: '2026-01-18',
		time: '14:00',
		status: 'pending',
		estimatedCost: 18000,
	},
	{
		id: 'APT-2026-004',
		customerName: '林貓貓',
		phone: '0955-666-777',
		carModel: 'Mini Cooper',
		licensePlate: 'MIN-5678',
		serviceType: '冷氣健檢',
		date: '2026-01-19',
		time: '11:00',
		status: 'pending',
		estimatedCost: 800,
	},
]);

const records = ref<RecordItem[]>([
	{
		id: 'REC-2025-888',
		customerName: '張貓貓',
		carModel: 'Mazda 3',
		licensePlate: 'QWE-5566',
		date: '2025-12-20',
		tech: '阿哲',
		items: [
			{ name: '四輪定位', price: 2000, type: 'base' },
			{ name: '雨刷更換', price: 800, type: 'addon' },
		],
		total: 2800,
		notes: '建議下次更換電瓶',
	},
	{
		id: 'REC-2025-887',
		customerName: '王貓貓',
		carModel: 'Toyota Camry',
		licensePlate: 'ABC-1234',
		date: '2025-11-15',
		tech: '小安',
		items: [
			{ name: '小保養套餐', price: 3000, type: 'base' },
		],
		total: 3000,
		notes: '',
	},
]);

const dashboardStats = computed(() => {
	const today = '2026-01-18'; 
	const todayAppts = appointments.value.filter(a => a.date === today);
	const pending = appointments.value.filter(a => a.status === 'pending');
	const servicing = appointments.value.filter(a => a.status === 'servicing');
	
	return {
		todayCount: todayAppts.length,
		pendingCount: pending.length,
		servicingCount: servicing.length,
	};
});

const apptFilterStatuses = ref<Set<ApptStatus>>(new Set(['pending', 'confirmed', 'servicing']));
const apptSearch = ref('');

const statusOptions: { value: ApptStatus; label: string }[] = [
	{ value: 'pending', label: '待確認' },
	{ value: 'confirmed', label: '已排程' },
	{ value: 'servicing', label: '作業中' },
	{ value: 'cancelled', label: '已取消' },
];

function toggleStatusFilter(status: ApptStatus) {
	if (apptFilterStatuses.value.has(status)) {
		apptFilterStatuses.value.delete(status);
	} else {
		apptFilterStatuses.value.add(status);
	}
	apptFilterStatuses.value = new Set(apptFilterStatuses.value);
}

const filteredAppointments = computed(() => {
	let list = appointments.value;

	if (apptFilterStatuses.value.size > 0) {
		list = list.filter(a => apptFilterStatuses.value.has(a.status));
	}

	const q = apptSearch.value.trim().toLowerCase();
	if (q) {
		list = list.filter(a =>
			a.customerName.toLowerCase().includes(q) ||
			a.licensePlate.toLowerCase().includes(q) ||
			a.phone.includes(q)
		);
	}

	return list.sort((a, b) => {
		return new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime();
	});
});

const recordSearch = ref('');
const filteredRecords = computed(() => {
	const q = recordSearch.value.trim().toLowerCase();
	if (!q) return records.value;
	return records.value.filter(r => 
		r.customerName.toLowerCase().includes(q) || 
		r.licensePlate.toLowerCase().includes(q)
	);
});

function formatCurrency(n: number) {
	return `NT$${n.toLocaleString('zh-Hant-TW')}`;
}

function getStatusLabel(s: ApptStatus) {
	const map: Record<ApptStatus, string> = {
		pending: '待確認',
		confirmed: '已排程',
		servicing: '作業中',
		cancelled: '已取消',
	};
	return map[s];
}

function getStatusClass(s: ApptStatus) {
	switch (s) {
		case 'pending': return 'bg-[#E8DCC2] text-[#8C7B5D]';
		case 'confirmed': return 'bg-[#D6DCD9] text-[#5C6B66]';
		case 'servicing': return 'bg-[#C2CCB8] text-[#5A6650]';
		case 'cancelled': return 'bg-[#E8C2C2] text-[#8C5D5D]';
		default: return '';
	}
}

const pageHeader = computed(() => {
	switch (activeNav.value) {
		case 'dashboard': return { title: '總覽', sub: '今日維修廠營運概況' };
		case 'appointments': return { title: '預約排程', sub: '管理客戶預約與維修進度' };
		case 'records': return { title: '完工維修記錄', sub: '查詢過往維修履歷與工單細節' };
		case 'settings': return { title: '編輯維修廠', sub: '維護維修廠的基本資料與簡介' };
		default: return { title: '', sub: '' };
	}
});

const showEditModal = ref(false);
const editingForm = reactive<{
	id: string;
	customerName: string;
	carModel: string;
	serviceType: string;
	status: ApptStatus;
	notes: string;
	estimatedCost: number;
	quotationImage: string;
}>({
	id: '',
	customerName: '',
	carModel: '',
	serviceType: '',
	status: 'pending',
	notes: '',
	estimatedCost: 0,
	quotationImage: '',
});

function openEditModal(apt: Appointment) {
	editingForm.id = apt.id;
	editingForm.customerName = apt.customerName;
	editingForm.carModel = apt.carModel;
	editingForm.serviceType = apt.serviceType;
	editingForm.status = apt.status;
	editingForm.notes = apt.notes || '';
	editingForm.estimatedCost = apt.estimatedCost;
	editingForm.quotationImage = apt.quotationImage || '';
	showEditModal.value = true;
}

function closeEditModal() {
	showEditModal.value = false;
}

function saveEdit() {
	const index = appointments.value.findIndex(a => a.id === editingForm.id);
	if (index !== -1) {
		const apt = appointments.value[index]!;
		apt.status = editingForm.status;
		apt.notes = editingForm.notes;
		apt.estimatedCost = editingForm.estimatedCost;
		apt.quotationImage = editingForm.quotationImage;
	}
	closeEditModal();
}

const showRemoveConfirm = ref(false);

function confirmRemove() {
	showRemoveConfirm.value = true;
}

function cancelRemove() {
	showRemoveConfirm.value = false;
}

function removeAppointment() {
	const index = appointments.value.findIndex(a => a.id === editingForm.id);
	if (index !== -1) {
		appointments.value.splice(index, 1);
	}
	showRemoveConfirm.value = false;
	closeEditModal();
}

function onQuotationImageChange(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files && input.files[0]) {
		const file = input.files[0];
		editingForm.quotationImage = URL.createObjectURL(file);
	}
}

function removeQuotationImage() {
	editingForm.quotationImage = '';
}

const showCompleteConfirm = ref(false);
const pendingCompleteApt = ref<Appointment | null>(null);

function openCompleteConfirm(apt: Appointment) {
	pendingCompleteApt.value = apt;
	showCompleteConfirm.value = true;
}

function cancelComplete() {
	showCompleteConfirm.value = false;
	pendingCompleteApt.value = null;
}

function confirmComplete() {
	if (!pendingCompleteApt.value) return;

	const apt = pendingCompleteApt.value;

	const newRecord: RecordItem = {
		id: `REC-${apt.id.replace('APT-', '')}`,
		customerName: apt.customerName,
		carModel: apt.carModel,
		licensePlate: apt.licensePlate,
		date: apt.date,
		items: [{ name: apt.serviceType, price: apt.estimatedCost, type: 'base' }],
		total: apt.estimatedCost,
		tech: '技師',
		notes: apt.notes || '',
	};
	records.value.unshift(newRecord);

	const index = appointments.value.findIndex(a => a.id === apt.id);
	if (index !== -1) {
		appointments.value.splice(index, 1);
	}

	showCompleteConfirm.value = false;
	pendingCompleteApt.value = null;
}

const navGroupMain: NavKey[] = ['dashboard', 'appointments', 'records', 'settings'];
</script>

<template>
	<div class="min-h-screen bg-[#EBE8E3] font-sans text-stone-600">
		<div class="flex h-screen overflow-hidden">
		<div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" @click="closeSidebar"></div>
		<aside
			class="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col border-r border-[#DCD9D3] bg-[#EBE8E3] transition-transform duration-300 lg:static lg:translate-x-0"
			:class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
		>
				<div class="p-8">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded bg-[#6B6B5C] text-[#EBE8E3] shadow-sm">
								<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
								</svg>
							</div>
							<h1 class="text-xl font-bold tracking-wider text-[#4A4A45]">晴天自動車</h1>
						</div>
						<button @click="closeSidebar" class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-[#DEDbd6] hover:text-stone-600 lg:hidden">
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="18" y1="6" x2="6" y2="18"/>
								<line x1="6" y1="6" x2="18" y2="18"/>
							</svg>
						</button>
					</div>
				</div>
				<nav class="flex-1 px-4 space-y-2 overflow-y-auto">
					<button
						v-for="key in navGroupMain"
						:key="key"
						@click="handleNavClick(key)"
						class="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left transition-all duration-300"
						:class="activeNav === key
							? 'bg-[#6B6B5C] text-[#EBE8E3] shadow-md shadow-[#6B6B5C]/20'
							: 'text-stone-500 hover:bg-[#DEDbd6] hover:text-[#4A4A45]'"
					>
						<svg v-if="key === 'dashboard'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
						<svg v-if="key === 'appointments'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M10 14h4"/></svg>
						<svg v-if="key === 'records'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
						<svg v-if="key === 'settings'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
						<span class="font-medium tracking-wide">
							{{ key === 'dashboard' ? '總覽' : key === 'appointments' ? '預約排程' : key === 'records' ? '完工維修記錄' : '編輯維修廠' }}
						</span>
					</button>
				</nav>
				<div class="p-6">
					<div class="rounded-lg bg-[#DEDbd6]/50 p-4 border border-[#DCD9D3]">
						<div class="text-xs text-stone-500">目前登入</div>
						<div class="font-bold text-[#4A4A45] tracking-wide">陳大貓</div>
					</div>
				</div>
			</aside>
			<main class="flex-1 overflow-y-auto">
				<div class="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
					<header class="mb-10">
						<div class="flex items-center gap-4">
							<button @click="toggleSidebar" class="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCD9D3] bg-white text-stone-600 shadow-sm transition hover:bg-[#F8F7F5] lg:hidden">
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<line x1="3" y1="6" x2="21" y2="6"/>
									<line x1="3" y1="12" x2="21" y2="12"/>
									<line x1="3" y1="18" x2="21" y2="18"/>
								</svg>
							</button>
							<div>
								<h2 class="text-2xl font-bold text-[#4A4A45] tracking-wide sm:text-3xl">{{ pageHeader.title }}</h2>
								<p class="mt-1 text-sm text-stone-500 font-medium sm:mt-2 sm:text-base">{{ pageHeader.sub }}</p>
							</div>
						</div>
					</header>
					<div v-if="activeNav === 'dashboard'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
						<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
							<div class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm hover:shadow-md transition duration-300">
								<div class="flex items-start justify-between">
									<div>
										<p class="text-sm font-medium text-stone-400">今日預約數</p>
										<p class="mt-2 text-3xl font-bold text-[#4A4A45]">{{ dashboardStats.todayCount }}</p>
									</div>
									<div class="rounded-full bg-[#D6DCD9] p-2 text-[#5C6B66]">
										<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
									</div>
								</div>
							</div>
							<div class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm hover:shadow-md transition duration-300">
								<div class="flex items-start justify-between">
									<div>
										<p class="text-sm font-medium text-stone-400">待確認訂單</p>
										<p class="mt-2 text-3xl font-bold text-[#4A4A45]">{{ dashboardStats.pendingCount }}</p>
									</div>
									<div class="rounded-full bg-[#E8DCC2] p-2 text-[#8C7B5D]">
										<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
									</div>
								</div>
							</div>
							<div class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm hover:shadow-md transition duration-300">
								<div class="flex items-start justify-between">
									<div>
										<p class="text-sm font-medium text-stone-400">正在作業中</p>
										<p class="mt-2 text-3xl font-bold text-[#4A4A45]">{{ dashboardStats.servicingCount }}</p>
									</div>
									<div class="rounded-full bg-[#C2CCB8] p-2 text-[#5A6650]">
										<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
									</div>
								</div>
							</div>
						</div>
						<div class="rounded-xl border border-[#DCD9D3] bg-white p-8 shadow-sm">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-lg font-bold text-[#4A4A45]">今日需關注</h3>
								<button @click="activeNav = 'appointments'" class="text-sm font-medium text-[#6B6B5C] hover:text-[#5a5a4d] hover:underline">查看全部 &rarr;</button>
							</div>
							<div class="space-y-4">
								<div v-for="apt in appointments.slice(0, 3)" :key="apt.id" class="flex items-center gap-4 rounded-lg bg-[#F8F7F5] p-4 border border-[#F0EEE9]">
									<div class="w-16 text-center">
										<div class="text-xs font-bold text-stone-400">{{ apt.time }}</div>
									</div>
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<span class="font-bold text-[#4A4A45]">{{ apt.customerName }}</span>
											<span class="text-xs text-stone-400">{{ apt.carModel }}</span>
										</div>
										<div class="text-sm text-stone-500">{{ apt.serviceType }}</div>
									</div>
									<div>
										<span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium" :class="getStatusClass(apt.status)">
											{{ getStatusLabel(apt.status) }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-else-if="activeNav === 'appointments'" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
						<div class="rounded-xl border border-[#DCD9D3] bg-white p-5 shadow-sm">
							<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div class="relative w-full max-w-sm">
									<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
									<input
										v-model="apptSearch"
										type="text"
										placeholder="搜尋姓名、車牌、手機號碼..."
										class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] py-2.5 pl-10 pr-4 text-sm text-[#4A4A45] outline-none transition focus:border-[#6B6B5C] focus:bg-white focus:ring-1 focus:ring-[#6B6B5C]"
									>
								</div>
							</div>
							<div class="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F0EEE9] pt-4">
								<span class="mr-2 text-sm font-medium text-stone-500">篩選狀態：</span>
								<label
									v-for="opt in statusOptions"
									:key="opt.value"
									class="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all"
									:class="apptFilterStatuses.has(opt.value)
										? 'border-[#6B6B5C] bg-[#6B6B5C] text-white'
										: 'border-[#DCD9D3] bg-white text-stone-500 hover:border-[#6B6B5C] hover:text-[#4A4A45]'"
								>
									<input
										type="checkbox"
										:checked="apptFilterStatuses.has(opt.value)"
										@change="toggleStatusFilter(opt.value)"
										class="sr-only"
									>
									<svg v-if="apptFilterStatuses.has(opt.value)" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
									<span :class="apptFilterStatuses.has(opt.value) ? 'font-medium' : ''">{{ opt.label }}</span>
								</label>
							</div>
						</div>
						<div class="space-y-4">
							<div 
								v-for="apt in filteredAppointments" 
								:key="apt.id"
								class="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center"
							>
								<div class="absolute left-0 top-0 bottom-0 w-1.5" :class="(getStatusClass(apt.status).split(' ')[0] || '')"></div>
								<div class="flex-1 pl-4">
									<div class="flex flex-wrap items-center gap-3">
										<span class="font-mono text-xs text-stone-400">{{ apt.id }}</span>
										<span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" :class="getStatusClass(apt.status)">
											{{ getStatusLabel(apt.status) }}
										</span>
									</div>
									<div class="mt-2 flex items-baseline gap-3">
										<h3 class="text-lg font-bold text-[#4A4A45]">{{ apt.customerName }}</h3>
										<span class="text-sm text-stone-500">{{ apt.carModel }} <span class="text-stone-300">|</span> {{ apt.licensePlate }}</span>
									</div>
									<div class="mt-1 text-sm text-stone-500">{{ apt.serviceType }} <span v-if="apt.notes" class="ml-2 text-[#8C7B5D]">★ {{ apt.notes }}</span></div>
								</div>
								<div class="flex flex-col gap-1 pl-4 lg:w-48 lg:border-l lg:border-[#F0EEE9] lg:pl-6">
									<div class="flex items-center gap-2 text-sm text-stone-600">
										<svg class="h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
										{{ apt.date }}
									</div>
									<div class="flex items-center gap-2 text-sm text-stone-600">
										<svg class="h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
										{{ apt.time }}
									</div>
								</div>
								<div class="flex items-center justify-end pl-4 lg:w-32 lg:pl-0">
									<div class="text-right">
										<div class="text-xs text-stone-400">預估費用</div>
										<div class="font-bold text-[#4A4A45]">{{ formatCurrency(apt.estimatedCost) }}</div>
									</div>
								</div>
								<div class="mt-4 flex w-full gap-2 border-t border-[#F0EEE9] pt-4 lg:mt-0 lg:w-auto lg:flex-col lg:border-0 lg:pt-0">
									<button @click="openCompleteConfirm(apt)" class="flex-1 rounded bg-[#6B6B5C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#5a5a4d] lg:w-28">完成訂單</button>
									<button @click="openEditModal(apt)" class="flex-1 rounded border border-[#DCD9D3] bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-[#F8F7F5] lg:w-28">編輯</button>
								</div>
							</div>
							<div v-if="filteredAppointments.length === 0" class="rounded-xl border border-dashed border-stone-300 p-12 text-center">
								<p class="text-stone-400">沒有符合條件的預約</p>
							</div>
						</div>
					</div>
					<div v-else-if="activeNav === 'records'" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
						<div class="rounded-xl border border-[#DCD9D3] bg-white p-5 shadow-sm">
							<div class="relative max-w-md">
								<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
								<input 
									v-model="recordSearch"
									type="text" 
									placeholder="輸入車主姓名或車牌查詢歷史紀錄..." 
									class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] py-2.5 pl-10 pr-4 text-sm text-[#4A4A45] outline-none transition focus:border-[#6B6B5C] focus:bg-white focus:ring-1 focus:ring-[#6B6B5C]"
								>
							</div>
						</div>
						<div class="grid grid-cols-1 gap-6">
							<div v-for="rec in filteredRecords" :key="rec.id" class="rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm">
								<div class="flex flex-col justify-between gap-4 border-b border-[#F0EEE9] pb-4 md:flex-row md:items-center">
									<div>
										<div class="flex items-center gap-3">
											<h3 class="text-lg font-bold text-[#4A4A45]">{{ rec.customerName }}</h3>
											<span class="rounded bg-[#F0EEE9] px-2 py-0.5 text-xs text-stone-500">{{ rec.licensePlate }}</span>
										</div>
										<p class="text-sm text-stone-400">{{ rec.carModel }}</p>
									</div>
									<div class="text-right">
										<p class="text-sm text-stone-400">{{ rec.date }}</p>
										<p class="text-xs text-stone-400">技師: {{ rec.tech }}</p>
									</div>
								</div>
								<div class="mt-4 space-y-2">
									<div v-for="(item, idx) in rec.items" :key="idx" class="flex justify-between text-sm">
										<span class="text-stone-600">{{ item.name }} <span v-if="item.type === 'addon'" class="ml-1 text-[10px] text-[#8C7B5D] border border-[#8C7B5D] px-1 rounded">加購</span></span>
										<span class="font-medium text-[#4A4A45]">{{ formatCurrency(item.price) }}</span>
									</div>
								</div>
								<div class="mt-4 flex items-center justify-between border-t border-[#F0EEE9] pt-4">
									<p class="text-sm text-stone-400 italic">{{ rec.notes || '無備註' }}</p>
									<p class="text-lg font-bold text-[#4A4A45]">總計: {{ formatCurrency(rec.total) }}</p>
								</div>
							</div>
						</div>
					</div>
					<div v-else-if="activeNav === 'settings'" class="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
						<div class="rounded-xl border border-[#DCD9D3] bg-white p-8 shadow-sm">
							<div class="space-y-6">
								<h3 class="text-base font-bold text-[#4A4A45]">維修廠照片</h3>
								<div>
									<label class="mb-3 block text-sm font-medium text-stone-500">封面照片 <span class="text-xs text-stone-400 font-normal">(建議尺寸 1200x600)</span></label>
									<div class="relative h-64 w-full overflow-hidden rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] transition-colors hover:border-[#6B6B5C]">
										<input type="file" accept="image/*" class="absolute inset-0 z-10 cursor-pointer opacity-0" @change="onCoverFileChange">
										<div v-if="!shopSettings.coverImage" class="flex h-full flex-col items-center justify-center text-stone-400">
											<svg class="mb-3 h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
											<span class="font-medium">點擊上傳封面照片</span>
											<span class="mt-1 text-xs text-stone-400">支援 JPG, PNG, WebP</span>
										</div>
										<div v-else class="relative h-full w-full">
											<img :src="shopSettings.coverImage" class="h-full w-full object-cover" alt="Shop Cover" />
											<div class="absolute bottom-4 right-4 z-20">
												<span class="rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-stone-600 shadow-sm backdrop-blur transition hover:bg-white">更換照片</span>
											</div>
										</div>
									</div>
								</div>
								<div>
									<label class="mb-3 block text-sm font-medium text-stone-500">環境照片 <span class="text-xs text-stone-400 font-normal">(展示工位、休息區等)</span></label>
									<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
										<div v-for="(img, idx) in shopSettings.environmentImages" :key="idx" class="group relative aspect-square overflow-hidden rounded-xl border border-[#DCD9D3]">
											<img :src="img" class="h-full w-full object-cover" alt="Environment" />
											<button
												@click="removeEnvImage(idx)"
												class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-stone-500 shadow-sm opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
											>
												<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
											</button>
										</div>
										<div class="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] text-stone-400 transition-colors hover:border-[#6B6B5C] hover:text-[#6B6B5C]">
											<input type="file" accept="image/*" multiple class="absolute inset-0 cursor-pointer opacity-0" @change="onEnvFileChange">
											<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
											<span class="mt-2 text-xs font-medium">新增照片</span>
										</div>
									</div>
								</div>
							</div>
							<div class="my-8 border-t border-[#F0EEE9]"></div>
							<div class="space-y-6">
								<h3 class="text-base font-bold text-[#4A4A45]">基本資料</h3>
								<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
									<div class="space-y-2">
										<label class="text-sm font-medium text-stone-500">維修廠名稱</label>
										<input v-model="shopSettings.name" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="例如：晴天自動車">
									</div>
									<div class="space-y-2">
										<label class="text-sm font-medium text-stone-500">店長名稱</label>
										<input v-model="shopSettings.ownerName" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="請輸入店長名稱">
									</div>
									<div class="space-y-2">
										<label class="text-sm font-medium text-stone-500">統一編號</label>
										<input v-model="shopSettings.taxId" type="text" maxlength="8" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="8 位數統一編號">
									</div>
									<div class="space-y-2">
										<label class="text-sm font-medium text-stone-500">聯絡電話</label>
										<input v-model="shopSettings.phone" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="02-1234-5678">
									</div>
									<div class="space-y-2">
										<label class="text-sm font-medium text-stone-500">維修廠地址</label>
										<input v-model="shopSettings.address" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="請輸入完整地址">
									</div>
									<div class="col-span-1 space-y-2 md:col-span-2">
										<label class="text-sm font-medium text-stone-500">維修廠簡介</label>
										<textarea
											v-model="shopSettings.description"
											rows="4"
											class="w-full resize-none rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
											placeholder="請簡單介紹您的維修廠，例如專修車種、服務特色等..."
										></textarea>
										<p class="text-right text-xs text-stone-400">{{ shopSettings.description.length }} / 200</p>
									</div>
								</div>
							</div>
							<div class="mt-8 flex justify-end border-t border-[#F0EEE9] pt-6">
								<button class="rounded-lg bg-[#6B6B5C] px-8 py-3 font-medium text-white shadow-lg shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] hover:shadow-xl active:scale-95">
									儲存變更
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
		<div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#FBFAF7] shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
				<div class="flex shrink-0 items-center justify-between border-b border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
					<h3 class="text-lg font-bold text-[#4A4A45]">編輯預約單</h3>
					<button @click="closeEditModal" class="rounded-full p-1 text-stone-400 hover:bg-black/5 hover:text-stone-600">
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
					</button>
				</div>
				<div class="flex-1 space-y-6 overflow-y-auto p-6">
					<div class="rounded-xl bg-[#F8F7F5] p-4 text-sm border border-[#E6E6DF]">
						<div class="grid grid-cols-2 gap-y-3">
							<div>
								<span class="block text-xs text-stone-400">預約編號</span>
								<span class="font-mono font-medium text-[#4A4A45]">{{ editingForm.id }}</span>
							</div>
							<div>
								<span class="block text-xs text-stone-400">客戶姓名</span>
								<span class="font-bold text-[#4A4A45]">{{ editingForm.customerName }}</span>
							</div>
							<div>
								<span class="block text-xs text-stone-400">車型</span>
								<span class="text-stone-600">{{ editingForm.carModel }}</span>
							</div>
							<div>
								<span class="block text-xs text-stone-400">維修項目</span>
								<span class="text-stone-600">{{ editingForm.serviceType }}</span>
							</div>
						</div>
					</div>
					<div class="space-y-4">
						<div class="space-y-2">
							<label class="text-sm font-bold text-[#4A4A45]">訂單狀態</label>
							<select v-model="editingForm.status" class="w-full rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
								<option value="pending">待確認 (Pending)</option>
								<option value="confirmed">已排程 (Confirmed)</option>
								<option value="servicing">作業中 (Servicing)</option>
								<option value="cancelled">已取消 (Cancelled)</option>
							</select>
						</div>
						<div class="space-y-2">
							<label class="text-sm font-bold text-[#4A4A45]">預估費用</label>
							<div class="relative">
								<span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">NT$</span>
								<input v-model.number="editingForm.estimatedCost" type="number" class="w-full rounded-lg border border-[#DCD9D3] bg-white py-2.5 pl-12 pr-4 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
							</div>
						</div>
						<div class="space-y-2">
							<label class="text-sm font-bold text-[#4A4A45]">備註事項</label>
							<textarea v-model="editingForm.notes" rows="3" class="w-full resize-none rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]" placeholder="輸入備註..."></textarea>
						</div>
						<div class="space-y-2">
							<label class="text-sm font-bold text-[#4A4A45]">報價單圖片</label>
							<div v-if="!editingForm.quotationImage" class="relative h-40 w-full overflow-hidden rounded-xl border-2 border-dashed border-[#DCD9D3] bg-[#F8F7F5] transition-colors hover:border-[#6B6B5C]">
								<input type="file" accept="image/*" class="absolute inset-0 z-10 cursor-pointer opacity-0" @change="onQuotationImageChange">
								<div class="flex h-full flex-col items-center justify-center text-stone-400">
									<svg class="mb-2 h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
									<span class="text-sm font-medium">點擊上傳報價單圖片</span>
									<span class="mt-1 text-xs text-stone-400">支援 JPG, PNG, WebP</span>
								</div>
							</div>
							<div v-else class="group relative overflow-hidden rounded-xl border border-[#DCD9D3]">
								<img :src="editingForm.quotationImage" class="w-full object-contain max-h-64" alt="報價單">
								<div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
									<label class="cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-sm transition hover:bg-[#F8F7F5]">
										<input type="file" accept="image/*" class="hidden" @change="onQuotationImageChange">
										更換圖片
									</label>
									<button @click="removeQuotationImage" class="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-red-600">
										移除圖片
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="flex shrink-0 items-center justify-between border-t border-[#E6E6DF] bg-[#F2F1EC] px-6 py-4">
					<button @click="confirmRemove" class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
						移除預約
					</button>
					<div class="flex items-center gap-3">
						<button @click="closeEditModal" class="rounded-lg border border-[#DCD9D3] bg-white px-5 py-2.5 text-sm font-medium text-stone-600 shadow-sm transition hover:bg-[#F8F7F5]">
							取消
						</button>
						<button @click="saveEdit" class="rounded-lg bg-[#6B6B5C] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] active:scale-95">
							儲存變更
						</button>
					</div>
				</div>
				<div v-if="showRemoveConfirm" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
					<div class="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
						</div>
						<h4 class="text-lg font-bold text-[#4A4A45]">確定移除此預約？</h4>
						<p class="mt-2 text-sm text-stone-500">此操作無法復原，預約資料將被永久刪除。</p>
						<div class="mt-6 flex gap-3">
							<button @click="cancelRemove" class="flex-1 rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-[#F8F7F5]">
								取消
							</button>
							<button @click="removeAppointment" class="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600">
								確定移除
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="showCompleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C2CCB8] text-[#5A6650]">
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
						<polyline points="22 4 12 14.01 9 11.01"/>
					</svg>
				</div>
				<h4 class="text-lg font-bold text-[#4A4A45]">確定完成此訂單？</h4>
				<p class="mt-2 text-sm text-stone-500">送出後將通知客戶可以取車，並將此訂單移至完工維修記錄。</p>
				<div v-if="pendingCompleteApt" class="mt-4 rounded-lg bg-[#F8F7F5] p-3 text-sm">
					<div class="flex justify-between">
						<span class="text-stone-500">客戶</span>
						<span class="font-medium text-[#4A4A45]">{{ pendingCompleteApt.customerName }}</span>
					</div>
					<div class="mt-1 flex justify-between">
						<span class="text-stone-500">車牌</span>
						<span class="font-medium text-[#4A4A45]">{{ pendingCompleteApt.licensePlate }}</span>
					</div>
				</div>
				<div class="mt-6 flex gap-3">
					<button @click="cancelComplete" class="flex-1 rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-[#F8F7F5]">
						取消
					</button>
					<button @click="confirmComplete" class="flex-1 rounded-lg bg-[#6B6B5C] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#5a5a4d]">
						確定送出
					</button>
				</div>
			</div>
		</div>
	</div>
</template>