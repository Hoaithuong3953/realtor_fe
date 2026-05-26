import { useTranslation } from "react-i18next"
import { Building2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/atoms"
import { EmptyState } from "@/components/molecules"
import { PropertyDetailView, type PropertyDetailData } from "@/components/organisms/listings"
import { useListingDetailQuery } from "@/hooks/listings/use-listings"
import { type ListingResponse } from "@/types/api"

export interface PropertyDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId?: number | null
  listing?: ListingResponse | null
  footerActions?: React.ReactNode
}

export const PropertyDetailModal = ({ 
  open, 
  onOpenChange, 
  listingId, 
  listing: initialListing, 
  footerActions 
}: PropertyDetailModalProps) => {
  const { t } = useTranslation(["listing"])
  
  const shouldFetch = open && !initialListing && !!listingId
  const { data: fetchedListing, isLoading } = useListingDetailQuery(
    listingId ? Number(listingId) : 0, 
    shouldFetch
  )
  
  const targetListing = initialListing || fetchedListing
  
  const formattedListing = targetListing ? {
    ...targetListing,
    media: targetListing.media?.map((m: Record<string, unknown>) => ({
      ...m,
      url: typeof m.url === "string" ? m.url : ""
    }))
  } : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-3xl max-h-[90vh] p-0 gap-0 border-0 shadow-2xl overflow-hidden flex flex-col"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <VisuallyHidden>
          <DialogTitle>{t("listing:detail.title")}</DialogTitle>
        </VisuallyHidden>
        
        <div className="absolute top-3 right-4 z-50">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="size-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md shadow-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoading && !initialListing ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-72 w-full rounded-xl" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : formattedListing ? (
            <PropertyDetailView property={formattedListing as unknown as PropertyDetailData} />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <EmptyState
                icon={<Building2 className="w-12 h-12 text-muted-foreground/30" />}
                title={t("listing:list.no_results")}
              />
            </div>
          )}
        </div>
        
        {footerActions && formattedListing && (
          <div className="p-4 border-t bg-background flex justify-end">
            {footerActions}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
