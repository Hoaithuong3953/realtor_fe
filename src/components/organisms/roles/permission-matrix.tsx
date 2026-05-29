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
import type { RoleWithPermissions, PermissionResourcePublic } from "@/types/api/user"
import { LoadingScreen } from "@/components/molecules"

export interface PermissionMatrixProps {
  roles: RoleWithPermissions[]
  resources: PermissionResourcePublic[]
  isLoading?: boolean
}

export const PermissionMatrix = ({ roles, resources, isLoading }: PermissionMatrixProps) => {
  const { t } = useTranslation(["role", "common"])

  const formatFallback = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  if (isLoading) {
    return <LoadingScreen />
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
          {resources.map((resource) => (
            <React.Fragment key={resource.key}>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableCell colSpan={roles.length + 1} className="font-semibold text-primary">
                  {t(`role:matrix.resources.${resource.key}`, formatFallback(resource.key))}
                </TableCell>
              </TableRow>
              {resource.actions.map((action) => {
                const permissionCode = `${resource.key}.${action}`
                return (
                  <TableRow key={permissionCode}>
                    <TableCell className="pl-8 text-muted-foreground">
                      {t(`role:matrix.actions.${action}`, formatFallback(action))}
                    </TableCell>
                    {roles.map((role) => {
                      const permissions = role.permissions || []
                      const hasPermission = permissions.some(p => p.code === permissionCode)
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
