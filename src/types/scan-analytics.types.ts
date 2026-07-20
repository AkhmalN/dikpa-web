import type { ListParams } from "./api.types";

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

export const PatrolStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  AUTO_COMPLETED_SHIFT_END: "AUTO_COMPLETED_SHIFT_END",
} as const;

export type PatrolStatus = (typeof PatrolStatus)[keyof typeof PatrolStatus];

interface ICurrentScanCheckpoint {
  checkpoint_id: string;
  scanned_at: Date;
}

export interface IHeartbeatLocation {
  gps_lat: number;
  gps_lon: number;
  updated_at?: Date;
}

export interface IPatrolLogs {
  _id: string;
  tenant_id: string;
  shift_id: string;
  user_id: string;
  assignment_id: string;
  status: PatrolStatus;
  started_at: Date;
  ended_at?: Date;
  last_heartbeat_location?: IHeartbeatLocation;
  current_history_location?: IHeartbeatLocation[];
  current_scan_checkpoint?: ICurrentScanCheckpoint[];
  total_checkpoint_passed: number;
  total_incident: number;
}
