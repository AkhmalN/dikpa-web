import axios, { type InternalAxiosRequestConfig } from "axios";

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://api.smartpatrol.example.com/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/* ─────── Request interceptor: attach access token ─────── */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ─────── Refresh token state ─────── */
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
}

/* ─────── Response interceptor: 401 → refresh → retry ─────── */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: InternalAxiosRequestConfig & {
      _retry?: boolean;
    } = error.config;

    const statusCode: number = error.response?.status ?? 0;

    // Only attempt refresh for 401 and not on login/refresh endpoints themselves
    if (
      statusCode === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith("/auth/login") &&
      !originalRequest.url?.endsWith("/auth/refresh")
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        // No refresh token → force logout
        localStorage.clear();
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(
          new ApiError(401, "Session expired. Please login again."),
        );
      }

      if (isRefreshing) {
        // Already refreshing — queue this request
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken: string = data.data.access_token;
        const newRefreshToken: string = data.data.refresh_token;

        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(
          new ApiError(401, "Session expired. Please login again."),
        );
      } finally {
        isRefreshing = false;
      }
    }

    const message: string =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan yang tidak diketahui";

    return Promise.reject(new ApiError(statusCode, message));
  },
);
