export interface Review {
  id: string;
  author: string;
  targetShop: string;
  rating: number;
  content: string;
  date: string;
  status: 'Published' | 'Hidden';
}

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
