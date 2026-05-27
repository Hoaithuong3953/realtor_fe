import * as React from "react"
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  className?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState = ({ icon, title, description, className, action }: EmptyStateProps) => {
  return (
    <Empty className={className}>
      <EmptyMedia>
        {icon}
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      {description && <EmptyDescription>{description}</EmptyDescription>}
      {action && (
        <div className="mt-4">
          <button
            onClick={action.onClick}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            {action.label}
          </button>
        </div>
      )}
    </Empty>
  )
}
