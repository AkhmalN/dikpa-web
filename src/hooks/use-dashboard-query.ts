import { dashboardService } from "@/services/dashboard.service";
import type { PeriodFilter } from "@/types";
import { useQuery } from "@tanstack/react-query";

type DashboardFilters = {
  period: PeriodFilter;
  date: string;
};

const staleConfig = {
  staleTime: 0,
  gcTime: 1000 * 60 * 5,
} as const;

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: ({ period, date }: DashboardFilters) =>
    ["dashboard", "summary", period, date] as const,
  trend: ({ period, date }: DashboardFilters) =>
    ["dashboard", "trend", period, date] as const,
  incidentStats: ({ period, date }: DashboardFilters) =>
    ["dashboard", "incident-stats", period, date] as const,
  guardLeaderboard: ({ period, date }: DashboardFilters) =>
    ["dashboard", "guard-leaderboard", period, date] as const,
};

export function useDashboardSummaryQuery(period: PeriodFilter, date: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.summary({ period, date }),
    queryFn: () => dashboardService.getSummary(period, date),
    ...staleConfig,
  });
}

export function useDashboardTrendQuery(period: PeriodFilter, date: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.trend({ period, date }),
    queryFn: () => dashboardService.getTrend(period, date),
    ...staleConfig,
  });
}

export function useIncidentStatsQuery(period: PeriodFilter, date: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.incidentStats({ period, date }),
    queryFn: () => dashboardService.getIncidentStats(period, date),
    ...staleConfig,
  });
}

export function useGuardLeaderboardQuery(period: PeriodFilter, date: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.guardLeaderboard({ period, date }),
    queryFn: () => dashboardService.getGuardLeaderboard(period, date),
    ...staleConfig,
  });
}
