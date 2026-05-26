import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button, Textarea } from "@/components/atoms"
import { SearchSelect, Alert } from "@/components/molecules"

export interface ClientOption {
  id: string | number
  full_name: string
  phone?: string | null
}

export interface LinkClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId: number | null
  clients: ClientOption[]
  isClientsLoading?: boolean
  selectedClientId: string
  onClientSelect: (id: string) => void
  isCheckingLink?: boolean
  isAlreadyLinked?: boolean
  isPending?: boolean
  onSubmit: (message: string) => void
}

export const LinkClientModal = ({ 
  open, 
  onOpenChange, 
  listingId,
  clients,
  isClientsLoading,
  selectedClientId,
  onClientSelect,
  isCheckingLink,
  isAlreadyLinked,
  isPending,
  onSubmit
}: LinkClientModalProps) => {
  const { t } = useTranslation(["client", "common"])
  
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClientId || !listingId) return
    onSubmit(message)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClientSelect("")
      setMessage("")
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("link.modal_title")}</DialogTitle>
          <DialogDescription>{t("link.modal_subtitle")}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <SearchSelect 
              label={t("link.client_label")}
              required={true}
              value={selectedClientId || undefined} 
              onChange={(val) => val && onClientSelect(val)}
              options={clients.map((client) => ({
                value: client.id.toString(),
                label: `${client.full_name} ${client.phone ? `- ${client.phone}` : ""}`
              }))}
              placeholder={t("link.search_placeholder")}
              emptyText={isClientsLoading ? t("common:actions.loading") : t("link.search_empty")}
            />

          {isAlreadyLinked && (
            <Alert 
              variant="warning"
              message={t("link.already_linked_warning")}
            />
          )}

          <Textarea 
            id="message"
            label={t("link.message_label")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("link.message_placeholder")}
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("actions.cancel", { ns: "common" })}
            </Button>
            <Button type="submit" disabled={!selectedClientId || isPending || isCheckingLink || isAlreadyLinked}>
              {isPending ? t("link.linking_btn") : t("link.link_btn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
