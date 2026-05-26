export interface AuthUserOut {
  id: number;
  tenant_id?: number | null;
  email: string;
  full_name: string;
  role_code?: "SUPER_ADMIN" | "TENANT_ADMIN" | "BROKER" | null;
  status: string;
  permissions?: PermissionOut[];
}

export interface PermissionOut {
  code:
    | "tenant.read"
    | "tenant.update"
    | "user.manage"
    | "role.manage"
    | "listing.create"
    | "listing.read"
    | "listing.update"
    | "listing.delete"
    | "client.create"
    | "client.read"
    | "client.update"
    | "client.delete"
    | "search.read"
    | "search.create"
    | "chat.read"
    | "chat.create";
  resource: string;
  action: string;
}

export interface RolePublic {
  id: number;
  tenant_id?: number | null;
  code: string;
  name: string;
  description?: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
  role_id?: number | null;
  status?: string;
}

export interface UserImportResponse {
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  skipped_rows: number;
  results: UserImportRowResult[];
}

export interface UserImportRowResult {
  index: number;
  email: string | null;
  status: string;
  user_id?: number | null;
  message?: string | null;
}

export interface UserListResponse {
  items: UserPublic[];
  total: number;
  limit: number;
  offset: number;
}

export interface UserPublic {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  tenant_id?: number | null;
  status: string;
  role_id?: number | null;
  role_code?: "SUPER_ADMIN" | "TENANT_ADMIN" | "BROKER" | null;
}

export interface UserUpdate {
  full_name?: string | null;
  phone?: string | null;
  role_id?: number | null;
  status?: string | null;
}

export const USER_STATUSES = ["active", "inactive", "locked"] as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    "tenant.read", "tenant.update",
    "user.read", "user.create", "user.update", "user.delete",
    "role.manage",
    "listing.create", "listing.read", "listing.update", "listing.delete",
    "client.create", "client.read", "client.update", "client.delete",
    "search.read", "search.create",
    "chat.read", "chat.create"
  ],
  TENANT_ADMIN: [
    "tenant.read", "tenant.update",
    "user.read", "user.create", "user.update", "user.delete",
    "role.manage",
    "listing.create", "listing.read", "listing.update", "listing.delete",
    "client.create", "client.read", "client.update", "client.delete",
    "search.read", "search.create",
    "chat.read", "chat.create"
  ],
  BROKER: [
    "listing.read", "listing.create", "listing.update",
    "client.create", "client.read", "client.update",
    "search.read", "search.create",
    "chat.read", "chat.create"
  ],
}

export const PERMISSION_RESOURCES = [
  { key: "listing", actions: ["read", "create", "update", "delete"] },
  { key: "client", actions: ["read", "create", "update", "delete"] },
  { key: "user", actions: ["read", "create", "update", "delete"] },
  { key: "role", actions: ["manage"] },
  { key: "tenant", actions: ["read", "update"] },
  { key: "chat", actions: ["read", "create"] },
  { key: "search", actions: ["read", "create"] },
]