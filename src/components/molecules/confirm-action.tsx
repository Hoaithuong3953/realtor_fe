import * as React from "react"
import { ConfirmDialog } from "./confirm-dialog"

export type ConfirmActionProps = {
  children: React.ReactElement
  title: React.ReactNode
  description?: React.ReactNode
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  confirmVariant?: "solid" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export const ConfirmAction = ({
  children,
  title,
  description,
  onConfirm,
  confirmText,
  cancelText,
  confirmVariant = "solid"
}: ConfirmActionProps) => {
  const [open, setOpen] = React.useState(false)

  const trigger = React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      setOpen(true)
    }
  })

  return (
    <>
      {trigger}
      {open && (
        <div onClick={(e) => e.stopPropagation()}>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            title={title}
            description={description}
            onConfirm={onConfirm}
            confirmText={confirmText}
            cancelText={cancelText}
            confirmVariant={confirmVariant}
          />
        </div>
      )}
    </>
  )
}
