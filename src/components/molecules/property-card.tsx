import React, { useState } from "react"
import { MapPin, SquareDashed, ImageOff, Info, MoreHorizontal, Clock } from "lucide-react"
import { ATTRIBUTE_CONFIG, EXCLUDED_CARD_ATTRIBUTES } from "@/constants/listing"

import { Badge } from "@/components/ui"
import { cn } from "@/lib/utils"
import { formatListingType, formatPropertyType, formatListingPrice, formatListingStatus, formatShortAddress, formatLocalizedAddress } from "@/utils/listing-formatter"
import { formatShortDateTime } from "@/utils/date-formatter"
import { useTranslation } from "react-i18next"
import { Button, Tag, Tooltip, ListingBadge } from "@/components/atoms"
import { ConfirmAction, ActionDropdown } from "@/components/molecules"
import type { PropertyItemData, PropertyAction } from "@/types/ui/property"

export type { PropertyAction }

export type PropertyCardProps = PropertyItemData & {
  className?: string
  onClick?: () => void
  actions?: PropertyAction[]
}

export const PropertyCard = ({
  title,
  price,
  address_text,
  media,
  area,
  attributes,
  listing_type,
  property_type,
  status,
  className,
  onClick,
  actions,
  tags,
  updated_at,
}: PropertyCardProps) => {
  const { t, i18n } = useTranslation("listing")
  const firstMedia = media?.[0];
  const url = typeof firstMedia === "string" 
    ? firstMedia 
    : (firstMedia && typeof firstMedia === "object" && "url" in firstMedia && typeof (firstMedia as Record<string, unknown>).url === "string" 
        ? ((firstMedia as Record<string, unknown>).url as string)
        : undefined);
  const imageUrl = url;
  
  const [imageError, setImageError] = useState(false)

  React.useEffect(() => {
    setImageError(false)
  }, [imageUrl])

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const validAttributes = Object.entries(attributes || {})
    .filter(([key, value]) => !EXCLUDED_CARD_ATTRIBUTES.includes(key) && value !== undefined && value !== null && value !== "")
    .slice(0, 3)

  const hasMetrics = Boolean(area) || validAttributes.length > 0

  const primaryActions = actions?.filter(a => a.isPrimary) || []
  const secondaryActions = actions?.filter(a => !a.isPrimary) || []

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group w-full h-full",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed bg-muted/30">
            <ImageOff className="w-8 h-8 opacity-50 mb-2" />
            <span className="text-xs font-medium opacity-50">{t("no_image")}</span>
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex gap-1.5">
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge 
            className="h-6 px-2.5 py-1 text-xs border-transparent bg-foreground/80 text-background shadow-sm backdrop-blur-md hover:bg-foreground rounded-sm font-bold"
          >
            {formatListingPrice({ price, listing_type, attributes }, t, i18n.language)}
          </Badge>
        </div>
        
        {secondaryActions.length > 0 && (
          <div className={cn(
            "absolute top-2 right-2 transition-opacity duration-200 z-10",
            isDropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <ActionDropdown 
              actions={secondaryActions}
              onOpenChange={setIsDropdownOpen}
              trigger={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-sm shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 w-full flex-1">
        <div className="flex items-center justify-between gap-1.5 text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
          <div className="flex items-center gap-1.5">
            {listing_type && <span>{formatListingType(listing_type, t)?.label}</span>}
            {listing_type && property_type && <span>•</span>}
            {property_type && <span>{formatPropertyType(property_type, t)}</span>}
          </div>
          {status && formatListingStatus(status, t) && (
            <ListingBadge 
              listing={formatListingStatus(status, t)?.listing}
              className="h-5 px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-md"
            >
              {formatListingStatus(status, t)?.label}
            </ListingBadge>
          )}
        </div>
        <Tooltip content={title} side="top" align="start">
          <h4 className="font-semibold text-sm line-clamp-2 leading-snug">
            {title}
          </h4>
        </Tooltip>
        <div className="flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 mt-0.5 shrink-0" />
          <Tooltip content={formatLocalizedAddress(address_text, i18n.language)} side="bottom" align="start">
            <span className="line-clamp-1">{formatShortAddress(address_text)}</span>
          </Tooltip>
        </div>
        {updated_at && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 mt-0.5">
            <Clock className="size-3 shrink-0" />
            <span>{t("list.updated_at")}: {formatShortDateTime(updated_at)}</span>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {tags.slice(0, 2).map((tag, idx) => (
              <Tooltip key={idx} content={tag} side="top">
                <Tag variant="secondary" size="sm" shape="sm" className="max-w-[120px]">
                  {tag}
                </Tag>
              </Tooltip>
            ))}
            {tags.length > 2 && (
              <Tag variant="secondary" size="sm" shape="sm">
                +{tags.length - 2}
              </Tag>
            )}
          </div>
        )}
      </div>
      {hasMetrics && (
        <>
          <div className="h-px w-full bg-border/60" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium flex-wrap">
            {Boolean(area) && (
              <Tooltip content={`${t("detail.area")} ${area}m²`} side="bottom">
                <div className="flex items-center gap-1.5">
                  <SquareDashed className="size-3.5" />
                  <span>{area}m²</span>
                </div>
              </Tooltip>
            )}
            
            {validAttributes.map(([key, value]) => {
              const config = ATTRIBUTE_CONFIG[key]
              const Icon = config?.icon || Info
              const label = config?.shortLabel || config?.label || key
              return (
                <Tooltip key={key} content={`${label}: ${String(value)}`} side="bottom">
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-3.5" />
                    <span className="truncate max-w-[60px]">{String(value)}</span>
                  </div>
                </Tooltip>
              )
            })}
          </div>
        </>
      )}

      {primaryActions.length > 0 && (
        <div className="pt-2 mt-auto flex gap-2 w-full">
          {primaryActions.map((action) => {
            const Icon = action.icon
            const buttonElement = (
              <Button
                key={action.id}
                variant={action.variant || "solid"}
                className={cn(
                  "flex-1",
                  action.variant === "secondary" && "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 font-medium"
                )}
                onClick={(e) => {
                  if (!action.confirmTitle) {
                    e.stopPropagation()
                    action.onClick?.(e)
                  }
                }}
              >
                {Icon && <Icon className="mr-2 size-4" />}
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
                  <div onClick={(e) => e.stopPropagation()} className="flex-1 flex">
                    {buttonElement}
                  </div>
                </ConfirmAction>
              )
            }

            return buttonElement
          })}
        </div>
      )}
    </div>
  )
}

import { CardSkeleton } from "./card"

export const PropertyCardSkeleton = ({ className, withActions = false }: { className?: string, withActions?: boolean }) => {
  return (
    <CardSkeleton 
      className={className} 
      hasImage={true} 
      textLines={5} 
      hasActions={withActions} 
    />
  )
}
