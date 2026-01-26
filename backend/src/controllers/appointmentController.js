import supabase from '../configs/supabase.js';

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
    const {
      garage_id,
      customer_name,
      customer_phone,
      car_model,
      license_plate,
      service_type,
      scheduled_date,
      scheduled_time,
      notes,
      quotation_image_url
    } = req.body;

    // 基本驗證
    if (!garage_id || !customer_name || !customer_phone || !scheduled_date || !scheduled_time) {
      return res.status(400).json({
        error: '欄位缺漏',
        message: '請填寫所有必要欄位 (車廠、姓名、電話、預約日期、時間)'
      });
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          garage_id,
          customer_name,
          customer_phone,
          car_model,
          license_plate,
          service_type,
          scheduled_date,
          scheduled_time,
          status: 'pending',
          notes,
          quotation_image_url
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
    const updates = req.body;

    // 防止更新不可修改的欄位 (例如 id, created_at)
    delete updates.id;
    delete updates.created_at;
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
 * 刪除預約 (或取消)
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
