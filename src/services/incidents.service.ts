import type { Incident, IncidentStatusUpdatePayload, PaginatedResponse, ListParams } from "@/types";
import { mockIncidents } from "./mock-data";

let incidents = [...mockIncidents];

function applyFilters(data: Incident[], params: ListParams): PaginatedResponse<Incident> {
  let filtered = [...data];
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(x =>
      x.title.toLowerCase().includes(s) ||
      (x.reporter_name || "").toLowerCase().includes(s)
    );
  }
  if (params.status) filtered = filtered.filter(x => x.status === params.status);
  if (params.severity) filtered = filtered.filter(x => x.severity === params.severity);
  filtered.sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const total = filtered.length;
  const start = (page - 1) * per_page;
  return { data: filtered.slice(start, start + per_page), total, page, per_page, total_pages: Math.ceil(total / per_page) };
}

export const incidentsService = {
  async getList(params: ListParams = {}): Promise<PaginatedResponse<Incident>> {
    await new Promise(r => setTimeout(r, 400));
    return applyFilters(incidents, params);
  },

  async getById(id: string): Promise<Incident> {
    await new Promise(r => setTimeout(r, 200));
    const inc = incidents.find(x => x.id === id);
    if (!inc) throw new Error("Incident tidak ditemukan");
    return inc;
  },

  async updateStatus(id: string, payload: IncidentStatusUpdatePayload): Promise<Incident> {
    await new Promise(r => setTimeout(r, 500));
    const idx = incidents.findIndex(x => x.id === id);
    if (idx === -1) throw new Error("Incident tidak ditemukan");
    incidents[idx] = {
      ...incidents[idx],
      status: payload.status,
      resolved_at: payload.status === "RESOLVED" ? new Date().toISOString() : incidents[idx].resolved_at,
      updated_at: new Date().toISOString(),
    };
    return incidents[idx];
  },
};
