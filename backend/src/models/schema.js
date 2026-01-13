/**
 * 資料模型 (Data Models)
 * 定義資料庫表格的結構
 *
 * 在 JavaScript 中用 JSDoc 註解來說明資料結構
 * 之後整合 Drizzle ORM 時會轉換成 schema
 */

/**
 * 使用者資料模型
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} name
 * @property {string} [phone]
 * @property {string} [avatarUrl]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * 車輛資料模型
 * @typedef {Object} Vehicle
 * @property {number} id
 * @property {number} userId - 關聯到 User
 * @property {string} licensePlate - 車牌號碼
 * @property {string} brand - 品牌（Toyota, Honda...）
 * @property {string} model - 車型
 * @property {number} [year] - 年份
 * @property {boolean} isDefault - 是否為預設車輛
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * 維修廠資料模型
 * @typedef {Object} Shop
 * @property {number} id
 * @property {number} ownerId - 關聯到 User（店主）
 * @property {string} name - 店名
 * @property {string} taxId - 統一編號
 * @property {string} address
 * @property {string} phone
 * @property {string} [description]
 * @property {boolean} isVerified - 是否已付費上架
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * 預約資料模型
 * @typedef {Object} Booking
 * @property {number} id
 * @property {number} userId - 關聯到 User
 * @property {number} shopId - 關聯到 Shop
 * @property {number} vehicleId - 關聯到 Vehicle
 * @property {string} serviceType - 維修項目
 * @property {Date} scheduledAt - 預約時間
 * @property {'pending'|'confirmed'|'in_progress'|'completed'|'cancelled'} status
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * 評價資料模型
 * @typedef {Object} Review
 * @property {number} id
 * @property {number} userId - 關聯到 User
 * @property {number} shopId - 關聯到 Shop
 * @property {number} bookingId - 關聯到 Booking（確保消費過才能評價）
 * @property {number} rating - 評分 1-5
 * @property {string} [content] - 評價內容
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
