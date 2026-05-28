import * as React from "react"
import { Dropdown } from "./dropdown"
import { ConfirmDialog } from "./confirm-dialog"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/atoms"

export type ActionItem = {
  id: string
  label: string
  icon?: React.ElementType
  variant?: "solid" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  onClick?: (e?: React.MouseEvent) => void
  danger?: boolean
  confirmTitle?: string
  confirmDescription?: string
}

export type ActionDropdownProps = {
  actions: ActionItem[]
  trigger?: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  onOpenChange?: (open: boolean) => void
}

export const ActionDropdown = ({ actions, trigger, className, align = "end", onOpenChange }: ActionDropdownProps) => {
  const [actionToConfirm, setActionToConfirm] = React.useState<ActionItem | null>(null)

  const handleActionClick = (action: ActionItem, e: React.MouseEvent) => {
    if (action.confirmTitle) {
      e.stopPropagation()
      setActionToConfirm(action)
    } else {
      action.onClick?.(e)
    }
  }

  const dropdownItems = actions.map(action => ({
    id: action.id,
    label: action.label,
    icon: action.icon,
    danger: action.danger || action.variant === "destructive",
    onClick: (e: React.MouseEvent) => handleActionClick(action, e)
  }))

  const defaultTrigger = (
    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
      <span className="sr-only">Mở menu</span>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  )

  return (
    <div onClick={(e) => e.stopPropagation()} className={className}>
      <Dropdown 
        trigger={trigger || defaultTrigger}
        items={dropdownItems} 
        align={align}
        onOpenChange={onOpenChange}
      />

      <ConfirmDialog
        open={!!actionToConfirm}
        onOpenChange={(isOpen) => !isOpen && setActionToConfirm(null)}
        title={actionToConfirm?.confirmTitle || "Xác nhận"}
        description={actionToConfirm?.confirmDescription}
        confirmVariant={actionToConfirm?.danger || actionToConfirm?.variant === "destructive" ? "destructive" : "solid"}
        onConfirm={() => {
          actionToConfirm?.onClick?.({} as React.MouseEvent)
          setActionToConfirm(null)
        }}
      />
    </div>
  )
}
