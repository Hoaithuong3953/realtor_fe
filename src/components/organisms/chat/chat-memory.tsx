import { BrainCircuit } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/atoms"
import { Drawer, MemoryCard, ConfirmDialog } from "@/components/molecules"
import type { MemoryGroupUI } from "@/types/ui/chat"

export type ChatMemoryItem = {
  id: string
  content: string
  source?: string
}

type ChatMemoryProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  groups?: MemoryGroupUI[]
  onDelete?: (id: string) => void
  onReset?: () => void
}

export const ChatMemory = ({ 
  isOpen, 
  onOpenChange, 
  groups = [], 
  onDelete, 
  onReset 
}: ChatMemoryProps) => {
  const { t: tChat } = useTranslation("chat")
  const { t: tCommon } = useTranslation("common")
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    setShowResetConfirm(false)
    onReset?.()
  }

  const renderMemory = (mem: ChatMemoryItem) => {
    return (
      <MemoryCard 
        key={mem.id} 
        memory={mem} 
        onDelete={onDelete} 
      />
    )
  }

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onOpenChange}
      side="right"
      className="w-[400px] sm:max-w-[400px] flex flex-col p-0 gap-0"
      hideCloseButton={false}
      title={
        <div className="flex items-center gap-2 text-primary w-full pr-8">
          <BrainCircuit className="size-5" />
          <span className="flex-1 text-left">{tChat("components.memory_title")}</span>
          <Button variant="ghost" size="xs" className="h-7 text-xs" onClick={() => setShowResetConfirm(true)}>
            {tCommon("actions.reset")}
          </Button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto p-4 bg-muted/20 border-t">
        {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
              <BrainCircuit className="size-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                {tChat("components.memory_empty")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pb-8">
              {groups.map((group) => (
                group.items.length > 0 && (
                  <div key={group.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary px-1 mb-1">
                      <group.icon className="size-4" />
                      {group.label}
                    </div>
                    {group.items.map(renderMemory)}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        title={tChat("messages.memory_reset_confirm_title")}
        description={tChat("messages.memory_reset_confirm_desc")}
        onConfirm={handleReset}
        confirmVariant="destructive"
        cancelText={tCommon("actions.cancel")}
        confirmText={tCommon("actions.reset")}
      />
    </Drawer>
  )
}


