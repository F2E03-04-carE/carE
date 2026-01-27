# carE 汽車維修媒合平台  
![Vue](https://img.shields.io/badge/%20-Vue.js-34495E?logo=vue.js&logoColor=41B883)
![TypeScript](https://img.shields.io/badge/%20-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/%20-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/%20-Node.js-339933?logo=node.js&logoColor=white)

<h3>
一個以 Vue 3 打造的汽車維修媒合平台。<br><br>
本專案為團體實作專案，聚焦於「汽車維修資訊透明化」，透過搜尋、比較、預約與進度追蹤，解決車主在維修過程中資訊不對稱與不確定感的問題，並同時提供維修廠有效曝光與管理工具。
</h3>

---

## 網站 Demo

- Frontend Demo：<https://care-f.zeabur.app>  
- Backend API：`<待補>`  

> 測試帳號 
- 車主帳號：`<email>` / `<password>`  
- 維修廠帳號：`<email>` / `<password>`

---

## 網站畫面（待捕）

<details>
  <summary>首頁 / 搜尋</summary>
  <img src="./docs/images/home.png" alt="首頁搜尋畫面" width="100%"/>
</details>

<details>
  <summary>搜尋結果列表</summary>
  <img src="./docs/images/search.png" alt="搜尋結果畫面" width="100%"/>
</details>

<details>
  <summary>維修廠詳細頁</summary>
  <img src="./docs/images/garage.png" alt="維修廠詳細頁" width="100%"/>
</details>

<details>
  <summary>後台管理</summary>
  <img src="./docs/images/dashboard.png" alt="後台畫面" width="100%"/>
</details>

---

## 專案概述

carE 是一個串連 **車主** 與 **汽車維修廠** 的媒合平台，核心目標為解決以下痛點：

- **送修後只能乾等**：不知道修到哪、什麼時候能取車
- **找維修廠全靠運氣**：不清楚每間店擅長品牌與維修項目
- **評價可信度不足**：未實際消費也能留下評論

平台透過「可搜尋、可比較、可預約、可追蹤」的流程設計，建立一個更透明、可信賴的維修生態系。

📌 詳細產品與使用者流程請見  
👉 [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md)

---

## 架構設計

本專案採用 **前後端分離架構**：

- 前端以 Vue 3 SPA 建構使用者操作體驗
- 後端提供 RESTful API，負責資料存取、身分驗證與商業邏輯
- 金流、Email、第三方 API 皆透過後端統一管理
- 專案部署於雲端平台，並支援 CI/CD 自動化流程

---

## 技術棧

### 使用語言
- [TypeScript](https://www.typescriptlang.org/)

### 前端框架
- [Vue 3](https://vuejs.org/)（Composition API）
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) 狀態管理
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### 後端框架
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)

### 資料庫 / 服務
- Supabase（PostgreSQL）

### 部署與工具
- Zeabur（部署）
- GitHub Actions（CI/CD）
- Postman（API 測試）

---

## 功能特色

### 搜尋與比較
- 多條件搜尋（維修項目、縣市、行政區、車款）
- 搜尋結果卡片化呈現
- 預設依評價排序
- 支援距離、評論數排序
- 快速篩選：3km 內、4 星以上

### 車主功能
- 瀏覽維修廠詳細資訊
- 會員可進行線上預約
- 後台查看預約與維修狀態
- 維修進度變更 Email 通知
- 完修後評價（確保實際消費）

### 維修廠功能
- 刊登維修廠（註冊 / 登入）
- 填寫並編輯店家資訊
- 商業登記統編檢核
- 試用 / 付費方案選擇
- 試用到期限制功能顯示
- 回覆顧客評論（付費會員）

### 金流與方案
- $0 試用方案（30 天）
- $5555 永久方案
- 串接第三方金流服務（應援金流）
- 付款成功 / 失敗流程處理

---

## 外部 API 與服務整合

| 功能 | 使用技術 / API |
|------|----------------|
| 行政區資料 | 全台縣市 / 行政區 API |
| 商業登記檢核 | 公司統編查詢 API |
| 金流服務 | 第三方金流 API |

---

## 開發與啟動方式

```bash
# clone 專案
git clone https://github.com/carwaE/carE.git
cd carE

# 前端
cd frontend
npm install
npm run dev

# 後端
cd ../backend
npm install
npm run dev

