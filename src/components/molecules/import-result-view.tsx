import { CheckCircle2, FileText, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ImportResultRow {
  index: number
  statusLabel: string
  statusColor: string
  statusIcon: React.ReactNode
  identifier?: string | null
  message?: string | null
}

interface ImportResultData {
  total_rows: number
  success_rows: number
  failed_rows: number
  results: ImportResultRow[]
}

export interface ImportResultViewProps {
  data: ImportResultData
}

export const ImportResultView = ({ data }: ImportResultViewProps) => {
  const { t } = useTranslation("import")

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-muted/30 p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center">
          <FileText className="w-5 h-5 text-muted-foreground mb-1" />
          <div className="text-sm font-medium text-muted-foreground mt-2">{t("importResult.total_rows")}</div>
          <div className="text-3xl font-bold mt-1">{data.total_rows}</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-success" />
          <div className="text-sm font-medium text-success mt-2">{t("importResult.success")}</div>
          <div className="text-3xl font-bold text-success mt-1">{data.success_rows}</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center">
          <XCircle className="w-8 h-8 text-destructive" />
          <div className="text-sm font-medium text-destructive mt-2">{t("importResult.failed")}</div>
          <div className="text-3xl font-bold text-destructive mt-1">{data.failed_rows}</div>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/50 font-medium text-sm">
          {t("importResult.details")}
        </div>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[80px]">{t("importResult.row")}</TableHead>
                <TableHead>{t("importResult.identifier")}</TableHead>
                <TableHead className="w-[150px]">{t("importResult.status")}</TableHead>
                <TableHead>{t("importResult.error_details")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((r, i) => {
                return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.index + 1}</TableCell>
                  <TableCell>{r.identifier || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {r.statusIcon}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.statusColor}`}>
                        {r.statusLabel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell 
                    className="text-muted-foreground text-xs max-w-[200px] truncate" 
                    title={r.message || ""}
                  >
                    {r.message}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}
