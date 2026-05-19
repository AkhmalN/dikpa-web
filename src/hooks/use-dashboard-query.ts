import { dashboardService } from "@/services/dashboard.service";
import type { PeriodFilter } from "@/types";
import { useQuery } from "@tanstack/react-query";

type dashboardFilters = {
  period: PeriodFilter;
  date: string;
};

export const dashboardQueryKeys = {
  all: ["dashboard-summary"] as const,
  list: ({ period, date }: dashboardFilters) =>
    ["dashboard-summary", period, date] as const,
};

export function useDashboardSummaryQuery(period: PeriodFilter, date: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.list({ period, date }),
    queryFn: () => dashboardService.getSummary(period, date),
    staleTime: 0, // Data immediately considered stale
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes (for offline)
  });
}
