import { useTranslation } from "react-i18next"
import { useRolesWithPermissionsQuery, usePermissionsMetadataQuery } from "@/hooks/use-roles"
import { PermissionMatrix } from "@/components/organisms/roles/permission-matrix"

export default function RolesPage() {
  const { t } = useTranslation(["role"])
  const { data: rolesData, isLoading: isLoadingRoles } = useRolesWithPermissionsQuery()
  const { data: permissionResources, isLoading: isLoadingMetadata } = usePermissionsMetadataQuery()

  const isLoading = isLoadingRoles || isLoadingMetadata

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("role:matrix.title")}</h2>
      </div>
      <p className="text-muted-foreground">
        {t("role:matrix.description")}
      </p>
      
      <div className="mt-8">
        <PermissionMatrix 
          roles={rolesData || []} 
          resources={permissionResources || []}
          isLoading={isLoading} 
        />
      </div>
    </div>
  )
}
