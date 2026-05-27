import { LanguageSwitcher, ThemeToggle, ChatContextBadge, Combobox } from "@/components/molecules"
import { useTranslation } from "react-i18next"
import { Separator } from "@/components/ui"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/atoms"
import { BrainCircuit } from "lucide-react"

export type ChatHeaderClient = {
  id: string | number
  name: string
  description?: string
}

type ChatHeaderProps = {
  clientName?: string
  clients?: ChatHeaderClient[]
  onSelectClient?: (client: ChatHeaderClient) => void
  onRemoveContext?: () => void
  onOpenMemory?: () => void
  isChatEmpty?: boolean
}

export const ChatHeader = ({
  clientName,
  clients = [],
  onSelectClient,
  onRemoveContext,
  onOpenMemory,
  isChatEmpty = false,
}: ChatHeaderProps) => {
  const { t } = useTranslation("chat")

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background z-20 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {clientName ? (
          <ChatContextBadge 
            clientName={clientName} 
            onRemove={onRemoveContext} 
            requireConfirm={!isChatEmpty}
          />
        ) : (
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm mr-2">{t("layout.header_ai_copilot")}</span>
            <Combobox 
              placeholder={t("layout.header_tag_placeholder")}
              className="h-8 text-xs w-64 bg-transparent"
              onValueChange={(val) => {
                if (!val) return;
                const selectedClient = clients.find(c => c.id.toString() === val)
                if (selectedClient) {
                  onSelectClient?.(selectedClient)
                }
              }}
              items={clients.map(client => ({
                value: client.id.toString(),
                label: client.description ? `${client.name} - ${client.description}` : client.name
              }))}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1.5 shadow-sm hidden sm:flex"
          onClick={onOpenMemory}
        >
          <BrainCircuit className="size-3.5 text-primary" />
          <span className="text-xs">{t("layout.header_ai_memory")}</span>
        </Button>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
