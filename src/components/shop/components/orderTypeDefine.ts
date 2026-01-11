// orderTypeDefine.ts
export type OrderStatus = '進行中' | '待確認' | '已完成' | '已取車'

export interface Customer {
  name: string
  phone: string
}

export interface Vehicle {
  model: string
  service: string
}

export interface Order {
  id: string
  status: OrderStatus
  customer: Customer
  vehicle: Vehicle
  requestTime: string
  date: string
  time: string
  note?: string
}
