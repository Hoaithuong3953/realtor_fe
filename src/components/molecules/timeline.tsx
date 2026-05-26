import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/molecules/empty-state"
import { Clock } from "lucide-react"

export interface TimelineEvent {
  id: string | number
  icon?: React.ReactNode
  title: React.ReactNode
  time?: React.ReactNode
  content?: React.ReactNode
}

export interface TimelineProps {
  events: TimelineEvent[]
  isLoading?: boolean
  loadingText?: string
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export const Timeline = ({
  events,
  isLoading,
  loadingText,
  emptyTitle,
  emptyDescription,
  className
}: TimelineProps) => {
  const { t } = useTranslation(["common"])

  const displayLoadingText = loadingText || t("actions.loading")
  const displayEmptyTitle = emptyTitle || t("actions.noData")

  return (
    <div className={cn("space-y-0", className)}>
      {isLoading ? (
        <div className="text-center text-muted-foreground py-4">{displayLoadingText}</div>
      ) : events.length === 0 ? (
        <EmptyState 
          icon={<Clock className="w-8 h-8 text-muted-foreground/30" />}
          title={displayEmptyTitle}
          description={emptyDescription}
          className="py-10 border-dashed"
        />
      ) : (
        events.map((event, idx) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-background rounded-full p-1 border-2 shrink-0 z-10">
                {event.icon}
              </div>
              {idx !== events.length - 1 && (
                <div className="w-0.5 bg-border grow my-1" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="relative overflow-hidden bg-muted/30 border rounded-lg p-4 group">
                <div className="absolute top-0 right-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{event.title}</span>
                  {event.time && (
                    <span className="text-xs text-muted-foreground">
                      {event.time}
                    </span>
                  )}
                </div>
                {event.content && (
                  <div className="text-sm whitespace-pre-wrap">
                    {event.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
