export type OrderStatus = '進行中' | '待確認' | '已完成' | '已取車';

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  requestTime: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceType: string;
  note?: string;
  customer: Customer;
  vehicle: Vehicle;
}

export interface ServiceRecord {
  id: string;
  scheduledDate: string;
  serviceType: string;
  description: string;
  price?: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  vehicle: Vehicle;
  serviceHistory: ServiceRecord[];
}

export interface WorkshopInfo {
  name: string;
  phone: string;
  address: string;
  taxId: string;
  description: string;
  brands: string[];
  skills: string[];
  images: string[];
}

export interface BusinessHour {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
  capacity: number;
}

export interface SubscriptionPlan {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  tag: string | null;
}

// 維修廠申請狀態，正常開通 / 審核中 / 註冊中，或填寫資料中
export type WorkshopStatus = 'active' | 'pending_review' | 'onboarding';
