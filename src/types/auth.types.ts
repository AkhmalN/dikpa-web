export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: "tenant_admin" | "supervisor" | "guard" | "auditor";
  avatar_url?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
