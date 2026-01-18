import { ref } from 'vue';

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
}

export function useMemberData() {
  // 假資料 - 車主 (CarOwners)
  const carOwners = ref<Member[]>([
    { 
      id: '1001', name: '王小明', email: 'ming@example.com', joinDate: '2026-01-15', status: 'Active',
      vehicles: [
        { brand: 'Toyota', model: 'Altis', year: 2018, plate: 'ABC-1234' },
        { brand: 'Honda', model: 'CR-V', year: 2021, plate: 'XYZ-5678' }
      ]
    },
    { 
      id: '1002', name: '李美玲', email: 'mei@example.com', joinDate: '2026-01-20', status: 'Active',
      vehicles: [{ brand: 'Benz', model: 'C300', year: 2019, plate: 'BEN-8888' }]
    },
    { id: '1003', name: '張大華', email: 'hua@example.com', joinDate: '2026-01-10', status: 'Suspended', vehicles: [] },
    { id: '1004', name: '陳建國', email: 'chen@example.com', joinDate: '2026-01-05', status: 'Active', vehicles: [{ brand: 'Ford', model: 'Focus', year: 2020, plate: 'F-9999' }] },
    { id: '1005', name: '林雅婷', email: 'lin@example.com', joinDate: '2026-01-12', status: 'Active', vehicles: [] },
  ]);

  // 假資料 - 維修廠 (Shops)
  const shops = ref<Member[]>([
    { 
      id: '2001', name: '大安優質修車廠', shopOwner: '陳老闆', phone: '02-2345-6789', rating: 4.8, status: 'VerifiedPaid',
      address: '台北市大安區和平東路二段100號', services: ['定期保養', '輪胎更換']
    },
    { 
      id: '2002', name: '板橋快速保養中心', shopOwner: '林師傅', phone: '02-8901-2345', rating: 4.5, status: 'VerifiedFree',
      address: '新北市板橋區文化路一段200號', services: ['快速保養']
    },
    { 
      id: '2003', name: '中和輪胎行', shopOwner: '黃店長', phone: '02-3456-7890', rating: 4.2, status: 'Pending',
      appliedPlan: 'Paid', // 申請付費方案
      address: '新北市中和區中正路300號', services: ['輪胎更換']
    },
    { 
      id: '2004', name: '永和專業烤漆', shopOwner: '張技師', phone: '02-4567-8901', rating: 4.9, status: 'Expired',
      address: '新北市永和區永利路50號', services: ['鈑金烤漆']
    },
    { 
      id: '2005', name: '三重機車行', shopOwner: '李老闆', phone: '02-5678-9012', rating: 3.5, status: 'Pending',
      appliedPlan: 'Free', // 申請免費方案
      address: '新北市三重區重陽路四段60號', services: ['機車維修']
    },
  ]);

  return { carOwners, shops };
}
