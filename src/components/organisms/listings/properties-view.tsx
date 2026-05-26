import { Filter, Eye, Archive, ArchiveRestore, Trash2, Edit } from "lucide-react"
import { useTranslation } from "react-i18next"
import { PropertyCard, PropertyCardSkeleton } from "@/components/molecules"
import { EmptyState } from "@/components/molecules"
import { PropertiesTable } from "@/components/organisms/listings"
import { Pagination } from "@/components/molecules"
import type { ListingResponse } from "@/types/api"
import type { PropertyItemData } from "@/types/ui/property"

interface PropertiesViewProps {
  isLoading: boolean
  data: { 
    items: ListingResponse[], 
    totalPages?: number, 
    currentPage?: number,
    total?: number,
    limit?: number,
    offset?: number
  } | undefined
  viewMode: "grid" | "list"
  onToggleStatus: (id: string | number, currentStatus: string) => void
  onDelete: (id: string | number) => void
  onSelect: (item: ListingResponse) => void
  onEdit: (id: string | number) => void
  onPageChange?: (page: number) => void
}

export const PropertiesView = ({
  isLoading,
  data,
  viewMode,
  onToggleStatus,
  onDelete,
  onSelect,
  onEdit,
  onPageChange
}: PropertiesViewProps) => {
  const { t } = useTranslation(["listing", "common"])

  const totalPages = data?.totalPages ?? (data?.total && data?.limit ? Math.ceil(data.total / data.limit) : 0)
  const currentPage = data?.currentPage ?? (data?.offset !== undefined && data?.limit ? Math.floor(data.offset / data.limit) + 1 : 1)

  if (isLoading && viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <PropertyCardSkeleton key={i} withActions={true} />
        ))}
      </div>
    )
  }

  if (!isLoading && (!data?.items || data.items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-card/50">
        <EmptyState 
          icon={<div className="bg-primary/10 p-4 rounded-full mb-4"><Filter className="w-8 h-8 text-primary" /></div>}
          title={t("list.no_results")}
          description={t("list.adjust_filters")}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.items?.map((listing) => (
            <PropertyCard 
              key={listing.id}
              {...(listing as unknown as PropertyItemData)}
              className="w-full"
              onClick={() => onSelect(listing)}
              actions={[
                {
                  id: "edit",
                  label: t("common:actions.edit"),
                  icon: Edit,
                  variant: "outline",
                  isPrimary: true,
                  onClick: () => onEdit(listing.id)
                },
                {
                  id: "toggle-status",
                  label: listing.status === "active" ? t("list.action_pause") : t("list.action_reopen"),
                  icon: listing.status === "active" ? Archive : ArchiveRestore,
                  variant: "secondary",
                  confirmTitle: listing.status === "active" ? t("list.action_pause") : t("list.action_reopen"),
                  confirmDescription: listing.status === "active" ? t("messages.pause_confirm_desc") : t("messages.reopen_confirm_desc"),
                  onClick: () => onToggleStatus(listing.id, listing.status || "inactive")
                },
                {
                  id: "delete",
                  label: t("list.action_delete"),
                  icon: Trash2,
                  variant: "destructive",
                  confirmTitle: t("messages.delete_confirm_title"),
                  confirmDescription: t("messages.delete_confirm_desc"),
                  onClick: () => onDelete(listing.id)
                }
              ]}
            />
          ))}
        </div>
      ) : (
        <PropertiesTable 
          data={(data?.items || []) as unknown as PropertyItemData[]}
          isLoading={isLoading}
          onRowClick={(listing) => onSelect(listing as unknown as ListingResponse)}
          actions={(listing) => [
            {
              id: "detail",
              label: t("list.action_detail"),
              icon: Eye,
              variant: "outline",
              onClick: () => onSelect(listing as unknown as ListingResponse)
            },
            {
              id: "edit",
              label: t("common:actions.edit"),
              icon: Edit,
              variant: "outline",
              isPrimary: true,
              onClick: () => onEdit(listing.id!)
            },
            {
              id: "toggle-status",
              label: listing.status === "active" ? t("list.action_pause") : t("list.action_reopen"),
              icon: listing.status === "active" ? Archive : ArchiveRestore,
              variant: "secondary",
              confirmTitle: listing.status === "active" ? t("list.action_pause") : t("list.action_reopen"),
              confirmDescription: listing.status === "active" ? t("messages.pause_confirm_desc") : t("messages.reopen_confirm_desc"),
              onClick: () => onToggleStatus(listing.id!, listing.status || "inactive")
            },
            {
              id: "delete",
              label: t("list.action_delete"),
              icon: Trash2,
              variant: "destructive",
              confirmTitle: t("messages.delete_confirm_title"),
              confirmDescription: t("messages.delete_confirm_desc"),
              onClick: () => onDelete(listing.id!)
            }
          ]}
        />
      )}

      {/* Common Pagination Integration */}
      {totalPages > 1 && onPageChange && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange}
          className="mt-6"
        />
      )}
    </div>
  )
}
