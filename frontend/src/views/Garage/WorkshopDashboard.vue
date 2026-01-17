<script setup lang="ts">
import { computed, ref } from 'vue';

type NavKey = 'dashboard' | 'orders' | 'schedule' | 'records' | 'shop';

type OrderStatus = 'in_progress' | 'pending_confirm' | 'completed' | 'cancelled';

type Order = {
	id: string;
	customerName: string;
	phone: string;
	carModel: string;
	licensePlate: string;
	service: string;
	appointmentDate: string;
	appointmentTime: string;
	status: OrderStatus;
	estimateMin: number;
	amount: number;
	notes?: string;
};

type ScheduleItem = {
	id: string;
	date: string;
	time: string;
	bay: 'A1' | 'A2' | 'B1' | 'B2';
	tech: string;
	title: string;
	customerName: string;
	carModel: string;
	status: 'upcoming' | 'doing' | 'done';
};

type RecordItem = {
	id: string;
	customerName: string;
	phone: string;
	carModel: string;
	licensePlate: string;
	date: string;
	items: Array<{ name: string; price: number; type: 'base' | 'addon' }>;
	notes: string;
};

type ShopInfo = {
	name: string;
	address: string;
	phone: string;
	businessHours: Array<{ day: string; open: string; close: string }>;
	bays: Array<{ bay: string; status: 'available' | 'busy' | 'maintenance' }>;
	techs: Array<{ name: string; level: '資深' | '中階' | '新手'; todayJobs: number }>;
};

const activeNav = ref<NavKey>('dashboard');

const stats = ref({
	todayBookings: 8,
	pendingOrders: 12,
	monthCompleted: 156,
	avgHandlingTime: '2.5h',
});

const recentOrders = ref([
	{ id: 'W-2024-001', customerName: '王小明', carModel: 'Toyota Camry', time: '09:30', status: 'in_progress' as const },
	{ id: 'W-2024-002', customerName: '李大華', carModel: 'Honda CR-V', time: '10:00', status: 'pending_confirm' as const },
	{ id: 'W-2024-003', customerName: '張美玲', carModel: 'Mazda 3', time: '11:15', status: 'completed' as const },
]);

const orderQuery = ref('');
const orderStatusFilter = ref<OrderStatus | 'all'>('all');

const orders = ref<Order[]>([
	{
		id: 'W-2024-001',
		customerName: '王小明',
		phone: '0912-345-678',
		carModel: 'Toyota Camry',
		licensePlate: 'ABC-1234',
		service: '定期保養',
		appointmentDate: '2024-12-01',
		appointmentTime: '09:30',
		status: 'in_progress',
		estimateMin: 90,
		amount: 3500,
		notes: '更換機油、機油濾芯',
	},
	{
		id: 'W-2024-002',
		customerName: '李大華',
		phone: '0923-456-789',
		carModel: 'Honda CR-V',
		licensePlate: 'KLM-7788',
		service: '煞車檢修',
		appointmentDate: '2024-12-01',
		appointmentTime: '10:00',
		status: 'pending_confirm',
		estimateMin: 60,
		amount: 2800,
		notes: '車主回報煞車異音',
	},
	{
		id: 'W-2024-003',
		customerName: '張美玲',
		phone: '0934-567-890',
		carModel: 'Mazda 3',
		licensePlate: 'QWE-5566',
		service: '輪胎更換',
		appointmentDate: '2024-12-01',
		appointmentTime: '11:15',
		status: 'completed',
		estimateMin: 45,
		amount: 12000,
		notes: '四輪更換 + 定位',
	},
	{
		id: 'W-2024-004',
		customerName: '陳冠宇',
		phone: '0988-112-233',
		carModel: 'Nissan Kicks',
		licensePlate: 'ZXC-9090',
		service: '冷氣保養',
		appointmentDate: '2024-12-02',
		appointmentTime: '14:00',
		status: 'cancelled',
		estimateMin: 40,
		amount: 1800,
		notes: '客戶臨時取消',
	},
]);

