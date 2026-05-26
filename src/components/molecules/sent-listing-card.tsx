import { useTranslation } from "react-i18next"
import { formatShortDateTime } from "@/utils/date-formatter"
import { Button, Tooltip } from "@/components/atoms"
import { Unlink, ExternalLink, Calendar, FileText } from "lucide-react"
import { ConfirmAction } from "@/components/molecules/confirm-action"

export interface SentListingItemData {
  id?: string | number
  listing_id: number
  created_at: string
  message?: string
}

export interface SentListingCardProps {
  item: SentListingItemData
  onUnlink: (listingId: number) => void
  onViewDetail: (listingId: number) => void
}

export const SentListingCard = ({ item, onUnlink, onViewDetail }: SentListingCardProps) => {
  const { t } = useTranslation(["client", "listing"])

  return (
    <div className="flex flex-col p-3 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
      
      <div className="pl-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h4 className="font-semibold text-sm leading-tight truncate" title={t("client:listings.property_id", { id: item.listing_id })}>
            {t("client:listings.property_id", { id: item.listing_id })}
          </h4>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
            {t("client:listings.status_sent")}
          </span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {t("client:listings.sent_at")} <span className="font-medium text-foreground/80">{formatShortDateTime(item.created_at)}</span>
          </span>
        </div>
      </div>
      
      {item.message && (
        <div className="pl-2 mt-2.5">
          <div className="text-xs bg-muted/40 p-2.5 rounded-lg text-muted-foreground border border-border/50 relative">
            <FileText className="w-3.5 h-3.5 absolute top-2.5 left-2.5 text-muted-foreground/50" />
            <span className="pl-6 block italic line-clamp-2">"{item.message}"</span>
          </div>
        </div>
      )}
      
      <div className="pt-2.5 pl-2 flex flex-wrap items-center justify-end gap-2 border-t border-border/40 mt-3">
        <ConfirmAction
          title={t("common:actions.confirm")}
          description={t("client:listings.unlink_confirm_desc")}
          confirmVariant="destructive"
          onConfirm={() => onUnlink(item.listing_id)}
        >
          <div className="inline-block">
            <Tooltip content={t("client:listings.unlink_btn")}>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Unlink className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </ConfirmAction>
        
        <Tooltip content={t("client:listings.view_detail")}>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 bg-background hover:bg-accent" 
            onClick={() => onViewDetail(item.listing_id)}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
