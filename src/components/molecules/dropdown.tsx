import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type DropdownItemType = {
  id: string
  label: React.ReactNode
  icon?: React.ElementType
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  danger?: boolean
  className?: string
}

export type DropdownProps = {
  trigger: React.ReactNode
  label?: string
  items: DropdownItemType[]
  align?: "start" | "center" | "end"
  className?: string
  onOpenChange?: (open: boolean) => void
}

export const Dropdown = ({
  trigger,
  label,
  items,
  align = "end",
  className,
  onOpenChange,
}: DropdownProps) => {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("w-56", className)}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem 
              key={item.id} 
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                "cursor-pointer",
                item.danger && "text-destructive focus:text-destructive focus:bg-destructive/10",
                item.className
              )}
            >
              {Icon && <Icon className="mr-2 size-4" />}
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
