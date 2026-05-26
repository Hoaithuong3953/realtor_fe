import { type TFunction } from "i18next"
import type { ClientFormData } from "@/types/ui"

export type ClientStatus = NonNullable<ClientFormData["status"]>

export interface ClientStatusFormat {
  variant: "default" | "secondary" | "outline" | "destructive" | "info"
  className?: string
  label: string
}

export const formatClientStatus = (status: string, t: TFunction): ClientStatusFormat => {
  switch (status) {
    case "new":
      return {
        variant: "info",
        label: t("client:constants.status_new")
      }
    case "contacted":
      return {
        variant: "secondary",
        label: t("client:constants.status_contacted")
      }
    case "qualified":
      return {
        variant: "default",
        label: t("client:constants.status_qualified")
      }
    case "closed":
      return {
        variant: "default",
        label: t("client:constants.status_closed")
      }
    case "archived":
      return {
        variant: "outline",
        label: t("client:constants.status_archived")
      }
    default:
      return {
        variant: "outline",
        label: status
      }
  }
}
