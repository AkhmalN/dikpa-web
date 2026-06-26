export interface AtensiReadLog {
  user_id: string;
  read_at: string;
}

export interface Atensi {
  _id: string;
  tenant_id: string;
  shift_id: string;
  checkpoint_id: string | null;
  title: string;
  description: string;
  photo_url: string | null;
  expires_at: string;
  created_by: string;
  read_logs: AtensiReadLog[];
  created_at: string;
  updated_at: string;
}

export interface CreateAtensiDto {
  shift_id: string;
  checkpoint_id?: string | null;
  title: string;
  description: string;
  photo_url?: string | null;
  expires_at: string; // ISO date string
}

export interface UpdateAtensiDto {
  title?: string;
  description?: string;
  photo_url?: string | null;
  expires_at?: string;
}

export interface AtensiQueryDto {
  page?: number;
  limit?: number;
  shift_id?: string;
  checkpoint_id?: string;
}
