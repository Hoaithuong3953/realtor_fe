import * as React from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { ChatArea } from "@/components/organisms/chat"
import { useChatStore } from "@/store/chat.store"
import {
  useChatMessagesQuery,
  useChatMemoriesQuery,
  useCreateChatSessionMutation,
  useChatStream,
} from "@/hooks/use-chat"
import { useCreateSearchFeedbackMutation } from "@/hooks/use-search"
import { paths } from "@/routes/paths"

import { useChatMessagesFormatter } from "@/hooks/use-chat-messages-formatter"
import { LinkClientModal } from "@/components/organisms/listings/link-client-modal"
import { PropertyDetailModal } from "@/components/organisms/listings/property-detail-modal"
import { useLinkListingMutation, useClientsQuery } from "@/hooks/use-clients"
import type { PropertyCardProps } from "@/components/molecules/property-card"
import { CHAT_SUGGESTIONS } from "@/constants/chat"

const SearchCarousel = React.lazy(() => import("@/components/molecules/property-carousel").then(mod => ({ default: mod.PropertyCarousel })))

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation(["chat", "common", "client"])

  // Local & Zustand state
  const { isTyping, setIsTyping, activeClient, setAggregatedMemory } = useChatStore()
  const [pendingListingId, setPendingListingId] = React.useState<number | null>(null)
  const [selectedDynamicClientId, setSelectedDynamicClientId] = React.useState<string>("")
  const [viewListingId, setViewListingId] = React.useState<number | null>(null)

  // Clear typing state when switching sessions
  React.useEffect(() => {
    return () => {
      setIsTyping(false)
    }
  }, [id, setIsTyping])

  // Queries
  const { data: messagesData } = useChatMessagesQuery(id, 50, !!id)
  const { data: memoriesData } = useChatMemoriesQuery(id, !!id)
  const { data: clientsData, isLoading: isClientsLoading } = useClientsQuery({ limit: 100 })
  const clients = clientsData?.items || []

  const [optimisticMessage, setOptimisticMessage] = React.useState<string | null>(null)
  const prevMessagesLength = React.useRef(messagesData?.items?.length || 0)

  React.useEffect(() => {
    const currentLength = messagesData?.items?.length || 0
    if (currentLength > prevMessagesLength.current) {
      setOptimisticMessage(null)
    }
    prevMessagesLength.current = currentLength
  }, [messagesData])

  // Mutations
  const { sendStream, streamingMessage } = useChatStream(id)
  const { mutate: createSession } = useCreateChatSessionMutation()
  const { mutate: logFeedback } = useCreateSearchFeedbackMutation()
  
  // Link listing mutation for active client
  const { mutate: linkActiveClientListing } = useLinkListingMutation(activeClient?.id || 0)
  
  // Link listing mutation for a dynamically selected client (from modal)
  const { mutate: linkDynamicClientListing, isPending: isLinkingDynamic } = useLinkListingMutation(selectedDynamicClientId)

  const handleSendMessage = (text: string) => {
    setIsTyping(true)
    setOptimisticMessage(text)

    if (!id) {
      // If no session, create one first, then navigate with state
      createSession({ 
        title: text.substring(0, 30),
        client_id: activeClient?.id 
      }, {
        onSuccess: (data) => {
          void navigate(`${paths.dashboard.chat}/${data.id}`, { state: { pendingMessage: text } })
        },
        onError: () => {
          setIsTyping(false)
          setOptimisticMessage(null)
        }
      })
      return
    }

    // Existing session, just send via stream
    sendStream(text, {
      onSuccess: () => {
        setIsTyping(false)
        setOptimisticMessage(null)
      },
      onError: () => {
        setIsTyping(false)
        setOptimisticMessage(null)
      },
      onClose: () => {
        setIsTyping(false)
      }
    })
  }

  // Handle pending message from session creation
  React.useEffect(() => {
    const state = location.state as { pendingMessage?: string } | null | undefined
    const pendingMsg = state?.pendingMessage
    if (id && pendingMsg) {
      // Clear the state so it doesn't fire again on refresh
      void navigate(location.pathname, { replace: true, state: {} })
      handleSendMessage(pendingMsg)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state, navigate, location.pathname])


  const handlePropertyClick = (listingId: number, searchQueryId?: number) => {
    if (searchQueryId) {
      logFeedback({ search_query_id: searchQueryId, listing_id: listingId, feedback_type: "click" })
    }
    setViewListingId(listingId)
  }

  const handleSendToClient = (listingId: number, searchQueryId?: number) => {
    if (searchQueryId) {
      logFeedback({ search_query_id: searchQueryId, listing_id: listingId, feedback_type: "save" })
    }
    
    if (activeClient) {
      linkActiveClientListing({ listingId })
    } else {
      setPendingListingId(listingId)
    }
  }

  const formattedData = useChatMessagesFormatter({
    messages: messagesData?.items,
  })

  const mappedMessages = formattedData.map(msg => {
    let children: React.ReactNode = null
    
    if (msg.propertiesData && msg.propertiesData.length > 0) {
      const carouselItems = msg.propertiesData.map((p) => ({
        ...p,
        onClick: () => handlePropertyClick(p.id as number, msg.searchQueryId),
        actions: [
          {
            id: "send",
            label: t("common:actions.sendToClient"),
            isPrimary: true,
            onClick: () => handleSendToClient(p.id as number, msg.searchQueryId)
          }
        ]
      })) as unknown as PropertyCardProps[]
      
      children = (
        <React.Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl w-full" />}>
          <div className="mt-4 -mx-4 sm:mx-0">
            <SearchCarousel items={carouselItems} />
          </div>
        </React.Suspense>
      )
    }
    
    return {
      role: msg.role,
      content: msg.content,
      children
    }
  })

  // Sync memories to Zustand for ChatbotLayout to use
  React.useEffect(() => {
    if (memoriesData) {
      setAggregatedMemory(memoriesData)
    } else {
      setAggregatedMemory(null)
    }
  }, [memoriesData, setAggregatedMemory])

  const finalMessages = [...mappedMessages]
  if (optimisticMessage) {
    finalMessages.push({
      role: "user",
      content: optimisticMessage,
      children: null
    })
  }
  if (streamingMessage) {
    finalMessages.push({
      role: "ai",
      content: streamingMessage,
      children: null
    })
  }

  return (
    <>
      <ChatArea 
        messages={finalMessages}
        isTyping={isTyping}
        isStreaming={!!streamingMessage}
        onSend={handleSendMessage}
        suggestions={CHAT_SUGGESTIONS.map(s => t(s))}
        onSuggestionClick={handleSendMessage}
      />
      <LinkClientModal
        open={!!pendingListingId}
        onOpenChange={(open) => {
          if (!open) {
            setPendingListingId(null)
            setSelectedDynamicClientId("")
          }
        }}
        listingId={pendingListingId}
        clients={clients}
        isClientsLoading={isClientsLoading}
        selectedClientId={selectedDynamicClientId}
        onClientSelect={setSelectedDynamicClientId}
        isPending={isLinkingDynamic}
        onSubmit={(message) => {
          if (pendingListingId && selectedDynamicClientId) {
            linkDynamicClientListing({ 
              listingId: pendingListingId,
              message 
            }, {
              onSuccess: () => {
                setPendingListingId(null)
                setSelectedDynamicClientId("")
              }
            })
          }
        }}
      />
      <PropertyDetailModal 
        open={!!viewListingId}
        onOpenChange={(open) => !open && setViewListingId(null)}
        listingId={viewListingId}
      />
    </>
  )
}
