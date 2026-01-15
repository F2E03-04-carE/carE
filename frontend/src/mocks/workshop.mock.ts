export type WorkshopStatus = 'onboarding' | 'pending_review' | 'active';

export interface Workshop {
  id: number;
  name: string | null;
  owner_user_id: number;
  status: WorkshopStatus;
  profile_completed: boolean;
  subscription_plan: 'free' | 'pro' | 'enterprise' | null;
  subscription_status: 'unpaid' | 'paid' | 'trial';
  taxId: string;
  address?: string;
  phone?: string;
  vat_number?: string;
  brands?: string[];
  skills?: string[];
  description?: string;
}

// 剛註冊，尚未填寫資料
export const onboardingWorkshop: Workshop = {
  id: 18,
  name: null,
  owner_user_id: 10,
  status: 'onboarding',
  profile_completed: false,
  subscription_plan: null,
  subscription_status: 'unpaid',
  taxId: '',
  brands: [],
  skills: [],
  description: '',
};

// 已付款，等待人工審核
export const pendingReviewWorkshop: Workshop = {
  id: 12,
  name: '匠心汽車維修廠',
  owner_user_id: 5,
  status: 'pending_review',
  profile_completed: true,
  subscription_plan: 'pro',
  subscription_status: 'paid',
  taxId: '24567890',
  address: '台中市南屯區工業路 88 號',
  phone: '04-2358-8899',
  vat_number: '24567890',
  brands: ['Toyota', 'Honda', 'BMW'],
  skills: ['引擎維修', '煞車系統', '汽車保養/定期檢查'],
  description: '專業維修團隊，提供各式汽車保養與修護服務。',
};

// 已正式開通
export const activeWorkshop: Workshop = {
  id: 15,
  name: '極速動力維修中心',
  owner_user_id: 8,
  status: 'active',
  profile_completed: true,
  subscription_plan: 'pro',
  subscription_status: 'paid',
  taxId: '27894561',
  address: '新北市板橋區中山路一段 102 號',
  phone: '02-2955-7788',
  vat_number: '27894561',
  brands: ['Nissan', 'Mazda', 'Lexus'],
  skills: ['變速箱維修', '底盤懸吊', '空調冷氣維修', '輪胎更換/定位'],
  description: '專注高效率維修，擁有先進設備及專業技師團隊。',
};


// 免費試用範例
export const trialWorkshop: Workshop = {
  id: 16,
  name: '新手上路維修站',
  owner_user_id: 9,
  status: 'active',
  profile_completed: true,
  subscription_plan: 'pro',
  subscription_status: 'trial',
  taxId: '12345678',
  address: '台北市信義區信義路五段7號',
  phone: '02-8101-8888',
  vat_number: '12345678',
  brands: ['Toyota', 'Honda'],
  skills: ['汽車保養/定期檢查'],
  description: '新開張！熱情服務中！',
};
