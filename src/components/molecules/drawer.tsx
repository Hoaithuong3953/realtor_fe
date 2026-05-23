import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export type DrawerProps = {
  isOpen: boolean
  onClose: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  hideCloseButton?: boolean
}

export const Drawer = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = "right",
  className,
  hideCloseButton = false,
}: DrawerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={side} 
        className={className} 
        showCloseButton={!hideCloseButton}
      >
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </Sheet>
  )
}
