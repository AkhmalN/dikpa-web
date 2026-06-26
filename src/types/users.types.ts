export type UserAppRole = "admin" | "supervisor" | "guard" | "auditor";

export interface AppUser {
  _id: string;
  tenant_id: string;
  username: string;
  name: string;
  email: string;
  role: UserAppRole;
  phone?: string;
  is_active?: boolean;
}

export interface UserPayload {
  username: string;
  name: string;
  email: string;
  password: string;
  role: UserAppRole;
  phone?: string;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  role?: UserAppRole;
  phone?: string;
  is_active?: boolean;
}
