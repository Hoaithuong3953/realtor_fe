import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/atoms"
import { ConfirmDialog } from "@/components/molecules"
import { cn } from "@/lib/utils"

export type MemoryCardItem = {
  id: string
  content: string
}

export type MemoryCardProps = {
  memory: MemoryCardItem
  onDelete?: (id: string) => void
}

export const MemoryCard = ({ memory, onDelete }: MemoryCardProps) => {
  const { t: tCommon } = useTranslation("common")
  const { t: tChat } = useTranslation("chat")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    setShowDeleteConfirm(false)
    onDelete?.(memory.id)
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border transition-colors shadow-sm",
        "bg-card hover:border-primary/30"
      )}
    >
      <p className="text-sm text-foreground/90 leading-snug flex-1">{memory.content}</p>

      <Button
        variant="ghost"
        size="icon"
        className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
        aria-label={tCommon("actions.delete")}
        onClick={() => setShowDeleteConfirm(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={tChat("messages.memory_delete_confirm_title")}
        description={tChat("messages.memory_delete_confirm_desc")}
        onConfirm={handleDelete}
        confirmVariant="destructive"
        cancelText={tCommon("actions.cancel")}
        confirmText={tCommon("actions.delete")}
      />
    </div>
  )
}
