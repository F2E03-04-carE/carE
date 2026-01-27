# carE 專案架構文件

> 汽車維修服務平台 - 連結車主與維修廠的整合系統

## 目錄

1. [專案概述](#專案概述)
2. [技術架構](#技術架構)
3. [檔案結構](#檔案結構)
4. [資料結構](#資料結構)
5. [API 端點](#api-端點)
6. [前端架構](#前端架構)
7. [運作邏輯](#運作邏輯)
8. [使用者流程](#使用者流程)

---

## 專案概述

carE 是一個汽車維修服務媒合平台，提供以下核心功能：

- **車主端**：搜尋維修廠、線上預約、管理預約記錄、查看維修歷史
- **維修廠端**：維修廠註冊、訂閱方案管理、預約管理、維修記錄管理
- **管理員端**：會員管理、評論審核

---

## 技術架構

### 整體架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Vue 3)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Views     │  │ Components  │  │    State Management     │  │
│  │ (頁面元件)  │  │  (UI 元件)  │  │   (Pinia Stores)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                              │                                    │
│                    ┌─────────┴─────────┐                         │
│                    │   Composables     │                         │
│                    │   (業務邏輯)       │                         │
│                    └───────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Routes    │  │ Controllers │  │      Middlewares        │  │
│  │  (路由)     │──│  (控制器)   │──│ (CORS, Rate Limiting)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Database   │  │    Auth     │  │       Storage           │  │
│  │ (PostgreSQL)│  │  (認證)     │  │   (檔案儲存)            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 技術堆疊

#### 前端 (Frontend)
| 技術 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.5.25 | 前端框架 (Composition API) |
| TypeScript | 5.9.0 | 型別系統 |
| Pinia | 3.0.4 | 狀態管理 |
| Vue Router | 4.6.3 | 路由管理 |
| Tailwind CSS | 4.1.18 | 樣式框架 |
| Vite | 7.2.4 | 建構工具 |
| Supabase JS | 2.91.0 | 後端服務客戶端 |
| v-calendar | 3.1.2 | 日曆元件 |
| FullCalendar | - | 預約行事曆 |
| @headlessui/vue | - | UI 元件庫 |
| tw-city-selector | - | 台灣縣市選擇器 |

#### 後端 (Backend)
| 技術 | 用途 |
|------|------|
| Node.js | 執行環境 (ES Modules) |
| Express.js | Web 框架 |
| Supabase | 資料庫與認證服務 |
| Drizzle ORM | ORM (已設定但未啟用) |
| Zod | 資料驗證 |
| express-rate-limit | API 速率限制 |
| OEN Pay | 金流整合 |

---

## 檔案結構

```
carE/
├── backend/                          # 後端服務
│   ├── index.js                      # 伺服器進入點
│   ├── package.json                  # 依賴管理
│   ├── data/                         # 靜態資料
│   │   ├── brands.json               # 汽車品牌資料
│   │   └── services.json             # 服務項目資料
│   ├── src/
│   │   ├── configs/                  # 設定檔
│   │   │   ├── db.js                 # Drizzle 資料庫設定
│   │   │   └── supabase.js           # Supabase 客戶端設定
│   │   ├── controllers/              # 控制器
│   │   │   ├── appointmentController.js  # 預約管理
│   │   │   ├── paymentController.js      # 金流處理
│   │   │   ├── searchController.js       # 搜尋功能
│   │   │   ├── subscriptionController.js # 訂閱管理
│   │   │   └── taxIdControllers.js       # 統編驗證
│   │   ├── models/
│   │   │   └── schema.js             # 資料庫 Schema 定義
│   │   └── routes/                   # 路由定義
│   │       ├── appointment.js        # 預約路由
│   │       ├── payment.js            # 金流路由
│   │       ├── search.js             # 搜尋路由
│   │       ├── subscription.js       # 訂閱路由
│   │       └── taxId.js              # 統編路由
│   └── tests/                        # 測試檔案
│       └── example.test.js
│
├── frontend/                         # 前端應用
│   ├── index.html                    # HTML 進入點
│   ├── package.json                  # 依賴管理
│   ├── vite.config.ts                # Vite 設定
│   ├── tsconfig.json                 # TypeScript 設定
│   ├── tailwind.config.js            # Tailwind 設定
│   ├── public/                       # 靜態資源
│   │   └── carE_logo_icon_v2_icon16x16.png
│   │
│   └── src/
│       ├── main.ts                   # 應用程式進入點
│       ├── App.vue                   # 根元件
│       ├── main.css                  # 全域樣式
│       │
│       ├── assets/                   # 靜態資源
│       │   ├── icons/                # 圖示
│       │   └── images/               # 圖片
│       │
│       ├── components/               # 元件
│       │   ├── Admin/                # 管理員元件
│       │   │   ├── CarOwnerTable.vue       # 車主列表
│       │   │   ├── MemberDetailCarOwner.vue
│       │   │   ├── MemberDetailModal.vue
│       │   │   ├── MemberDetailShop.vue
│       │   │   └── ShopTable.vue           # 店家列表
│       │   ├── Home/                 # 首頁元件
│       │   │   └── HomeSearchBar.vue       # 搜尋列
│       │   ├── layout/               # 佈局元件
│       │   │   ├── Footer.vue
│       │   │   └── HeaderNavbar.vue
│       │   ├── payment/              # 金流元件
│       │   │   ├── PaymentDrawer.vue
│       │   │   └── TermsModal.vue
│       │   ├── Search/               # 搜尋元件
│       │   │   ├── BookingTimeSelectorView.vue  # 時間選擇
│       │   │   └── DetailView.vue               # 店家詳情
│       │   ├── service-search/       # 服務搜尋
│       │   │   └── ServiceSearchFlow.vue   # 預約流程
│       │   └── ui/                   # 通用 UI 元件
│       │       ├── FormInput.vue
│       │       ├── PricingCard.vue
│       │       └── ShopCard.vue
│       │
│       ├── composables/              # 組合式函式
│       │   ├── admin/                # 管理員邏輯
│       │   │   ├── memberCore.ts
│       │   │   └── mockData.ts
│       │   ├── garage/               # 維修廠邏輯
│       │   │   ├── mockData.ts
│       │   │   ├── types.ts
│       │   │   ├── useAppointments.ts      # 預約管理
│       │   │   ├── useGarageProfile.ts     # 店家資料
│       │   │   ├── useImageUpload.ts       # 圖片上傳
│       │   │   └── useMaintenanceRecords.ts # 維修記錄
│       │   └── user/                 # 使用者邏輯
│       │       └── useUserAppointments.ts
│       │
│       ├── data/                     # 靜態資料
│       │   ├── brands.json           # 汽車品牌 (50 種)
│       │   └── services.json         # 服務項目 (14 種)
│       │
│       ├── layouts/                  # 佈局
│       │   └── GarageAdminLayout.vue
│       │
│       ├── lib/                      # 函式庫
│       │   └── supabase.ts           # Supabase 客戶端
│       │
│       ├── router/                   # 路由
│       │   └── index.ts
│       │
│       ├── stores/                   # Pinia 狀態管理
│       │   ├── auth.ts               # 認證狀態
│       │   ├── subscription.ts       # 訂閱狀態
│       │   └── user.ts               # 使用者狀態
│       │
│       ├── types/                    # TypeScript 型別
│       │   ├── database.ts           # 資料庫型別
│       │   └── garage.ts             # 維修廠型別
│       │
│       ├── utils/                    # 工具函式
│       │   ├── distance.ts           # 距離計算
│       │   └── orderStatus.ts        # 訂單狀態
│       │
│       └── views/                    # 頁面
│           ├── Admin/                # 管理員頁面
│           │   ├── AdminLogin.vue
│           │   ├── MemberManagement.vue
│           │   └── ReviewManagement.vue
│           ├── Auth/                 # 認證頁面
│           │   ├── AuthCallback.vue
│           │   ├── ForgetPassword.vue
│           │   └── LoginMode.vue
│           ├── Error/
│           │   └── ErrorView.vue
│           ├── Garage/               # 維修廠註冊
│           │   ├── GarageOnboarding.vue
│           │   ├── JoinGarage.vue
│           │   ├── SubscriptionFailure.vue
│           │   ├── SubscriptionSelection.vue
│           │   └── SubscriptionSuccess.vue
│           ├── GarageAdmin/          # 維修廠後台
│           │   ├── GarageAppointments.vue
│           │   ├── GarageDashboard.vue
│           │   ├── GarageRecords.vue
│           │   ├── GarageSettings.vue
│           │   └── WorkshopDashboard.vue
│           ├── Home/
│           │   └── Home.vue
│           ├── Legal/
│           │   ├── PrivacyPolicy.vue
│           │   └── TermsOfService.vue
│           ├── Search/
│           │   └── SearchResults.vue
│           └── User/                 # 使用者頁面
│               ├── BookingList.vue
│               ├── MaintenanceHistory.vue
│               └── UserDashboard.vue
│
└── docs/                             # 文件
    └── PROJECT_ARCHITECTURE.md       # 本文件
```

---

## 資料結構

### 資料庫 Schema (Supabase/PostgreSQL)

#### 1. garages (維修廠)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | BIGSERIAL | 主鍵 |
| name | string | 維修廠名稱 |
| garage_owner_name | string? | 負責人姓名 |
| address | string? | 地址 |
| phone | string? | 電話 |
| tax_id | string? | 統一編號 |
| description | string? | 描述 |
| cover_image_url | string? | 封面圖片 |
| city | string | 縣市 |
| district | string | 區域 |
| lat | number | 緯度 |
| lng | number | 經度 |
| rating | number | 評分 |
| review_count | number | 評論數 |
| subscription_status | enum | 訂閱狀態：none/trial/lifetime |
| trial_expiry_date | timestamp? | 試用到期日 |
| subscription_date | timestamp? | 訂閱日期 |
| last_transaction_id | string? | 最後交易 ID |
| created_at | timestamp | 建立時間 |
| updated_at | timestamp | 更新時間 |

#### 2. appointments (預約)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | BIGSERIAL | 主鍵 |
| garage_id | number | 維修廠 ID (FK) |
| customer_name | string | 顧客姓名 |
| customer_phone | string | 顧客電話 |
| car_model | string? | 車型 |
| license_plate | string? | 車牌號碼 |
| service_type | string? | 服務類型 |
| scheduled_date | string | 預約日期 (YYYY-MM-DD) |
| scheduled_time | string | 預約時間 (HH:mm:ss) |
| status | enum | 狀態：pending/confirmed/servicing/completed/cancelled |
| estimated_cost | number? | 預估費用 |
| notes | string? | 備註 |
| quotation_image_url | string? | 報價單圖片 |
| created_at | timestamp | 建立時間 |
| updated_at | timestamp | 更新時間 |

#### 3. maintenance_records (維修記錄)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | BIGSERIAL | 主鍵 |
| garage_id | number | 維修廠 ID (FK) |
| original_appointment_id | number? | 原始預約 ID (FK) |
| customer_name | string? | 顧客姓名 |
| car_model | string? | 車型 |
| license_plate | string? | 車牌號碼 |
| service_date | string | 服務日期 (YYYY-MM-DD) |
| items | JSONB | 服務項目陣列 [{ name, price }] |
| total_amount | number? | 總金額 |
| notes | string? | 備註 |
| created_at | timestamp | 建立時間 |

#### 4. garage_environment_images (維修廠環境圖片)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | BIGSERIAL | 主鍵 |
| garage_id | number | 維修廠 ID (FK) |
| image_url | string | 圖片 URL |
| display_order | number? | 顯示順序 |
| created_at | timestamp | 建立時間 |

#### 5. brands (汽車品牌)

| 欄位 | 型別 | 說明 |
|------|------|------|
| carbrand_id | number | 主鍵 |
| brand_en | string | 英文品牌名 |
| brand_zh | string | 中文品牌名 |

#### 6. services (服務項目)

| 欄位 | 型別 | 說明 |
|------|------|------|
| garageservice_id | number | 主鍵 |
| name | string | 服務名稱 |
| category | string | 分類：維修/保養/改裝/鈑金/輪胎/救援 |

#### 7. garage_brands (維修廠-品牌關聯)

| 欄位 | 型別 | 說明 |
|------|------|------|
| garage_id | number | 維修廠 ID (FK) |
| brand_id | number | 品牌 ID (FK) |

#### 8. garage_services (維修廠-服務關聯)

| 欄位 | 型別 | 說明 |
|------|------|------|
| garage_id | number | 維修廠 ID (FK) |
| service_id | number | 服務 ID (FK) |

#### 9. profiles (使用者資料)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | UUID | 主鍵 (對應 auth.users) |
| name | string? | 姓名 |
| nickname | string? | 暱稱 |
| phone | string? | 電話 |
| license_plate | string? | 車牌號碼 |

### 關聯圖

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│   brands    │────│  garage_brands  │────│   garages   │
└─────────────┘    └─────────────────┘    └─────────────┘
                                                 │
┌─────────────┐    ┌─────────────────┐           │
│  services   │────│ garage_services │───────────┤
└─────────────┘    └─────────────────┘           │
                                                 │
                   ┌─────────────────┐           │
                   │  appointments   │───────────┤
                   └─────────────────┘           │
                            │                    │
                   ┌────────▼────────┐           │
                   │maintenance_     │───────────┤
                   │records          │           │
                   └─────────────────┘           │
                                                 │
                   ┌─────────────────┐           │
                   │garage_          │───────────┘
                   │environment_     │
                   │images           │
                   └─────────────────┘
```

---

## API 端點

### 基本設定

- **Base URL**: `http://localhost:3000` (開發) / `https://care-f.zeabur.app` (生產)
- **認證方式**: Header-based (`x-garage-id` 或 `x-user-id`)

### 1. 統編驗證 API

| 方法 | 端點 | 說明 | Rate Limit |
|------|------|------|------------|
| GET | `/api/verify-taxid?taxId=12345678` | 驗證台灣統一編號 | - |

**回應範例**:
```json
{
  "exists": true,
  "type": "公司"
}
```

### 2. 搜尋 API

| 方法 | 端點 | 說明 | Rate Limit |
|------|------|------|------------|
| GET | `/api/search` | 搜尋維修廠 | 100/15分 |
| GET | `/api/search/filters` | 取得篩選選項 | 300/15分 |

**搜尋參數**:
- `city` - 縣市
- `district` - 區域
- `brand` - 品牌 ID
- `service` - 服務 ID
- `category` - 服務分類
- `page` - 頁碼 (預設: 1)
- `limit` - 每頁數量 (預設: 10, 最大: 100)
- `sort` - 排序方式 (rating/review_count)

**回應範例**:
```json
{
  "data": [{
    "id": 1,
    "name": "XX汽車維修",
    "city": "台北市",
    "district": "信義區",
    "address": "...",
    "lat": 25.033,
    "lng": 121.565,
    "rating": 4.5,
    "review_count": 120,
    "image_url": "...",
    "brands": [{ "carbrand_id": 1, "brand_en": "Toyota", "brand_zh": "豐田" }],
    "services": [{ "garageservice_id": 1, "name": "機油更換", "category": "保養" }]
  }],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 3. 預約 API

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/appointments` | 建立預約 |
| GET | `/api/appointments` | 查詢預約列表 |
| GET | `/api/appointments/:id` | 取得單筆預約 |
| PUT | `/api/appointments/:id` | 更新預約 |
| DELETE | `/api/appointments/:id` | 刪除預約 |

**建立預約請求**:
```json
{
  "garage_id": 1,
  "customer_name": "王小明",
  "customer_phone": "0912345678",
  "car_model": "Toyota Camry",
  "license_plate": "ABC-1234",
  "service_type": "定期保養",
  "scheduled_date": "2024-03-15",
  "scheduled_time": "10:00:00",
  "notes": "輪胎磨損較嚴重"
}
```

**預約狀態流程**:
```
pending (待確認) → confirmed (已排程) → servicing (作業中) → completed (已完成)
                                    ↓
                            cancelled (已取消)
```

### 4. 金流 API

| 方法 | 端點 | 說明 | Rate Limit |
|------|------|------|------------|
| POST | `/api/payment/oen/checkout` | 建立結帳 | 60/15分 |
| GET | `/api/payment/oen/transactions/:id` | 查詢交易 | 200/15分 |
| POST | `/api/payment/oen/webhook` | Webhook 回呼 | - |

**結帳請求**:
```json
{
  "amount": 3990,
  "currency": "TWD",
  "orderId": "ORD-001",
  "successUrl": "https://...",
  "failureUrl": "https://...",
  "planType": "lifetime"
}
```

### 5. 訂閱 API

| 方法 | 端點 | 說明 | Rate Limit |
|------|------|------|------------|
| GET | `/api/subscription/current` | 取得訂閱狀態 | 100/15分 |
| POST | `/trial/activate` | 啟用試用 | 100/15分 |
| POST | `/subscription/activate-lifetime` | 啟用終身方案 | 100/15分 |

**訂閱狀態回應**:
```json
{
  "success": true,
  "subscription": {
    "id": 1,
    "planType": "trial",
    "status": "active",
    "trialStartDate": "2024-03-01T00:00:00Z",
    "trialExpiryDate": "2024-03-31T00:00:00Z",
    "features": {
      "bookingManagement": true,
      "reviewSystem": true,
      "profileDisplay": true
    }
  }
}
```

---

## 前端架構

### 狀態管理 (Pinia Stores)

#### 1. Auth Store (`stores/auth.ts`)

管理認證狀態與 Supabase 整合。

```typescript
interface AuthState {
  user: User | null;          // Supabase 使用者
  session: Session | null;    // 當前 Session
  loading: boolean;           // 初始化狀態
  isSigningOut: boolean;      // 登出進行中
}
```

**方法**:
- `initialize()` - 初始化認證狀態並設定監聽器
- `signInWithMagicLink(email)` - Email OTP 登入
- `signInWithGoogle()` - Google OAuth 登入
- `signOut()` - 登出
- `syncUserStore()` - 同步使用者狀態

#### 2. User Store (`stores/user.ts`)

管理使用者資料。

```typescript
interface UserState {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: 'guest' | 'member' | 'garage';
    avatar: string;
    nickname: string;
  } | null;
}
```

#### 3. Subscription Store (`stores/subscription.ts`)

管理維修廠訂閱狀態。

```typescript
interface Subscription {
  id: string;
  planType: 'trial' | 'lifetime' | null;
  status: 'active' | 'expired' | 'cancelled';
  trialStartDate?: string;
  trialExpiryDate?: string;
  features: {
    bookingManagement: boolean;
    reviewSystem: boolean;
    profileDisplay: boolean;
  };
}
```

**計算屬性**:
- `daysRemaining` - 試用剩餘天數
- `isExpiringSoon` - 是否即將到期 (≤7天)
- `isExpired` - 是否已過期

### 路由結構 (Vue Router)

#### 公開路由

| 路徑 | 元件 | 說明 |
|------|------|------|
| `/` | Home.vue | 首頁 |
| `/search` | SearchResults.vue | 搜尋結果 |
| `/search/:id` | DetailView.vue | 店家詳情 |
| `/join-garage` | JoinGarage.vue | 維修廠註冊入口 |
| `/terms` | TermsOfService.vue | 服務條款 |
| `/privacy` | PrivacyPolicy.vue | 隱私權政策 |
| `/auth/callback` | AuthCallback.vue | OAuth 回呼 |

#### 需要認證的路由 (`requiresAuth: true`)

**使用者路由**:
| 路徑 | 元件 | 說明 |
|------|------|------|
| `/member/profile` | UserDashboard.vue | 使用者儀表板 |
| `/member/bookings` | BookingList.vue | 預約列表 |
| `/member/history` | MaintenanceHistory.vue | 維修歷史 |

**維修廠路由**:
| 路徑 | 元件 | 說明 |
|------|------|------|
| `/garage/onboarding` | GarageOnboarding.vue | 維修廠入駐流程 |
| `/garage/subscription` | SubscriptionSelection.vue | 訂閱方案選擇 |

**維修廠後台 (嵌套路由)**:
| 路徑 | 元件 | 說明 |
|------|------|------|
| `/garage/admin/dashboard` | GarageDashboard.vue | 儀表板 |
| `/garage/admin/appointments` | GarageAppointments.vue | 預約管理 |
| `/garage/admin/records` | GarageRecords.vue | 維修記錄 |
| `/garage/admin/settings` | GarageSettings.vue | 設定 |

### Composables (組合式函式)

#### 維修廠相關 (`composables/garage/`)

| 檔案 | 用途 |
|------|------|
| `useAppointments.ts` | 預約 CRUD、狀態更新、統計計算 |
| `useGarageProfile.ts` | 維修廠資料讀取與更新 |
| `useImageUpload.ts` | 圖片上傳至 Supabase Storage |
| `useMaintenanceRecords.ts` | 維修記錄管理與搜尋 |

#### 使用者相關 (`composables/user/`)

| 檔案 | 用途 |
|------|------|
| `useUserAppointments.ts` | 以電話號碼查詢預約、取消預約 |

---

## 運作邏輯

### 1. 認證流程

```
使用者點擊登入
       │
       ▼
┌─────────────────┐
│  LoginMode.vue  │
│  選擇登入方式   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌──────────┐
│Email  │  │Google    │
│OTP    │  │OAuth     │
└───┬───┘  └────┬─────┘
    │           │
    ▼           ▼
┌─────────────────────────┐
│    Supabase Auth        │
│    處理認證             │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   AuthCallback.vue      │
│   處理 OAuth 回呼       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│    Auth Store           │
│    更新狀態、同步 User  │
└─────────────────────────┘
```

### 2. 搜尋與預約流程

```
首頁 (Home.vue)
       │
       │ 輸入搜尋條件
       ▼
┌─────────────────────────┐
│   HomeSearchBar.vue     │
│   縣市/品牌/服務選擇    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   SearchResults.vue     │
│   顯示搜尋結果列表      │
│   ├─ 排序、篩選         │
│   └─ 分頁               │
└───────────┬─────────────┘
            │ 點擊店家
            ▼
┌─────────────────────────┐
│   DetailView.vue        │
│   顯示店家詳細資訊      │
│   ├─ 基本資訊           │
│   ├─ 環境照片           │
│   ├─ 專精品牌/服務      │
│   └─ 客戶評價           │
└───────────┬─────────────┘
            │ 點擊立即預約
            ▼
┌─────────────────────────┐
│  ServiceSearchFlow.vue  │
│  預約流程 (2步驟)       │
│                         │
│  Step 1: 填寫資料       │
│  ├─ 聯絡資訊            │
│  ├─ 車輛資訊            │
│  ├─ 預約時間            │
│  └─ 服務需求            │
│                         │
│  Step 2: 確認預約       │
│  └─ 送出                │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   POST /api/appointments│
│   建立預約              │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   顯示預約成功          │
│   取得預約編號          │
└─────────────────────────┘
```

### 3. 維修廠入駐流程

```
點擊「立即刊登維修廠」
       │
       ▼
┌─────────────────────────┐
│   JoinGarage.vue        │
│   入駐說明頁面          │
└───────────┬─────────────┘
            │ 登入後
            ▼
┌─────────────────────────┐
│  GarageOnboarding.vue   │
│  入駐流程 (3步驟)       │
│                         │
│  Step 1: 基本資料       │
│  ├─ 維修廠名稱          │
│  ├─ 電話                │
│  ├─ 地址                │
│  ├─ 負責人姓名          │
│  └─ 統一編號            │
│                         │
│  Step 2: 統編驗證中     │
│  └─ 呼叫政府 API        │
│                         │
│  Step 3: 驗證結果       │
│  ├─ 成功 → 跳轉後台     │
│  └─ 失敗 → 返回修改     │
└───────────┬─────────────┘
            │ 成功
            ▼
┌─────────────────────────┐
│  GarageSettings.vue     │
│  維修廠設定頁面         │
└─────────────────────────┘
```

### 4. 訂閱與金流流程

```
維修廠選擇訂閱方案
       │
       ▼
┌─────────────────────────┐
│ SubscriptionSelection   │
│ 選擇: 試用 / 終身方案   │
└───────────┬─────────────┘
            │
       ┌────┴────┐
       ▼         ▼
   試用方案   付費方案
       │         │
       ▼         ▼
┌──────────┐ ┌────────────────────┐
│POST      │ │POST                │
│/trial/   │ │/payment/oen/       │
│activate  │ │checkout            │
└────┬─────┘ └──────────┬─────────┘
     │                  │
     │                  ▼
     │       ┌────────────────────┐
     │       │  OEN Pay 付款頁面  │
     │       └──────────┬─────────┘
     │                  │
     │                  ▼
     │       ┌────────────────────┐
     │       │  Webhook 回呼      │
     │       │  啟用終身方案      │
     │       └──────────┬─────────┘
     │                  │
     └────────┬─────────┘
              ▼
┌─────────────────────────┐
│   訂閱狀態更新          │
│   subscription_status   │
│   = 'trial' / 'lifetime'│
└─────────────────────────┘
```

### 5. 預約管理流程 (維修廠端)

```
┌─────────────────────────┐
│  GarageDashboard.vue    │
│  顯示今日預約統計       │
│  ├─ 今日預約數          │
│  ├─ 待確認訂單          │
│  └─ 正在作業中          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ GarageAppointments.vue  │
│ 預約列表管理            │
└───────────┬─────────────┘
            │
    ┌───────┼───────┐
    ▼       ▼       ▼
┌───────┐┌───────┐┌───────┐
│確認   ││開始   ││完成   │
│預約   ││作業   ││作業   │
└───┬───┘└───┬───┘└───┬───┘
    │        │        │
    ▼        ▼        ▼
 pending → confirmed → servicing → completed
                                      │
                                      ▼
                              ┌───────────────┐
                              │轉為維修記錄  │
                              │maintenance_  │
                              │records       │
                              └───────────────┘
```

---

## 使用者流程

### 車主旅程

```
1. 首頁
   └─► 搜尋維修廠 (依縣市/品牌/服務)
       └─► 瀏覽搜尋結果
           └─► 查看店家詳情
               └─► 線上預約
                   └─► 收到預約編號

2. 會員中心
   ├─► 個人資料管理
   ├─► 預約記錄查詢
   └─► 維修歷史紀錄
```

### 維修廠旅程

```
1. 入駐流程
   └─► 填寫基本資料
       └─► 統編驗證
           └─► 完成註冊

2. 訂閱啟用
   └─► 選擇方案 (試用/付費)
       └─► 付款 (如選擇付費)
           └─► 開始使用

3. 後台管理
   ├─► 儀表板 (統計數據)
   ├─► 預約管理 (接單/狀態更新)
   ├─► 維修記錄 (歷史紀錄)
   └─► 設定 (店家資料/照片)
```

---

## 環境設定

### 開發環境

**前端** (localhost:5173):
```bash
cd frontend
npm install
npm run dev
```

**後端** (localhost:3000):
```bash
cd backend
npm install
npm run dev
```

### 環境變數

**Backend `.env`**:
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
OEN_MERCHANT_ID=your_merchant_id
OEN_API_KEY=your_api_key
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`**:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 部署資訊

- **前端**: Zeabur (`https://care-f.zeabur.app`)
- **後端**: Zeabur (`https://care-f.zeabur.app/api`)
- **資料庫**: Supabase PostgreSQL
- **檔案儲存**: Supabase Storage

---

*文件最後更新：2026-01-28*
