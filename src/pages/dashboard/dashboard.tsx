import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Building2, Users, MessageSquareText, Plus, BotMessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthStore } from "@/store/auth.store"
import { useListingsQuery } from "@/hooks/listings/use-listings"
import { useClientsQuery, useCreateClientMutation } from "@/hooks/use-clients"
import { useChatSessionsQuery } from "@/hooks/use-chat"
import { paths } from "@/routes/paths"

import { Card, PropertyCard, LoadingScreen, EmptyState } from "@/components/molecules"
import { ClientFormModal } from "@/components/organisms/clients"
import { type ClientFormData } from "@/types/ui"
import { CLIENT_TYPES, CLIENT_GOAL_TYPES, CLIENT_STATUSES } from "@/types/api"
import type { PropertyCardProps } from "@/components/molecules/property-card"
import { Button } from "@/components/ui/button"

export default function DashboardHomePage() {
  const { t } = useTranslation(["common", "dashboard", "listing", "client"])
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()

  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const createMutation = useCreateClientMutation()

  // 1. Fetch Totals
  const { data: listingsData, isLoading: isLoadingListings } = useListingsQuery({ limit: 4 })
  const { data: clientsData, isLoading: isLoadingClients } = useClientsQuery({ limit: 5 })
  const { data: chatData, isLoading: isLoadingChats } = useChatSessionsQuery(1)

  const isLoading = isLoadingListings || isLoadingClients || isLoadingChats

  if (isLoading) {
    return <LoadingScreen />
  }

  const totalListings = listingsData?.total || 0
  const totalClients = clientsData?.total || 0
  const totalChats = chatData?.total || 0

  const recentListings = listingsData?.items || []
  const recentClients = clientsData?.items || []

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard:welcome.title", { name: user?.full_name })}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("dashboard:welcome.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => void navigate(paths.dashboard.properties.create)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("dashboard:quick_actions.add_property")}
          </Button>
          <Button variant="outline" onClick={() => setIsClientModalOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            {t("dashboard:quick_actions.add_client")}
          </Button>
          <Button variant="secondary" onClick={() => void navigate(paths.dashboard.chat)}>
            <BotMessageSquare className="mr-2 h-4 w-4" />
            {t("dashboard:quick_actions.ai_copilot")}
          </Button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{t("dashboard:kpi.total_properties")}</h3>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{totalListings}</div>
        </Card>
        
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{t("dashboard:kpi.total_clients")}</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{totalClients}</div>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{t("dashboard:kpi.total_ai_chats")}</h3>
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{totalChats}</div>
        </Card>
      </div>

      {/* 3. Main Content */}
      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-3">
        
        {/* Left Column - Recent Properties */}
        <Card className="md:col-span-4 lg:col-span-2 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("dashboard:sections.recent_properties")}</h3>
            <Button variant="ghost" size="sm" onClick={() => void navigate(paths.dashboard.properties.root)}>
              {t("dashboard:actions.view_all")}
            </Button>
          </div>
          
          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentListings.map(listing => (
                <PropertyCard key={listing.id} {...(listing as unknown as PropertyCardProps)} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("dashboard:empty.no_properties.title")}
              description={t("dashboard:empty.no_properties.description")}
              icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
              action={{
                label: t("dashboard:empty.no_properties.action"),
                onClick: () => void navigate(paths.dashboard.properties.create)
              }}
            />
          )}
        </Card>

        {/* Right Column - Recent Clients */}
        <Card className="md:col-span-3 lg:col-span-1 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("dashboard:sections.recent_clients")}</h3>
            <Button variant="ghost" size="sm" onClick={() => void navigate(paths.dashboard.clients.root)}>
              {t("dashboard:actions.all")}
            </Button>
          </div>
          
          {recentClients.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentClients.map(client => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => void navigate(paths.dashboard.clients.detail.replace(":id", client.id.toString()))}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {client.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{client.full_name}</span>
                      <span className="text-xs text-muted-foreground">{client.phone || client.email || t("dashboard:client.no_info")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("dashboard:empty.no_clients.title")}
              description={t("dashboard:empty.no_clients.description")}
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              className="py-8"
              action={{
                label: t("dashboard:quick_actions.add_client"),
                onClick: () => setIsClientModalOpen(true)
              }}
            />
          )}
        </Card>

      </div>

      <ClientFormModal 
        open={isClientModalOpen} 
        onOpenChange={setIsClientModalOpen} 
        onSubmit={(data: ClientFormData) => {
          createMutation.mutate(data, {
            onSuccess: () => setIsClientModalOpen(false)
          })
        }}
        isPending={createMutation.isPending}
        typeOptions={CLIENT_TYPES.map(t_ => ({ label: t(`client:constants.type_${t_}`), value: t_ }))}
        goalOptions={CLIENT_GOAL_TYPES.map(g => ({ label: t(`client:constants.goal_${g}`), value: g }))}
        statusOptions={CLIENT_STATUSES.map(s => ({ label: t(`client:constants.status_${s}`), value: s }))}
      />
    </div>
  )
}
