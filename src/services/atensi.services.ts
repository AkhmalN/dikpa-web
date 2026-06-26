import type {
  Atensi,
  CreateAtensiDto,
  UpdateAtensiDto,
} from "@/types/atensi.types";
import type { ListParams, PaginatedResponse } from "@/types";
import { apiClient } from "@/lib/axios";

const ATENSI_ENDPOINT = "/atensi";

type AtensiApiPayload = {
  _id: string;
  tenant_id: string;
  shift_id: string;
  checkpoint_id: string | null;
  title: string;
  description: string;
  photo_url: string | null;
  expires_at: string;
  created_by: string;
  read_logs: { user_id: string; read_at: string }[];
  created_at: string;
  updated_at: string;
};

type AtensiListApiResponse = {
  success: boolean;
  data: AtensiApiPayload[];
  meta: {
    total: number;
    limit: number;
    skip: number;
    page: number;
    totalPages: number;
  };
  message?: string;
};

type AtensiItemApiResponse = {
  success: boolean;
  data: AtensiApiPayload;
  message?: string;
};

type AtensiDeleteApiResponse = {
  success: boolean;
  message?: string;
};

function toListQueryParams(params: ListParams = {}) {
  return {
    page: params.page ?? 1,
    limit: params.per_page ?? 10,
    ...(params.shift_id ? { shift_id: params.shift_id } : {}),
    ...(params.checkpoint_id ? { checkpoint_id: params.checkpoint_id } : {}),
  };
}

function mapAtensi(payload: AtensiApiPayload): Atensi {
  return {
    _id: payload._id,
    tenant_id: payload.tenant_id,
    shift_id: payload.shift_id,
    checkpoint_id: payload.checkpoint_id,
    title: payload.title,
    description: payload.description,
    photo_url: payload.photo_url,
    expires_at: payload.expires_at,
    created_by: payload.created_by,
    read_logs: payload.read_logs,
    created_at: payload.created_at,
    updated_at: payload.updated_at,
  };
}

export const atensiServices = {
  async getList(params: ListParams = {}): Promise<PaginatedResponse<Atensi>> {
    const response = await apiClient.get<AtensiListApiResponse>(
      ATENSI_ENDPOINT,
      { params: toListQueryParams(params) },
    );

    return {
      success: response.data.success,
      data: response.data.data.map(mapAtensi),
      meta: response.data.meta,
    };
  },

  async getById(id: string): Promise<Atensi> {
    const response = await apiClient.get<AtensiItemApiResponse>(
      `${ATENSI_ENDPOINT}/${id}`,
    );
    return mapAtensi(response.data.data);
  },

  async create(payload: CreateAtensiDto): Promise<Atensi> {
    const response = await apiClient.post<AtensiItemApiResponse>(
      ATENSI_ENDPOINT,
      payload,
    );
    return mapAtensi(response.data.data);
  },

  async update(id: string, payload: UpdateAtensiDto): Promise<Atensi> {
    const response = await apiClient.put<AtensiItemApiResponse>(
      `${ATENSI_ENDPOINT}/${id}`,
      payload,
    );
    return mapAtensi(response.data.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<AtensiDeleteApiResponse>(`${ATENSI_ENDPOINT}/${id}`);
  },
};
