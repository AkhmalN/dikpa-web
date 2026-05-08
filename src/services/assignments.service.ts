import type { Assignment, AssignmentPayload, PaginatedResponse, ListParams } from "@/types";
import { mockAssignments } from "./mock-data";

let assignments = [...mockAssignments];

function applyFilters(data: Assignment[], params: ListParams): PaginatedResponse<Assignment> {
  let filtered = [...data];
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(x =>
      (x.user_name || "").toLowerCase().includes(s) ||
      (x.shift_name || "").toLowerCase().includes(s)
    );
  }
  if (params.status) {
    filtered = filtered.filter(x => x.status === params.status);
  }
  if (params.sort_by) {
    filtered.sort((a, b) => {
      const va = String(a[params.sort_by as keyof Assignment] ?? "");
      const vb = String(b[params.sort_by as keyof Assignment] ?? "");
      return params.sort_dir === "desc" ? vb.localeCompare(va) : va.localeCompare(vb);
    });
  }
  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const total = filtered.length;
  const start = (page - 1) * per_page;
  return { data: filtered.slice(start, start + per_page), total, page, per_page, total_pages: Math.ceil(total / per_page) };
}

export const assignmentsService = {
  async getList(params: ListParams = {}): Promise<PaginatedResponse<Assignment>> {
    await new Promise(r => setTimeout(r, 400));
    return applyFilters(assignments, params);
  },

  async getById(id: string): Promise<Assignment> {
    await new Promise(r => setTimeout(r, 200));
    const a = assignments.find(x => x.id === id);
    if (!a) throw new Error("Assignment tidak ditemukan");
    return a;
  },

  async create(payload: AssignmentPayload): Promise<Assignment> {
    await new Promise(r => setTimeout(r, 500));
    // Lookup names from mock data for display
    const newA: Assignment = {
      id: `a${Date.now()}`,
      ...payload,
      user_name: `User ${payload.user_id}`,
      shift_name: `Shift ${payload.shift_id}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    assignments = [newA, ...assignments];
    return newA;
  },

  async update(id: string, payload: AssignmentPayload): Promise<Assignment> {
    await new Promise(r => setTimeout(r, 500));
    const idx = assignments.findIndex(x => x.id === id);
    if (idx === -1) throw new Error("Assignment tidak ditemukan");
    assignments[idx] = { ...assignments[idx], ...payload, updated_at: new Date().toISOString() };
    return assignments[idx];
  },

  async remove(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 400));
    assignments = assignments.filter(x => x.id !== id);
  },
};
