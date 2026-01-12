/**
 * 資料模型 (Data Models)
 * 定義資料庫表格的結構
 *
 * 這裡使用 TypeScript interface 先定義資料結構
 * 之後整合 Drizzle ORM 時會轉換成 schema
 */

// 使用者資料模型
export interface User {
  id: number
  email: string
  name: string
  phone?: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

// 車輛資料模型
export interface Vehicle {
  id: number
  userId: number          // 關聯到 User
  licensePlate: string    // 車牌號碼
  brand: string           // 品牌（Toyota, Honda...）
  model: string           // 車型
  year?: number           // 年份
  isDefault: boolean      // 是否為預設車輛
  createdAt: Date
  updatedAt: Date
}

// 維修廠資料模型
export interface Shop {
  id: number
  ownerId: number         // 關聯到 User（店主）
  name: string            // 店名
  taxId: string           // 統一編號
  address: string
  phone: string
  description?: string
  isVerified: boolean     // 是否已付費上架
  createdAt: Date
  updatedAt: Date
}

// 預約資料模型
export interface Booking {
  id: number
  userId: number          // 關聯到 User
  shopId: number          // 關聯到 Shop
  vehicleId: number       // 關聯到 Vehicle
  serviceType: string     // 維修項目
  scheduledAt: Date       // 預約時間
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

// 評價資料模型
export interface Review {
  id: number
  userId: number          // 關聯到 User
  shopId: number          // 關聯到 Shop
  bookingId: number       // 關聯到 Booking（確保消費過才能評價）
  rating: number          // 評分 1-5
  content?: string        // 評價內容
  createdAt: Date
  updatedAt: Date
}
