import { ref, reactive } from 'vue';
import { supabase } from '@/lib/supabase';
import type { GarageProfile } from './types';

export function useGarageProfile(garageId: number) {
  const profile = reactive<GarageProfile>({
    id: garageId,
    name: '',
    garage_owner_name: '',
    address: '',
    phone: '',
    tax_id: '',
    description: '',
    cover_image_url: '',
    environment_images: [],
  });

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProfile() {
    loading.value = true;
    error.value = null;
    try {
      // 1. 載入基本資料
      const { data: garageData, error: garageError } = await supabase
        .from('garages')
        .select('*')
        .eq('id', garageId)
        .single();

      if (garageError) throw garageError;

      // 更新 reactive 物件
      Object.assign(profile, {
        name: garageData.name || '',
        garage_owner_name: garageData.garage_owner_name || '',
        address: garageData.address || '',
        phone: garageData.phone || '',
        tax_id: garageData.tax_id || '',
        description: garageData.description || '',
        cover_image_url: garageData.cover_image_url || '',
      });

      // 2. 載入環境照片
      const { data: envImages, error: envError } = await supabase
        .from('garage_environment_images')
        .select('*')
        .eq('garage_id', garageId)
        .order('display_order', { ascending: true });

      if (envError) throw envError;
      profile.environment_images = envImages?.map((img: any) => img.image_url) || [];

    } catch (e: any) {
      console.error('fetchProfile error:', e);
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(updates: Partial<GarageProfile>) {
    try {
      // 定義 garages 表可更新的欄位
      const allowedFields = ['name', 'address', 'phone', 'tax_id', 'description', 'cover_image_url', 'garage_owner_name'] as const;

      // 只保留允許更新的欄位
      const dbUpdates: Record<string, any> = {};
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          dbUpdates[field] = updates[field];
        }
      }

      const { error } = await supabase
        .from('garages')
        .update(dbUpdates)
        .eq('id', garageId);

      if (error) throw error;

      // 更新本地狀態
      Object.assign(profile, updates);

    } catch (e: any) {
      console.error('updateProfile error:', e);
      throw e;
    }
  }
  
  // 新增環境照片 (僅寫入 DB，檔案上傳由 useImageUpload 處理)
  async function addEnvironmentImage(imageUrl: string) {
     try {
       // 查詢當前最大的 display_order
       const { data: maxOrderData } = await supabase
         .from('garage_environment_images')
         .select('display_order')
         .eq('garage_id', garageId)
         .order('display_order', { ascending: false })
         .limit(1)
         .single();

       const nextOrder = (maxOrderData?.display_order ?? -1) + 1;

       const { error } = await supabase
         .from('garage_environment_images')
         .insert({
           garage_id: garageId,
           image_url: imageUrl,
           display_order: nextOrder
         });

       if (error) throw error;
       profile.environment_images.push(imageUrl);
     } catch (e: any) {
       console.error('addEnvironmentImage error:', e);
       throw e;
     }
  }

  // 刪除環境照片
  async function removeEnvironmentImage(imageUrl: string) {
    try {
      const { error } = await supabase
        .from('garage_environment_images')
        .delete()
        .eq('garage_id', garageId)
        .eq('image_url', imageUrl);
        
      if (error) throw error;
      profile.environment_images = profile.environment_images.filter(url => url !== imageUrl);
    } catch (e: any) {
      console.error('removeEnvironmentImage error:', e);
      throw e;
    }
  }

  return { profile, loading, error, fetchProfile, updateProfile, addEnvironmentImage, removeEnvironmentImage };
}
