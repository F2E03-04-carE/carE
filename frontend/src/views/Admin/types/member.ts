// 定義車輛介面
export interface Vehicle {
  brand: string;
  model: string;
  year: number;
  plate: string;
}

// 定義會員介面
export interface Member {
  id: string;
  name: string; // 姓名或維修廠名稱
  email?: string; // 車主可能有
  phone?: string;
  joinDate?: string;
  status: string; // 'Active' | 'Suspended' | 'Pending' | 'VerifiedFree' | 'VerifiedPaid' | 'Expired'
  appliedPlan?: 'Free' | 'Paid'; // 維修廠申請時的方案
  // 車主 (CarOwner) 專屬
  vehicles?: Vehicle[];
  // 維修廠 (Shop) 專屬
  shopOwner?: string; // 維修廠負責人 (ShopOwner)
  rating?: number;
  address?: string;
  services?: string[];
  orderCount?: number; // 維修廠接單數量
  bookings?: { date: string; shop: string; service: string; status: string }[];
}
