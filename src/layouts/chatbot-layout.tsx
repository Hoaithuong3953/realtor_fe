import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom"
import React, { useEffect } from "react"
import { paths } from "@/routes/paths"
import { useTranslation } from "react-i18next"
import { ChatSidebar, ChatHeader, ChatMemory, type ChatHeaderClient } from "@/components/organisms/chat"
import { useChatStore } from "@/store/chat.store"
import { 
  useChatSessionsQuery, 
  useChatSessionQuery,
  useInitializeMemoryMutation,
  useResetMemoryMutation
} from "@/hooks/use-chat"
import { useClientsQuery, useClientQuery } from "@/hooks/use-clients"
import { SidebarInset, SidebarProvider } from "@/components/ui"

export function ChatbotLayout() {
  const { id } = useParams()
  const activeSessionId = id || ""
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation("chat")

  const { data: sessionsData } = useChatSessionsQuery()
  const { data: sessionDetail } = useChatSessionQuery(activeSessionId, !!activeSessionId)
  
  const { mutate: initializeMemory, isPending: isInitializing } = useInitializeMemoryMutation(activeSessionId)
  const { mutate: resetMemory } = useResetMemoryMutation(activeSessionId)

  const urlClientId = searchParams.get("clientId")
  const effectiveClientId = sessionDetail?.client_id || (urlClientId ? Number(urlClientId) : undefined)
  const { data: clientDetail } = useClientQuery(effectiveClientId, !!effectiveClientId)
  const [clientSearchKeyword, setClientSearchKeyword] = React.useState("")
  const { data: clientsData, isLoading: isClientsLoading } = useClientsQuery({ limit: 10, keyword: clientSearchKeyword || undefined })

  const {
    activeClient,
    aggregatedMemory,
    isMemoryOpen,
    setActiveClient,
    setAggregatedMemory,
    setIsMemoryOpen
  } = useChatStore()

  useEffect(() => {
    if (activeSessionId && !sessionDetail) return;

    if (clientDetail && activeClient?.id !== clientDetail.id) {
      setActiveClient(clientDetail)
    } else if (activeSessionId && sessionDetail && !sessionDetail.client_id && activeClient) {
      setActiveClient(null)
    } else if (!activeSessionId && !urlClientId && activeClient) {
      setActiveClient(null)
    }
  }, [clientDetail, sessionDetail, activeSessionId, urlClientId, activeClient, setActiveClient])

  useEffect(() => {
    if (sessionDetail && (sessionDetail.status === "deleted" || sessionDetail.status === "inactive")) {
      void navigate(paths.dashboard.chat, { replace: true })
    }
  }, [sessionDetail, navigate])

  const handleNewChat = () => {
    void navigate(paths.dashboard.chat)
  }

  const handleSelectClient = (client: ChatHeaderClient) => {
    if (activeSessionId) {
      void navigate(`${paths.dashboard.chat}?clientId=${client.id.toString()}`)
    } else {
      const newParams = new URLSearchParams(searchParams)
      newParams.set("clientId", client.id.toString())
      setSearchParams(newParams)
    }
  }

  const handleRemoveContext = () => {
    setActiveClient(null)
    setAggregatedMemory(null)
    void navigate(paths.dashboard.chat)
  }

  const handleInitializeMemory = () => {
    initializeMemory()
  }

  const handleResetMemory = () => {
    resetMemory(undefined, {
      onSuccess: () => {
        setAggregatedMemory(null)
      }
    })
  }


  return (
    <SidebarProvider>
      <ChatSidebar 
        sessions={(sessionsData?.items || [])
          .filter(session => session.status !== "deleted" && session.status !== "inactive")
          .map(session => ({
            id: session.id.toString(),
            title: session.title || t("layout.sidebar_new_chat"),
            updatedAt: session.updated_at
          }))} 
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
      />
      <SidebarInset className="flex flex-col h-[100dvh] overflow-hidden bg-background">
        <ChatHeader 
          clientName={activeClient?.full_name} 
          clients={(clientsData?.items || []).map(c => ({
            id: c.id,
            name: c.full_name,
            description: c.phone || undefined
          }))}
          onSelectClient={handleSelectClient}
          onRemoveContext={handleRemoveContext}
          onOpenMemory={() => setIsMemoryOpen(true)}
          isChatEmpty={!activeSessionId}
          onSearchClient={setClientSearchKeyword}
          isSearchingClient={isClientsLoading}
        />
        <div className="flex-1 flex flex-row relative overflow-hidden">
          <Outlet />
          <ChatMemory 
            isOpen={isMemoryOpen}
            onOpenChange={setIsMemoryOpen}
            activeClient={activeClient}
            aggregatedMemory={aggregatedMemory}
            onInitialize={handleInitializeMemory}
            onReset={handleResetMemory}
            isInitializing={isInitializing}
            disabled={!activeSessionId}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
