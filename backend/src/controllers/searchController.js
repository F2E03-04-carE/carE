import supabase from '../configs/supabase.js';


export const searchGarages = async (req, res) => {
  try {
    const {
      city,
      district,
      brand,
      service,
      page = 1,
      limit = 10,
      sort = 'rating'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;
    const validSortFields = ['rating', 'review_count'];
    const sortField = validSortFields.includes(sort) ? sort : 'rating';

    let query = supabase
      .from('garages')
      .select('*', { count: 'exact' }); // count: 'exact' 會回傳總筆數

    if (city) {
      query = query.eq('city', city);
    }

    if (district) {
      query = query.eq('district', district);
    }

    if (brand) {
      const { data: brandData, error: brandError } = await supabase
        .from('garage_brands')
        .select('garage_id')
        .eq('brand_id', brand);

      if (brandError) {
        console.error('品牌篩選錯誤:', brandError);
        return res.status(500).json({
          error: '品牌篩選失敗',
          message: brandError.message
        });
      }

      const garageIds = brandData.map(item => item.garage_id);
      
      if (garageIds.length === 0) {
        return res.json({
          data: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0
          }
        });
      }

      query = query.in('id', garageIds);
    }
    if (service) {
      const { data: serviceData, error: serviceError } = await supabase
        .from('garage_services')
        .select('garage_id')
        .eq('service_id', service);

      if (serviceError) {
        console.error('服務篩選錯誤:', serviceError);
        return res.status(500).json({
          error: '服務篩選失敗',
          message: serviceError.message
        });
      }

      const garageIds = serviceData.map(item => item.garage_id);
      
      if (garageIds.length === 0) {
        return res.json({
          data: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0
          }
        });
      }

      query = query.in('id', garageIds);
    }

    //排序（評分或評論數，由高到低）
    query = query.order(sortField, { ascending: false });

    query = query.range(offset, offset + limitNum - 1);

    const { data: garages, count, error: queryError } = await query;

    if (queryError) {
      console.error('查詢錯誤:', queryError);
      return res.status(500).json({
        error: '搜尋失敗',
        message: queryError.message
      });
    }

    const garageIds = garages.map(g => g.id);
    let brands = [];
    let services = [];

    if (garageIds.length > 0) {
      const { data: brandRelations } = await supabase
        .from('garage_brands')
        .select('garage_id, brands(id, name)')
        .in('garage_id', garageIds);

      if (brandRelations) {
        brands = brandRelations;
      }
      const { data: serviceRelations } = await supabase
        .from('garage_services')
        .select('garage_id, services(id, name)')
        .in('garage_id', garageIds);

      if (serviceRelations) {
        services = serviceRelations;
      }
    }

    const enrichedGarages = garages.map(garage => {
      const garageRelatedBrands = brands
        .filter(b => b.garage_id === garage.id)
        .slice(0, 8)
        .map(b => b.brands);

      const garageRelatedServices = services
        .filter(s => s.garage_id === garage.id)
        .slice(0, 8)
        .map(s => s.services);

      return {
        ...garage,
        brands: garageRelatedBrands,
        services: garageRelatedServices
      };
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      data: enrichedGarages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('搜尋異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};



