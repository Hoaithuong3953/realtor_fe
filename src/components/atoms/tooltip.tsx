import * as React from "react"

import {
  Tooltip as PrimitiveTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type TooltipProps = Omit<
  React.ComponentProps<typeof PrimitiveTooltip>,
  "children"
> & {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
}

export const Tooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 200,
  ...props
}: TooltipProps) => {
  if (!content) {
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <PrimitiveTooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {content}
        </TooltipContent>
      </PrimitiveTooltip>
    </TooltipProvider>
  )
}

export type { TooltipProps }
