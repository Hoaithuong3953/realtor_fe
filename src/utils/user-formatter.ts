import { type TFunction } from "i18next"
import type { UserFormData } from "@/types/ui"

export type UserStatus = NonNullable<UserFormData["status"]>

export interface UserStatusFormat {
  variant: "default" | "secondary" | "outline" | "destructive" | "info"
  label: string
}

export const formatUserStatus = (status: string, t: TFunction): UserStatusFormat => {
  switch (status) {
    case "active":
      return {
        variant: "default",
        label: t("user:constants.status_active")
      }
    case "inactive":
      return {
        variant: "secondary",
        label: t("user:constants.status_inactive")
      }

    default:
      return {
        variant: "outline",
        label: status
      }
  }
}

export const formatUserRole = (roleCode: string | null | undefined): string => {
  switch (roleCode) {
    case "SUPER_ADMIN":
      return "Super Admin"
    case "TENANT_ADMIN":
      return "Tenant Admin"
    case "BROKER":
      return "Broker"
    default:
      return roleCode || "-"
  }
}
