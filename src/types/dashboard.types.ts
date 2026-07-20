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

// ─── Trend (time-series) ────────────────────────────────────────────────────

export interface TrendPoint {
  date: string;
  total: number;
  completed: number;
  active: number;
  avg_duration_minutes: number | null;
}

export interface DashboardTrendData {
  period: string;
  date_range: DateRange;
  data: TrendPoint[];
}

export interface DashboardTrendResponse {
  success: boolean;
  data: DashboardTrendData;
}

// ─── Incident Stats ─────────────────────────────────────────────────────────

export interface IncidentByTypeItem {
  type: string;
  count: number;
}

export interface IncidentBySeverityItem {
  severity: string;
  count: number;
}

export interface IncidentStatsData {
  period: string;
  date_range: DateRange;
  by_type: IncidentByTypeItem[];
  by_severity: IncidentBySeverityItem[];
  total: number;
}

export interface IncidentStatsResponse {
  success: boolean;
  data: IncidentStatsData;
}

// ─── Guard Leaderboard ──────────────────────────────────────────────────────

export interface GuardLeaderboardItem {
  user_id: string;
  user_name: string;
  total_patrols: number;
  total_checkpoints: number;
  total_incidents: number;
  avg_duration_minutes: number | null;
}

export interface GuardLeaderboardData {
  period: string;
  date_range: DateRange;
  top_guards: GuardLeaderboardItem[];
}

export interface GuardLeaderboardResponse {
  success: boolean;
  data: GuardLeaderboardData;
}
