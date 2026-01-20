import type { Order, WorkshopInfo, BusinessHour } from '@/types/garage';

// 廠房基本資訊假資料
export const mockWorkshopInfo: WorkshopInfo = {
  name: '我的維修廠',
  phone: '02-12345678',
  address: '台北市信義區信義路五段7號',
  taxId: '12345678',
  description: '我們提供專業的維修服務，擁有豐富的經驗和技術。',
  brands: ['Toyota', 'Honda'],
  skills: ['定期保養'],
  images: [
    'https://placehold.co/600x400/e0dfd6/6b6b5a?text=Garage+1',
    'https://placehold.co/600x400/e0dfd6/6b6b5a?text=Garage+2',
  ],
};

// 營業時間假資料
export const mockBusinessHours: BusinessHour[] = [
  { day: '週一', enabled: true, start: '09:00', end: '18:00' },
  { day: '週二', enabled: true, start: '09:00', end: '18:00' },
  { day: '週三', enabled: true, start: '09:00', end: '18:00' },
  { day: '週四', enabled: true, start: '09:00', end: '18:00' },
  { day: '週五', enabled: true, start: '09:00', end: '18:00' },
  { day: '週六', enabled: false, start: '', end: '' },
  { day: '週日', enabled: false, start: '', end: '' },
];

// 選項假資料
export const mockBrandOptions = ['Toyota', 'Honda', 'Nissan', 'Ford', 'BMW', 'Benz'];
export const mockSkillOptions = ['定期保養', '引擎維修', '板金噴漆', '輪胎更換', '冷氣維修'];

// 儀表板統計假資料
export const mockStats = [
  { label: '今日預約', value: 12, icon: 'event_note' },
  { label: '待確認工單', value: 5, icon: 'assignment' },
  { label: '本月完成', value: 45, icon: 'trending_up' },
];

// 工單列表假資料
export const mockOrders: Order[] = [
  {
    id: 'ORD-20260105-001',
    status: '待確認',
    requestTime: '2026-01-04 09:30',
    scheduledDate: '2026-01-05',
    scheduledTime: '10:00',
    serviceType: '輪胎更換',
    note: '希望換抓地力好一點的輪胎，預算兩萬元左右。',
    customer: {
      id: 'CUST-001',
      name: '張君雅',
      phone: '0911-222-333',
    },
    vehicle: {
      id: 'VEH-001',
      licensePlate: 'ABC-7890',
      model: 'Nissan Sentra',
      brand: 'Nissan',
    },
  },
  {
    id: 'ORD-20260110-002',
    status: '進行中',
    requestTime: '2026-01-09 13:00',
    scheduledDate: '2026-01-10',
    scheduledTime: '15:00',
    serviceType: '煞車系統檢查',
    note: '煞車有異音，踩下去軟軟的，請檢查總泵。',
    customer: {
      id: 'CUST-002',
      name: '陳小華',
      phone: '0922-333-444',
    },
    vehicle: {
      id: 'VEH-002',
      licensePlate: 'XYZ-1234',
      model: 'BMW 3系列',
      brand: 'BMW',
    },
  },
  {
    id: 'ORD-20260122-003',
    status: '已完成',
    requestTime: '2026-01-21 16:00',
    scheduledDate: '2026-01-22',
    scheduledTime: '09:00',
    serviceType: '引擎故障燈診斷',
    note: '引擎燈亮了三天，但開起來沒什麼異狀。',
    customer: {
      id: 'CUST-003',
      name: '林美麗',
      phone: '0933-444-555',
    },
    vehicle: {
      id: 'VEH-003',
      licensePlate: 'DEF-5678',
      model: 'Mercedes-Benz C-Class',
      brand: 'Mercedes-Benz',
    },
  },
];

// 訂閱方案假資料
export const mockSubscriptionPlans = [
  {
    id: 'free',
    title: '免費試用方案',
    subtitle: '先試用，滿意再升級',
    price: 'NT$ 0',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示 （試用期滿僅剩此功能）'],
    tag: null,
  },
  {
    id: 'pro',
    title: '永久會員方案',
    subtitle: '一次付費，終身使用',
    price: 'NT$ 5,555',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示', '永久使用權限'],
    tag: '一次性買斷',
  },
];
