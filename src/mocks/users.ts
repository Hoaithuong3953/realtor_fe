import { AuthUserOut, UserPublic, RolePublic } from "@/types/api";

export const mockRoles: RolePublic[] = [
  {
    id: 1,
    tenant_id: 1,
    code: "TENANT_ADMIN",
    name: "Tenant Admin",
    description: "Administrator with full access",
    is_system: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    tenant_id: 1,
    code: "BROKER",
    name: "Broker",
    description: "Real estate broker with listing and client management",
    is_system: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    tenant_id: 1,
    code: "SUPER_ADMIN",
    name: "Super Admin",
    description: "System administrator",
    is_system: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const mockCurrentUser: AuthUserOut = {
  id: 1,
  tenant_id: 1,
  email: "admin@realtor.com",
  full_name: "John Doe",
  role_code: "TENANT_ADMIN",
  status: "active",
  permissions: [
    {
      code: "tenant.read",
      resource: "tenant",
      action: "read",
    },
    {
      code: "tenant.update",
      resource: "tenant",
      action: "update",
    },
    {
      code: "user.manage",
      resource: "user",
      action: "manage",
    },
    {
      code: "role.manage",
      resource: "role",
      action: "manage",
    },
    {
      code: "listing.create",
      resource: "listing",
      action: "create",
    },
    {
      code: "listing.read",
      resource: "listing",
      action: "read",
    },
    {
      code: "listing.update",
      resource: "listing",
      action: "update",
    },
    {
      code: "listing.delete",
      resource: "listing",
      action: "delete",
    },
    {
      code: "client.create",
      resource: "client",
      action: "create",
    },
    {
      code: "client.read",
      resource: "client",
      action: "read",
    },
    {
      code: "client.update",
      resource: "client",
      action: "update",
    },
    {
      code: "client.delete",
      resource: "client",
      action: "delete",
    },
    {
      code: "chat.read",
      resource: "chat",
      action: "read",
    },
    {
      code: "chat.create",
      resource: "chat",
      action: "create",
    },
  ],
};

export const mockUsers: UserPublic[] = [
  {
    id: 1,
    email: "admin@realtor.com",
    full_name: "John Doe",
    phone: "+1234567890",
    tenant_id: 1,
    status: "active",
    role_id: 1,
    role_code: "TENANT_ADMIN",
  },
  {
    id: 2,
    email: "broker1@realtor.com",
    full_name: "Jane Smith",
    phone: "+1987654321",
    tenant_id: 1,
    status: "active",
    role_id: 2,
    role_code: "BROKER",
  },
  {
    id: 3,
    email: "broker2@realtor.com",
    full_name: "Michael Johnson",
    phone: "+1555555555",
    tenant_id: 1,
    status: "active",
    role_id: 2,
    role_code: "BROKER",
  },
  {
    id: 4,
    email: "broker3@realtor.com",
    full_name: "Sarah Williams",
    phone: "+1666666666",
    tenant_id: 1,
    status: "inactive",
    role_id: 2,
    role_code: "BROKER",
  },
];
