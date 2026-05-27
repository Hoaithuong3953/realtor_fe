import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useTranslation } from "react-i18next"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/atoms"

export type ChatMessageProps = {
  role: "user" | "ai" | "system"
  content: string
  children?: React.ReactNode
  isError?: boolean
  onRetry?: () => void
}

export const ChatMessage = ({ role, content, children, isError, onRetry }: ChatMessageProps) => {
  const { t } = useTranslation("common")

  if (role === "system") {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          {content}
        </span>
      </div>
    )
  }

  if (role === "ai") {
    return (
      <div className="flex flex-col w-full px-4 py-6 bg-muted/30">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-2">
          {isError ? (
            <div className="flex flex-col items-start gap-3 bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-destructive text-sm w-fit max-w-[80%] shadow-sm">
              <div className="flex items-start gap-2 font-medium">
                <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{content}</span>
              </div>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="h-8 bg-background border-destructive/30 hover:bg-destructive hover:text-destructive-foreground text-destructive ml-6 transition-colors"
                >
                  <RefreshCcw className="size-3 mr-2" />
                  {t("actions.retry")}
                </Button>
              )}
            </div>
          ) : (
            <>
              {content && (
                <div className="
                  prose prose-sm dark:prose-invert max-w-none text-foreground/90
                  prose-p:my-1 prose-p:leading-relaxed
                  prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-3 prose-headings:mb-1
                  prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
                  prose-ul:my-1 prose-ul:pl-5
                  prose-ol:my-1 prose-ol:pl-5
                  prose-li:my-0.5
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
                  prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-3 prose-pre:text-xs
                  prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-3 prose-blockquote:text-muted-foreground prose-blockquote:italic
                  prose-hr:border-border prose-hr:my-3
                  prose-a:text-primary prose-a:underline prose-a:underline-offset-2
                  prose-table:text-sm
                  prose-th:text-foreground prose-th:font-semibold
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              )}
              {children && <div className="mt-4">{children}</div>}
            </>
          )}
        </div>
      </div>
    )
  }

  // role === "user"
  return (
    <div className="flex flex-col w-full px-4 py-6">
      <div className="max-w-4xl mx-auto w-full flex justify-end">
        <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
          {content}
        </div>
      </div>
    </div>
  )
}
