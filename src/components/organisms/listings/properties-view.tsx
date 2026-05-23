import { Filter, Eye, Archive, ArchiveRestore, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui"
import { PropertyCard } from "@/components/molecules"
import { EmptyState } from "@/components/molecules"
import { PropertiesTable } from "./properties-table"
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
  onPageChange?: (page: number) => void
}

export const PropertiesView = ({
  isLoading,
  data,
  viewMode,
  onToggleStatus,
  onDelete,
  onSelect,
  onPageChange
}: PropertiesViewProps) => {
  const { t } = useTranslation("listing")

  const totalPages = data?.totalPages ?? (data?.total && data?.limit ? Math.ceil(data.total / data.limit) : 0)
  const currentPage = data?.currentPage ?? (data?.offset !== undefined && data?.limit ? Math.floor(data.offset / data.limit) + 1 : 1)

  if (isLoading) {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )
    } else {
      return (
        <div className="w-full space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )
    }
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-card/50">
        <EmptyState 
          icon={<div className="bg-primary/10 p-4 rounded-full mb-4"><Filter className="w-8 h-8 text-primary" /></div>}
          title={t("no_results")}
          description={t("adjust_filters")}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.items.map((listing) => (
            <PropertyCard 
              key={listing.id}
              {...(listing as unknown as PropertyItemData)}
              className="w-full"
              onClick={() => onSelect(listing)}
              actions={[
                {
                  id: "toggle-status",
                  label: listing.status === "active" ? t("action.pause") : t("action.reopen"),
                  icon: listing.status === "active" ? Archive : ArchiveRestore,
                  variant: "secondary",
                  confirmTitle: listing.status === "active" ? t("action.pause") : t("action.reopen"),
                  confirmDescription: listing.status === "active" ? t("pause_confirm_desc") : t("reopen_confirm_desc"),
                  onClick: () => onToggleStatus(listing.id, listing.status || "inactive")
                },
                {
                  id: "delete",
                  label: t("action.delete"),
                  icon: Trash2,
                  variant: "destructive",
                  confirmTitle: t("delete_confirm_title"),
                  confirmDescription: t("delete_confirm_desc"),
                  onClick: () => onDelete(listing.id)
                }
              ]}
            />
          ))}
        </div>
      ) : (
        <PropertiesTable 
          data={data.items as unknown as PropertyItemData[]}
          actions={(listing) => [
            {
              id: "detail",
              label: t("action.detail"),
              icon: Eye,
              variant: "outline",
              onClick: () => onSelect(listing as unknown as ListingResponse)
            },
            {
              id: "toggle-status",
              label: listing.status === "active" ? t("action.pause") : t("action.reopen"),
              icon: listing.status === "active" ? Archive : ArchiveRestore,
              variant: "secondary",
              confirmTitle: listing.status === "active" ? t("action.pause") : t("action.reopen"),
              confirmDescription: listing.status === "active" ? t("pause_confirm_desc") : t("reopen_confirm_desc"),
              onClick: () => onToggleStatus(listing.id!, listing.status || "inactive")
            },
            {
              id: "delete",
              label: t("action.delete"),
              icon: Trash2,
              variant: "destructive",
              confirmTitle: t("delete_confirm_title"),
              confirmDescription: t("delete_confirm_desc"),
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
