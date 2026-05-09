// import { apiClient } from "@/lib/axios"; // TODO: uncomment when backend is ready
import type { LoginPayload, AuthTokens, AuthUser } from "@/types";

// TODO: Replace mock with real API call when backend is ready
export const authService = {
  async login(
    payload: LoginPayload,
  ): Promise<{ tokens: AuthTokens; user: AuthUser }> {
    // MOCK: Simulates successful login for demo
    await new Promise((r) => setTimeout(r, 800));
    if (
      payload.email === "admin@smartpatrol.com" &&
      payload.password === "password"
    ) {
      return {
        tokens: { access_token: "mock-access-token-tenant-admin" },
        user: {
          id: "1",
          email: payload.email,
          full_name: "Ahmad Ridwan",
          role: "tenant_admin",
        },
      };
    }
    if (
      payload.email === "supervisor@smartpatrol.com" &&
      payload.password === "password"
    ) {
      return {
        tokens: { access_token: "mock-access-token-supervisor" },
        user: {
          id: "2",
          email: payload.email,
          full_name: "Budi Santoso",
          role: "supervisor",
        },
      };
    }
    throw new Error("Email atau password salah.");
    // Real API: return apiClient.post("/auth/login", payload).then(r => r.data);
  },

  async logout(): Promise<void> {
    // Real API: return apiClient.post("/auth/logout").then(r => r.data);
    await new Promise((r) => setTimeout(r, 100));
  },

  async me(): Promise<AuthUser> {
    // Real API: return apiClient.get("/auth/me").then(r => r.data);
    const user = localStorage.getItem("user");
    if (user) return JSON.parse(user);
    throw new Error("Not authenticated");
  },
};
