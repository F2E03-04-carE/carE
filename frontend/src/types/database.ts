/**
 * 資料庫型別定義
 */

// 前端使用的保養廠項目格式（SearchResults）
export interface GarageItem {
  id: number;
  name: string;
  score: number;
  distance: number;
  reviewCount: number;
  brands: string[];
  services: string[];
  image?: string;
  address: string;
  city: string;
  district: string;
}

// 詳情頁使用的保養廠格式（DetailView）
export interface GarageDetail extends GarageItem {
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  ownerName?: string;
  operatingHours?: any;
}
