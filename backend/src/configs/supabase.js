import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// 讀取 Supabase URL（支援多種環境變數名稱）
// 在 Zeabur 上，REST 服務的 domain 就是你的 SUPABASE_URL
const supabaseUrl =
  process.env.SUPABASE_URL ||      
  process.env.REST_URL ||         
  process.env.SUPABASE_API_URL;    


const supabaseKey =
  process.env.SUPABASE_KEY ||             
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SERVICE_ROLE_KEY ||          
  process.env.SUPABASE_ANON_KEY ||         
  process.env.ANON_KEY;


if (!supabaseUrl) {
  throw new Error('❌ 缺少 Supabase URL 環境變數');
}

if (!supabaseKey) {
  throw new Error('❌ 缺少 Supabase Key 環境變數');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;