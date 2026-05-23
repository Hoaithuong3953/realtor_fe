import type { ListingResponse } from "@/types/api";
import { formatPrice } from "./currency-formatter";

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

type PropertyType = NonNullable<ListingResponse["property_type"]>
type ListingStatus = NonNullable<ListingResponse["status"]>
type ListingType = NonNullable<ListingResponse["listing_type"]>

const statusColorMap: Record<ListingStatus, string> = {
  active: "bg-emerald-500/90",
  draft: "bg-amber-500/90",
  inactive: "bg-gray-500/90",
};

export function formatPropertyType(type?: PropertyType, t?: TranslationFn): string {
  if (!type || !t) return "";
  return t(`propertyType.${type}`);
}

export function formatListingStatus(status?: ListingStatus, t?: TranslationFn): { label: string; className: string } | null {
  if (!status || !t) return null;
  return { 
    label: t(`status.${status}`), 
    className: statusColorMap[status] || ""
  };
}

const listingTypeColorMap: Record<ListingType, string> = {
  sale: "bg-success/90 text-success-foreground hover:bg-success",
  rent: "bg-info/90 text-info-foreground hover:bg-info",
};

export function formatListingType(type?: ListingType, t?: TranslationFn): { label: string; className: string } | null {
  if (!type || !t) return null;
  return {
    label: t(`type.${type}`),
    className: listingTypeColorMap[type] || ""
  };
}

export function formatListingPrice(
  property: { price?: number | null; listing_type?: string | null; attributes?: Record<string, unknown> | { rent_period?: string; [key: string]: unknown } | null }, 
  t: TranslationFn, 
  language: string
): string {
  const basePrice = formatPrice(property.price, t, language);
  if (property.listing_type === "rent" && property.attributes?.rent_period) {
    if (property.attributes.rent_period === "month") {
      return `${basePrice}${t("detail.units.per_month")}`;
    }
    if (property.attributes.rent_period === "year") {
      return `${basePrice}${t("detail.units.per_year")}`;
    }
  }
  return basePrice;
}
