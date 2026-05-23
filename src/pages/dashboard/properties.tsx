import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Plus } from "lucide-react"

import { useListingsQuery, useDeleteListingMutation, useUpdateListingStatusMutation } from "@/hooks/use-listings"
import { Button } from "@/components/atoms"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { PropertyDetailView, PropertiesFilterBar, PropertiesView } from "@/components/organisms/listings"
import { type ListingResponse, LISTING_TYPES, PROPERTY_TYPES, LISTING_STATUSES } from "@/types/api"

export default function PropertiesPage() {
  const { t } = useTranslation("listing")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState<string>("")
  const [listingType, setListingType] = useState<string>("")
  const [propertyType, setPropertyType] = useState<string>("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [minArea, setMinArea] = useState<string>("")
  const [maxArea, setMaxArea] = useState<string>("")
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [selectedListing, setSelectedListing] = useState<ListingResponse | null>(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [status, listingType, propertyType])

  const handleClearFilters = () => {
    setSearch("")
    setStatus("")
    setListingType("")
    setPropertyType("")
    setMinPrice("")
    setMaxPrice("")
    setMinArea("")
    setMaxArea("")
  }

  const { data, isLoading } = useListingsQuery({
    keyword: debouncedSearch || undefined,
    status: status || undefined,
    listing_type: listingType || undefined,
    property_type: propertyType || undefined,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    min_area: minArea ? Number(minArea) : undefined,
    max_area: maxArea ? Number(maxArea) : undefined,
    offset: (page - 1) * 20,
    limit: 20
  })

  const listingTypeOptions = [
    { label: t("filter.all_type"), value: "all" },
    ...LISTING_TYPES.map(type => ({ label: t(`type.${type}`), value: type }))
  ]

  const statusOptions = [
    { label: t("filter.all_status"), value: "all" },
    ...LISTING_STATUSES.map(status => ({ label: t(`status.${status}`), value: status }))
  ]

  const propertyTypeOptions = [
    { label: t("filter.all_properties"), value: "all" },
    ...PROPERTY_TYPES.map(type => ({ label: t(`propertyType.${type}`), value: type }))
  ]

  const { mutate: deleteListing } = useDeleteListingMutation()
  const { mutate: updateStatus } = useUpdateListingStatusMutation()

  const handleDelete = (id: string | number) => {
    deleteListing(id)
  }

  const handleToggleStatus = (id: string | number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    updateStatus({ id, status: newStatus })
  }

  return (
    <div className="flex flex-col flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            {data?.total !== undefined && (
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-semibold">
                {data.total}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">{t("subtitle")}</p>
        </div>
        <Button variant="solid" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("add_new")}
        </Button>
      </div>

      <PropertiesFilterBar 
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        listingType={listingType}
        onTypeChange={setListingType}
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        minArea={minArea}
        onMinAreaChange={setMinArea}
        maxArea={maxArea}
        onMaxAreaChange={setMaxArea}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusOptions={statusOptions}
        listingTypeOptions={listingTypeOptions}
        propertyTypeOptions={propertyTypeOptions}
        onClearFilters={handleClearFilters}
      />

      <PropertiesView 
        isLoading={isLoading}
        data={data}
        viewMode={viewMode}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onSelect={setSelectedListing}
        onPageChange={setPage}
      />

      <Dialog open={!!selectedListing} onOpenChange={(open) => !open && setSelectedListing(null)}>
        <DialogContent 
          className="sm:max-w-3xl max-h-[90vh] p-0 gap-0 border-0 shadow-2xl overflow-hidden flex flex-col"
          showCloseButton={false}
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <DialogTitle>{t("detail_title")}</DialogTitle>
          </VisuallyHidden>
          
          <button
            onClick={() => setSelectedListing(null)}
            className="absolute top-3 right-3 z-50 size-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md shadow-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedListing && (
              <PropertyDetailView 
                property={{
                  ...selectedListing,
                  media: selectedListing.media?.map(m => ({
                    ...m,
                    url: typeof m.url === "string" ? m.url : ""
                  }))
                }} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