const filteredOrders = computed(() => {
	const q = orderQuery.value.trim().toLowerCase();
	const status = orderStatusFilter.value;

	return orders.value.filter((o) => {
		const matchQ =
			!q ||
			o.customerName.toLowerCase().includes(q) ||
			o.phone.includes(orderQuery.value.trim()) ||
			o.carModel.toLowerCase().includes(q) ||
			o.licensePlate.toLowerCase().includes(q) ||
			o.id.toLowerCase().includes(q);

		const matchStatus = status === 'all' ? true : o.status === status;
		return matchQ && matchStatus;
	});
});

const scheduleDate = ref('2024-12-01');
const schedules = ref<ScheduleItem[]>([
	{
		id: 'S-001',
		date: '2024-12-01',
		time: '09:30',
		bay: 'A1',
		tech: '阿哲',
		title: '定期保養',
		customerName: '王小明',
		carModel: 'Toyota Camry',
		status: 'doing',
	},
	{
		id: 'S-002',
		date: '2024-12-01',
		time: '10:00',
		bay: 'A2',
		tech: '小安',
		title: '煞車檢修',
		customerName: '李大華',
		carModel: 'Honda CR-V',
		status: 'upcoming',
	},
	{
		id: 'S-003',
		date: '2024-12-01',
		time: '11:15',
		bay: 'B1',
		tech: '阿哲',
		title: '輪胎更換',
		customerName: '張美玲',
		carModel: 'Mazda 3',
		status: 'done',
	},
	{
		id: 'S-004',
		date: '2024-12-02',
		time: '14:00',
		bay: 'B2',
		tech: '阿凱',
		title: '冷氣保養',
		customerName: '陳冠宇',
		carModel: 'Nissan Kicks',
		status: 'upcoming',
	},
]);

const schedulesOfDay = computed(() => schedules.value.filter((s) => s.date === scheduleDate.value));

const recordQuery = ref('');
const records = ref<RecordItem[]>([
	{
		id: 'R-2024-001',
		customerName: '王小明',
		phone: '0912-345-678',
		carModel: 'Toyota Camry',
		licensePlate: 'ABC-1234',
		date: '2024-11-15',
		items: [
			{ name: '機油更換', price: 1800, type: 'base' },
			{ name: '機油濾芯', price: 400, type: 'base' },
			{ name: '冷氣濾網', price: 650, type: 'addon' },
		],
		notes: '建議下次保養檢查煞車皮厚度',
	},
	{
		id: 'R-2024-002',
		customerName: '李大華',
		phone: '0923-456-789',
		carModel: 'Honda CR-V',
		licensePlate: 'KLM-7788',
		date: '2024-10-05',
		items: [
			{ name: '煞車來令片', price: 2400, type: 'base' },
			{ name: '煞車碟盤研磨', price: 1200, type: 'addon' },
		],
		notes: '異音已排除，回廠再確認',
	},
	{
		id: 'R-2024-003',
		customerName: '張美玲',
		phone: '0934-567-890',
		carModel: 'Mazda 3',
		licensePlate: 'QWE-5566',
		date: '2024-12-01',
		items: [
			{ name: '輪胎更換（四輪）', price: 9800, type: 'base' },
			{ name: '四輪定位', price: 2200, type: 'addon' },
		],
		notes: '胎壓已校正',
	},
]);

const filteredRecords = computed(() => {
	const q = recordQuery.value.trim().toLowerCase();
	if (!q) return records.value;

	return records.value.filter((r) => {
		return (
			r.customerName.toLowerCase().includes(q) ||
			r.phone.includes(recordQuery.value.trim()) ||
			r.carModel.toLowerCase().includes(q) ||
			r.licensePlate.toLowerCase().includes(q) ||
			r.id.toLowerCase().includes(q)
		);
	});
});

