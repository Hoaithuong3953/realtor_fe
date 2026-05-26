import { apiClient } from "@/lib/api-client"
import { API_ENDPOINTS } from "@/constants/api"
import type { RolePublic } from "@/types/api/user"

export const roleService = {
  /**
   * Fetch all roles available for the current tenant context
   * [GET] /roles
   */
  getRoles: async (): Promise<RolePublic[]> => {
    const { data } = await apiClient.get<RolePublic[]>(API_ENDPOINTS.ROLES.ROOT)
    return data
  }
}
