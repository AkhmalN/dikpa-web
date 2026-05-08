import type { DashboardSummaryResponse, PeriodFilter } from "@/types";

import { apiClient } from "@/lib/axios";

const DASHBOARD_ENDPOINT = "/admin-dashboard/dashboard";

export const dashboardService = {
  async getSummary(_period: PeriodFilter, date: string) {
    const response = await apiClient.get<DashboardSummaryResponse>(
      `${DASHBOARD_ENDPOINT}/summary`,
      {
        params: {
          period: _period,
          date: date,
        },
      },
    );
    return response.data;
  },
};
