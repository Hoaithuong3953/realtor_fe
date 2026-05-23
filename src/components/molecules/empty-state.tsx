import * as React from "react"
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  className?: string
}

export const EmptyState = ({ icon, title, description, className }: EmptyStateProps) => {
  return (
    <Empty className={className}>
      <EmptyMedia>
        {icon}
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      {description && <EmptyDescription>{description}</EmptyDescription>}
    </Empty>
  )
}
