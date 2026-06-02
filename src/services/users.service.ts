import { apiClient } from "@/lib/axios";
import type { ListParams } from "@/types";

export const USER_API_BASE_PATH = "/api/v1/users" as const;

export const USER_API_ENDPOINTS = {
  list: USER_API_BASE_PATH,
  create: USER_API_BASE_PATH,
  byId: (id: string) => `${USER_API_BASE_PATH}/${id}`,
} as const;

export type AppRole = "tenant_admin" | "supervisor" | "guard" | "auditor";

export type UserPayload = {
  _id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  email: string;
  app_role: AppRole;
};

export type CreateUserRequest = {
  user_id: string;
  name: string;
  email: string;
  app_role: AppRole;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  app_role?: AppRole;
};

export type GetUsersResponse = {
  success: boolean;
  message: string;
  data: UserPayload[];
};

export type GetUserByIdResponse = {
  success: boolean;
  message: string;
  data: UserPayload;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  data: UserPayload;
};

export type UpdateUserResponse = {
  success: boolean;
  message: string;
  data: UserPayload;
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
};

function resolveApiUrl(path: string): string {
  const baseUrl = apiClient.defaults.baseURL;
  if (
    typeof baseUrl === "string" &&
    baseUrl.length > 0 &&
    /^https?:\/\//i.test(baseUrl)
  ) {
    return new URL(path, baseUrl).toString();
  }
  return path;
}

function toListQueryParams(params: ListParams = {}) {
  return {
    ...(params.page ? { page: params.page } : {}),
    ...(params.per_page ? { limit: params.per_page } : {}),
    ...(params.search ? { search: params.search } : {}),
  };
}

export const usersService = {
  async getList(params: ListParams = {}): Promise<GetUsersResponse> {
    const response = await apiClient.get<GetUsersResponse>(
      resolveApiUrl(USER_API_ENDPOINTS.list),
      {
        params: toListQueryParams(params),
      },
    );
    return response.data;
  },

  async getById(id: string): Promise<UserPayload> {
    const response = await apiClient.get<GetUserByIdResponse>(
      resolveApiUrl(USER_API_ENDPOINTS.byId(id)),
    );
    return response.data.data;
  },

  async create(payload: CreateUserRequest): Promise<UserPayload> {
    const response = await apiClient.post<CreateUserResponse>(
      resolveApiUrl(USER_API_ENDPOINTS.create),
      payload,
    );
    return response.data.data;
  },

  async update(id: string, payload: UpdateUserRequest): Promise<UserPayload> {
    const response = await apiClient.put<UpdateUserResponse>(
      resolveApiUrl(USER_API_ENDPOINTS.byId(id)),
      payload,
    );
    return response.data.data;
  },

  async remove(id: string): Promise<DeleteUserResponse> {
    const response = await apiClient.delete<DeleteUserResponse>(
      resolveApiUrl(USER_API_ENDPOINTS.byId(id)),
    );
    return response.data;
  },
};
