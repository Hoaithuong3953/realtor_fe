export type UserStatus = "active" | "inactive" | "pending";

export interface UserPublic {
  id: number;
  email: string;
  full_name: string;
  tenant_id: number | null;
  status: UserStatus;
}

export interface AuthUserOut {
  id: number;
  tenant_id: number | null;
  email: string;
  full_name: string;
  role_code: "SUPER_ADMIN" | "TENANT_ADMIN" | "BROKER" | null;
  status: UserStatus;
}

export interface UserProfile extends UserPublic {
  phone: string | null;
  role_id: number | null;
  role_code: "SUPER_ADMIN" | "TENANT_ADMIN" | "BROKER" | null;
  broker_settings?: {
    avatar?: string;
    license_no?: string;
    bio?: string;
    experience_years?: number;
    working_status?: string;
    [key: string]: unknown;
  } | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
