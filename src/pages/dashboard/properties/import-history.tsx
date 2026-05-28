import { useTranslation } from "react-i18next"
import { RefreshCw } from "lucide-react"
import { ImportHistoryTable } from "@/components/organisms/listings"
import { ImportResultModal } from "@/components/organisms/common"
import { Button } from "@/components/atoms"
import { useImportJobsQuery } from "@/hooks/listings/use-listings"
import { useState } from "react"
import { type ImportJobResponse, type ListingImportRowResult } from "@/types/api"
import { getImportRowDisplay } from "@/utils/import-formatter"

export default function ImportHistoryPage() {
  const { t } = useTranslation(["listing", "common"])
  const { data: jobs, isLoading, refetch, isRefetching } = useImportJobsQuery({ limit: 50 })
  const [selectedJob, setSelectedJob] = useState<ImportJobResponse | null>(null)

  return (
    <div className="flex flex-col flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("listing:import_history.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("listing:import_history.description")}</p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            {t("listing:import_history.refresh")}
          </Button>
        </div>
      </div>

      <ImportHistoryTable 
        data={jobs || []} 
        isLoading={isLoading} 
        onRowClick={(job) => setSelectedJob(job)}
      />

      <ImportResultModal
        isOpen={!!selectedJob}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null)
        }}
        data={selectedJob ? {
          total_rows: selectedJob.total_rows,
          success_rows: selectedJob.success_rows,
          failed_rows: selectedJob.failed_rows,
          results: ((selectedJob.result_json?.results ?? []) as ListingImportRowResult[]).map((r: ListingImportRowResult, idx: number) => {
            const display = getImportRowDisplay(r.status, t)
            
            return {
              index: r.index ?? idx,
              statusLabel: display.label,
              statusColor: display.color,
              statusIcon: display.icon,
              identifier: r.title ?? (r.source_ref !== null ? String(r.source_ref) : "N/A"),
              message: r.message
            }
          })
        } : null}
      />
    </div>
  )
}
