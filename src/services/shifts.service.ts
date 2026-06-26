import type { ListParams, Shift, ShiftPayload } from "@/types";
import { apiClient } from "@/lib/axios";

type ShiftListApiResponse = {
  success: boolean;
  data: Shift[];
  meta: {
    total: number;
    limit: number;
    skip: number;
    page: number;
    totalPages: number;
  };
  message?: string;
};

type ShiftItemApiResponse = {
  success: boolean;
  data: Shift;
  message?: string;
};

type ShiftDeleteApiResponse = {
  success: boolean;
  message?: string;
};

const SHIFTS_ENDPOINT = "/shifts";

function toListQueryParams(params: ListParams = {}) {
  return {
    page: params.page ?? 1,
    limit: params.per_page ?? 10,
    ...(params.search ? { search: params.search } : {}),
  };
}

export const shiftsService = {
  async getList(params: ListParams = {}): Promise<ShiftListApiResponse> {
    const response = await apiClient.get<ShiftListApiResponse>(
      SHIFTS_ENDPOINT,
      { params: toListQueryParams(params) },
    );
    return response.data;
  },

  async getAll(): Promise<Shift[]> {
    const response = await apiClient.get<ShiftListApiResponse>(
      SHIFTS_ENDPOINT,
      { params: { page: 1, limit: 100 } },
    );
    return response.data.data;
  },

  async getById(id: string): Promise<Shift> {
    const response = await apiClient.get<ShiftItemApiResponse>(
      `${SHIFTS_ENDPOINT}/${id}`,
    );
    return response.data.data;
  },

  async create(payload: ShiftPayload): Promise<Shift> {
    const response = await apiClient.post<ShiftItemApiResponse>(
      SHIFTS_ENDPOINT,
      payload,
    );
    return response.data.data;
  },

  async update(id: string, payload: ShiftPayload): Promise<Shift> {
    const response = await apiClient.put<ShiftItemApiResponse>(
      `${SHIFTS_ENDPOINT}/${id}`,
      payload,
    );
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ShiftDeleteApiResponse>(`${SHIFTS_ENDPOINT}/${id}`);
  },
};
