import { useQuery } from "@tanstack/react-query"
import { roleService } from "@/services/role.service"

interface UseRolesOptions {
  enabled?: boolean
}

export const useRolesQuery = (options?: UseRolesOptions) => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => roleService.getRoles(),
    enabled: options?.enabled,
  })
}

export const useRolesWithPermissionsQuery = (options?: UseRolesOptions) => {
  return useQuery({
    queryKey: ["roles", "permissions"],
    queryFn: () => roleService.getRolesWithPermissions(),
    enabled: options?.enabled,
  })
}

export const usePermissionsMetadataQuery = (options?: UseRolesOptions) => {
  return useQuery({
    queryKey: ["roles", "permissions", "metadata"],
    queryFn: () => roleService.getPermissionsMetadata(),
    enabled: options?.enabled,
  })
}
