import { ref } from 'vue';
import type { Order } from './orderTypeDefine';

export function useOrders() {
  // 浮窗控制
  const selectedOrder = ref<Order | null>(null);
  const showModal = ref(false);

  // 開啟浮窗
  const open = (order: Order) => {
    selectedOrder.value = order;
    showModal.value = true;
  };

  // 工單資料（假資料）
  const orders = ref<Order[]>([
    {
      id: 'W-2026-001',
      status: '進行中',
      customer: { name: '王小明', phone: '0912-345-678' },
      vehicle: { model: 'Toyota Camry', service: '定期保養' },
      requestTime: '2026-01-07 14:20',
      date: '2026-01-09',
      time: '09:30',
      note: '希望使用原廠機油',
    },
    {
      id: 'W-2026-002',
      status: '待確認',
      customer: { name: '李大華', phone: '0923-456-789' },
      vehicle: { model: 'Honda CR-V', service: '引擎檢修' },
      requestTime: '2026-01-06 09:50',
      date: '2026-01-09',
      time: '10:00',
      note: '引擎聲音異常，請詳細檢查',
    },
    {
      id: 'W-2026-003',
      status: '已完成',
      customer: { name: '張三', phone: '0933-222-333' },
      vehicle: { model: 'BMW X5', service: '煞車檢修' },
      requestTime: '2026-01-05 11:15',
      date: '2026-01-08',
      time: '13:00',
      note: '',
    },
    {
      id: 'W-2026-004',
      status: '已取車',
      customer: { name: '林小七', phone: '0988-777-666' },
      vehicle: { model: 'Audi A6', service: '輪胎更換' },
      requestTime: '2026-01-02 10:00',
      date: '2026-01-09',
      time: '14:00',
      note: '輪胎品牌改為 Michelin',
    },
  ]);

  // 儲存修改
  const save = (status: Order['status'], note?: string) => {
    if (!selectedOrder.value) return;

    orders.value = orders.value.map((order) =>
      order.id === selectedOrder.value!.id ? { ...order, status, note: note ?? order.note } : order,
    );

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
