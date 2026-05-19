import { useDashboardSummaryQuery } from "@/hooks/use-dashboard-query";
import type { PeriodFilter } from "@/types";
import { useState, useCallback } from "react";

export function useDashboardPage() {
  const [period, setPeriod] = useState<PeriodFilter>("weekly");
  const [date] = useState(() => new Date().toISOString().split("T")[0]);

  console.log("Selected Period:", period);

  const summaryQuery = useDashboardSummaryQuery(period, date);

  // Stable refetch function that doesn't change on every render
  const stableRefetch = useCallback(() => {
    return summaryQuery.refetch();
  }, [summaryQuery.refetch]);

  return {
    data: summaryQuery.data ?? null,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
    period,
    setPeriod,
    refetch: stableRefetch,
  };
}
