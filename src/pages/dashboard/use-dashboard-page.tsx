import {
  useDashboardSummaryQuery,
  useDashboardTrendQuery,
  useIncidentStatsQuery,
  useGuardLeaderboardQuery,
} from "@/hooks/use-dashboard-query";
import type { PeriodFilter } from "@/types";
import { useState, useCallback, useMemo } from "react";

export function useDashboardPage() {
  const [period, setPeriod] = useState<PeriodFilter>("weekly");
  const [date] = useState(() => new Date().toISOString().split("T")[0]);

  const summaryQuery = useDashboardSummaryQuery(period, date);
  const trendQuery = useDashboardTrendQuery(period, date);
  const incidentStatsQuery = useIncidentStatsQuery(period, date);
  const guardLeaderboardQuery = useGuardLeaderboardQuery(period, date);

  const isLoading = useMemo(
    () =>
      summaryQuery.isLoading ||
      trendQuery.isLoading ||
      incidentStatsQuery.isLoading ||
      guardLeaderboardQuery.isLoading,
    [
      summaryQuery.isLoading,
      trendQuery.isLoading,
      incidentStatsQuery.isLoading,
      guardLeaderboardQuery.isLoading,
    ],
  );

  const stableRefetch = useCallback(() => {
    return Promise.all([
      summaryQuery.refetch(),
      trendQuery.refetch(),
      incidentStatsQuery.refetch(),
      guardLeaderboardQuery.refetch(),
    ]);
  }, [
    summaryQuery.refetch,
    trendQuery.refetch,
    incidentStatsQuery.refetch,
    guardLeaderboardQuery.refetch,
  ]);

  return {
    summary: summaryQuery.data ?? null,
    trend: trendQuery.data ?? null,
    incidentStats: incidentStatsQuery.data ?? null,
    guardLeaderboard: guardLeaderboardQuery.data ?? null,
    isLoading,
    period,
    setPeriod,
    refetch: stableRefetch,
  };
}
