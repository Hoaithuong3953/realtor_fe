import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ImportResultView, type ImportResultViewProps } from "@/components/molecules/import-result-view"

export interface ImportResultModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  data: ImportResultViewProps["data"] | null
  title?: string
  description?: string
}

export const ImportResultModal = ({
  isOpen,
  onOpenChange,
  data,
  title,
  description
}: ImportResultModalProps) => {
  const { t } = useTranslation("import")

  const displayTitle = title || t("importFile.resultTitle")
  const displayDescription = description || t("importFile.resultDescription")

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>{displayTitle}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </DialogHeader>
        {data && <ImportResultView data={data} />}
      </DialogContent>
    </Dialog>
  )
}
