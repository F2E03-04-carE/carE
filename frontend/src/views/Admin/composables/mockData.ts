import type { Member, Review } from './memberCore';

// 產生隨機日期 (2023-01-01 ~ 2026-01-18)
const getRandomDate = () => {
  const start = new Date('2023-01-01').getTime();
  const end = new Date('2026-01-18').getTime();
  const randomTime = start + Math.random() * (end - start);
  const date = new Date(randomTime);
  return date.toISOString().split('T')[0];
};

export const mockCarOwners: Member[] = [
  {
    id: '1001',
    name: '王小明',
    email: 'ming@example.com',
    phone: '0912-345-678',
    joinDate: '2026-01-15',
    status: 'Active',
    vehicles: [
      { brand: 'Toyota', model: 'Altis', year: 2018, plate: 'ABC-1234' },
      { brand: 'Honda', model: 'CR-V', year: 2021, plate: 'XYZ-5678' },
    ],
    bookings: [
      { date: '2026/01/20', shop: '大安優質修車廠', service: '定期保養', status: 'completed' },
      { date: '2026/01/05', shop: '板橋快速保養中心', service: '快速保養', status: 'completed' },
    ],
  },
  {
    id: '1002',
    name: '李美玲',
    email: 'mei@example.com',
    phone: '0922-333-444',
    joinDate: '2026-01-20',
    status: 'Active',
    vehicles: [{ brand: 'Benz', model: 'C300', year: 2019, plate: 'BEN-8888' }],
    bookings: [{ date: '2026/01/18', shop: '中和輪胎行', service: '輪胎更換', status: 'pending' }],
  },
  {
    id: '1003',
    name: '張大華',
    email: 'hua@example.com',
    phone: '0933-555-666',
    joinDate: '2026-01-10',
    status: 'Suspended',
    vehicles: [],
    bookings: [],
  },
  {
    id: '1004',
    name: '陳建國',
    email: 'chen@example.com',
    phone: '0911-222-333',
    joinDate: '2026-01-05',
    status: 'Active',
    vehicles: [{ brand: 'Ford', model: 'Focus', year: 2020, plate: 'F-9999' }],
    bookings: [
      { date: '2026/01/10', shop: '三重汽車電機', service: '冷氣維修', status: 'completed' },
    ],
  },
  {
    id: '1005',
    name: '林雅婷',
    email: 'lin@example.com',
    phone: '0955-666-777',
    joinDate: '2026-01-12',
    status: 'Active',
    vehicles: [],
    bookings: [],
  },
];

export const mockShops: Member[] = [
  {
    id: '2001',
    name: '大安優質修車廠',
    shopOwner: '陳老闆',
    email: 'daan@example.com',
    phone: '02-2345-6789',
    rating: 4.8,
    status: 'VerifiedPaid',
    joinDate: getRandomDate(),
    address: '台北市大安區和平東路二段100號',
    services: ['定期保養', '輪胎更換'],
    appliedPlan: 'Paid',
    orderCount: Math.floor(Math.random() * 500) + 100,
  },
  {
    id: '2002',
    name: '板橋快速保養中心',
    shopOwner: '林師傅',
    email: 'banqiao@example.com',
    phone: '02-8901-2345',
    rating: 4.5,
    status: 'VerifiedFree',
    joinDate: getRandomDate(),
    address: '新北市板橋區文化路一段200號',
    services: ['快速保養'],
    appliedPlan: 'Free',
    orderCount: Math.floor(Math.random() * 200) + 50,
  },
  {
    id: '2003',
    name: '中和輪胎行',
    shopOwner: '黃店長',
    email: 'zhonghe@example.com',
    phone: '02-3456-7890',
    rating: 4.2,
    status: 'Pending',
    joinDate: getRandomDate(),
    appliedPlan: 'Paid',
    address: '新北市中和區中正路300號',
    services: ['輪胎更換'],
    orderCount: Math.floor(Math.random() * 50) + 5,
  },
  {
    id: '2004',
    name: '永和專業烤漆',
    shopOwner: '張技師',
    email: 'yonghe@example.com',
    phone: '02-4567-8901',
    rating: 4.9,
    status: 'Expired',
    joinDate: getRandomDate(),
    address: '新北市永和區永利路50號',
    services: ['鈑金烤漆'],
    appliedPlan: 'Free',
    orderCount: Math.floor(Math.random() * 300) + 150,
  },
  {
    id: '2005',
    name: '三重汽車電機',
    shopOwner: '李老闆',
    email: 'sanchong@example.com',
    phone: '02-5678-9012',
    rating: 3.5,
    status: 'Pending',
    joinDate: getRandomDate(),
    appliedPlan: 'Free',
    address: '新北市三重區重陽路四段60號',
    services: ['冷氣維修', '電機電路'],
    orderCount: Math.floor(Math.random() * 100) + 20,
  },
];

export const mockReviews: Review[] = [
  {
    id: 'R001',
    author: '王小明',
    targetShop: '大安優質修車廠',
    rating: 5,
    content: '服務很好，老闆親切！',
    date: '2026-01-18',
    status: 'Published',
  },
  {
    id: 'R002',
    author: '李美玲',
    targetShop: '板橋快速保養中心',
    rating: 4,
    content: '速度很快，但休息區有點小。',
    date: '2026-01-17',
    status: 'Published',
  },
  {
    id: 'R003',
    author: '陳建國',
    targetShop: '中和輪胎行',
    rating: 1,
    content: '換完輪胎後定位還是不準，回去處理還要等很久。',
    date: '2026-01-15',
    status: 'Hidden',
  },
  {
    id: 'R004',
    author: '張大華',
    targetShop: '永和專業烤漆',
    rating: 5,
    content: '烤漆顏色完全沒有色差，像新的一樣！',
    date: '2026-01-14',
    status: 'Published',
  },
];