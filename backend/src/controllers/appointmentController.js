import supabase from '../configs/supabase.js';
import { z } from 'zod';

// Zod Schema 定義
const appointmentSchema = z.object({
  garage_id: z.number({ invalid_type_error: "garage_id 必須是數字" }),
  customer_name: z.string().min(1, "請填寫客戶姓名"),
  customer_phone: z.string().min(1, "請填寫客戶電話"),
  car_model: z.string().optional(),
  license_plate: z.string().optional(),
  service_type: z.string().optional(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式錯誤，應為 YYYY-MM-DD"),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "時間格式錯誤，應為 HH:mm:ss"),
  notes: z.string().optional(),
  quotation_image_url: z.string().optional()
});

/**
 * POST /api/appointments
 * 建立預約
 * 
 * Body:
 * {
 *   "garage_id": 1,
 *   "customer_name": "王小明",
 *   "customer_phone": "0912345678",
 *   "car_model": "Toyota Altis",
 *   "license_plate": "ABC-1234",
 *   "service_type": "定期保養",
 *   "scheduled_date": "2023-12-01",
 *   "scheduled_time": "10:00:00",
 *   "notes": "備註事項"
 * }
 */
export const createAppointment = async (req, res) => {
  try {
    // 1. Zod 驗證
    const validation = appointmentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: '欄位驗證失敗',
        details: validation.error.errors
      });
    }

    const validData = validation.data;

    // 2. 插入資料庫
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          ...validData,
          status: 'pending' // 預設狀態
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('建立預約錯誤:', error);
      return res.status(500).json({
        error: '建立預約失敗',
        message: error.message
      });
    }

    return res.status(201).json({
      message: '預約建立成功',
      data
    });

  } catch (error) {
    console.error('建立預約異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};

/**
 * GET /api/appointments
 * 查詢預約列表 (支援篩選)
 * 
 * Query:
 * - garage_id (optional)
 * - status (optional)
 * - date (optional)
 * - phone (optional) - 用於使用者查詢自己的預約
 */
export const getAppointments = async (req, res) => {
  try {
    const { garage_id, status, date, phone } = req.query;

    let query = supabase
      .from('appointments')
      .select('*')
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true });

    if (garage_id) {
      query = query.eq('garage_id', garage_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('scheduled_date', date);
    }

    if (phone) {
      query = query.eq('customer_phone', phone);
    }

    const { data, error } = await query;

    if (error) {
      console.error('查詢預約錯誤:', error);
      return res.status(500).json({
        error: '查詢預約失敗',
        message: error.message
      });
    }

    return res.json({
      data
    });

  } catch (error) {
    console.error('查詢預約異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};

/**
 * GET /api/appointments/:id
 * 查詢單筆預約詳情
 */
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        garages (
          name,
          address,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('查詢單筆預約錯誤:', error);
      return res.status(500).json({
        error: '查詢預約失敗',
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        error: '找不到預約',
        message: '該預約編號不存在'
      });
    }

    return res.json({
      data
    });

  } catch (error) {
    console.error('查詢單筆預約異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};

/**
 * PUT /api/appointments/:id
 * 更新預約 (狀態、備註、金額等)
 */
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. 白名單過濾
    const allowedUpdates = [
      'customer_name', 'customer_phone', 'car_model', 'license_plate',
      'service_type', 'scheduled_date', 'scheduled_time', 'status',
      'estimated_cost', 'notes', 'quotation_image_url'
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: '沒有提供有效的更新欄位'
      });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新預約錯誤:', error);
      return res.status(500).json({
        error: '更新預約失敗',
        message: error.message
      });
    }

    return res.json({
      message: '預約更新成功',
      data
    });

  } catch (error) {
    console.error('更新預約異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};

/**
 * DELETE /api/appointments/:id
 * 永久刪除預約
 * 
 * 注意：若只是要「取消」預約，請使用 PUT 更新 status 為 'cancelled'。
 * 此 API 會將資料從資料庫中永久移除。
 */
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('刪除預約錯誤:', error);
      return res.status(500).json({
        error: '刪除預約失敗',
        message: error.message
      });
    }

    return res.json({
      message: '預約刪除成功'
    });

  } catch (error) {
    console.error('刪除預約異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};