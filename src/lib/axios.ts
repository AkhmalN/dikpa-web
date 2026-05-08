import axios from "axios";

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

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode: number = error.response?.status ?? 0;
    const message: string =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan yang tidak diketahui";

    if (statusCode === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    return Promise.reject(new ApiError(statusCode, message));
  },
);
