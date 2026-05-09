import type {
  Assignment,
  AssignmentPayload,
  PaginatedResponse,
  ListParams,
} from "@/types";
import { apiClient } from "@/lib/axios";

export const assignmentsService = {
  async getList(
    params: ListParams = {},
  ): Promise<PaginatedResponse<Assignment>> {
    const response = await apiClient.get("/assignments", { params });
    return response.data;
  },

  async getById(id: string): Promise<Assignment> {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },

  async create(payload: AssignmentPayload): Promise<Assignment> {
    const newAssignment: Partial<Assignment> = {
      user_id: payload.user_id,
      shift_id: payload.shift_id,
      duty_date: payload.duty_date,
      assigned_checkpoint_ids: payload.assigned_checkpoint_ids,
      notes: payload.notes,
    };

    const response = await apiClient.post("/assignments", newAssignment);
    return response.data;
  },

  async update(id: string, payload: AssignmentPayload): Promise<Assignment> {
    const updatedAssignment: Partial<Assignment> = {
      user_id: payload.user_id,
      shift_id: payload.shift_id,
      duty_date: payload.duty_date,
      assigned_checkpoint_ids: payload.assigned_checkpoint_ids,
      notes: payload.notes,
    };
    const response = await apiClient.put(
      `/assignments/${id}`,
      updatedAssignment,
    );
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  },
};
