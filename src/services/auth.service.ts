import { apiClient } from "@/lib/axios";
import axios from "axios";
import type {
  LoginPayload,
  AuthTokens,
  AuthUser,
  LoginApiResponse,
  MeApiResponse,
} from "@/types";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://api.smartpatrol.example.com/v1";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await apiClient.post<LoginApiResponse>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    // Note: use raw axios, not apiClient — avoids intercept loop
    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    });
    return data.data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refresh_token: refreshToken });
      }
    } catch {
      // ignore network errors during logout
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },

  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get<MeApiResponse>("/auth/me");
    return data.data;
  },
};
