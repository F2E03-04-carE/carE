import supabase from '../configs/supabase.js';



/**
* GET /api/search
* 搜尋維修廠
*
* Query 參數範例：
* /api/search?city=台北市&district=中山區&brand=123&service=456&category=維修&page=1&limit=10&sort=rating
*
* 回傳格式：
* {
*   "data": [
*     {
*       "id": "uuid",
*       "name": "維修廠名稱",
*       "city": "台北市",
*       "district": "中山區",
*       "address": "完整地址",
*       "lat": 25.0xxx,
*       "lng": 121.xxx,
*       "rating": 4.5,
*       "review_count": 120,
*       "image_url": "圖片網址",
*       "brands": [{ "id": "...", "name": "Toyota" }],
*       "services": [{ "id": "...", "name": "換機油" }]
*     }
*   ],
*   "pagination": {
*     "page": 1,
*     "limit": 10,
*     "total": 150,
*     "totalPages": 15
*   }
* }
*/
const MAX_RELATED_ITEMS_PER_GARAGE = 8;

export const searchGarages = async (req, res) => {
  try {
    const {
      city,
      district,
      brand,
      service,
      category,
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
      .select('*', { count: 'exact' }); 

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

      const brandGarageIds = brandData.map(item => item.garage_id);
      
      if (brandGarageIds.length === 0) {
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

      query = query.in('id', brandGarageIds);
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

      const serviceGarageIds = serviceData.map(item => item.garage_id);

      if (serviceGarageIds.length === 0) {
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

      query = query.in('id', serviceGarageIds);
    }

    if (category) {
      const { data: categoryServices, error: categoryServicesError } = await supabase
        .from('services')
        .select('garageservice_id')
        .eq('category', category);

      if (categoryServicesError) {
        console.error('類別服務查詢錯誤:', categoryServicesError);
        return res.status(500).json({
          error: '類別篩選失敗',
          message: categoryServicesError.message
        });
      }

      const categoryServiceIds = categoryServices.map(item => item.garageservice_id);

      if (categoryServiceIds.length === 0) {
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

      // 根據 category 找到對應的 service_id 再查關聯的garage_id
      const { data: categoryGarageData, error: categoryGarageError } = await supabase
        .from('garage_services')
        .select('garage_id')
        .in('service_id', categoryServiceIds);

      if (categoryGarageError) {
        console.error('類別維修廠查詢錯誤:', categoryGarageError);
        return res.status(500).json({
          error: '類別篩選失敗',
          message: categoryGarageError.message
        });
      }

      const categoryGarageIds = [...new Set(categoryGarageData.map(item => item.garage_id))];

      if (categoryGarageIds.length === 0) {
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

      query = query.in('id', categoryGarageIds);
    }

    // 排序（評分或評論數，由高到低）
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
        .select('garage_id, brand_id')
        .in('garage_id', garageIds);

      if (brandRelations && brandRelations.length > 0) {
        const brandIds = [...new Set(brandRelations.map(b => b.brand_id))];
        const { data: brandsData } = await supabase
          .from('brands')
          .select('carbrand_id, brand_en, brand_zh')
          .in('carbrand_id', brandIds);

        brands = brandRelations.map(rel => ({
          garage_id: rel.garage_id,
          brands: brandsData?.find(b => b.carbrand_id === rel.brand_id) || null
        })).filter(item => item.brands !== null);
      }

      const { data: serviceRelations } = await supabase
        .from('garage_services')
        .select('garage_id, service_id')
        .in('garage_id', garageIds);

      if (serviceRelations && serviceRelations.length > 0) {
        const serviceIds = [...new Set(serviceRelations.map(s => s.service_id))];
        const { data: servicesData } = await supabase
          .from('services')
          .select('garageservice_id, name, category')
          .in('garageservice_id', serviceIds);

        services = serviceRelations.map(rel => ({
          garage_id: rel.garage_id,
          services: servicesData?.find(s => s.garageservice_id === rel.service_id) || null
        })).filter(item => item.services !== null);
      }
    }

    const enrichedGarages = garages.map(garage => {
      const garageRelatedBrands = brands
        .filter(b => b.garage_id === garage.id)
        .slice(0, MAX_RELATED_ITEMS_PER_GARAGE)
        .map(b => b.brands);

      const garageRelatedServices = services
        .filter(s => s.garage_id === garage.id)
        .slice(0, MAX_RELATED_ITEMS_PER_GARAGE)
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

/**
* GET /api/search/filters
* 獲取篩選選項（品牌、服務）
* 
* 城市和行政區由前端 tw-city-selector 處理
* 
* 回傳格式：
* {
*   "brands": [{ "id": "...", "name": "Toyota" }, ...],
*   "services": [{ "id": "...", "name": "換機油" }, ...]
* }
*/

export const getFilterOptions = async (req, res) => {
  try {

    const { data: brandsData, error: brandsError } = await supabase
      .from('brands')
      .select('id, name');

    if (brandsError) {
      console.error('獲取品牌篩選選項異常:', brandsError);
      return res.status(500).json({
        error: '伺服器內部錯誤',
        message: brandsError.message || '獲取品牌篩選選項失敗'
      });
    }
      
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, name');

    if (servicesError) {
      console.error('獲取服務篩選選項異常:', servicesError);
      return res.status(500).json({
        error: '伺服器內部錯誤',
        message: servicesError.message || '獲取服務篩選選項失敗'
      });
    }
    return res.json({
      brands: brandsData || [],
      services: servicesData || []
    });

  } catch (error) {
    console.error('獲取篩選選項異常:', error);
    return res.status(500).json({
      error: '伺服器內部錯誤',
      message: error.message
    });
  }
};