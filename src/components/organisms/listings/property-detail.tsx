import * as React from "react"
import { MapPin, BedDouble, Bath, SquareDashed, Building2, Banknote } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

import { formatPrice } from "@/utils/currency-formatter"
import { formatListingType, formatPropertyType, formatListingStatus } from "@/utils/listing-formatter"
import { useTranslation } from "react-i18next"
import { Tag } from "@/components/atoms"
import { Badge } from "@/components/ui"

export type PropertyDetailData = {
  id?: string | number
  title: string
  address_text?: string
  price?: number
  listing_type?: "sale" | "rent"
  property_type?: "apartment" | "house" | "villa" | "land"
  status?: "active" | "draft" | "inactive"
  area?: number
  description?: string
  media?: Array<{ url: string; [key: string]: unknown }>
  tags?: string[]
  attributes?: {
    rent_period?: string
    deposit?: number
    bedrooms?: number | string
    bathrooms?: number | string
    [key: string]: unknown
  }
}

export type PropertyDetailViewProps = {
  property: PropertyDetailData
  footerActions?: React.ReactNode
  className?: string
}

export function PropertyDetailView({ property, footerActions, className }: PropertyDetailViewProps) {
  const { t, i18n } = useTranslation("listing")
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const media = property.media && property.media.length > 0 
    ? property.media 
    : [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" }]

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <div className={cn("flex flex-col", className)}>
      {/* 1. Media Gallery - Carousel */}
      <div className="w-full relative bg-muted group">
        <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {media.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="aspect-[16/9] w-full">
                  <img
                    src={img.url}
                    alt={`${property.title} - ${t("detail.image")} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {media.length > 1 && (
            <>
              <CarouselPrevious
                className="left-3 bg-black/40 hover:bg-black/60 text-white border-0 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => e.preventDefault()}
              />
              <CarouselNext
                className="right-3 bg-black/40 hover:bg-black/60 text-white border-0 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => e.preventDefault()}
              />
            </>
          )}
        </Carousel>

        {/* Dot indicators */}
        {media.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 px-2 py-1 bg-black/30 rounded-full backdrop-blur-sm">
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx)}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                  "rounded-full transition-all duration-300",
                  idx === current
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}

        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {property.listing_type && (() => {
            const typeInfo = formatListingType(property.listing_type, t);
            return typeInfo ? (
              <Badge className={cn(
                "px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md shadow-md uppercase tracking-wider",
                typeInfo.className
              )}>
                {typeInfo.label}
              </Badge>
            ) : null;
          })()}
          {property.status && formatListingStatus(property.status, t) && (
            <Badge className={cn(
              "px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md shadow-md rounded-md", 
              formatListingStatus(property.status, t)?.className
            )}>
              {formatListingStatus(property.status, t)?.label}
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Basic Information */}
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        {/* 3. Price & Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug flex-1">{property.title}</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="size-4 shrink-0" />
              <span>{property.address_text}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary shrink-0 flex items-baseline gap-1">
              {formatPrice(property.price, t, i18n.language)}
              {property.listing_type === "rent" && property.attributes?.rent_period === "month" && (
                <span className="text-lg font-medium text-muted-foreground">/tháng</span>
              )}
              {property.listing_type === "rent" && property.attributes?.rent_period === "year" && (
                <span className="text-lg font-medium text-muted-foreground">/năm</span>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-border/60" />

        {/* 4. Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {property.property_type && (
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
              <Building2 className="size-5 text-primary" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t("detail.property_type")}</p>
                <p className="font-semibold text-foreground text-sm mt-0.5">{formatPropertyType(property.property_type, t)}</p>
              </div>
            </div>
          )}
          {property.listing_type === "rent" && property.attributes?.deposit !== undefined && (
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
              <Banknote className="size-5 text-primary" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">Tiền cọc</p>
                <p className="font-semibold text-foreground text-sm mt-0.5">{formatPrice(property.attributes?.deposit, t, i18n.language)}</p>
              </div>
            </div>
          )}
          {property.attributes?.bedrooms !== undefined && (
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
              <BedDouble className="size-5 text-primary" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t("detail.bedrooms")}</p>
                <p className="font-semibold text-foreground text-sm mt-0.5">{property.attributes?.bedrooms} {t("detail.units.beds")}</p>
              </div>
            </div>
          )}
          {property.attributes?.bathrooms !== undefined && (
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
              <Bath className="size-5 text-primary" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t("detail.bathrooms")}</p>
                <p className="font-semibold text-foreground text-sm mt-0.5">{property.attributes?.bathrooms} {t("detail.units.baths")}</p>
              </div>
            </div>
          )}
          {property.area !== undefined && (
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
              <SquareDashed className="size-5 text-primary" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t("detail.area")}</p>
                <p className="font-semibold text-foreground text-sm mt-0.5">{property.area} m²</p>
              </div>
            </div>
          )}
        </div>

        {/* 5. Description */}
        {property.description && (
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-base border-l-4 border-primary pl-3">{t("detail.description")}</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm">
              {property.description}
            </p>
          </div>
        )}

        {/* 6. Highlights */}
        {property.tags && property.tags.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-base border-l-4 border-primary pl-3">{t("detail.highlights")}</h3>
            <div className="flex flex-wrap gap-2">
              {property.tags.map(tag => (
                <Tag key={tag} variant="info" shape="pill" className="bg-primary/8 text-primary border-primary/15">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* 6. Footer Actions */}
        {footerActions && (
          <>
            <div className="h-px bg-border/50 w-full" />
            <div className="flex items-center justify-end gap-3">
              {footerActions}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
