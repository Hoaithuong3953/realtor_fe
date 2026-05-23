import * as React from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/atoms/button"

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  cancelText?: React.ReactNode
  confirmText?: React.ReactNode
  onConfirm: () => void
  confirmVariant?: "solid" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  cancelText,
  confirmText,
  onConfirm,
  confirmVariant = "solid",
}: ConfirmDialogProps) => {
  const { t } = useTranslation("common")
  
  const finalCancelText = cancelText || t("actions.cancel")
  const finalConfirmText = confirmText || t("actions.confirm")

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-0 sm:space-x-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {finalCancelText}
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm}>
            {finalConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
