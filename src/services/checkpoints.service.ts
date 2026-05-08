import type {
  Checkpoint,
  CheckpointPayload,
  PaginatedResponse,
  ListParams,
} from "@/types";
import { apiClient } from "@/lib/axios";

const CHECKPOINTS_ENDPOINT = "/checkpoints";

type CheckpointListApiResponse = {
  success: boolean;
  data: Checkpoint[];
  meta: {
    total: number;
    limit: number;
    skip: number;
    page: number;
    totalPages: number;
  };
};

type CheckpointItemApiResponse = {
  success: boolean;
  data: Checkpoint;
  message?: string;
};

type CheckpointDeleteApiResponse = {
  success: boolean;
  message?: string;
};

export const checkpointsService = {
  async getList(
    params: ListParams = {},
  ): Promise<PaginatedResponse<Checkpoint>> {
    const response = await apiClient.get<CheckpointListApiResponse>(
      CHECKPOINTS_ENDPOINT,
      {
        params: {
          page: params.page ?? 1,
          limit: params.per_page ?? 10,
          ...(params.search ? { search: params.search } : {}),
        },
      },
    );
    const { data, meta } = response.data;
    return {
      data,
      total: meta.total,
      page: meta.page,
      per_page: meta.limit,
      total_pages: meta.totalPages,
    };
  },

  async getById(id: string): Promise<Checkpoint> {
    const response = await apiClient.get<CheckpointItemApiResponse>(
      `${CHECKPOINTS_ENDPOINT}/${id}`,
    );
    return response.data.data;
  },

  async getAll(): Promise<Checkpoint[]> {
    const response = await apiClient.get<CheckpointListApiResponse>(
      CHECKPOINTS_ENDPOINT,
      { params: { page: 1, limit: 1000 } },
    );
    return response.data.data;
  },

  async create(payload: CheckpointPayload): Promise<Checkpoint> {
    const response = await apiClient.post<CheckpointItemApiResponse>(
      CHECKPOINTS_ENDPOINT,
      payload,
    );
    return response.data.data;
  },

  async update(id: string, payload: CheckpointPayload): Promise<Checkpoint> {
    const response = await apiClient.put<CheckpointItemApiResponse>(
      `${CHECKPOINTS_ENDPOINT}/${id}`,
      payload,
    );
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<CheckpointDeleteApiResponse>(
      `${CHECKPOINTS_ENDPOINT}/${id}`,
    );
  },

  async printQr(id: string): Promise<void> {
    const response = await apiClient.get(
      `${CHECKPOINTS_ENDPOINT}/${id}/print`,
      { responseType: "blob" },
    );
    const url = URL.createObjectURL(response.data as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `checkpoint-${id}.png`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
