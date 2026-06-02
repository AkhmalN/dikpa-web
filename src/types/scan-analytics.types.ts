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
