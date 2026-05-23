import type { ListingResponse } from "@/types/api";

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
