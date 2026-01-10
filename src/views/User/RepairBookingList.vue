<script setup lang="ts">
import { computed, ref } from "vue";

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
type FilterType = "all" | AppointmentStatus;

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
};

const MockAppointments: Appointment[] = [
	{
		id: "1",
		carModel: "Toyota Camry 2020",
		licensePlate: "ABC-1234",
		serviceType: "定期保養・機油更換・煞車系統檢查",
		appointmentDate: "2026-01-15",
		appointmentTime: "10:30",
		status: "confirmed",
		location: "台北市信義區忠孝東路五段 68 號",
		estimatedDuration: "2 小時",
		estimatedCost: "3,500",
		customerName: "王小明",
		customerPhone: "0912-345-678",
		additionalServices: ["輪胎胎壓檢查", "雨刷更換"],
		notes: "請檢查煞車有異音",
	},
	{
		id: "2",
		carModel: "Honda CR-V 2019",
		licensePlate: "XYZ-5678",
		serviceType: "冷氣系統檢修・冷媒補充",
		appointmentDate: "2026-01-18",
		appointmentTime: "14:00",
		status: "pending",
		location: "新北市板橋區文化路一段 188 號",
		estimatedDuration: "1.5 小時",
		estimatedCost: "2,200",
		customerName: "李美麗",
		customerPhone: "0988-765-432",
		additionalServices: ["冷氣濾網更換"],
	},
	{
		id: "3",
		carModel: "Tesla Model 3 2022",
		licensePlate: "EV-8888",
		serviceType: "輪胎更換・四輪定位",
		appointmentDate: "2026-01-10",
		appointmentTime: "09:00",
		status: "completed",
		location: "桃園市中壢區中華路二段 100 號",
		estimatedDuration: "1 小時",
		estimatedCost: "8,600",
		customerName: "陳大華",
		customerPhone: "0900-111-222",
		additionalServices: ["輪胎氮氣填充"],
	},
	{
		id: "4",
		carModel: "Mazda CX-5 2021",
		licensePlate: "MAZ-9527",
		serviceType: "引擎警示燈診斷・電腦檢測",
		appointmentDate: "2026-01-20",
		appointmentTime: "11:00",
		status: "confirmed",
		location: "台中市西屯區台灣大道三段 99 號",
		estimatedDuration: "2.5 小時",
		estimatedCost: "4,800",
		customerName: "林小芳",
		customerPhone: "0977-333-444",
		additionalServices: ["火星塞檢查", "電瓶健康檢測"],
	},
	{
		id: "5",
		carModel: "Nissan Sentra 2018",
		licensePlate: "NIS-7777",
		serviceType: "煞車片更換・煞車油更換",
		appointmentDate: "2026-01-12",
		appointmentTime: "15:30",
		status: "cancelled",
		location: "高雄市左營區博愛二路 300 號",
		estimatedDuration: "2 小時",
		estimatedCost: "3,200",
		customerName: "張志強",
		customerPhone: "0955-888-999",
		additionalServices: [],
		notes: "臨時有事改期",
	},
];

const Appointments = ref<Appointment[]>([...MockAppointments]);
const ActiveFilter = ref<FilterType>("all");
const SelectedAppointment = ref<Appointment | null>(null);

const CancelDialogOpen = ref(false);
const DetailDialogOpen = ref(false);

const FilteredAppointments = computed(() => {
	if (ActiveFilter.value === "all") {
		return Appointments.value;
	}
	return Appointments.value.filter((apt) => apt.status === ActiveFilter.value);
});

const StatusConfig = (status: AppointmentStatus) => {
	switch (status) {
		case "pending":
			return { label: "待確認", color: "text-[#B07B3B] border-[#E6C7A8] bg-[#F2E2D3]" };
		case "confirmed":
			return { label: "已確認", color: "text-[#2D6A8A] border-[#BBD7E8] bg-[#D9E8F2]" };
		case "completed":
			return { label: "已完成", color: "text-[#4A7C59] border-[#C8DCC0] bg-[#E0EAD8]" };
		case "cancelled":
			return { label: "已取消", color: "text-[#B85C50] border-[#E8B9B4] bg-[#F3D7D4]" };
	}
};

