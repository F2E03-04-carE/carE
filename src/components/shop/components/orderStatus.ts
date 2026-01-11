import type { OrderStatus } from './orderTypeDefine'

export const statusColors: Record<OrderStatus, string> = {
  進行中: 'bg-green-400 text-white',
  待確認: 'bg-amber-400 text-white',
  已完成: 'bg-[#6b6b5a] text-white',
}

export const statusClass = (status: OrderStatus) => statusColors[status] ?? 'bg-gray-400 text-white'
