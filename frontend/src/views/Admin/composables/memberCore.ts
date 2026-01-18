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

// 定義操作按鈕介面
export interface ActionButton {
  label: string;
  class: string;
  onClick?: () => void;
}

// 產生操作按鈕邏輯
export function useMemberActions(member: Member, closeFn: () => void): ActionButton[] {
  const btns: ActionButton[] = [
    { label: '關閉', class: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50', onClick: closeFn }
  ];

  if (member.status === 'Pending') {
    btns.push({
      label: `通過審核 (${member.appliedPlan === 'Paid' ? '付費' : '免費'})`,
      class: 'bg-green-600 text-white hover:bg-green-700 border-transparent'
    });
  } else if (['Active', 'VerifiedFree', 'VerifiedPaid', 'Expired'].includes(member.status)) {
    btns.push({
      label: '停權會員',
      class: 'bg-red-600 text-white hover:bg-red-700 border-transparent'
    });
  }

  if (member.status === 'Expired') {
    btns.push({
      label: '開通付費',
      class: 'bg-yellow-500 text-white hover:bg-yellow-600 border-transparent'
    });
  }

  if (member.status === 'Suspended') {
    btns.push({
      label: '恢復權限',
      class: 'bg-green-600 text-white hover:bg-green-700 border-transparent'
    });
  }

  return btns.reverse();
}

// 取得狀態顯示文字
export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'VerifiedFree': return '已驗證 (免費)';
    case 'VerifiedPaid': return '已驗證 (付費)';
    case 'Pending': return '審核中';
    case 'Suspended': return '已停權';
    case 'Expired': return '已過期';
    case 'Active': return '正常';
    default: return status;
  }
};

// 取得狀態對應的 CSS 樣式類別
export const getStatusClass = (status: string) => {
  switch (status) {
    case 'VerifiedFree': return 'bg-blue-100 text-blue-800';
    case 'VerifiedPaid': return 'bg-yellow-100 text-yellow-800';
    case 'Pending': return 'bg-gray-100 text-gray-800';
    case 'Suspended': return 'bg-red-100 text-red-800';
    case 'Expired': return 'bg-orange-100 text-orange-800';
    case 'Active': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// 假資料 - 車主 (CarOwners)
export const mockCarOwners: Member[] = [
  { 
    id: '1001', name: '王小明', email: 'ming@example.com', phone: '0912-345-678', joinDate: '2026-01-15', status: 'Active',
    vehicles: [
      { brand: 'Toyota', model: 'Altis', year: 2018, plate: 'ABC-1234' },
      { brand: 'Honda', model: 'CR-V', year: 2021, plate: 'XYZ-5678' }
    ],
    bookings: [
      { date: '2026/01/20', shop: '大安優質修車廠', service: '定期保養', status: 'completed' },
      { date: '2026/01/05', shop: '板橋快速保養中心', service: '快速保養', status: 'completed' }
    ]
  },
  { 
    id: '1002', name: '李美玲', email: 'mei@example.com', phone: '0922-333-444', joinDate: '2026-01-20', status: 'Active',
    vehicles: [{ brand: 'Benz', model: 'C300', year: 2019, plate: 'BEN-8888' }],
    bookings: [
       { date: '2026/01/18', shop: '中和輪胎行', service: '輪胎更換', status: 'pending' }
    ]
  },
  { id: '1003', name: '張大華', email: 'hua@example.com', phone: '0933-555-666', joinDate: '2026-01-10', status: 'Suspended', vehicles: [], bookings: [] },
  { id: '1004', name: '陳建國', email: 'chen@example.com', phone: '0911-222-333', joinDate: '2026-01-05', status: 'Active', vehicles: [{ brand: 'Ford', model: 'Focus', year: 2020, plate: 'F-9999' }], bookings: [{ date: '2026/01/10', shop: '三重汽車電機', service: '冷氣維修', status: 'completed' }] },
  { id: '1005', name: '林雅婷', email: 'lin@example.com', phone: '0955-666-777', joinDate: '2026-01-12', status: 'Active', vehicles: [], bookings: [] },
];

// 假資料 - 維修廠 (Shops)
export const mockShops: Member[] = [
  { 
    id: '2001', name: '大安優質修車廠', shopOwner: '陳老闆', email: 'daan@example.com', phone: '02-2345-6789', rating: 4.8, status: 'VerifiedPaid',
    address: '台北市大安區和平東路二段100號', services: ['定期保養', '輪胎更換'],
    appliedPlan: 'Paid',
    orderCount: Math.floor(Math.random() * 500) + 100
  },
  { 
    id: '2002', name: '板橋快速保養中心', shopOwner: '林師傅', email: 'banqiao@example.com', phone: '02-8901-2345', rating: 4.5, status: 'VerifiedFree',
    address: '新北市板橋區文化路一段200號', services: ['快速保養'],
    appliedPlan: 'Free',
    orderCount: Math.floor(Math.random() * 200) + 50
  },
  { 
    id: '2003', name: '中和輪胎行', shopOwner: '黃店長', email: 'zhonghe@example.com', phone: '02-3456-7890', rating: 4.2, status: 'Pending',
    appliedPlan: 'Paid', // 申請付費方案
    address: '新北市中和區中正路300號', services: ['輪胎更換'],
    orderCount: Math.floor(Math.random() * 50) + 5
  },
  { 
    id: '2004', name: '永和專業烤漆', shopOwner: '張技師', email: 'yonghe@example.com', phone: '02-4567-8901', rating: 4.9, status: 'Expired',
    address: '新北市永和區永利路50號', services: ['鈑金烤漆'],
    appliedPlan: 'Free',
    orderCount: Math.floor(Math.random() * 300) + 150
  },
  { 
    id: '2005', name: '三重汽車電機', shopOwner: '李老闆', email: 'sanchong@example.com', phone: '02-5678-9012', rating: 3.5, status: 'Pending',
    appliedPlan: 'Free', // 申請免費方案
    address: '新北市三重區重陽路四段60號', services: ['冷氣維修', '電機電路'],
    orderCount: Math.floor(Math.random() * 100) + 20
  },
];
