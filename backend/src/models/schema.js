/**
 * 資料模型 (Data Models)
 * 定義資料庫表格的結構
 *
 * 這些定義基於目前的 Supabase 表格結構
 */

/**
 * 維修廠資料模型 (garages)
 * @typedef {Object} Garage
 * @property {number} id - BIGSERIAL PK
 * @property {string} name - 維修廠名稱
 * @property {string} [garage_owner_name] - 負責人姓名
 * @property {string} [address] - 地址
 * @property {string} [phone] - 電話
 * @property {string} [tax_id] - 統一編號
 * @property {string} [description] - 描述
 * @property {string} [cover_image_url] - 封面圖片網址
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * 維修廠環境圖片 (garage_environment_images)
 * @typedef {Object} GarageEnvironmentImage
 * @property {number} id - BIGSERIAL PK
 * @property {number} garage_id - FK to garages
 * @property {string} image_url - 圖片網址
 * @property {number} [display_order] - 顯示順序
 * @property {Date} created_at
 */

/**
 * 預約資料模型 (appointments)
 * @typedef {Object} Appointment
 * @property {number} id - BIGSERIAL PK
 * @property {number} garage_id - FK to garages
 * @property {string} [customer_name] - 客戶姓名
 * @property {string} [customer_phone] - 客戶電話
 * @property {string} [car_model] - 車型
 * @property {string} [license_plate] - 車牌
 * @property {string} [service_type] - 服務類型
 * @property {string} [scheduled_date] - 預約日期 (YYYY-MM-DD)
 * @property {string} [scheduled_time] - 預約時間 (HH:mm:ss)
 * @property {'pending'|'confirmed'|'servicing'|'completed'|'cancelled'} status - 狀態
 * @property {number} [estimated_cost] - 預估費用
 * @property {string} [notes] - 備註
 * @property {string} [quotation_image_url] - 報價單圖片網址
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * 維修記錄模型 (maintenance_records)
 * @typedef {Object} MaintenanceRecord
 * @property {number} id - BIGSERIAL PK
 * @property {number} garage_id - FK to garages
 * @property {number} [original_appointment_id] - FK to appointments (可為空)
 * @property {string} [customer_name] - 客戶姓名
 * @property {string} [car_model] - 車型
 * @property {string} [license_plate] - 車牌
 * @property {string} [service_date] - 維修日期 (YYYY-MM-DD)
 * @property {Object[]} items - 維修項目列表 (JSONB)
 * @property {string} items[].name - 項目名稱
 * @property {number} items[].price - 項目價格
 * @property {number} [total_amount] - 總金額
 * @property {string} [notes] - 備註
 * @property {Date} created_at
 */

// 舊的 Booking 模型定義 (已棄用，保留參考)
// /**
//  * 預約資料模型
//  * @typedef {Object} Booking
//  * ...
//  */