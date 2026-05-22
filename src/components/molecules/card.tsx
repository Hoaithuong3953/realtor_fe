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

export type { CardProps }
