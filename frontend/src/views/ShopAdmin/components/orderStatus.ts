// 根據工單狀態決定標籤顏色
import type { OrderStatus } from '../types';

export const statusColors: Record<OrderStatus, string> = {
  進行中: 'bg-green-400 text-white',
  待確認: 'bg-amber-400 text-white',
  已完成: 'bg-[#6b6b5a] text-white',
  已取車: 'bg-gray-400 text-white',
};

export const statusClass = (status: OrderStatus) =>
  statusColors[status] ?? 'bg-gray-400 text-white';
