export type UserAppRole = "tenant_admin" | "supervisor" | "guard" | "auditor";

export interface AppUser {
  _id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  email: string;
  app_role: UserAppRole;
}

export interface UserPayload {
  user_id: string;
  name: string;
  email: string;
  app_role: UserAppRole;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  app_role?: UserAppRole;
}
