import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '缺少 Supabase 環境變數。請確認 .env 檔案中已設定 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // DEV MODE: 暫時關閉 session 持久化以避免初始化問題
    // TODO: 生產環境應啟用以下設定以改善使用者體驗：
    // autoRefreshToken: true,
    // persistSession: true,
    // detectSessionInUrl: true,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    storage: undefined,
  },
});
