import { apiClient } from "@/lib/axios";
import type {
  AppUser,
  ListParams,
  UserPayload,
  UserUpdatePayload,
} from "@/types";

type UserListApiResponse = {
  success: boolean;
  data: AppUser[];
  message?: string;
};

type UserItemApiResponse = {
  success: boolean;
  data: AppUser;
  message?: string;
};

type UserDeleteApiResponse = {
  success: boolean;
  message?: string;
};

const USERS_ENDPOINT = "/users";

function toListQueryParams(params: ListParams = {}) {
  return {
    ...(params.page ? { page: params.page } : {}),
    ...(params.per_page ? { limit: params.per_page } : {}),
    ...(params.search ? { search: params.search } : {}),
  };
}

export const usersService = {
  async getList(params: ListParams = {}): Promise<UserListApiResponse> {
    const response = await apiClient.get<UserListApiResponse>(USERS_ENDPOINT, {
      params: toListQueryParams(params),
    });
    return response.data;
  },

  async getById(id: string): Promise<AppUser> {
    const response = await apiClient.get<UserItemApiResponse>(
      `${USERS_ENDPOINT}/${id}`,
    );
    return response.data.data;
  },

  async create(payload: UserPayload): Promise<AppUser> {
    const response = await apiClient.post<UserItemApiResponse>(
      USERS_ENDPOINT,
      payload,
    );
    return response.data.data;
  },

  async update(id: string, payload: UserUpdatePayload): Promise<AppUser> {
    const response = await apiClient.put<UserItemApiResponse>(
      `${USERS_ENDPOINT}/${id}`,
      payload,
    );
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<UserDeleteApiResponse>(`${USERS_ENDPOINT}/${id}`);
  },
};
