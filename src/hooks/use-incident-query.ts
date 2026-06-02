import { useQuery } from "@tanstack/react-query";
import { incidentsService } from "@/services/incidents.service";
import type { IncidentSeverity, IncidentStatus } from "@/types";

type IncidentListFilters = {
  page: number;
  perPage: number;
  search: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
};

export const incidentQueryKeys = {
  all: ["incidents"] as const,
  list: ({ page, perPage, search, status, severity }: IncidentListFilters) =>
    [
      "incidents",
      page,
      perPage,
      search.trim(),
      status ?? "",
      severity ?? "",
    ] as const,
};

export function useIncidentsQuery(filters: IncidentListFilters) {
  return useQuery({
    queryKey: incidentQueryKeys.list(filters),
    queryFn: () =>
      incidentsService.getList({
        page: filters.page + 1,
        per_page: filters.perPage,
        search: filters.search.trim(),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.severity ? { severity: filters.severity } : {}),
      }),
    placeholderData: (previousData) => previousData,
  });
}
