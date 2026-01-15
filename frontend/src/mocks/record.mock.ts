export type RecordItem = {
  id: number;
  date: string;
  title: string;
  desc: string;
  price: number;
};

export type CarOwner = {
  id: number;
  name: string;
  phone: string;
  car: string;
  records: RecordItem[];
};

export const mockCarOwners: CarOwner[] = [
  {
    id: 1,
    name: '王小明',
    phone: '0912-345-678',
    car: 'Toyota Camry 2020',
    records: [
      { id: 1, date: '2024-11-15', title: '定期保養', desc: '更換機油、濾芯', price: 3500 },
      { id: 2, date: '2024-08-20', title: '輪胎更換', desc: '四輪更換', price: 12000 },
      { id: 3, date: '2024-05-10', title: '煞車檢修', desc: '煞車皮更換', price: 3500 },
    ],
  },
  {
    id: 2,
    name: '李大華',
    phone: '0923-456-789',
    car: 'Honda CR-V 2019',
    records: [{ id: 1, date: '2024-10-01', title: '冷氣檢修', desc: '冷媒補充', price: 2800 }],
  },
];
