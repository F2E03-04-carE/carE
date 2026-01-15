import { ref, computed } from 'vue';
import {
  mockCustomerProfiles,
  type CustomerProfile,
  type ServiceRecord,
} from '@/mocks/customer.mock';

export type Order = ServiceRecord & {
  customer: { name: string; phone: string };
  vehicle: { model: string };
};

// 響應式的假資料
const reactiveProfiles = ref<CustomerProfile[]>(JSON.parse(JSON.stringify(mockCustomerProfiles)));

export function useOrders() {
  // 浮窗控制
  const selectedOrder = ref<Order | null>(null);
  const showModal = ref(false);

  // 將資料攤平，以符合工單列表的顯示需求
  const orders = computed<Order[]>(() =>
    reactiveProfiles.value.flatMap((profile) =>
      profile.serviceHistory.map((record) => ({
        ...record,
        customer: { name: profile.name, phone: profile.phone },
        vehicle: { model: profile.vehicle.model },
      })),
    ),
  );

  // 開啟浮窗
  const open = (order: Order) => {
    selectedOrder.value = order;
    showModal.value = true;
  };

  // 儲存修改
  const save = (status: ServiceRecord['status'], note?: string) => {
    if (!selectedOrder.value) return;

    const orderId = selectedOrder.value.id;

    for (const profile of reactiveProfiles.value) {
      const record = profile.serviceHistory.find((r) => r.id === orderId);
      if (record) {
        record.status = status;
        record.note = note ?? record.note;
        break;
      }
    }
    showModal.value = false;
  };

  return {
    orders,
    selectedOrder,
    showModal,
    open,
    save,
  };
}
