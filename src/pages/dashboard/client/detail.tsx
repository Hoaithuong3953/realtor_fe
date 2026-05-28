import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BotMessageSquare } from "lucide-react"
import { formatPrice } from "@/utils/currency-formatter"

import {
  useClientQuery,
  useClientTimelineQuery,
  useCreateInteractionMutation,
  useClientListingsQuery,
  useUnlinkListingMutation,
  useUpdateClientMutation,
} from "@/hooks/use-clients"
import { paths } from "@/routes/paths"
import { Button, Tabs } from "@/components/atoms"
import { ClientGeneralInfo, ClientTimeline, ClientSentListings, ClientFormModal } from "@/components/organisms/clients"
import { LoadingScreen } from "@/components/molecules/loading-screen"
import type { ClientFormData, ClientFieldConfig } from "@/types/ui/client"
import { type ClientInteractionCreate, CLIENT_INTERACTION_TYPES, CLIENT_TYPES, CLIENT_GOAL_TYPES, CLIENT_STATUSES } from "@/types/api"
import type { SentListingItemData } from "@/components/molecules/sent-listing-card"

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation(["client"])
  
  const clientId = Number(id)
  const { data: client, isLoading } = useClientQuery(clientId)
  const { data: timelineData, isLoading: isTimelineLoading } = useClientTimelineQuery(clientId)
  const { data: listings, isLoading: isListingsLoading } = useClientListingsQuery(clientId)
  
  const { mutate: createInteraction, isPending: isInteractionPending } = useCreateInteractionMutation(clientId)
  const { mutate: unlinkListing } = useUnlinkListingMutation(clientId)
  const updateMutation = useUpdateClientMutation(clientId)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fieldConfig: ClientFieldConfig[] = [
    { key: "full_name", label: t("form.full_name") },
    { key: "phone", label: t("form.phone") },
    { key: "email", label: t("form.email") },
    { key: "status", label: t("form.status"), format: (v) => t(`constants.status_${v as string}`) },
    { key: "customer_type", label: t("form.customer_type"), format: (v) => t(`constants.type_${v as string}`) },
    { key: "goal_type", label: t("form.goal_type"), format: (v) => t(`constants.goal_${v as string}`) },
    { key: "budget_min", label: t("form.budget_min"), format: (v) => formatPrice(v as number) },
    { key: "budget_max", label: t("form.budget_max"), format: (v) => formatPrice(v as number) },
  ]

  const handleEditSubmit = (data: ClientFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => setIsEditModalOpen(false)
    })
  }

  const handleChatAI = () => {
    void navigate(`${paths.dashboard.chat}?clientId=${clientId}`)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!client) {
    return <div className="p-8 text-center text-destructive">{t("list.no_results")}</div>
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">


        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            <ClientGeneralInfo 
              client={client} 
              onEditClick={() => setIsEditModalOpen(true)} 
              fieldConfig={fieldConfig}
            />
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-card rounded-2xl border shadow-sm p-1">
              <Tabs 
                defaultValue="timeline"
                items={[
                  {
                    value: "timeline",
                    label: t("detail.tab_timeline"),
                    content: (
                      <div className="p-4 sm:p-6">
                        <ClientTimeline 
                          events={timelineData?.events || []}
                          isLoading={isTimelineLoading}
                          onSubmitInteraction={(data) => createInteraction(data as unknown as ClientInteractionCreate)}
                          isPending={isInteractionPending}
                          interactionTypeOptions={CLIENT_INTERACTION_TYPES.map(type => ({
                            label: t(`timeline.type_${type}`),
                            value: type
                          }))}
                        />
                      </div>
                    )
                  },
                  {
                    value: "listings",
                    label: t("detail.tab_listings"),
                    content: (
                      <div className="p-4 sm:p-6">
                        <ClientSentListings 
                          listings={(listings as unknown as SentListingItemData[]) || []}
                          isLoading={isListingsLoading}
                          onUnlink={(id) => unlinkListing(id)}
                        />
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <ClientFormModal 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen}
        initialData={client}
        onSubmit={handleEditSubmit}
        isPending={updateMutation.isPending}
        typeOptions={CLIENT_TYPES.map(t_ => ({ label: t(`constants.type_${t_}`), value: t_ }))}
        goalOptions={CLIENT_GOAL_TYPES.map(g => ({ label: t(`constants.goal_${g}`), value: g }))}
        statusOptions={CLIENT_STATUSES.map(s => ({ label: t(`constants.status_${s}`), value: s }))}
      />

      {/* Floating Action Button for AI */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <Button 
          variant="solid"
          className="rounded-full shadow-lg h-12 max-w-[48px] group-hover:max-w-[200px] p-0 transition-all duration-300 ease-in-out border-0 flex items-center justify-start overflow-hidden gap-0"
          onClick={handleChatAI}
        >
          <div className="flex items-center justify-center w-12 h-12 shrink-0">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <span className="font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-5">
            {t("detail.ai_assistant")}
          </span>
        </Button>
      </div>
    </div>
  )
}
