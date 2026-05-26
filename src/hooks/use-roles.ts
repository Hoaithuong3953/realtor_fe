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
