export type ApptStatus = 'pending' | 'confirmed' | 'servicing' | 'completed' | 'cancelled';

export interface Appointment {
  id: string; // UUID
  garage_id: number; // bigint
  customer_name?: string;
  customer_phone?: string;
  car_model?: string;
  license_plate?: string;
  service_type?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  status: ApptStatus;
  estimated_cost?: number;
  notes?: string;
  quotation_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string; // UUID
  garage_id: number; // bigint
  original_appointment_id?: string;
  customer_name?: string;
  car_model?: string;
  license_plate?: string;
  service_date?: string;
  technician_name?: string;
  items: Array<{ name: string; price: number; type: 'base' | 'addon' }>;
  total_amount?: number;
  notes?: string;
  created_at: string;
}

export interface GarageProfile {
  id: number;
  name: string;
  garage_owner_name?: string;
  address?: string;
  phone?: string;
  tax_id?: string;
  description?: string;
  cover_image_url?: string;
  environment_images: string[]; // 我們會將 garage_environment_images 表的資料轉為 array
}
