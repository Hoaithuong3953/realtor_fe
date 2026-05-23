import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui"
import { Button } from "@/components/atoms"
import { DataTable } from "@/components/organisms/common/data-table"
import { ConfirmAction } from "@/components/molecules"
import { useTranslation } from "react-i18next"
import { formatListingType, formatPropertyType, formatListingPrice } from "@/utils/listing-formatter"
import type { PropertyItemData, PropertyAction } from "@/types/ui/property"

export interface PropertiesTableProps {
  data: PropertyItemData[]
  actions?: (item: PropertyItemData) => PropertyAction[]
}

export const PropertiesTable = ({ data, actions }: PropertiesTableProps) => {
  const { t, i18n } = useTranslation("listing")

  const columns: ColumnDef<PropertyItemData>[] = [
    {
      accessorKey: "title",
      header: t("table.property"),
      cell: ({ row }) => {
        const property = row.original
        const firstMedia = property.media?.[0]
        const imageUrl = firstMedia && typeof firstMedia.url === "string" 
          ? firstMedia.url 
          : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"
        
        return (
          <div className="flex items-center gap-3 max-w-sm">
            <img 
              src={imageUrl} 
              alt={property.title} 
              className="w-16 h-12 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium truncate" title={property.title}>{property.title}</span>
              <span className="text-xs text-muted-foreground truncate" title={property.address_text}>{property.address_text}</span>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "price",
      header: t("table.price"),
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
      accessorKey: "listing_type",
      header: t("table.listing_type"),
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
      header: t("table.status"),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={status === "active" ? "default" : status === "draft" ? "secondary" : "outline"}>
            {status === "active" ? t("status.active") : status === "draft" ? t("status.draft") : t("status.inactive")}
          </Badge>
        )
      }
    },
    {
      id: "actions",
      header: t("table.actions"),
      cell: ({ row }) => {
        const property = row.original
        const rowActions = actions ? actions(property) : []
        return (
          <div className="flex items-center gap-2">
            {rowActions.map((action) => {
              const Icon = action.icon
              const buttonElement = (
                <Button 
                  key={action.id}
                  variant={action.variant || "outline"} 
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={(e) => {
                    if (!action.confirmTitle) {
                      e.stopPropagation()
                      action.onClick?.(e)
                    }
                  }}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
                  {action.label}
                </Button>
              )

              if (action.confirmTitle) {
                return (
                  <ConfirmAction
                    key={action.id}
                    title={action.confirmTitle}
                    description={action.confirmDescription}
                    onConfirm={() => action.onClick?.({} as React.MouseEvent)}
                    confirmVariant={action.variant === "destructive" ? "destructive" : "solid"}
                  >
                    {buttonElement}
                  </ConfirmAction>
                )
              }

              return buttonElement
            })}
          </div>
        )
      }
    }
  ]

  return <DataTable columns={columns} data={data} emptyMessage={t("no_data")} />
}
