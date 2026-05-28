import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { AlertCircle, FileSpreadsheet, CheckCircle2, XCircle, MinusCircle } from "lucide-react"

import { DataTable } from "@/components/organisms/common"
import { Badge } from "@/components/ui"
import { type ImportJobResponse } from "@/types/api"
import { getImportJobStatusDisplay } from "@/utils/listing-formatter"

export interface ImportHistoryTableProps {
  data: ImportJobResponse[]
  isLoading?: boolean
  onRowClick?: (job: ImportJobResponse) => void
}

export const ImportHistoryTable = ({ data, isLoading, onRowClick }: ImportHistoryTableProps) => {
  const { t } = useTranslation(["listing", "common"])

  const columns = useMemo<ColumnDef<ImportJobResponse>[]>(() => [
    {
      accessorKey: "id",
      header: t("listing:import_history.table_job_id"),
      cell: ({ row }) => <span className="font-medium text-muted-foreground">#{row.getValue("id")}</span>,
    },
    {
      accessorKey: "created_at",
      header: t("listing:import_history.table_time"),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {format(new Date(row.getValue("created_at")), "dd/MM/yyyy HH:mm")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("listing:import_history.table_status"),
      cell: ({ row }) => {
        const job = row.original
        const statusDisplay = getImportJobStatusDisplay(job.status, t)
        return (
          <div>
            <Badge variant="secondary" className={statusDisplay.color}>
              {statusDisplay.label}
            </Badge>
            {job.error_message && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600 max-w-[200px] truncate" title={job.error_message}>
                <AlertCircle className="w-3 h-3" />
                {job.error_message}
              </div>
            )}
          </div>
        )
      }
    },

    {
      id: "results",
      header: () => <div className="text-right">{t("listing:import_history.table_result")}</div>,
      cell: ({ row }) => {
        const job = row.original
        const isFinished = ["success", "completed", "partial_success", "failed"].includes(job.status.toLowerCase())
        const skipped_rows = job.total_rows - job.success_rows - job.failed_rows
        return (
          <div className="flex flex-col items-end gap-1.5 text-sm">
            <div className="text-muted-foreground">
              {t("listing:import_history.total")}: <span className="font-medium text-foreground">{job.total_rows}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              {job.success_rows > 0 && (
                <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("listing:import_history.success")}: {job.success_rows}</span>
                </div>
              )}
              {job.failed_rows > 0 && (
                <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{t("listing:import_history.failed")}: {job.failed_rows}</span>
                </div>
              )}
              {skipped_rows > 0 && isFinished && (
                <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>{t("listing:import_history.skipped", { defaultValue: "Bỏ qua" })}: {skipped_rows}</span>
                </div>
              )}
            </div>
          </div>
        )
      },
    },
  ], [t])

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage={
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
          <FileSpreadsheet className="w-8 h-8 text-muted-foreground/50" />
          {t("listing:import_history.empty")}
        </div>
      }
    />
  )
}
