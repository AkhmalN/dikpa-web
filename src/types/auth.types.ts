export interface AuthUser {
  sub: string;
  username: string;
  name: string;
  email: string;
  role: string;
  tenant_id: string;
  phone?: string;
  platform?: string;
  is_active?: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string | number;
}

export interface LoginPayload {
  username: string;
  password: string;
  tenant_id: string;
}

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: AuthTokens;
}

export interface MeApiResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