const shopInfo = ref<ShopInfo>({
	name: '晴天維修廠',
	address: '台北市中山區某某路 100 號',
	phone: '02-1234-5678',
	businessHours: [
		{ day: '週一', open: '09:00', close: '18:00' },
		{ day: '週二', open: '09:00', close: '18:00' },
		{ day: '週三', open: '09:00', close: '18:00' },
		{ day: '週四', open: '09:00', close: '18:00' },
		{ day: '週五', open: '09:00', close: '18:00' },
		{ day: '週六', open: '10:00', close: '17:00' },
		{ day: '週日', open: '休息', close: '—' },
	],
	bays: [
		{ bay: 'A1', status: 'busy' },
		{ bay: 'A2', status: 'available' },
		{ bay: 'B1', status: 'maintenance' },
		{ bay: 'B2', status: 'available' },
	],
	techs: [
		{ name: '阿哲', level: '資深', todayJobs: 3 },
		{ name: '小安', level: '中階', todayJobs: 2 },
		{ name: '阿凱', level: '新手', todayJobs: 1 },
	],
});

function statusText(s: OrderStatus): string {
	switch (s) {
		case 'in_progress':
			return '進行中';
		case 'pending_confirm':
			return '待確認';
		case 'completed':
			return '已完成';
		case 'cancelled':
			return '已取消';
		default:
			return '—';
	}
}

function statusClass(s: OrderStatus): string {
	switch (s) {
		case 'in_progress':
			return 'bg-[#8fb6a1] text-white';
		case 'pending_confirm':
			return 'bg-[#7f93a4] text-white';
		case 'completed':
			return 'bg-[#e7e5e4] text-[#6b7280]';
		case 'cancelled':
			return 'bg-[#f1c0c0] text-[#7a2e2e]';
		default:
			return 'bg-zinc-200 text-zinc-700';
	}
}

function scheduleBadgeClass(s: ScheduleItem['status']): string {
	switch (s) {
		case 'doing':
			return 'bg-[#8fb6a1] text-white';
		case 'upcoming':
			return 'bg-[#7f93a4] text-white';
		case 'done':
			return 'bg-[#e7e5e4] text-[#6b7280]';
		default:
			return 'bg-zinc-200 text-zinc-700';
	}
}

function bayStatusClass(s: ShopInfo['bays'][number]['status']): string {
	switch (s) {
		case 'available':
			return 'bg-[#e6f2ec] text-[#2f3b35]';
		case 'busy':
			return 'bg-[#8fb6a1] text-white';
		case 'maintenance':
			return 'bg-[#c7ab7a] text-[#3f3f46]';
		default:
			return 'bg-zinc-200 text-zinc-700';
	}
}

function formatCurrency(n: number): string {
	return `NT$${n.toLocaleString('zh-Hant-TW')}`;
}

function sumRecord(items: RecordItem['items']): number {
	return items.reduce((sum, i) => sum + i.price, 0);
}

const pageTitle = computed(() => {
	switch (activeNav.value) {
		case 'dashboard':
			return { title: '總覽', subtitle: '今日維修廠運營概況' };
		case 'orders':
			return { title: '工單管理', subtitle: '管理今日與未來的工單狀態' };
		case 'schedule':
			return { title: '行程安排', subtitle: '查看各工位與技師排程' };
		case 'records':
			return { title: '維修紀錄', subtitle: '查詢車主的過往維修紀錄' };
		case 'shop':
			return { title: '廠房資訊', subtitle: '查看營業資訊、工位與人員狀態' };
		default:
			return { title: '總覽', subtitle: '今日維修廠運營概況' };
	}
});
</script>

