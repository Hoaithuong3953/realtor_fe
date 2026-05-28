import { AlertCircle, CheckCircle2, Info } from "lucide-react"

type TranslationFn = (key: string, options?: Record<string, unknown>) => string

export function getImportRowDisplay(status: string | null | undefined, t: TranslationFn) {
  const safeStatus = status || ""
  let label = safeStatus
  let color = "bg-gray-100 text-gray-700"
  let icon = <Info className="w-4 h-4 text-gray-500" />
  
  switch(safeStatus.toLowerCase()) {
    case "success":
    case "created":
      label = t("import:importResult.status_created")
      color = "bg-green-100 text-green-700"
      icon = <CheckCircle2 className="w-4 h-4 text-green-600" />
      break
    case "updated":
      label = t("import:importResult.status_updated")
      color = "bg-blue-100 text-blue-700"
      icon = <Info className="w-4 h-4 text-blue-600" />
      break
    case "skipped":
      label = t("import:importResult.status_skipped")
      color = "bg-gray-100 text-gray-700"
      icon = <Info className="w-4 h-4 text-gray-500" />
      break
    case "failed":
      label = t("import:importResult.status_failed")
      color = "bg-red-100 text-red-700"
      icon = <AlertCircle className="w-4 h-4 text-red-600" />
      break
  }

  return { label, color, icon }
}
