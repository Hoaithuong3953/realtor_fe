import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { ColumnDef } from "@tanstack/react-table"

import { ActionDropdown } from "@/components/molecules"
import { DataTable } from "@/components/organisms/common/data-table"
import { Tag } from "@/components/atoms"
import type { UserAction, UserUiModel } from "@/types/ui/user"
import { formatUserStatus, formatUserRole } from "@/utils/user-formatter"

export interface UsersTableProps {
  data: UserUiModel[]
  isLoading?: boolean
  actions?: (user: UserUiModel) => UserAction[]
}

export const UsersTable = ({ data, isLoading, actions }: UsersTableProps) => {
  const { t } = useTranslation(["common", "user"])

  const columns = useMemo<ColumnDef<UserUiModel>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: t("user:list.table_full_name"),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
              {row.original.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="font-medium truncate">{row.original.full_name}</div>
          </div>
        )
      },
      {
        accessorKey: "email",
        header: t("user:list.table_email"),
      },
      {
        accessorKey: "phone",
        header: t("user:list.table_phone"),
        cell: ({ row }) => row.original.phone || <span className="text-muted-foreground italic">{t("user:form.empty_phone")}</span>
      },
      {
        accessorKey: "role_code",
        header: t("user:list.table_role"),
        cell: ({ row }) => {
          const roleCode = row.original.role_code
          return <span>{formatUserRole(roleCode, t)}</span>
        }
      },
      {
        accessorKey: "status",
        header: t("user:list.table_status"),
        cell: ({ row }) => {
          const status = row.original.status
          const formatted = formatUserStatus(status, t)
          return <Tag variant={formatted.variant}>{formatted.label}</Tag>
        }
      },
      {
        id: "actions",
        cell: ({ row }) => {
          if (!actions) return null
          const userActions = actions(row.original)
          if (!userActions?.length) return null
          
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <ActionDropdown actions={userActions} />
            </div>
          )
        }
      }
    ],
    [actions, t]
  )

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
      />
    </div>
  )
}
