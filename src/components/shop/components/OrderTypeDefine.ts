export type OrderStatus = '待確認' | '進行中' | '已完成'

export interface Order {
  id: string
  status: OrderStatus
  customer: {
    name: string
    phone: string
  }
  vehicle: {
    model: string
    service: string
  }
  date: string
  time: string
  requestTime: string
}
