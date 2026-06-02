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
