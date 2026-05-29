import * as React from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { ChatInput, ChatMessage, type ChatMessageProps } from "@/components/molecules"

type ChatAreaProps = {
  messages?: ChatMessageProps[]
  clientName?: string
  isTyping?: boolean
  isStreaming?: boolean
  onSend?: (text: string) => void
  onRemoveContext?: () => void
  onSuggestionClick?: (text: string) => void
  suggestions?: string[]
}

export const ChatArea = ({
  messages = [],
  isTyping,
  isStreaming,
  onSend,
  onSuggestionClick,
  suggestions = [],
}: ChatAreaProps) => {
  const { t } = useTranslation("chat")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const isEmpty = messages.length === 0 && !isTyping

  return (
    <div className="flex flex-col flex-1 h-full bg-background relative overflow-hidden">
      {isEmpty ? (
        // DEFAULT STATE (Empty)
        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
              <Sparkles className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">{t("components.empty_title")}</h2>
            <p className="text-muted-foreground">
              {t("components.empty_desc")}
            </p>
          </div>

          <div className="w-full">
            <ChatInput isTyping={isTyping} onSend={(t) => onSend?.(t)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="text-left px-4 py-3 rounded-xl border bg-card hover:bg-accent hover:border-accent-foreground/20 text-sm font-medium transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // ACTIVE CHAT STATE
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto pb-4 pt-16">
            <div className="flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} {...msg} />
              ))}
              {isTyping && !isStreaming && (
                <ChatMessage role="ai" content="">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="size-4 animate-spin" />
                    <span>{t("components.input_ai_thinking")}</span>
                  </div>
                </ChatMessage>
              )}
            </div>
          </div>
          
          <div className="p-4 pb-6">
            <div className="max-w-4xl mx-auto w-full">
              <ChatInput isTyping={isTyping} onSend={(t) => onSend?.(t)} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
