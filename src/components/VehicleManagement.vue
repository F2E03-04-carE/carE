<script setup lang="ts">
import { ref, computed } from "vue";

type Vehicle = {
	id: string;
	brand: string;
	model: string;
	plate: string;
	isDefault?: boolean;
};

type Toast = {
	id: number;
	message: string;
	type: "success" | "error" | "info";
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

const vehicleList = ref<Vehicle[]>(props.vehicles?.length ? [...props.vehicles] : (props.useDemoWhenEmpty ? [...demoVehicles] : []));
const currentDefaultId = ref<string | null>(props.defaultId || vehicleList.value.find((v) => v.isDefault)?.id || vehicleList.value[0]?.id || null);

const vehicles = computed(() => vehicleList.value);
const defaultVehicleId = computed(() => currentDefaultId.value);
const isDefault = (v: Vehicle) => defaultVehicleId.value === v.id;

const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;

const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
	const id = toastIdCounter++;
	toasts.value.push({ id, message, type });
	
	setTimeout(() => {
		toasts.value = toasts.value.filter((t) => t.id !== id);
	}, 3000);
};

const deleteModal = ref({
	show: false,
	vehicleId: ``,
	vehicleName: ``,
});

const showDeleteModal = (id: string) => {
	const vehicle = vehicleList.value.find((v) => v.id === id);
	if (vehicle) {
		deleteModal.value = {
			show: true,
			vehicleId: id,
			vehicleName: `${vehicle.brand} ${vehicle.model}`,
		};
	}
};

const confirmDelete = () => {
	const id = deleteModal.value.vehicleId;
	vehicleList.value = vehicleList.value.filter((v) => v.id !== id);
	if (currentDefaultId.value === id && vehicleList.value.length > 0) {
		currentDefaultId.value = vehicleList.value[0]?.id || null;
	} else if (vehicleList.value.length === 0) {
		currentDefaultId.value = null;
	}
	emit(`remove`, id);
	deleteModal.value.show = false;
	showToast(`車輛已刪除`, `success`);
};

const cancelDelete = () => {
	deleteModal.value.show = false;
};

const editModal = ref({
	show: false,
	vehicle: null as Vehicle | null,
	form: {
		brand: ``,
		model: ``,
		plate: ``,
	},
});

const showEditModal = (id: string) => {
	const vehicle = vehicleList.value.find((v) => v.id === id);
	if (vehicle) {
		editModal.value = {
			show: true,
			vehicle: vehicle,
			form: {
				brand: vehicle.brand,
				model: vehicle.model,
				plate: vehicle.plate,
			},
		};
	}
};

const saveEdit = () => {
	if (editModal.value.vehicle) {
		const index = vehicleList.value.findIndex((v) => v.id === editModal.value.vehicle!.id);
		
		if (index !== -1 && vehicleList.value[index]) {
			vehicleList.value[index].brand = editModal.value.form.brand;
			vehicleList.value[index].model = editModal.value.form.model;
			vehicleList.value[index].plate = editModal.value.form.plate;
		}

		emit(`edit`, editModal.value.vehicle.id);
		editModal.value.show = false;
		showToast(`車輛資訊已更新`, `success`);
	}
};

const cancelEdit = () => {
	editModal.value.show = false;
};

const handleAdd = () => {
	const newId = `${Date.now()}`;
	const newVehicle: Vehicle = {
		id: newId,
		brand: `新車輛`,
		model: `請編輯`,
		plate: `XXX-0000`,
		isDefault: vehicleList.value.length === 0,
	};
	vehicleList.value.push(newVehicle);
	if (vehicleList.value.length === 1) {
		currentDefaultId.value = newId;
	}
	emit(`add`);
	showToast(`新增車輛成功！`, `success`);
};

const handleEdit = (id: string) => {
	showEditModal(id);
};

const handleRemove = (id: string) => {
	showDeleteModal(id);
};

const handleSetDefault = (id: string) => {
	currentDefaultId.value = id;
	emit(`set-default`, id);
	showToast(`已設為預設車輛`, `info`);
};
</script>

