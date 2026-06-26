import type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  ListParams,
  PaginatedResponse,
} from "@/types";
import { apiClient } from "@/lib/axios";

const INCIDENTS_ENDPOINT = "/incidents/";

type IncidentApiPayload = {
  _id: string;
  tenant_id: string;
  patrol_log_id: string;
  incident_type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  status: IncidentStatus;
  reported_by: string;
  reported_at: string;
  upload_paths: string[];
  createdAt: string;
  updatedAt: string;
};

type IncidentListApiResponse = {
  success: boolean;
  data: IncidentApiPayload[];
  meta: {
    total: number;
    limit: number;
    skip: number;
    page: number;
    totalPages: number;
  };
  message?: string;
};

type IncidentItemApiResponse = {
  success: boolean;
  data: IncidentApiPayload;
  message?: string;
};

function mapIncident(payload: IncidentApiPayload): Incident {
  return {
    ...payload,
    reported_at: new Date(payload.reported_at),
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt),
  };
}

function toListQueryParams(params: ListParams = {}) {
  return {
    page: params.page ?? 1,
    limit: params.per_page ?? 10,
    ...(params.search ? { search: params.search } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.severity ? { severity: params.severity } : {}),
  };
}

export const incidentsService = {
  async getList(params: ListParams = {}): Promise<PaginatedResponse<Incident>> {
    const response = await apiClient.get<IncidentListApiResponse>(
      INCIDENTS_ENDPOINT,
      { params: toListQueryParams(params) },
    );

    return {
      success: response.data.success,
      data: response.data.data.map(mapIncident),
      meta: response.data.meta,
    };
  },

  async getById(id: string): Promise<Incident> {
    const response = await apiClient.get<IncidentItemApiResponse>(
      `${INCIDENTS_ENDPOINT}${id}`,
    );
    return mapIncident(response.data.data);
  },
};
