import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom"
import React, { useEffect } from "react"
import { paths } from "@/routes/paths"
import { useTranslation } from "react-i18next"

import { ChatSidebar, ChatHeader, ChatMemory, type ChatHeaderClient } from "@/components/organisms/chat"
import type { MemoryGroupUI } from "@/types/ui/chat"
import { MEMORY_SOURCE_MAP } from "@/constants/memory"
import { Database } from "lucide-react"

import { useChatStore } from "@/store/chat.store"
import { 
  useChatSessionsQuery, 
  useChatSessionQuery,
  useDeleteMemoryMutation,
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
  const { data: sessionDetail, isLoading: isSessionLoading } = useChatSessionQuery(activeSessionId, !!activeSessionId)
  
  const { mutate: deleteMemory } = useDeleteMemoryMutation(activeSessionId)
  const { mutate: resetMemory } = useResetMemoryMutation(activeSessionId)

  const urlClientId = searchParams.get("clientId")
  const effectiveClientId = sessionDetail?.client_id || (urlClientId ? Number(urlClientId) : undefined)
  const { data: clientDetail } = useClientQuery(effectiveClientId, !!effectiveClientId)
  const [clientSearchKeyword, setClientSearchKeyword] = React.useState("")
  const { data: clientsData, isLoading: isClientsLoading } = useClientsQuery({ limit: 10, keyword: clientSearchKeyword || undefined })

  const {
    activeClient,
    memories,
    isMemoryOpen,
    setActiveClient,
    setMemories,
    setIsMemoryOpen
  } = useChatStore()

  useEffect(() => {
    if (isSessionLoading) return;

    if (clientDetail && activeClient?.id !== clientDetail.id) {
      setActiveClient(clientDetail)
    } else if (!effectiveClientId && activeClient) {
      setActiveClient(null)
    }
  }, [clientDetail, effectiveClientId, activeClient, setActiveClient, isSessionLoading])

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
    // Always navigate to a fresh /chat (clears session + client context)
    setActiveClient(null)
    setMemories([])
    void navigate(paths.dashboard.chat)
  }

  const handleDeleteMemory = (memId: string) => {
    deleteMemory(memId, {
      onSuccess: () => {
        setMemories(memories.filter(m => m.id !== memId))
      }
    })
  }

  const handleResetMemory = () => {
    resetMemory(undefined, {
      onSuccess: () => {
        setMemories([])
      }
    })
  }

  const memoryGroups = React.useMemo(() => {
    const groupsMap = new Map<string, MemoryGroupUI>()
    
    memories.forEach(mem => {
      const source = mem.source || "ai"
      if (!groupsMap.has(source)) {
         const config = MEMORY_SOURCE_MAP[source] || { icon: Database, tooltipKey: `constants.source_custom` }
         const label = config.tooltipKey === "constants.source_custom" 
           ? t("constants.source_custom", { source })
           : t(config.tooltipKey)
           
         groupsMap.set(source, {
           id: source,
           label,
           icon: config.icon,
           items: []
         })
      }
      groupsMap.get(source)!.items.push(mem)
    })
    
    return Array.from(groupsMap.values())
  }, [memories, t])

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
            groups={memoryGroups} 
            onDelete={handleDeleteMemory}
            onReset={handleResetMemory}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
