import { type ColumnDef } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/organisms/common"
import { ActionDropdown } from "@/components/molecules"
import { Tag } from "@/components/atoms"
import { formatPrice } from "@/utils/currency-formatter"
import { formatShortDateTime } from "@/utils/date-formatter"
import { formatClientStatus } from "@/utils/client-formatter"
import type { ClientUiModel, ClientAction } from "@/types/ui"

export interface ClientsTableProps {
  data: ClientUiModel[]
  actions?: (item: ClientUiModel) => ClientAction[]
  onRowClick?: (item: ClientUiModel) => void
  isLoading?: boolean
}

export const ClientsTable = ({ 
  data, 
  actions, 
  isLoading, 
  onRowClick 
}: ClientsTableProps) => {
  const { t } = useTranslation(["client", "common"])

  const columns: ColumnDef<ClientUiModel>[] = [
    {
      accessorKey: "full_name",
      header: t("list.columns.name"),
      cell: ({ row }) => <span className="font-medium">{row.original.full_name}</span>,
    },
    {
      id: "contact",
      header: t("list.columns.contact"),
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span>{row.original.phone || "-"}</span>
          <span className="text-muted-foreground text-xs">{row.original.email || "-"}</span>
        </div>
      )
    },
    {
      id: "type",
      header: t("list.columns.type"),
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="capitalize">{row.original.customer_type ? t(`client:constants.type_${row.original.customer_type}`) : "-"}</span>
          <span className="text-muted-foreground text-xs">{row.original.goal_type ? t(`client:constants.goal_${row.original.goal_type}`) : "-"}</span>
        </div>
      )
    },
    {
      id: "budget",
      header: t("list.columns.budget"),
      cell: ({ row }) => {
        const { budget_min, budget_max } = row.original
        if (budget_min && budget_max) return `${formatPrice(budget_min)} - ${formatPrice(budget_max)}`
        if (budget_max) return `< ${formatPrice(budget_max)}`
        if (budget_min) return `> ${formatPrice(budget_min)}`
        return "-"
      }
    },
    {
      accessorKey: "status",
      header: t("list.columns.status"),
      cell: ({ row }) => {
        const config = formatClientStatus(row.original.status || "new", t)
        return <Tag variant={config.variant} className={config.className}>{config.label}</Tag>
      }
    },
    {
      accessorKey: "updated_at",
      header: t("list.columns.updated_at"),
      cell: ({ row }) => <span className="text-muted-foreground whitespace-nowrap">{formatShortDateTime(row.original.updated_at)}</span>
    },
    {
      id: "actions",
      header: t("list.columns.actions"),
      cell: ({ row }) => {
        const property = row.original
        const rowActions = actions ? actions(property) : []
        return <ActionDropdown actions={rowActions} />
      },
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage={t("client:list.no_results")}
      onRowClick={onRowClick}
    />
  )
}
