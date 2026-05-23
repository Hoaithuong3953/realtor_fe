import { MapPin, BedDouble, Bath, SquareDashed } from "lucide-react"

import { Skeleton, Badge } from "@/components/ui"
import { cn } from "@/lib/utils"
import { formatListingType, formatPropertyType, formatListingPrice } from "@/utils/listing-formatter"
import { useTranslation } from "react-i18next"
import { Button, Tag, Tooltip } from "@/components/atoms"
import { ConfirmAction } from "@/components/molecules"
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
  className,
  onClick,
  actions,
  tags,
}: PropertyCardProps) => {
  const { t, i18n } = useTranslation("listing")
  const firstMedia = media?.[0];
  const url = firstMedia && typeof firstMedia.url === "string" ? firstMedia.url : undefined;
  const imageUrl = url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"
  const bedrooms = attributes?.bedrooms
  const bathrooms = attributes?.bathrooms

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group w-full h-full",
        className
      )}
    >
      <div className="overflow-hidden rounded-md relative bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {listing_type && (() => {
            const typeInfo = formatListingType(listing_type, t);
            return typeInfo ? (
              <Badge 
                className={cn(
                  "h-5 px-2 py-0.5 text-[10px] border-transparent uppercase tracking-wider shadow-sm backdrop-blur-sm rounded-sm font-bold",
                  typeInfo.className
                )}
              >
                {typeInfo.label}
              </Badge>
            ) : null;
          })()}
          {property_type && (
            <Badge 
              className="h-5 px-2 py-0.5 text-[10px] border-transparent bg-foreground/60 text-background uppercase tracking-wider shadow-sm backdrop-blur-sm hover:bg-foreground/70 rounded-sm font-bold"
            >
              {formatPropertyType(property_type, t)}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge 
            className="h-6 px-2.5 py-1 text-xs border-transparent bg-foreground/80 text-background shadow-sm backdrop-blur-md hover:bg-foreground rounded-sm font-bold"
          >
            {formatListingPrice({ price, listing_type, attributes }, t, i18n.language)}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 w-full flex-1">
        <Tooltip content={title} side="top" align="start">
          <h4 className="font-semibold text-sm line-clamp-2 leading-snug">
            {title}
          </h4>
        </Tooltip>
        <div className="flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 mt-0.5 shrink-0" />
          <Tooltip content={address_text ?? ""} side="bottom" align="start">
            <span className="line-clamp-1">{address_text}</span>
          </Tooltip>
        </div>
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
      {(bedrooms !== undefined || bathrooms !== undefined || area !== undefined) && (
        <>
          <div className="h-px w-full bg-border/60" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            {bedrooms !== undefined && (
              <Tooltip content={`${bedrooms} ${t("detail.bedrooms").toLowerCase()}`} side="bottom">
                <div className="flex items-center gap-1.5">
                  <BedDouble className="size-3.5" />
                  <span>{bedrooms}</span>
                </div>
              </Tooltip>
            )}
            {bathrooms !== undefined && (
              <Tooltip content={`${bathrooms} ${t("detail.bathrooms").toLowerCase()}`} side="bottom">
                <div className="flex items-center gap-1.5">
                  <Bath className="size-3.5" />
                  <span>{bathrooms}</span>
                </div>
              </Tooltip>
            )}
            {area !== undefined && (
              <Tooltip content={`${t("detail.area")} ${area}m²`} side="bottom">
                <div className="flex items-center gap-1.5">
                  <SquareDashed className="size-3.5" />
                  <span>{area}m²</span>
                </div>
              </Tooltip>
            )}
          </div>
        </>
      )}

      {actions && actions.length > 0 && (
        <div className="pt-2 mt-auto flex gap-2 w-full">
          {actions.map((action) => {
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
                  {buttonElement}
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

export const PropertyCardSkeleton = ({ className, withActions = false }: { className?: string, withActions?: boolean }) => {
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border bg-card p-3 w-full h-full", className)}>
      <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 mt-1 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex items-center gap-1 mt-1">
          <Skeleton className="size-3.5 rounded-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex gap-1 mt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
      <div className="h-px w-full bg-border/60 mt-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5"><Skeleton className="size-3.5 rounded-full" /><Skeleton className="h-3 w-4" /></div>
        <div className="flex items-center gap-1.5"><Skeleton className="size-3.5 rounded-full" /><Skeleton className="h-3 w-4" /></div>
        <div className="flex items-center gap-1.5"><Skeleton className="size-3.5 rounded-full" /><Skeleton className="h-3 w-8" /></div>
      </div>
      {withActions && (
        <div className="pt-2 mt-auto flex w-full">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      )}
    </div>
  )
}
