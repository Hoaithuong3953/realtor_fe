import * as React from "react"
import { useTranslation } from "react-i18next"
import type { ChatMessageResponse } from "@/types/api"
import { ROLE_MAP } from "@/constants/chat"
import { logger } from "@/utils/logger"

export type FormattedChatMessage = {
  id: number
  role: "user" | "ai" | "system"
  content: string
  propertiesData?: Record<string, unknown>[]
  searchQueryId?: number
}

type UseChatMessagesFormatterProps = {
  messages: ChatMessageResponse[] | undefined
}

export function useChatMessagesFormatter({
  messages,
}: UseChatMessagesFormatterProps) {
  const { t } = useTranslation(["chat"])

  const formattedMessages = React.useMemo(() => {
    return (messages || []).map(m => {
      const isToolCall = m.message_type === "tool_call"
      let content = m.content
      let propertiesData: Record<string, unknown>[] | undefined = undefined
      const searchQueryId = m.meta_data?.search_query_id as number | undefined

      if (isToolCall) {
        try {
          const properties = JSON.parse(m.content) as Record<string, unknown>[]
          if (Array.isArray(properties) && properties.length > 0) {
            content = t("chat:messages.found_properties")
            propertiesData = properties
          }
        } catch (e) {
          logger.error("Failed to parse tool_call content", e)
        }
      }
        
      const role = ROLE_MAP[(m.sender_type as string)?.toLowerCase() || ""] || "user"

      if (!isToolCall && role === "ai") {
        const listings = m.meta_data?.context_listings as Record<string, unknown>[] | undefined
        if (Array.isArray(listings) && listings.length > 0) {
          propertiesData = listings
        }
      }

      return {
        id: m.id,
        role,
        content,
        propertiesData,
        searchQueryId
      }
    })
  }, [messages, t])

  return formattedMessages
}
