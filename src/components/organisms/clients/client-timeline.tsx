import { useTranslation } from "react-i18next"
import { formatShortDateTime } from "@/utils/date-formatter"
import { Timeline, InteractionForm } from "@/components/molecules"
import { type SelectOption } from "@/components/molecules/select"
import { INTERACTION_FORMAT_MAP } from "@/utils/client-formatter"

export interface ClientTimelineEvent {
  id?: string | number
  type: string
  created_at: string
  content?: string
}

interface ClientTimelineProps {
  events: ClientTimelineEvent[]
  isLoading: boolean
  onSubmitInteraction: (data: { type: string, content: string }) => void
  isPending?: boolean
  interactionTypeOptions: SelectOption[]
}

export const ClientTimeline = ({ 
  events, 
  isLoading, 
  onSubmitInteraction, 
  isPending,
  interactionTypeOptions
}: ClientTimelineProps) => {
  const { t } = useTranslation(["client"])

  return (
    <div className="space-y-8">
      {/* Input box */}
      <InteractionForm 
        onSubmitInteraction={onSubmitInteraction} 
        isPending={isPending}
        typeOptions={interactionTypeOptions}
      />

      {/* Timeline List */}
      <Timeline
        isLoading={isLoading}
        loadingText={t("timeline.loading")}
        emptyTitle={t("timeline.empty_title")}
        emptyDescription={t("timeline.empty_desc")}
        events={events.map((event, idx) => {
          const format = INTERACTION_FORMAT_MAP[event.type] || INTERACTION_FORMAT_MAP.default
          const Icon = format.icon
          return {
            id: idx,
            icon: <Icon className={`w-4 h-4 ${format.color}`} />,
            title: t(`timeline.type_${event.type}`),
            time: formatShortDateTime(event.created_at),
            content: event.content
          }
        })}
      />
    </div>
  )
}
