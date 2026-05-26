import * as React from "react"
import { MapPin, SquareDashed, Building2, Banknote, Tag as TagIcon } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

import { formatListingType, formatPropertyType, formatListingStatus, formatListingPrice, formatLocalizedAddress } from "@/utils/listing-formatter"
import { formatPrice } from "@/utils/currency-formatter"
import { formatShortDateTime } from "@/utils/date-formatter"
import { useTranslation } from "react-i18next"
import { Tag, ListingBadge } from "@/components/atoms"
import { ATTRIBUTE_CONFIG } from "@/constants/listing"

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
  updated_at?: string
  media?: Array<{ url: string;[key: string]: unknown }>
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

export const PropertyDetailView = ({ property, footerActions, className }: PropertyDetailViewProps) => {
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
        </div>
      </div>

      {/* 2. Basic Information */}
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        {/* 3. Price & Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug flex-1">
              {property.title}
              {property.status && formatListingStatus(property.status, t) && (
                <ListingBadge 
                  listing={formatListingStatus(property.status, t)?.listing}
                  className="px-2.5 py-1 text-[11px] rounded-md align-middle ml-3 -mt-1"
                >
                  {formatListingStatus(property.status, t)?.label}
                </ListingBadge>
              )}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-1 text-muted-foreground text-sm">
              <div className="flex items-start gap-1.5">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                <span>{formatLocalizedAddress(property.address_text, i18n.language)}</span>
              </div>
              {property.updated_at && (
                <div className="flex items-center gap-1.5 text-xs opacity-80 mt-1">
                  <span>{t("list.updated_at")}: {formatShortDateTime(property.updated_at)}</span>
                </div>
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary shrink-0 flex items-baseline gap-1">
              {formatListingPrice(property, t, i18n.language)}
            </div>
          </div>
        </div>

        <div className="h-px bg-border/60" />

        {/* 4. Basic Information */}
        <div className="flex flex-col gap-2.5">
          <h3 className="font-bold text-base border-l-4 border-primary pl-3">{t("form.step_basic") || "Tổng quan"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {property.listing_type && (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
                <TagIcon className="size-5 text-primary" />
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t("form.listing_type_label") || "Giao dịch"}</p>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{formatListingType(property.listing_type, t)?.label}</p>
                </div>
              </div>
            )}

            {property.property_type && (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
                <Building2 className="size-5 text-primary" />
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t("detail.property_type")}</p>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{formatPropertyType(property.property_type, t)}</p>
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
            {property.listing_type === "rent" && property.attributes?.deposit !== undefined && (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
                <Banknote className="size-5 text-primary" />
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t("detail.deposit") || "Deposit"}</p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <p className="font-semibold text-foreground text-sm">{formatPrice(property.attributes?.deposit, t, i18n.language)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Attributes Grid */}
        {Object.entries(property.attributes || {}).filter(([key, value]) => key !== "deposit" && key !== "rent_period" && value !== undefined && value !== null && value !== "").length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-base border-l-4 border-primary pl-3">{t("form.step_details") || "Đặc điểm"}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(property.attributes || {})
                .filter(([key, value]) => key !== "deposit" && key !== "rent_period" && value !== undefined && value !== null && value !== "")
                .map(([key, value]) => {
                  const config = ATTRIBUTE_CONFIG[key]
                  if (!config) return null
                  const Icon = config.icon
                  return (
                    <div key={key} className="flex flex-col gap-2 p-3.5 rounded-xl bg-muted/40 border border-border/40">
                      <Icon className="size-5 text-primary" />
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{t(config.label)}</p>
                        <p className="font-semibold text-foreground text-sm mt-0.5">
                          {value as React.ReactNode} {key === "bedrooms" ? t("detail.beds_unit") : key === "bathrooms" ? t("detail.baths_unit") : ""}
                        </p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

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
