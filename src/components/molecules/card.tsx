import * as React from "react"

import {
  Card as UICard,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui"
import { cn } from "@/lib/utils"

type CardProps = Omit<React.ComponentProps<typeof UICard>, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
}

export const Card = ({
  className,
  title,
  description,
  action,
  footer,
  children,
  contentClassName,
  headerClassName,
  footerClassName,
  ...props
}: CardProps) => {
  const hasHeader = title || description || action

  return (
    <UICard className={className} {...props}>
      {hasHeader ? (
        <CardHeader className={headerClassName}>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}

      {children ? (
        <CardContent className={cn(contentClassName)}>{children}</CardContent>
      ) : null}

      {footer ? (
        <CardFooter className={cn(footerClassName)}>{footer}</CardFooter>
      ) : null}
    </UICard>
  )
}

export type CardSkeletonProps = {
  className?: string
  hasImage?: boolean
  textLines?: number
  hasActions?: boolean
}

export const CardSkeleton = ({
  className,
  hasImage = false,
  textLines = 2,
  hasActions = false
}: CardSkeletonProps) => {
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border bg-card p-3 w-full h-full", className)}>
      {hasImage && <Skeleton className="aspect-[4/3] w-full rounded-md" />}
      <div className="flex flex-col gap-2 mt-1 flex-1">
        {Array.from({ length: textLines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-4", 
              i === 0 ? "w-3/4 mb-1" : (i === textLines - 1 ? "w-1/2" : "w-full")
            )} 
          />
        ))}
      </div>
      {hasActions && (
        <div className="pt-2 mt-auto flex w-full border-t">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      )}
    </div>
  )
}

export type { CardProps }