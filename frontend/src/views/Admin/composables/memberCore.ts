import { ref } from 'vue';
import { mockCarOwners, mockShops } from './mockData';

// --- 型別定義 ---

export interface Vehicle {
  brand: string;
  model: string;
  year: number;
  plate: string;
}

export type BookingStatus = 'completed' | 'pending' | 'cancelled';

export interface Booking {
  id: string;
  date: string;
  shop: string;
  service: string;
  status: BookingStatus;
}

export type MemberStatus =
  | 'Active'
  | 'Suspended'
  | 'Pending'
  | 'VerifiedFree'
  | 'VerifiedPaid'
  | 'Expired';

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  joinDate?: string;
  status: MemberStatus;
  appliedPlan?: 'Free' | 'Paid';
  vehicles?: Vehicle[];
  shopOwner?: string;
  rating?: number;
  address?: string;
  services?: string[];
  orderCount?: number;
  bookings?: Booking[];
}

export interface Review {
  id: string;
  author: string;
  targetShop: string;
  rating: number;
  content: string;
  date: string;
  status: 'Published' | 'Hidden';
}

export interface ActionButton {
  key: string;
  label: string;
  class: string;
  onClick?: () => void;
}

// --- 功能邏輯與 Composable ---

export function useMemberData() {
  const carOwners = ref<Member[]>(mockCarOwners);
  const shops = ref<Member[]>(mockShops);
  return { carOwners, shops };
}

export function useMemberActions(member: Member, closeFn: () => void): ActionButton[] {
  const btns: ActionButton[] = [];

  // 先根據狀態加入功能性按鈕
  if (member.status === 'Pending') {
    btns.push({
      key: 'approve',
      label: `通過審核 (${member.appliedPlan === 'Paid' ? '付費' : '免費'})`,
      class: 'bg-green-600 text-white hover:bg-green-700 border-transparent'
    });
  } else if (['Active', 'VerifiedFree', 'VerifiedPaid', 'Expired'].includes(member.status)) {
    btns.push({
      key: 'suspend',
      label: '停權會員',
      class: 'bg-red-600 text-white hover:bg-red-700 border-transparent'
    });
  }

  if (member.status === 'Expired') {
    btns.push({
      key: 'activate_payment',
      label: '開通付費',
      class: 'bg-yellow-500 text-white hover:bg-yellow-600 border-transparent'
    });
  }

  if (member.status === 'Suspended') {
    btns.push({
      key: 'restore',
      label: '恢復權限',
      class: 'bg-green-600 text-white hover:bg-green-700 border-transparent'
    });
  }

  // 最後加入「關閉」按鈕
  btns.push({
    key: 'close',
    label: '關閉',
    class: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    onClick: closeFn
  });

  return btns;
}

const STATUS_LABELS: Record<MemberStatus, string> = {
  VerifiedFree: '已驗證 (免費)',
  VerifiedPaid: '已驗證 (付費)',
  Pending: '審核中',
  Suspended: '已停權',
  Expired: '已過期',
  Active: '正常',
};

const STATUS_CLASSES: Record<MemberStatus, string> = {
  VerifiedFree: 'bg-blue-100 text-blue-800',
  VerifiedPaid: 'bg-yellow-100 text-yellow-800',
  Pending: 'bg-gray-100 text-gray-800',
  Suspended: 'bg-red-100 text-red-800',
  Expired: 'bg-orange-100 text-orange-800',
  Active: 'bg-green-100 text-green-800',
};

export const getStatusLabel = (status: MemberStatus): string => STATUS_LABELS[status] || status;
export const getStatusClass = (status: MemberStatus): string =>
  STATUS_CLASSES[status] || 'bg-gray-100 text-gray-800';
