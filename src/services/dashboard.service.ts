import type {
  DashboardSummaryResponse,
  DashboardTrendResponse,
  IncidentStatsResponse,
  GuardLeaderboardResponse,
  PeriodFilter,
} from "@/types";

import { apiClient } from "@/lib/axios";

const DASHBOARD_ENDPOINT = "/admin-dashboard/dashboard";

const queryParams = (period: PeriodFilter, date: string) => ({
  period,
  date,
});

export const dashboardService = {
  async getSummary(period: PeriodFilter, date: string) {
    const response = await apiClient.get<DashboardSummaryResponse>(
      `${DASHBOARD_ENDPOINT}/summary`,
      { params: queryParams(period, date) },
    );
    return response.data;
  },

  async getTrend(period: PeriodFilter, date: string) {
    const response = await apiClient.get<DashboardTrendResponse>(
      `${DASHBOARD_ENDPOINT}/trend`,
      { params: queryParams(period, date) },
    );
    return response.data;
  },

  async getIncidentStats(period: PeriodFilter, date: string) {
    const response = await apiClient.get<IncidentStatsResponse>(
      `${DASHBOARD_ENDPOINT}/incident-stats`,
      { params: queryParams(period, date) },
    );
    return response.data;
  },

  async getGuardLeaderboard(period: PeriodFilter, date: string) {
    const response = await apiClient.get<GuardLeaderboardResponse>(
      `${DASHBOARD_ENDPOINT}/guard-leaderboard`,
      { params: queryParams(period, date) },
    );
    return response.data;
  },
};
