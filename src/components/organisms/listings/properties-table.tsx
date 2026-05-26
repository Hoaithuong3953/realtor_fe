import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui"
import { ImageOff } from "lucide-react"
import { Button } from "@/components/atoms"
import { DataTable } from "@/components/organisms/common/data-table"
import { Dropdown } from "@/components/molecules/dropdown"
import { ListingBadge } from "@/components/atoms"
import { useTranslation } from "react-i18next"
import { MoreHorizontal } from "lucide-react"
import { formatListingType, formatPropertyType, formatListingPrice, formatListingStatus, formatShortAddress, formatLocalizedAddress } from "@/utils/listing-formatter"
import { formatShortDateTime } from "@/utils/date-formatter"
import type { PropertyItemData, PropertyAction } from "@/types/ui/property"

export interface PropertiesTableProps {
  data: PropertyItemData[]
  actions?: (item: PropertyItemData) => PropertyAction[]
  onPageChange?: (page: number) => void
  onRowClick?: (item: PropertyItemData) => void
  isLoading?: boolean
}

export const PropertiesTable = ({ 
  data, 
  actions,
  onRowClick,
  isLoading
}: PropertiesTableProps) => {
  const { t, i18n } = useTranslation(["listing", "common"])

  const columns: ColumnDef<PropertyItemData>[] = [
    {
      accessorKey: "title",
      header: t("list.table_property"),
      cell: ({ row }) => {
        const property = row.original
        const firstMedia = property.media?.[0]
        const imageUrl = firstMedia && typeof firstMedia.url === "string" 
          ? firstMedia.url 
          : undefined
        
        return (
          <div className="flex items-center gap-3 max-w-sm">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={property.title} 
                className="w-16 h-12 object-cover rounded-md flex-shrink-0 bg-muted"
              />
            ) : (
              <div className="w-16 h-12 rounded-md flex-shrink-0 bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground">
                <ImageOff className="w-5 h-5 opacity-50" />
              </div>
            )}
            <div className="flex flex-col overflow-hidden gap-0.5">
              <span className="font-medium truncate" title={property.title}>{property.title}</span>
              <span className="text-xs text-muted-foreground truncate" title={formatLocalizedAddress(property.address_text, i18n.language)}>{formatShortAddress(property.address_text)}</span>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "price",
      header: t("list.table_price"),
      cell: ({ row }) => {
        const property = row.original
        return (
          <div className="font-semibold text-sm whitespace-nowrap">
            {formatListingPrice(property, t, i18n.language)}
          </div>
        )
      }
    },
    {
      accessorKey: "area",
      header: t("list.table_area"),
      cell: ({ row }) => {
        const property = row.original
        return (
          <div className="text-sm">
            {property.area ? `${property.area} m²` : "-"}
          </div>
        )
      }
    },
    {
      accessorKey: "listing_type",
      header: t("list.table_listing_type"),
      cell: ({ row }) => {
        const property = row.original
        return (
          <div className="flex flex-col gap-1 items-start">
            {property.listing_type && (
              <Badge variant="secondary" className="text-[10px]">
                {formatListingType(property.listing_type, t)?.label}
              </Badge>
            )}
            {property.property_type && (
              <Badge variant="outline" className="text-[10px]">
                {formatPropertyType(property.property_type, t)}
              </Badge>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "status",
      header: t("list.table_status"),
      cell: ({ row }) => {
        const status = row.original.status
        const statusInfo = formatListingStatus(status, t)
        return statusInfo ? (
          <ListingBadge listing={statusInfo.listing} className="hover:opacity-80 transition-opacity rounded-md">
            {statusInfo.label}
          </ListingBadge>
        ) : null
      }
    },
    {
      accessorKey: "updated_at",
      header: t("list.table_updated_at"),
      cell: ({ row }) => {
        const property = row.original
        return (
          <div className="text-sm text-muted-foreground">
            {property.updated_at ? formatShortDateTime(property.updated_at) : "-"}
          </div>
        )
      }
    },
    {
      id: "actions",
      header: t("list.table_actions"),
      cell: ({ row }) => {
        const property = row.original

        const rowActions = actions
          ? actions(property).map((action) => ({
              id: action.id,
              label: action.label,
              icon: action.icon,
              onClick: action.onClick,
              danger: action.variant === "destructive",

              confirmTitle: action.confirmTitle,
              confirmDescription: action.confirmDescription,
            }))
          : []

        return (
          <Dropdown
            items={rowActions}
            trigger={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
        )
      },
    }
  ]

  return <DataTable columns={columns} data={data} isLoading={isLoading} emptyMessage={t("list.no_data")} onRowClick={onRowClick} />
}
