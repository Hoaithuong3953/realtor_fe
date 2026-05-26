import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Plus } from "lucide-react"
import { Link, useNavigate, generatePath } from "react-router-dom"
import { paths } from "@/routes/paths"
import { useAppStore } from "@/store/app.store"
import { useListingsQuery, useDeleteListingMutation, useUpdateListingStatusMutation } from "@/hooks/listings/use-listings"
import { useQueryParams } from "@/hooks/use-query-params"

import { Button } from "@/components/atoms"
import { PropertyDetailModal, PropertiesFilterBar, PropertiesView } from "@/components/organisms/listings"
import { type ListingResponse, LISTING_TYPES, PROPERTY_TYPES, LISTING_STATUSES } from "@/types/api"


export default function PropertiesPage() {
  const { t } = useTranslation("listing")
  const navigate = useNavigate()
  const { viewMode, setViewMode } = useAppStore()
  
  const { apiParams, search, setSearch, setPage, filters, setFilters } = useQueryParams({ defaultSort: "updated_at_desc" })
  const [selectedListing, setSelectedListing] = useState<ListingResponse | null>(null)

  const handleClearFilters = () => {
    setSearch("")
    setFilters({})
  }

  // Handle parse numbers for min/max
  const parsedFilters = useMemo(() => ({
    ...filters,
    min_price: filters.minPrice ? Number(filters.minPrice) : undefined,
    max_price: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    min_area: filters.minArea ? Number(filters.minArea) : undefined,
    max_area: filters.maxArea ? Number(filters.maxArea) : undefined,
    listing_type: (filters.listingType as string) || undefined,
    property_type: (filters.propertyType as string) || undefined,
    status: (filters.status as string) || undefined,
  }), [filters])

  const { data, isLoading } = useListingsQuery({
    ...apiParams,
    ...parsedFilters,
  })

  const listingTypeOptions = [
    { label: t("list.filter_all_type"), value: "all" },
    ...LISTING_TYPES.map(type => ({ label: t(`constants.listing_type_${type}`), value: type }))
  ]

  const statusOptions = [
    { label: t("list.filter_all_status"), value: "all" },
    ...LISTING_STATUSES.map(status => ({ label: t(`constants.status_${status}`), value: status }))
  ]

  const propertyTypeOptions = [
    { label: t("list.filter_all_properties"), value: "all" },
    ...PROPERTY_TYPES.map(type => ({
      label: t(`constants.property_type_${type}`),
      value: type
    }))
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
            <h1 className="text-2xl font-bold tracking-tight">{t("list.title")}</h1>
            {data?.total !== undefined && (
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-semibold">
                {data.total}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">{t("list.subtitle")}</p>
        </div>
        <Button variant="solid" className="flex items-center gap-2" asChild>
          <Link to={paths.dashboard.properties.create}>
            <Plus className="w-4 h-4" />
            {t("list.add_new_btn")}
          </Link>
        </Button>
      </div>

      <PropertiesFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={filters as Record<string, string | undefined>}
        onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
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
        onEdit={(id) => navigate(generatePath(paths.dashboard.properties.edit, { id: String(id) }))}
        onPageChange={setPage}
      />

      <PropertyDetailModal
        open={!!selectedListing}
        onOpenChange={(open) => !open && setSelectedListing(null)}
        listing={selectedListing}
      />
    </div>
  )
}
