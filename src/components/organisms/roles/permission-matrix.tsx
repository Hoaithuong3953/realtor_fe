import React from "react"
import { useTranslation } from "react-i18next"
import { Check, X } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RolePublic } from "@/types/api/user"
import { ROLE_PERMISSIONS, PERMISSION_RESOURCES } from "@/types/api/user"

export interface PermissionMatrixProps {
  roles: RolePublic[]
  isLoading?: boolean
}

export const PermissionMatrix = ({ roles, isLoading }: PermissionMatrixProps) => {
  const { t } = useTranslation(["role", "common"])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 text-muted-foreground">
        {t("common:status.loading")}
      </div>
    )
  }

  if (!roles.length) {
    return null
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[300px] font-semibold">{t("role:matrix.resource")}</TableHead>
            {roles.map((role) => (
              <TableHead key={role.id} className="text-center font-semibold">
                {t(`role:matrix.roles.${role.code}`, role.name)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSION_RESOURCES.map((resource) => (
            <React.Fragment key={resource.key}>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableCell colSpan={roles.length + 1} className="font-semibold text-primary">
                  {t(`role:matrix.resources.${resource.key}`)}
                </TableCell>
              </TableRow>
              {resource.actions.map((action) => {
                const permissionCode = `${resource.key}.${action}`
                return (
                  <TableRow key={permissionCode}>
                    <TableCell className="pl-8 text-muted-foreground">
                      {t(`role:matrix.actions.${action}`)}
                    </TableCell>
                    {roles.map((role) => {
                      const permissions = ROLE_PERMISSIONS[role.code] || []
                      const hasPermission = permissions.includes(permissionCode)
                      return (
                        <TableCell key={role.id} className="text-center">
                          {hasPermission ? (
                            <div className="flex justify-center">
                              <Check className="size-4 text-green-500" />
                            </div>
                          ) : (
                            <div className="flex justify-center text-destructive/50">
                              <X className="size-4" />
                            </div>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
