import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex w-fit items-center gap-1.5 overflow-hidden border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        info: "border-info/20 bg-info/10 text-info hover:bg-info/20",
      },
      size: {
        sm: "h-4 px-1.5 py-0 text-[10px]",
        md: "h-6 px-2.5 py-1",
        lg: "h-7 px-3 py-1 text-sm",
      },
      shape: {
        default: "rounded-md",
        sm: "rounded-sm",
        pill: "rounded-full",
        square: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "default"
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  onClose?: (e: React.MouseEvent) => void
  leftIcon?: React.ReactNode
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  function Tag({ className, variant, size, shape, onClose, leftIcon, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(tagVariants({ variant, size, shape }), className)} {...props}>
      {leftIcon && <span className="shrink-0 flex items-center justify-center">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {onClose && (
        <button
          type="button"
          className={cn(
            "ml-0.5 shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            variant === "info" ? "hover:bg-info/20" : "hover:bg-foreground/10"
          )}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose(e)
          }}
        >
          <X className="size-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  )
})
