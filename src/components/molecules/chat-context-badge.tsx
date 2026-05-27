import * as React from "react"
import { UserSquare2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Tag } from "@/components/atoms"
import { ConfirmDialog } from "@/components/molecules"

type ChatContextBadgeProps = {
  clientName: string
  onRemove: () => void
  requireConfirm?: boolean
}

export const ChatContextBadge = ({ 
  clientName, 
  onRemove,
  requireConfirm = true 
}: ChatContextBadgeProps) => {
  const { t } = useTranslation("chat")
  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    if (requireConfirm) {
      setOpen(true)
    } else {
      onRemove()
    }
  }

  return (
    <>
      <Tag 
        variant="info" 
        size="md"
        leftIcon={<UserSquare2 className="size-3.5" />}
        onClose={handleClose}
      >
        {t("components.context_badge_consulting_for", { name: clientName })}
      </Tag>

      <ConfirmDialog 
        open={open} 
        onOpenChange={setOpen}
        title={t("components.context_badge_confirm_title")}
        description={t("components.context_badge_confirm_desc", { name: clientName })}
        cancelText={t("components.context_badge_cancel")}
        confirmText={t("components.context_badge_confirm")}
        onConfirm={onRemove}
        confirmVariant="destructive"
      />
    </>
  )
}
