import * as React from "react"
import { Paperclip, SendHorizontal } from "lucide-react"

import { Button } from "@/components/atoms"
import { Textarea } from "@/components/ui"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type ChatInputProps = {
  isTyping?: boolean
  onSend: (text: string) => void
  className?: string
}

export const ChatInput = ({ isTyping, onSend, className }: ChatInputProps) => {
  const { t } = useTranslation("chat")
  const [value, setValue] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!value.trim()) return
    onSend(value)
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div 
      className={cn(
        "relative flex w-full flex-col gap-2 rounded-2xl border bg-background p-3 shadow-sm focus-within:ring-1 focus-within:ring-ring", 
        className
      )}
    >
      <Textarea
        ref={textareaRef}
        placeholder={t("components.input_placeholder")}
        className="min-h-[44px] max-h-[200px] resize-none border-0 p-0 shadow-none focus-visible:ring-0 text-base bg-transparent dark:bg-transparent"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isTyping}
        rows={1}
      />
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground rounded-full">
          <Paperclip className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSend}
            disabled={!value.trim() || isTyping}
            size="icon"
            className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
