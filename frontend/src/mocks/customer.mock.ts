export type ServiceStatus = '進行中' | '待確認' | '已完成' | '已取車';

export interface ServiceRecord {
  id: string; // 工單 ID，例如 'W-2026-001'
  status: ServiceStatus;
  serviceType: string; // 服務類型，例如 '定期保養'
  requestTime: string; // 客戶請求時間
  scheduledDate: string; // 預計日期
  scheduledTime: string; // 預計時間
  description?: string; // 維修細節描述 (原 RecordItem 的 desc)
  price?: number; // 價格 (原 RecordItem 的 price)
  note?: string; // 客戶備註
}

export interface CustomerProfile {
  id: number; // 客戶 ID
  name: string;
  phone: string;
  vehicle: {
    model: string; // 車輛型號
  };
  serviceHistory: ServiceRecord[];
}

export const mockCustomerProfiles: CustomerProfile[] = [
  {
    id: 1,
    name: '王小明',
    phone: '0912-345-678',
    vehicle: { model: 'Toyota Camry 2020' },
    serviceHistory: [
      {
        id: 'W-2026-001',
        status: '進行中',
        serviceType: '定期保養',
        requestTime: '2026-01-07 14:20',
        scheduledDate: '2026-01-09',
        scheduledTime: '09:30',
        note: '希望使用原廠機油',
        description: '更換機油、濾芯',
        price: 3500,
      },
    ],
  },
  {
    id: 2,
    name: '李大華',
    phone: '0923-456-789',
    vehicle: { model: 'Honda CR-V 2019' },
    serviceHistory: [
      {
        id: 'W-2026-002',
        status: '待確認',
        serviceType: '引擎檢修',
        requestTime: '2026-01-06 09:50',
        scheduledDate: '2026-01-09',
        scheduledTime: '10:00',
        note: '引擎聲音異常，請詳細檢查',
      },
    ],
  },
  {
    id: 3,
    name: '張三',
    phone: '0933-222-333',
    vehicle: { model: 'BMW X5' },
    serviceHistory: [
      {
        id: 'W-2026-003',
        status: '已完成',
        serviceType: '煞車檢修',
        requestTime: '2026-01-05 11:15',
        scheduledDate: '2026-01-08',
        scheduledTime: '13:00',
        note: '',
        description: '更換後來令片',
        price: 4500,
      },
    ],
  },
];