const Tabs = [
	{ label: "全部", value: "all" as const },
	{ label: "待確認", value: "pending" as const },
	{ label: "已確認", value: "confirmed" as const },
	{ label: "已完成", value: "completed" as const },
	{ label: "已取消", value: "cancelled" as const },
];

const CanCancel = (status: AppointmentStatus) => status === "pending" || status === "confirmed";

const HandleCancelClick = (appointment: Appointment) => {
	SelectedAppointment.value = appointment;
	CancelDialogOpen.value = true;
};

const HandleConfirmCancel = () => {
	if (SelectedAppointment.value) {
		Appointments.value = Appointments.value.map((apt) =>
			apt.id === SelectedAppointment.value?.id ? { ...apt, status: "cancelled" } : apt
		);
	}
	CancelDialogOpen.value = false;
	SelectedAppointment.value = null;
};

const HandleViewDetail = (appointment: Appointment) => {
	SelectedAppointment.value = appointment;
	DetailDialogOpen.value = true;
};

const CloseDetail = () => {
	DetailDialogOpen.value = false;
	SelectedAppointment.value = null;
};

const CloseCancelDialog = () => {
	CancelDialogOpen.value = false;
	SelectedAppointment.value = null;
};
</script>

<template>
	<div class="min-h-screen bg-[#F4F1EC] text-[#2F2E2A]">
		<header class="border-b border-[#E2DED6] bg-[#F4F1EC]">
			<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
				<div>
					<h1 class="text-xl font-semibold">我的預約</h1>
					<p class="text-[#6B6B5C] mt-1 text-sm">查看與管理你的汽車維修預約</p>
				</div>
				<div class="flex items-center gap-3">
					<button type="button" class="relative inline-flex items-center gap-2 rounded-xl bg-[#D9D6CF] px-4 py-2 text-sm text-[#2F2E2A] transition-colors duration-200 hover:bg-[#CFCBC3]">
						<font-awesome-icon :icon="['fas', 'bell']" class="h-4 w-4" />
						<span class="text-sm">通知</span>
						<span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#B85C50] text-xs text-white">
							2
						</span>
					</button>
					<button type="button" class="bg-[#D9D6CF] hover:bg-[#CFCBC3] flex items-center gap-2 rounded-lg px-3 py-2 text-[#2F2E2A] transition-colors duration-200">
						<font-awesome-icon :icon="['fas', 'user']" class="h-4 w-4" />
						<span class="text-sm">個人資料</span>
					</button>
				</div>
			</div>
		</header>
		<main class="mx-auto max-w-6xl px-4 py-8">
			<div class="mb-7">
				<div class="flex flex-wrap gap-2">
					<button
						v-for="Tab in Tabs"
						:key="Tab.value"
						type="button"
						@click="ActiveFilter = Tab.value"
						:class="[
							`border border-[#E2DED6] rounded-xl px-4 py-2 text-sm transition-colors duration-200`,
							ActiveFilter === Tab.value ? 'bg-[#6B6B5C] text-[#F7F5F0]' : `bg-[#F7F5F0] text-[#6B6B5C] hover:bg-[#EFECE6]`
						]"
					>
						{{ Tab.label }}
					</button>
				</div>
			</div>
			<div v-if="FilteredAppointments.length > 0" class="grid grid-cols-1 gap-6">
				<div
					v-for="Appointment in FilteredAppointments"
					:key="Appointment.id"
					class="bg-[#F7F5F0] border border-[#E2DED6] rounded-2xl p-6 transition-colors duration-200 hover:bg-[#F7F5F0]"
				>
					<div class="flex flex-col gap-5">
						<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
							<div class="min-w-0">
								<div class="mb-2 flex items-center gap-2">
									<h3 class="text-[#2F2E2A] truncate font-semibold">{{ Appointment.carModel }}</h3>
									<span class="text-[#6B6B5C] text-sm">・{{ Appointment.licensePlate }}</span>
								</div>
								<div class="text-[#6B6B5C] mb-1 flex items-center gap-2 text-sm">
									<font-awesome-icon :icon="['fas', 'screwdriver-wrench']" class="h-3.5 w-3.5" />
									<span class="line-clamp-2">{{ Appointment.serviceType }}</span>
								</div>
							</div>
							<span
								class="rounded-full border px-3 py-1.5 text-sm"
								:class="StatusConfig(Appointment.status).color"
							>
								{{ StatusConfig(Appointment.status).label }}
							</span>
						</div>
						<div class="grid grid-cols-1 gap-3 border-y border-[#E2DED6] py-4 sm:grid-cols-2">
							<div class="flex items-center gap-2 text-sm">
								<font-awesome-icon :icon="['fas', 'calendar-days']" class="text-[#6B6B5C] h-4 w-4" />
								<div>
									<p class="text-[#6B6B5C] text-xs">預約日期</p>
									<p class="text-[#2F2E2A]">{{ Appointment.appointmentDate }}</p>
								</div>
							</div>
							<div class="flex items-center gap-2 text-sm">
								<font-awesome-icon :icon="['fas', 'clock']" class="text-[#6B6B5C] h-4 w-4" />
								<div>
									<p class="text-[#6B6B5C] text-xs">預約時間</p>
									<p class="text-[#2F2E2A]">{{ Appointment.appointmentTime }}</p>
								</div>
							</div>
							<div class="flex items-center gap-2 text-sm">
								<font-awesome-icon :icon="['fas', 'location-dot']" class="text-[#6B6B5C] h-4 w-4" />
								<div>
									<p class="text-[#6B6B5C] text-xs">門市地點</p>
									<p class="text-[#2F2E2A] line-clamp-1">{{ Appointment.location }}</p>
								</div>
							</div>
							<div class="flex items-center gap-2 text-sm">
								<font-awesome-icon :icon="['fas', 'car']" class="text-[#6B6B5C] h-4 w-4" />
								<div>
									<p class="text-[#6B6B5C] text-xs">預估時間</p>
									<p class="text-[#2F2E2A]">{{ Appointment.estimatedDuration }}</p>
								</div>
							</div>
						</div>
						<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
							<button
								type="button"
								@click="HandleViewDetail(Appointment)"
								class="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-xl bg-[#6B6B5C] px-5 py-3 text-sm text-[#F7F5F0] transition-colors duration-200 hover:bg-[#5F5F52] sm:w-auto"
							>
								<font-awesome-icon :icon="['fas', 'circle-info']" class="h-4 w-4" />
								查看詳情
							</button>
							<button
								v-if="CanCancel(Appointment.status)"
								type="button"
								@click="HandleCancelClick(Appointment)"
								class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9D6CF] px-5 py-3 text-sm text-[#2F2E2A] transition-colors duration-200 hover:bg-[#CFCBC3] sm:w-40"
							>
								<font-awesome-icon :icon="['fas', 'xmark']" class="h-4 w-4" />
								取消預約
							</button>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="bg-[#F7F5F0] border border-[#E2DED6] rounded-2xl p-12 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D9D6CF] text-[#6B6B5C]">
					<font-awesome-icon :icon="['fas', 'calendar-xmark']" class="h-6 w-6" />
				</div>
				<h2 class="text-[#2F2E2A] mb-2 text-lg font-semibold">沒有符合條件的預約</h2>
				<p class="text-[#6B6B5C]">請切換篩選條件，或稍後再試。</p>
			</div>
		</main>
		<Teleport to="body">
			<div v-if="CancelDialogOpen" class="fixed inset-0 z-50">
				<div class="bg-black/50 absolute inset-0" @click="CloseCancelDialog"></div>
				<div class="absolute inset-0 flex items-center justify-center p-4">
					<div class="w-full max-w-md rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-6 shadow-lg">
						<h3 class="text-[#2F2E2A] text-lg font-semibold">取消預約</h3>
						<p class="text-[#6B6B5C] mt-2 text-sm">
							確定要取消這筆預約嗎？取消後可能需要重新預約時間。
						</p>
						<div v-if="SelectedAppointment" class="mt-4 rounded-xl bg-[#EFECE6] p-4 text-sm">
							<p class="text-[#2F2E2A] font-medium">{{ SelectedAppointment.carModel }}</p>
							<p class="text-[#6B6B5C] mt-1">
								{{ SelectedAppointment.appointmentDate }}・{{ SelectedAppointment.appointmentTime }}
							</p>
						</div>
						<div class="mt-6 flex gap-3">
							<button
								type="button"
								@click="CloseCancelDialog"
								class="bg-[#D9D6CF] hover:bg-[#CFCBC3] border-[#E2DED6] flex-1 rounded-lg border px-4 py-2.5 text-sm text-[#2F2E2A] transition-colors duration-200"
							>
								返回
							</button>
							<button
								type="button"
								@click="HandleConfirmCancel"
								class="bg-[#B85C50] hover:bg-[#A04B40] flex-1 rounded-lg px-4 py-2.5 text-sm text-white transition-colors duration-200"
							>
								確認取消
							</button>
						</div>
					</div>
				</div>
			</div>
		</Teleport>
		<Teleport to="body">
			<div v-if="DetailDialogOpen && SelectedAppointment" class="fixed inset-0 z-50">
				<div class="bg-black/50 absolute inset-0" @click="CloseDetail"></div>
				<div class="absolute inset-0 flex items-center justify-center p-4">
					<div class="w-full max-w-2xl rounded-2xl border border-[#E2DED6] bg-[#F7F5F0] p-6 shadow-lg">
						<div class="flex items-center justify-between gap-4">
							<h3 class="text-[#2F2E2A] text-lg font-semibold">預約詳情</h3>
							<span
								class="rounded-full border px-3 py-1.5 text-sm"
								:class="StatusConfig(SelectedAppointment.status).color"
							>
								{{ StatusConfig(SelectedAppointment.status).label }}
							</span>
						</div>
						<div class="mt-4 space-y-6">
							<div class="bg-[#F4F1EC]/50 rounded-lg p-4">
								<h4 class="text-[#2F2E2A] mb-3 flex items-center gap-2 font-medium">
									<font-awesome-icon :icon="['fas', 'car']" class="text-[#6B6B5C] h-4 w-4" />
									車輛資訊
								</h4>
								<div class="grid grid-cols-2 gap-3 text-sm">
									<div>
										<p class="text-[#6B6B5C] mb-1 text-xs">車型</p>
										<p class="text-[#2F2E2A]">{{ SelectedAppointment.carModel }}</p>
									</div>
									<div>
										<p class="text-[#6B6B5C] mb-1 text-xs">車牌號碼</p>
										<p class="text-[#2F2E2A]">{{ SelectedAppointment.licensePlate }}</p>
									</div>
								</div>
							</div>
							<div class="bg-[#F4F1EC]/50 rounded-lg p-4">
								<h4 class="text-[#2F2E2A] mb-3 flex items-center gap-2 font-medium">
									<font-awesome-icon :icon="['fas', 'calendar-days']" class="text-[#6B6B5C] h-4 w-4" />
									預約資訊
								</h4>
								<div class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
									<div class="flex items-center gap-2">
										<font-awesome-icon :icon="['fas', 'calendar-days']" class="text-[#6B6B5C] h-4 w-4" />
										<div>
											<p class="text-[#6B6B5C] text-xs">日期</p>
											<p class="text-[#2F2E2A]">{{ SelectedAppointment.appointmentDate }}</p>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<font-awesome-icon :icon="['fas', 'clock']" class="text-[#6B6B5C] h-4 w-4" />
										<div>
											<p class="text-[#6B6B5C] text-xs">時間</p>
											<p class="text-[#2F2E2A]">{{ SelectedAppointment.appointmentTime }}</p>
										</div>
									</div>
									<div class="flex items-center gap-2 sm:col-span-2">
										<font-awesome-icon :icon="['fas', 'wrench']" class="text-[#6B6B5C] h-4 w-4" />
										<div>
											<p class="text-[#6B6B5C] text-xs">項目</p>
											<p class="text-[#2F2E2A]">{{ SelectedAppointment.serviceType }}</p>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-[#F4F1EC]/50 rounded-lg p-4">
								<h4 class="text-[#2F2E2A] mb-3 flex items-center gap-2 font-medium">
									<font-awesome-icon :icon="['fas', 'user']" class="text-[#6B6B5C] h-4 w-4" />
									客戶資訊
								</h4>
								<div class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
									<div class="flex items-center gap-2">
										<font-awesome-icon :icon="['fas', 'user']" class="text-[#6B6B5C] h-4 w-4" />
										<div>
											<p class="text-[#6B6B5C] text-xs">姓名</p>
											<p class="text-[#2F2E2A]">{{ SelectedAppointment.customerName }}</p>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<font-awesome-icon :icon="['fas', 'phone']" class="text-[#6B6B5C] h-4 w-4" />
										<div>
											<p class="text-[#6B6B5C] text-xs">電話</p>
											<p class="text-[#2F2E2A]">{{ SelectedAppointment.customerPhone }}</p>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-[#F4F1EC]/50 rounded-lg p-4">
								<h4 class="text-[#2F2E2A] mb-3 flex items-center gap-2 font-medium">
									<font-awesome-icon :icon="['fas', 'screwdriver-wrench']" class="text-[#6B6B5C] h-4 w-4" />
									服務項目
								</h4>
								<p class="text-[#2F2E2A] text-sm">{{ SelectedAppointment.serviceType }}</p>
								<div class="border-[#E2DED6] mt-3 border-t pt-3 text-sm">
									<div class="flex items-center gap-2">
										<font-awesome-icon :icon="['fas', 'dollar-sign']" class="text-[#6B6B5C] h-4 w-4" />
										<span class="text-[#6B6B5C] text-xs">預估費用</span>
										<span class="text-[#2F2E2A] ml-auto">NT$ {{ SelectedAppointment.estimatedCost }}</span>
									</div>
								</div>
								<div v-if="SelectedAppointment.additionalServices.length" class="mt-3 flex flex-wrap gap-2">
									<span
										v-for="(Service, Index) in SelectedAppointment.additionalServices"
										:key="Index"
										class="bg-[#D9D6CF] text-[#2F2E2A] rounded-full px-3 py-1 text-xs"
									>
										{{ Service }}
									</span>
								</div>
							</div>
							<div class="bg-[#F4F1EC]/50 rounded-lg p-4">
								<h4 class="text-[#2F2E2A] mb-3 flex items-center gap-2 font-medium">
									<font-awesome-icon :icon="['fas', 'location-dot']" class="text-[#6B6B5C] h-4 w-4" />
									門市資訊
								</h4>
								<div class="space-y-3 text-sm">
									<div>
										<p class="text-[#6B6B5C] mb-1 text-xs">門市名稱</p>
										<p class="text-[#2F2E2A]">{{ SelectedAppointment.location }}</p>
									</div>
								</div>
							</div>
							<div v-if="SelectedAppointment.notes" class="bg-[#F4F1EC]/50 rounded-lg p-4">
								<h4 class="text-[#2F2E2A] mb-3 flex items-center gap-2 font-medium">
									<font-awesome-icon :icon="['fas', 'file-lines']" class="text-[#6B6B5C] h-4 w-4" />
									備註
								</h4>
								<p class="text-[#2F2E2A] text-sm">{{ SelectedAppointment.notes }}</p>
							</div>
						</div>
						<div class="mt-6 flex justify-end">
							<button
								type="button"
								@click="CloseDetail"
								class="bg-[#D9D6CF] hover:bg-[#CFCBC3] border-[#E2DED6] rounded-lg border px-5 py-2.5 text-sm text-[#2F2E2A] transition-colors duration-200"
							>
								關閉
							</button>
						</div>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>
