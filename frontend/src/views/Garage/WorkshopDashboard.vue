<script setup lang="ts">
import { computed, ref, reactive } from 'vue';

type NavKey = 'dashboard' | 'appointments' | 'records' | 'settings' | 'identity';

type ApptStatus = 'pending' | 'confirmed' | 'servicing' | 'completed' | 'cancelled';

type Appointment = {
	id: string;
	customerName: string;
	phone: string;
	carModel: string;
	licensePlate: string;
	serviceType: string;
	date: string;
	time: string;
	tech?: string;
	bay?: string;
	status: ApptStatus;
	notes?: string;
	estimatedCost: number;
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
	address: string;
	phone: string;
	bays: number;
};

type IdentityForm = {
	name: string;
	taxId: string;
};

const activeNav = ref<NavKey>('dashboard');

const shopSettings = reactive<ShopSettings>({
	name: '晴天自動車',
	address: '台北市中山區職人路 100 號',
	phone: '02-1234-5678',
	bays: 4,
});

const identityForm = reactive<IdentityForm>({
	name: shopSettings.name,
	taxId: '',
});

const appointments = ref<Appointment[]>([
	{
		id: 'APT-2026-001',
		customerName: '王小明',
		phone: '0912-345-678',
		carModel: 'Toyota Camry',
		licensePlate: 'ABC-1234',
		serviceType: '定期保養',
		date: '2026-01-18',
		time: '09:30',
		tech: '阿哲',
		bay: 'A1',
		status: 'servicing',
		estimatedCost: 3500,
		notes: '自備機油',
	},
	{
		id: 'APT-2026-002',
		customerName: '李大華',
		phone: '0923-456-789',
		carModel: 'Honda CR-V',
		licensePlate: 'KLM-7788',
		serviceType: '煞車異音檢查',
		date: '2026-01-18',
		time: '10:30',
		tech: '小安',
		bay: 'A2',
		status: 'confirmed',
		estimatedCost: 1200,
		notes: '右前輪有異音',
	},
	{
		id: 'APT-2026-003',
		customerName: '陳冠宇',
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
		customerName: '林雅婷',
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
		customerName: '張美玲',
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
		customerName: '王小明',
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

const apptFilterStatus = ref<ApptStatus | 'all'>('all');
const apptSearch = ref('');

const filteredAppointments = computed(() => {
	let list = appointments.value;
	
	if (apptFilterStatus.value !== 'all') {
		list = list.filter(a => a.status === apptFilterStatus.value);
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
		completed: '已完工',
		cancelled: '已取消',
	};
	return map[s];
}

function getStatusClass(s: ApptStatus) {
	switch (s) {
		case 'pending': return 'bg-[#E8DCC2] text-[#8C7B5D]';
		case 'confirmed': return 'bg-[#D6DCD9] text-[#5C6B66]';
		case 'servicing': return 'bg-[#C2CCB8] text-[#5A6650]';
		case 'completed': return 'bg-[#E5E2DD] text-[#9CA3AF]';
		case 'cancelled': return 'bg-[#E8C2C2] text-[#8C5D5D]';
		default: return '';
	}
}

function submitIdentity() {
	alert(`身份資訊已送出：\n店家名稱：${identityForm.name}\n店家統編：${identityForm.taxId}`);
}

const pageHeader = computed(() => {
	switch (activeNav.value) {
		case 'dashboard': return { title: '總覽', sub: '今日維修廠營運概況' };
		case 'appointments': return { title: '預約排程', sub: '管理客戶預約、指派技師與工位' };
		case 'records': return { title: '維修紀錄', sub: '查詢過往維修履歷與工單細節' };
		case 'settings': return { title: '店鋪設定', sub: '設定維修廠基本資訊與場地' };
		case 'identity': return { title: '登記身份', sub: '管理維修廠的登記與認證資訊' };
		default: return { title: '', sub: '' };
	}
});

const navGroupMain: NavKey[] = ['dashboard', 'appointments', 'records', 'settings'];
const navGroupBottom: NavKey[] = ['identity'];
</script>

<template>
	<div class="min-h-screen bg-[#EBE8E3] font-sans text-stone-600">
		<div class="flex h-screen overflow-hidden">
			<aside class="w-[280px] shrink-0 flex flex-col border-r border-[#DCD9D3] bg-[#EBE8E3]">
				<div class="p-8">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded bg-[#6B6B5C] text-[#EBE8E3] shadow-sm">
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
							</svg>
						</div>
						<h1 class="text-xl font-bold tracking-wider text-[#4A4A45]">晴天自動車</h1>
					</div>
				</div>
				<nav class="flex-1 px-4 space-y-2 overflow-y-auto">
					<button
						v-for="key in navGroupMain"
						:key="key"
						@click="activeNav = key"
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
							{{ key === 'dashboard' ? '總覽' : key === 'appointments' ? '預約排程' : key === 'records' ? '維修紀錄' : '店鋪設定' }}
						</span>
					</button>
					<div class="my-2 border-t border-[#DCD9D3]"></div>
					<button
						v-for="key in navGroupBottom"
						:key="key"
						@click="activeNav = key"
						class="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left transition-all duration-300"
						:class="activeNav === key 
							? 'bg-[#6B6B5C] text-[#EBE8E3] shadow-md shadow-[#6B6B5C]/20' 
							: 'text-stone-500 hover:bg-[#DEDbd6] hover:text-[#4A4A45]'"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
						<span class="font-medium tracking-wide">登記身份</span>
					</button>
				</nav>
				<div class="p-6">
					<div class="rounded-lg bg-[#DEDbd6]/50 p-4 border border-[#DCD9D3]">
						<div class="text-xs text-stone-500">目前登入</div>
						<div class="font-bold text-[#4A4A45] tracking-wide">店長 Admin</div>
					</div>
				</div>
			</aside>
			<main class="flex-1 overflow-y-auto">
				<div class="mx-auto max-w-6xl px-8 py-10">
					<header class="mb-10">
						<h2 class="text-3xl font-bold text-[#4A4A45] tracking-wide">{{ pageHeader.title }}</h2>
						<p class="mt-2 text-stone-500 font-medium">{{ pageHeader.sub }}</p>
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
						<div class="flex flex-col gap-4 rounded-xl border border-[#DCD9D3] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
							<div class="flex flex-1 gap-3">
								<div class="relative w-full max-w-sm">
									<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
									<input 
										v-model="apptSearch"
										type="text" 
										placeholder="搜尋姓名、車牌..." 
										class="w-full rounded-lg border border-[#DCD9D3] bg-[#F8F7F5] py-2.5 pl-10 pr-4 text-sm text-[#4A4A45] outline-none transition focus:border-[#6B6B5C] focus:bg-white focus:ring-1 focus:ring-[#6B6B5C]"
									>
								</div>
								<select v-model="apptFilterStatus" class="rounded-lg border border-[#DCD9D3] bg-white px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
									<option value="all">顯示全部</option>
									<option value="pending">待確認</option>
									<option value="confirmed">已排程</option>
									<option value="servicing">作業中</option>
								</select>
							</div>
							<button class="flex items-center gap-2 rounded-lg bg-[#6B6B5C] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#5a5a4d] active:scale-95">
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
								新增預約
							</button>
						</div>
						<div class="space-y-4">
							<div 
								v-for="apt in filteredAppointments" 
								:key="apt.id"
								class="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#DCD9D3] bg-white p-6 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center"
							>
								<div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getStatusClass(apt.status).split(' ')[0].replace('bg-', 'bg-')"></div>
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
								<div class="flex flex-col gap-1 pl-4 lg:w-48 lg:border-l lg:border-[#F0EEE9] lg:pl-6">
									<div v-if="apt.tech" class="flex items-center gap-2 text-sm">
										<span class="text-stone-400">技師:</span>
										<span class="font-medium text-stone-600">{{ apt.tech }}</span>
									</div>
									<div v-if="apt.bay" class="flex items-center gap-2 text-sm">
										<span class="text-stone-400">工位:</span>
										<span class="font-medium text-stone-600">{{ apt.bay }}</span>
									</div>
									<div v-if="!apt.tech && !apt.bay" class="text-sm italic text-stone-400">尚未指派</div>
								</div>
								<div class="flex items-center justify-end pl-4 lg:w-32 lg:pl-0">
									<div class="text-right">
										<div class="text-xs text-stone-400">預估費用</div>
										<div class="font-bold text-[#4A4A45]">{{ formatCurrency(apt.estimatedCost) }}</div>
									</div>
								</div>
								<div class="mt-4 flex w-full gap-2 border-t border-[#F0EEE9] pt-4 lg:mt-0 lg:w-auto lg:flex-col lg:border-0 lg:pt-0">
									<button class="flex-1 rounded border border-[#DCD9D3] bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-[#F8F7F5] lg:w-20">編輯</button>
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
					<div v-else-if="activeNav === 'settings'" class="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
						<div class="rounded-xl border border-[#DCD9D3] bg-white p-8 shadow-sm">
							<h3 class="mb-6 text-lg font-bold text-[#4A4A45]">基本資訊</h3>
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div class="space-y-2">
									<label class="text-sm font-medium text-stone-500">店舖名稱</label>
									<input v-model="shopSettings.name" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
								</div>
								<div class="space-y-2">
									<label class="text-sm font-medium text-stone-500">聯絡電話</label>
									<input v-model="shopSettings.phone" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
								</div>
								<div class="space-y-2 md:col-span-2">
									<label class="text-sm font-medium text-stone-500">地址</label>
									<input v-model="shopSettings.address" type="text" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
								</div>
								<div class="space-y-2">
									<label class="text-sm font-medium text-stone-500">工位數量 (Bays)</label>
									<input v-model="shopSettings.bays" type="number" class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]">
								</div>
							</div>
						</div>
						<div class="flex justify-end pt-4">
							<button class="rounded-lg bg-[#6B6B5C] px-8 py-3 font-medium text-white shadow-lg shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] hover:shadow-xl active:scale-95">
								儲存變更
							</button>
						</div>
					</div>
					<div v-else-if="activeNav === 'identity'" class="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
						<div class="rounded-xl border border-[#DCD9D3] bg-white p-8 shadow-sm">
							<h3 class="mb-6 text-lg font-bold text-[#4A4A45]">登記身份資訊</h3>
							<div class="space-y-6">
								<div class="space-y-2">
									<label class="text-sm font-medium text-stone-500">店家名稱</label>
									<input 
										v-model="identityForm.name" 
										type="text" 
										placeholder="請輸入店家完整名稱"
										class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
									>
								</div>
								<div class="space-y-2">
									<label class="text-sm font-medium text-stone-500">店家統編</label>
									<input 
										v-model="identityForm.taxId" 
										type="text" 
										placeholder="請輸入 8 位數統一編號"
										maxlength="8"
										class="w-full rounded-lg border border-[#DCD9D3] px-4 py-2.5 text-sm text-[#4A4A45] outline-none focus:border-[#6B6B5C] focus:ring-1 focus:ring-[#6B6B5C]"
									>
								</div>
								<div class="pt-4">
									<button 
										@click="submitIdentity"
										class="w-full rounded-lg bg-[#6B6B5C] px-8 py-3 font-medium text-white shadow-lg shadow-[#6B6B5C]/20 transition hover:bg-[#5a5a4d] hover:shadow-xl active:scale-95 md:w-auto"
									>
										確認資訊
									</button>
								</div>
							</div>
							<div class="mt-8 border-t border-[#F0EEE9] pt-6">
								<div class="flex items-start gap-3 text-sm text-stone-400">
									<svg class="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
									</svg>
									<p>提交後將進入人工審核階段，審核期間部分功能可能會受到限制。如有疑問請聯繫系統管理員。</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>