<template>
	<section class="w-full bg-[#EBE8E3]">
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
				class="inline-flex items-center gap-2 mb-8 px-6 py-3 text-base font-bold text-white transition-colors rounded-full bg-[#6B6B5C] hover:bg-[#5a5a4d]"
				@click="handleAdd"
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
							@click="handleSetDefault(v.id)"
						>
							<span class="material-symbols-outlined text-[20px]">star</span>
							設為預設
						</button>
						<button
							class="flex-1 flex justify-center items-center gap-2 px-4 py-3 text-base font-bold text-[#2F2F2F] transition-colors border border-[#E2E2E2] rounded-full bg-white hover:bg-[#F9F9F9]"
							@click="handleEdit(v.id)"
						>
							<span class="material-symbols-outlined text-[20px]">edit_square</span>
							編輯
						</button>
						<button
							class="flex justify-center items-center w-[52px] h-[52px] text-[#B06A6A] transition-colors border border-[#E2E2E2] rounded-full bg-white hover:bg-[#FFF5F5]"
							@click="handleRemove(v.id)"
						>
							<span class="material-symbols-outlined text-[24px]">delete</span>
						</button>
					</div>
				</article>
			</div>
		</div>
		<div class="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
			<div
				v-for="toast in toasts"
				:key="toast.id"
				class="flex items-center gap-3 px-5 py-4 min-w-[300px] bg-white border-l-4 rounded-lg shadow-lg animate-slide-in"
				:class="{
					'border-[#4CAF50]': toast.type === 'success',
					'border-[#F44336]': toast.type === 'error',
					'border-[#2196F3]': toast.type === 'info',
				}"
			>
				<span
					class="material-symbols-outlined text-[24px]"
					:class="{
						'text-[#4CAF50]': toast.type === 'success',
						'text-[#F44336]': toast.type === 'error',
						'text-[#2196F3]': toast.type === 'info',
					}"
				>
					{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
				</span>
				<span class="text-base font-medium text-[#2F2F2F]">{{ toast.message }}</span>
			</div>
		</div>
		<div
			v-if="deleteModal.show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
			@click.self="cancelDelete"
		>
			<div class="bg-white rounded-[24px] p-8 max-w-md w-full mx-4 shadow-2xl">
				<div class="flex items-center gap-3 mb-4">
					<div class="grid place-items-center w-12 h-12 rounded-full bg-[#FFEBEE]">
						<span class="material-symbols-outlined text-[28px] text-[#B06A6A]">warning</span>
					</div>
					<h3 class="text-[24px] font-extrabold text-[#2F2F2F]">確認刪除</h3>
				</div>
				<p class="text-base text-[#7B7B7B] mb-6">
					確定要刪除車輛「<span class="font-bold text-[#2F2F2F]">{{ deleteModal.vehicleName }}</span>」嗎？此操作無法復原。
				</p>
				<div class="flex gap-3">
					<button
						class="flex-1 px-6 py-3 text-base font-bold text-[#2F2F2F] transition-colors border border-[#E2E2E2] rounded-full bg-white hover:bg-[#F9F9F9]"
						@click="cancelDelete"
					>
						取消
					</button>
					<button
						class="flex-1 px-6 py-3 text-base font-bold text-white transition-colors rounded-full bg-[#B06A6A] hover:bg-[#9a5a5a]"
						@click="confirmDelete"
					>
						確認刪除
					</button>
				</div>
			</div>
		</div>
		<div
			v-if="editModal.show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
			@click.self="cancelEdit"
		>
			<div class="bg-white rounded-[24px] p-8 max-w-md w-full mx-4 shadow-2xl">
				<div class="flex items-center gap-3 mb-6">
					<div class="grid place-items-center w-12 h-12 rounded-full bg-[#E7E1DA]">
						<span class="material-symbols-outlined text-[28px] text-[#6E7A86]">edit_square</span>
					</div>
					<h3 class="text-[24px] font-extrabold text-[#2F2F2F]">編輯車輛</h3>
				</div>
				<div class="flex flex-col gap-4 mb-6">
					<div>
						<label class="block mb-2 text-sm font-bold text-[#2F2F2F]">品牌</label>
						<input
							v-model="editModal.form.brand"
							type="text"
							class="w-full px-4 py-3 text-base border border-[#E2E2E2] rounded-xl bg-white focus:outline-none focus:border-[#6B6B5C]"
							placeholder="例如：Toyota"
						/>
					</div>
					<div>
						<label class="block mb-2 text-sm font-bold text-[#2F2F2F]">型號</label>
						<input
							v-model="editModal.form.model"
							type="text"
							class="w-full px-4 py-3 text-base border border-[#E2E2E2] rounded-xl bg-white focus:outline-none focus:border-[#6B6B5C]"
							placeholder="例如：Camry"
						/>
					</div>
					<div>
						<label class="block mb-2 text-sm font-bold text-[#2F2F2F]">車牌號碼</label>
						<input
							v-model="editModal.form.plate"
							type="text"
							class="w-full px-4 py-3 text-base border border-[#E2E2E2] rounded-xl bg-white focus:outline-none focus:border-[#6B6B5C]"
							placeholder="例如：ABC-1234"
						/>
					</div>
				</div>
				<div class="flex gap-3">
					<button class="flex-1 px-6 py-3 text-base font-bold text-[#2F2F2F] transition-colors border border-[#E2E2E2] rounded-full bg-white hover:bg-[#F9F9F9]" @click="cancelEdit">
						取消
					</button>
					<button class="flex-1 px-6 py-3 text-base font-bold text-white transition-colors rounded-full bg-[#6B6B5C] hover:bg-[#5a5a4d]" @click="saveEdit">
						儲存
					</button>
				</div>
			</div>
		</div>
	</section>
</template>