<template>
	<div class="min-h-screen bg-white">
		<div class="flex">
			<aside class="w-[320px] shrink-0 bg-[#f5f3ee]">
				<div class="px-10 py-10">
					<h1 class="text-3xl font-semibold tracking-wide text-[#3f3f46]">維修廠後台</h1>
				</div>
				<nav class="px-6 pb-10">
					<ul class="space-y-3">
						<li>
							<button
								type="button"
								class="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left transition"
								:class="
									activeNav === 'dashboard'
										? 'bg-[#7f93a4] text-white shadow-sm'
										: 'text-[#5b5b5b] hover:bg-white/60'
								"
								@click="activeNav = 'dashboard'"
							>
								<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<rect x="3" y="3" width="7" height="7" rx="1" />
									<rect x="14" y="3" width="7" height="7" rx="1" />
									<rect x="3" y="14" width="7" height="7" rx="1" />
									<rect x="14" y="14" width="7" height="7" rx="1" />
								</svg>
								<span class="text-lg font-medium">總覽</span>
							</button>
						</li>
						<li>
							<button
								type="button"
								class="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left text-[#5b5b5b] transition hover:bg-white/60"
								:class="activeNav === 'orders' ? 'ring-1 ring-black/5' : ''"
								@click="activeNav = 'orders'"
							>
								<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
									<rect x="9" y="3" width="6" height="4" rx="1" />
									<path d="M9 12h6" />
									<path d="M9 16h6" />
								</svg>
								<span class="text-lg font-medium">工單管理</span>
							</button>
						</li>
						<li>
							<button
								type="button"
								class="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left text-[#5b5b5b] transition hover:bg-white/60"
								:class="activeNav === 'schedule' ? 'ring-1 ring-black/5' : ''"
								@click="activeNav = 'schedule'"
							>
								<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<rect x="3" y="4" width="18" height="18" rx="2" />
									<path d="M16 2v4" />
									<path d="M8 2v4" />
									<path d="M3 10h18" />
								</svg>
								<span class="text-lg font-medium">行程安排</span>
							</button>
						</li>
						<li>
							<button
								type="button"
								class="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left text-[#5b5b5b] transition hover:bg-white/60"
								:class="activeNav === 'records' ? 'ring-1 ring-black/5' : ''"
								@click="activeNav = 'records'"
							>
								<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<path d="M14 2v6h6" />
									<path d="M8 13h8" />
									<path d="M8 17h8" />
								</svg>
								<span class="text-lg font-medium">維修紀錄</span>
							</button>
						</li>
						<li>
							<button
								type="button"
								class="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left text-[#5b5b5b] transition hover:bg-white/60"
								:class="activeNav === 'shop' ? 'ring-1 ring-black/5' : ''"
								@click="activeNav = 'shop'"
							>
								<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
									<path
										d="M19.4 15a7.97 7.97 0 0 0 .1-2l2-1.2-2-3.4-2.3.6a7.9 7.9 0 0 0-1.7-1l-.3-2.4h-4l-.3 2.4c-.6.2-1.2.6-1.7 1l-2.3-.6-2 3.4 2 1.2a7.97 7.97 0 0 0 0 2l-2 1.2 2 3.4 2.3-.6c.5.4 1.1.8 1.7 1l.3 2.4h4l.3-2.4c.6-.2 1.2-.6 1.7-1l2.3.6 2-3.4-2-1.2z"
									/>
								</svg>
								<span class="text-lg font-medium">廠房資訊</span>
							</button>
						</li>
					</ul>
				</nav>
			</aside>
			<main class="flex-1 bg-white px-12 py-10">
				<header>
					<h2 class="text-2xl font-semibold text-[#3f3f46]">{{ pageTitle.title }}</h2>
					<p class="mt-2 text-sm text-[#a1a1aa]">{{ pageTitle.subtitle }}</p>
				</header>
				<section v-if="activeNav === 'dashboard'" class="mt-8">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-[#a1a1aa]">今日預約</p>
									<p class="mt-2 text-4xl font-semibold text-[#3f3f46]">
										{{ stats.todayBookings }}
									</p>
								</div>
								<div class="rounded-2xl bg-[#7f93a4] p-4 text-white">
									<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<rect x="3" y="4" width="18" height="18" rx="2" />
										<path d="M16 2v4" />
										<path d="M8 2v4" />
										<path d="M3 10h18" />
									</svg>
								</div>
							</div>
						</div>
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-[#a1a1aa]">待處理工單</p>
									<p class="mt-2 text-4xl font-semibold text-[#3f3f46]">
										{{ stats.pendingOrders }}
									</p>
								</div>
								<div class="rounded-2xl bg-[#8fb6a1] p-4 text-[#2f3b35]">
									<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M9 5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
										<rect x="9" y="3" width="6" height="4" rx="1" />
										<path d="M9 12h6" />
										<path d="M9 16h6" />
									</svg>
								</div>
							</div>
						</div>
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-[#a1a1aa]">本月完成</p>
									<p class="mt-2 text-4xl font-semibold text-[#3f3f46]">
										{{ stats.monthCompleted }}
									</p>
								</div>
								<div class="rounded-2xl bg-[#c7ab7a] p-4 text-[#3f3f46]">
									<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M3 17l6-6 4 4 8-8" />
										<path d="M14 7h7v7" />
									</svg>
								</div>
							</div>
						</div>
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-[#a1a1aa]">平均處理時間</p>
									<p class="mt-2 text-4xl font-semibold text-[#3f3f46]">
										{{ stats.avgHandlingTime }}
									</p>
								</div>
								<div class="rounded-2xl bg-[#a9bac7] p-4 text-[#3f3f46]">
									<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<circle cx="12" cy="12" r="9" />
										<path d="M12 7v6l4 2" />
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-8 rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
						<h3 class="text-lg font-semibold text-[#3f3f46]">近期工單</h3>
						<div class="mt-6 space-y-4">
							<div
								v-for="o in recentOrders"
								:key="o.id"
								class="flex items-center justify-between rounded-2xl bg-[#f5f3ee] px-8 py-6"
							>
								<div class="min-w-0">
									<div class="flex items-center gap-3 text-sm">
										<span class="text-[#a1a1aa]">{{ o.id }}</span>
										<span class="text-[#a1a1aa]">•</span>
										<span class="font-medium text-[#3f3f46]">{{ o.customerName }}</span>
									</div>
									<p class="mt-2 text-sm text-[#a1a1aa]">{{ o.carModel }}</p>
								</div>
								<div class="flex items-center gap-6">
									<span class="text-sm text-[#a1a1aa]">{{ o.time }}</span>
									<span class="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium" :class="statusClass(o.status)">
										{{ statusText(o.status) }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section v-else-if="activeNav === 'orders'" class="mt-8 space-y-6">
					<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
						<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<div class="relative w-full md:max-w-md">
								<svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="11" cy="11" r="8" />
									<path d="M21 21l-4.3-4.3" />
								</svg>
								<input
									v-model="orderQuery"
									type="text"
									placeholder="搜尋工單號、姓名、車型、車牌..."
									class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
								/>
							</div>
							<div class="flex items-center gap-3">
								<select
									v-model="orderStatusFilter"
									class="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
								>
									<option value="all">全部狀態</option>
									<option value="in_progress">進行中</option>
									<option value="pending_confirm">待確認</option>
									<option value="completed">已完成</option>
									<option value="cancelled">已取消</option>
								</select>
								<button
									type="button"
									class="rounded-xl bg-[#7f93a4] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95 active:scale-[0.99]"
									@click="orders = [...orders].reverse()"
								>
									假裝排序
								</button>
							</div>
						</div>
					</div>
					<div class="rounded-2xl border border-zinc-100 bg-white shadow-sm">
						<div class="overflow-x-auto">
							<table class="w-full min-w-[920px] text-left text-sm">
								<thead class="bg-[#f5f3ee] text-[#6b7280]">
									<tr>
										<th class="px-6 py-4 font-medium">工單</th>
										<th class="px-6 py-4 font-medium">客戶 / 車輛</th>
										<th class="px-6 py-4 font-medium">預約</th>
										<th class="px-6 py-4 font-medium">服務項目</th>
										<th class="px-6 py-4 font-medium">預估</th>
										<th class="px-6 py-4 font-medium">金額</th>
										<th class="px-6 py-4 font-medium">狀態</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-zinc-100">
									<tr v-for="o in filteredOrders" :key="o.id" class="hover:bg-zinc-50/60">
										<td class="px-6 py-4 font-medium text-[#3f3f46]">{{ o.id }}</td>
										<td class="px-6 py-4">
											<p class="font-medium text-[#3f3f46]">{{ o.customerName }} <span class="text-[#a1a1aa]">({{ o.phone }})</span></p>
											<p class="mt-1 text-[#a1a1aa]">{{ o.carModel }} · {{ o.licensePlate }}</p>
										</td>
										<td class="px-6 py-4 text-[#6b7280]">{{ o.appointmentDate }} {{ o.appointmentTime }}</td>
										<td class="px-6 py-4 text-[#6b7280]">{{ o.service }}</td>
										<td class="px-6 py-4 text-[#6b7280]">{{ o.estimateMin }} 分</td>
										<td class="px-6 py-4 font-medium text-[#3f3f46]">{{ formatCurrency(o.amount) }}</td>
										<td class="px-6 py-4">
											<span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium" :class="statusClass(o.status)">
												{{ statusText(o.status) }}
											</span>
										</td>
									</tr>
									<tr v-if="filteredOrders.length === 0">
										<td colspan="7" class="px-6 py-10 text-center text-[#a1a1aa]">找不到符合的工單喔</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>
				<section v-else-if="activeNav === 'schedule'" class="mt-8 space-y-6">
					<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
						<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<div class="flex items-center gap-3">
								<label class="text-sm text-[#6b7280]">日期</label>
								<input
									v-model="scheduleDate"
									type="date"
									class="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
								/>
							</div>
							<button
								type="button"
								class="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-[#3f3f46] shadow-sm transition hover:bg-zinc-50 active:scale-[0.99]"
								@click="scheduleDate = scheduleDate === '2024-12-01' ? '2024-12-02' : '2024-12-01'"
							>
								切換假日期
							</button>
						</div>
					</div>
					<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<h3 class="text-base font-semibold text-[#3f3f46]">當日排程</h3>
							<div class="mt-4 space-y-3">
								<div
									v-for="s in schedulesOfDay"
									:key="s.id"
									class="flex items-center justify-between rounded-2xl bg-[#f5f3ee] px-6 py-5"
								>
									<div>
										<p class="text-sm font-medium text-[#3f3f46]">
											{{ s.time }} · 工位 {{ s.bay }} · {{ s.tech }}
										</p>
										<p class="mt-1 text-sm text-[#a1a1aa]">{{ s.customerName }} · {{ s.carModel }} · {{ s.title }}</p>
									</div>
									<span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium" :class="scheduleBadgeClass(s.status)">
										{{ s.status === 'doing' ? '進行中' : s.status === 'upcoming' ? '待開始' : '已完成' }}
									</span>
								</div>
								<div v-if="schedulesOfDay.length === 0" class="rounded-2xl bg-zinc-50 px-6 py-10 text-center text-[#a1a1aa]">
									當天沒有排程
								</div>
							</div>
						</div>
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<h3 class="text-base font-semibold text-[#3f3f46]">工位概況</h3>
							<div class="mt-4 grid grid-cols-2 gap-4">
								<div
									v-for="b in shopInfo.bays"
									:key="b.bay"
									class="rounded-2xl bg-zinc-50 p-5"
								>
									<p class="text-sm text-[#6b7280]">工位 {{ b.bay }}</p>
									<p class="mt-2">
										<span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium" :class="bayStatusClass(b.status)">
											{{ b.status === 'available' ? '可用' : b.status === 'busy' ? '忙碌中' : '維護中' }}
										</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section v-else-if="activeNav === 'records'" class="mt-8 space-y-6">
					<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
						<div class="relative w-full md:max-w-md">
							<svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="11" cy="11" r="8" />
								<path d="M21 21l-4.3-4.3" />
							</svg>
							<input
								v-model="recordQuery"
								type="text"
								placeholder="搜尋紀錄編號、姓名、車型、車牌..."
								class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
							/>
						</div>
					</div>
					<div class="space-y-4">
						<div
							v-for="r in filteredRecords"
							:key="r.id"
							class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
						>
							<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div>
									<p class="text-sm text-[#a1a1aa]">{{ r.id }} · {{ r.date }}</p>
									<p class="mt-2 text-lg font-semibold text-[#3f3f46]">{{ r.customerName }}</p>
									<p class="mt-1 text-sm text-[#a1a1aa]">
										{{ r.phone }} · {{ r.carModel }} · {{ r.licensePlate }}
									</p>
								</div>
								<div class="text-right">
									<p class="text-sm text-[#a1a1aa]">合計</p>
									<p class="mt-1 text-xl font-semibold text-[#3f3f46]">
										{{ formatCurrency(sumRecord(r.items)) }}
									</p>
								</div>
							</div>
							<div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
								<div
									v-for="(it, idx) in r.items"
									:key="idx"
									class="flex items-center justify-between rounded-2xl bg-[#f5f3ee] px-5 py-4"
								>
									<div class="flex items-center gap-3">
										<span
											class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
											:class="it.type === 'base' ? 'bg-[#7f93a4] text-white' : 'bg-[#c7ab7a] text-[#3f3f46]'"
										>
											{{ it.type === 'base' ? '基本維修' : '加購' }}
										</span>
										<span class="text-sm font-medium text-[#3f3f46]">{{ it.name }}</span>
									</div>
									<span class="text-sm font-semibold text-[#3f3f46]">{{ formatCurrency(it.price) }}</span>
								</div>
							</div>
							<p class="mt-4 text-sm text-[#6b7280]">{{ r.notes }}</p>
						</div>
						<div
							v-if="filteredRecords.length === 0"
							class="rounded-2xl border border-zinc-100 bg-white p-12 text-center text-[#a1a1aa] shadow-sm"
						>
							找不到符合的維修紀錄
						</div>
					</div>
				</section>
				<section v-else class="mt-8 space-y-6">
					<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
						<p class="text-sm text-[#a1a1aa]">廠名</p>
						<p class="mt-1 text-xl font-semibold text-[#3f3f46]">{{ shopInfo.name }}</p>
						<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="rounded-2xl bg-zinc-50 p-5">
								<p class="text-sm text-[#6b7280]">地址</p>
								<p class="mt-1 text-sm font-medium text-[#3f3f46]">{{ shopInfo.address }}</p>
							</div>
							<div class="rounded-2xl bg-zinc-50 p-5">
								<p class="text-sm text-[#6b7280]">電話</p>
								<p class="mt-1 text-sm font-medium text-[#3f3f46]">{{ shopInfo.phone }}</p>
							</div>
						</div>
					</div>
					<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<h3 class="text-base font-semibold text-[#3f3f46]">營業時間</h3>
							<div class="mt-4 space-y-3">
								<div
									v-for="(h, idx) in shopInfo.businessHours"
									:key="idx"
									class="flex items-center justify-between rounded-2xl bg-[#f5f3ee] px-6 py-4"
								>
									<span class="text-sm font-medium text-[#3f3f46]">{{ h.day }}</span>
									<span class="text-sm text-[#6b7280]">{{ h.open }} - {{ h.close }}</span>
								</div>
							</div>
						</div>
						<div class="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
							<h3 class="text-base font-semibold text-[#3f3f46]">技師狀態</h3>
							<div class="mt-4 space-y-3">
								<div
									v-for="t in shopInfo.techs"
									:key="t.name"
									class="flex items-center justify-between rounded-2xl bg-zinc-50 px-6 py-4"
								>
									<div>
										<p class="text-sm font-medium text-[#3f3f46]">{{ t.name }}</p>
										<p class="mt-1 text-xs text-[#a1a1aa]">{{ t.level }}</p>
									</div>
									<div class="text-right">
										<p class="text-xs text-[#a1a1aa]">今日工單</p>
										<p class="mt-1 text-sm font-semibold text-[#3f3f46]">{{ t.todayJobs }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	</div>
</template>
