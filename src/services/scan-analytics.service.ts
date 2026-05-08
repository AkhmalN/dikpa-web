import type { CheckpointScanStat, ScanAnalyticsParams, PaginatedResponse } from "@/types";
import { mockScanStats } from "./mock-data";

export const scanAnalyticsService = {
  async getCheckpointRankings(params: ScanAnalyticsParams = {}): Promise<PaginatedResponse<CheckpointScanStat>> {
    await new Promise(r => setTimeout(r, 500));
    let data = [...mockScanStats];
    if (params.search) {
      const s = params.search.toLowerCase();
      data = data.filter(x => x.checkpoint_name.toLowerCase().includes(s));
    }
    data.sort((a, b) => b.total_scans - a.total_scans);
    const page = params.page || 1;
    const per_page = params.per_page || 10;
    const total = data.length;
    const start = (page - 1) * per_page;
    return { data: data.slice(start, start + per_page), total, page, per_page, total_pages: Math.ceil(total / per_page) };
  },
};
