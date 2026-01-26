import { ref, reactive } from 'vue';
import { supabase } from '@/lib/supabase';
import type { GarageProfile } from './types';

export function useGarageProfile(garageId: number) {
  const profile = reactive<GarageProfile>({
    id: garageId,
    name: '',
    owner_name: '',
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
        owner_name: garageData.owner_name || '', // 這裡可能要對應 garage_owner_name 還是 owner_name，視實際 DB 欄位而定
        address: garageData.address || '',
        phone: garageData.phone || '',
        tax_id: garageData.tax_id || '',
        description: garageData.description || '',
        cover_image_url: garageData.cover_image_url || '',
      });
      
      // 注意：garages 表可能有 garage_owner_name 欄位，需確認 SQL 結構
      if (garageData.garage_owner_name) {
         profile.owner_name = garageData.garage_owner_name;
      }

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
      const dbUpdates: any = {};
      // 只更新 garages 表有的欄位
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.tax_id !== undefined) dbUpdates.tax_id = updates.tax_id;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.cover_image_url !== undefined) dbUpdates.cover_image_url = updates.cover_image_url;
      if (updates.owner_name !== undefined) {
         // 兩個都更新以防萬一
         dbUpdates.owner_name = updates.owner_name;
         dbUpdates.garage_owner_name = updates.owner_name; 
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
       const { error } = await supabase
         .from('garage_environment_images')
         .insert({
           garage_id: garageId,
           image_url: imageUrl,
           display_order: profile.environment_images.length
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
