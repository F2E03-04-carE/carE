import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

type BucketName = 'garage-covers' | 'garage-environments' | 'appointment-quotations';

export function useImageUpload() {
  const uploading = ref(false);
  const error = ref<string | null>(null);

  async function uploadImage(
    file: File,
    bucket: BucketName,
    path: string
  ): Promise<string | null> {
    uploading.value = true;
    error.value = null;

    try {
      // 簡單驗證
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('不支援的圖片格式 (僅支援 JPG, PNG, WebP)');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('圖片大小不得超過 5MB');
      }

      // 上傳
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 取得公開連結 (Public URL)
      // 注意：如果是 private bucket (如 appointment-quotations)，這裡要改用 createSignedUrl
      if (bucket === 'appointment-quotations') {
         // 私密檔案：回傳短期有效的 signed URL (7天)
         const { data: signedData, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60 * 24 * 7); // 7天有效

         if (signedError) throw signedError;
         return signedData.signedUrl;
      } else {
         const { data: urlData } = supabase.storage
           .from(bucket)
           .getPublicUrl(data.path);

         return urlData.publicUrl;
      }

    } catch (e: any) {
      console.error('Upload error:', e);
      error.value = e.message;
      return null;
    } finally {
      uploading.value = false;
    }
  }

  async function deleteImage(bucket: BucketName, path: string) {
    try {
      const { error: removeError } = await supabase.storage.from(bucket).remove([path]);
      if (removeError) throw removeError;
    } catch (e: any) {
      console.error('Delete image error:', e);
      // 不一定要 throw，因為圖片刪除失敗可能不影響主流程
    }
  }

  return { uploading, error, uploadImage, deleteImage };
}
