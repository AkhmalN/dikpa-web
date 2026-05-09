// Auth
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: "tenant_admin" | "supervisor" | "guard";
  avatar_url?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Generic API response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface MetaResponse {
  total: number;
  limit: number;
  skip: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: MetaResponse;
}

export interface ListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  [key: string]: unknown;
}

// Shifts
export interface Shift {
  _id: string;
  shift_name: string;
  shift_start_time: string;
  shift_end_time: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftPayload {
  shift_name: string;
  shift_start_time: string;
  shift_end_time: string;
}

// Checkpoints
export interface Checkpoint {
  _id: string;
  name: string;
  qr_code_value: string;
  gps_lat: number;
  gps_lon: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckpointPayload {
  name: string;
  qr_code_value: string;
  gps_lat: number;
  gps_lon: number;
  description?: string;
}

// Assignments
export type AssignmentStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "COMPLETED";
export type Period = "daily" | "weekly" | "monthly" | "yearly";

export interface Assignment {
  _id: string;
  user_id: string;
  user_name?: string;
  shift_id: string;
  shift_name?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  duty_date?: string;
  assigned_checkpoint_ids: string[];
  status: AssignmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentPayload {
  user_id: string;
  shift_id: string;
  duty_date: string;
  assigned_checkpoint_ids: string[];
  status: AssignmentStatus;
  notes?: string;
}

// Incidents
export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reported_by: string;
  reporter_name?: string;
  checkpoint_id?: string;
  checkpoint_name?: string;
  location?: string;
  occurred_at: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentStatusUpdatePayload {
  status: IncidentStatus;
  resolution_note?: string;
}

// Scan Analytics
export interface CheckpointScanStat {
  checkpoint_id: string;
  checkpoint_name: string;
  total_scans: number;
  last_scanned_at?: string;
  unique_scanners: number;
}

export interface ScanAnalyticsParams extends ListParams {
  date_from?: string;
  date_to?: string;
  shift_id?: string;
  user_id?: string;
}

export type UserAppRole = "tenant_admin" | "supervisor" | "guard";
export interface AppUser {
  _id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  email: string;
  app_role: UserAppRole;
}

export interface UserPayload {
  user_id: string;
  name: string;
  email: string;
  app_role: UserAppRole;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  app_role?: UserAppRole;
}

// Dashboard
export type PeriodFilter = "daily" | "weekly" | "monthly" | "yearly";
interface DateRange {
  start: string;
  end: string;
}

export interface PatrolStats {
  total: number;
  completed: number;
  auto_completed: number;
  active: number;
  completion_rate: number;
  avg_duration_minutes: number | null;
  total_checkpoints_scanned: number;
  total_incidents_reported: number;
}

export interface DashboardData {
  period: string;
  date_range: DateRange;
  patrols: PatrolStats;
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardData;
}
