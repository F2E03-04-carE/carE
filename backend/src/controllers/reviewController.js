import supabase from '../configs/supabase.js';

/**
 * GET /api/reviews?garage_id=&page=&limit=
 * 取得維修廠評論列表（僅供維修廠詳細頁顯示，唯讀）
 */
export const getReviewsByGarage = async (req, res) => {
  try {
    const { garage_id, page = 1, limit = 10 } = req.query;

    if (!garage_id) {
      return res.status(400).json({
        error: '缺少必要參數',
        message: '請提供 garage_id'
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('garage_id', garage_id)
      .eq('status', 'published')
      .order('review_date', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('查詢評論錯誤:', error);
      return res.status(500).json({
        error: '查詢評論失敗',
        message: error.message
      });
    }

    return res.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('查詢評論異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};

/**
 * GET /api/reviews/stats/:garage_id
 * 取得維修廠評論統計（僅供維修廠詳細頁顯示，唯讀）
 */
export const getReviewStats = async (req, res) => {
  try {
    const { garage_id } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('garage_id', garage_id)
      .eq('status', 'published');

    if (error) {
      console.error('查詢評論統計錯誤:', error);
      return res.status(500).json({
        error: '查詢評論統計失敗',
        message: error.message
      });
    }

    const total = data.length;
    const avgRating = total > 0
      ? (data.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : 0;

    return res.json({
      data: {
        totalReviews: total,
        averageRating: parseFloat(avgRating)
      }
    });
  } catch (error) {
    console.error('查詢評論統計異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};
