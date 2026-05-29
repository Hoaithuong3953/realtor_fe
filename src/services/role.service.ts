import { apiClient } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/constants/api"
import type { RolePublic, RoleWithPermissions, PermissionResourcePublic } from "@/types/api/user"

export const roleService = {
  /**
   * Fetch all roles available for the current tenant context
   * [GET] /roles
   */
  getRoles: async (): Promise<RolePublic[]> => {
    const { data } = await apiClient.get<RolePublic[]>(API_ENDPOINTS.ROLES.ROOT)
    return data
  },

  /**
   * Fetch all roles with their detailed permissions
   * [GET] /roles/permissions
   */
  getRolesWithPermissions: async (): Promise<RoleWithPermissions[]> => {
    const { data } = await apiClient.get<RoleWithPermissions[]>(`${API_ENDPOINTS.ROLES.ROOT}/permissions`)
    return data
  },

  /**
   * Fetch all available permission resources and actions
   * [GET] /roles/permissions/metadata
   */
  getPermissionsMetadata: async (): Promise<PermissionResourcePublic[]> => {
    const { data } = await apiClient.get<PermissionResourcePublic[]>(`${API_ENDPOINTS.ROLES.ROOT}/permissions/metadata`)
    return data
  }
}
