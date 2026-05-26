import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { SentListingCard, type SentListingItemData, EmptyState } from "@/components/molecules"
import { Building2 } from "lucide-react"
import { PropertyDetailModal } from "@/components/organisms/listings"

interface ClientSentListingsProps {
  listings: SentListingItemData[]
  isLoading: boolean
  onUnlink: (listingId: number) => void
}

export const ClientSentListings = ({ listings, isLoading, onUnlink }: ClientSentListingsProps) => {
  const { t } = useTranslation(["client", "listing"])
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="w-12 h-12 text-muted-foreground/30" />}
        title={t("client:listings.no_listings")}
        description={t("client:listings.no_listings_desc")}
        className="border-dashed py-12"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {listings.map((item) => (
        <SentListingCard
          key={item.id}
          item={item}
          onUnlink={onUnlink}
          onViewDetail={(id) => setSelectedListingId(id)}
        />
      ))}

      {selectedListingId && (
        <PropertyDetailModal 
          listingId={selectedListingId} 
          open={!!selectedListingId} 
          onOpenChange={(open) => !open && setSelectedListingId(null)} 
        />
      )}
    </div>
  )
}
