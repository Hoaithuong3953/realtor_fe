import type { ListingResponse } from "@/types/api";
import { formatPrice } from "./currency-formatter";

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

type PropertyType = NonNullable<ListingResponse["property_type"]>
type ListingStatus = NonNullable<ListingResponse["status"]>
type ListingType = NonNullable<ListingResponse["listing_type"]>

type BadgeVariant = "active" | "draft" | "inactive" | "sale" | "rent";

export function formatPropertyType(type?: PropertyType, t?: TranslationFn): string {
  if (!type || !t) return "";
  return t(`constants.property_type_${type}`);
}

export function formatListingStatus(status?: ListingStatus, t?: TranslationFn): { label: string; listing: BadgeVariant } | null {
  if (!status || !t) return null;
  return { 
    label: t(`constants.status_${status}`), 
    listing: status as BadgeVariant
  };
}

export function formatListingType(type?: ListingType, t?: TranslationFn): { label: string; listing: BadgeVariant } | null {
  if (!type || !t) return null;
  return {
    label: t(`constants.listing_type_${type}`),
    listing: type as BadgeVariant
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
      return `${basePrice}${t("detail.per_month_unit")}`;
    }
    if (property.attributes.rent_period === "year") {
      return `${basePrice}${t("detail.per_year_unit")}`;
    }
  }
  return basePrice;
}

export function formatShortAddress(address?: string | null): string {
  if (!address) return "";
  
  const prefixes = [
    "Số ", "số ",
    "Thành phố ", "thành phố ", "TP.", "tp.", "TP ", "tp ",
    "Tỉnh ", "tỉnh ",
    "Quận ", "quận ", "Q.", "q.",
    "Huyện ", "huyện ", "H.", "h.",
    "Phường ", "phường ", "P.", "p.",
    "Xã ", "xã ", "X.", "x."
  ];

  const parts = address.split(',').map(part => part.trim());
  
  const cleanParts = parts.map(part => {
    let cleanPart = part;
    for (const prefix of prefixes) {
      if (cleanPart.toLowerCase().startsWith(prefix.toLowerCase())) {
        const stripped = cleanPart.substring(prefix.length).trim();
        // If the remaining part is just a number (e.g. "3", "12"), keep the prefix
        if (/^\d+$/.test(stripped)) {
          continue;
        }
        cleanPart = stripped;
      }
    }
    return cleanPart;
  });

  return cleanParts.filter(Boolean).join(', ');
}

export function formatLocalizedAddress(address?: string | null, language: string = "vi"): string {
  if (!address) return "";
  if (language === "vi") return address;

  let result = address;
  const replacements: Array<[RegExp, string]> = [
    [/\b(Số|số)\s+/g, "No. "],
    [/\b(Thành phố|thành phố|TP\.|tp\.|TP|tp)\s+([^,]+)/g, "$2 City"],
    [/\b(Tỉnh|tỉnh)\s+([^,]+)/g, "$2 Province"],
    [/\b(Quận|quận|Q\.|q\.)\s+([^,]+)/g, "$2 District"],
    [/\b(Huyện|huyện|H\.|h\.)\s+([^,]+)/g, "$2 District"],
    [/\b(Phường|phường|P\.|p\.)\s+([^,]+)/g, "$2 Ward"],
    [/\b(Xã|xã|X\.|x\.)\s+([^,]+)/g, "$2 Ward"]
  ];

  replacements.forEach(([regex, replacement]) => {
    result = result.replace(regex, replacement);
  });

  return result;
}

export function getImportJobStatusDisplay(status: string, t?: TranslationFn): { label: string, color: string } {
  switch (status.toLowerCase()) {
    case "success":
    case "completed":
      return {
        label: t ? (t("import:importResult.job_status_completed") || "Hoàn thành") : "Hoàn thành",
        color: "bg-green-500/10 text-green-700 hover:bg-green-500/20"
      }
    case "partial_success":
      return {
        label: t ? (t("import:importResult.job_status_partial") || "Hoàn thành (có lỗi)") : "Hoàn thành (có lỗi)",
        color: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20"
      }
    case "failed":
      return {
        label: t ? (t("import:importResult.job_status_failed") || "Lỗi") : "Lỗi",
        color: "bg-red-500/10 text-red-700 hover:bg-red-500/20"
      }
    case "running":
    case "processing":
      return {
        label: t ? (t("import:importResult.job_status_running") || "Đang xử lý") : "Đang xử lý",
        color: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
      }
    case "pending":
    default:
      return {
        label: t ? (t("import:importResult.job_status_pending") || "Chờ xử lý") : "Chờ xử lý",
        color: "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20"
      }
  }
}

export function getMediaUrl(mediaItem: unknown): string {
  if (typeof mediaItem === "string") return mediaItem;
  if (mediaItem && typeof mediaItem === "object") {
    const obj = mediaItem as Record<string, unknown>;
    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.image === "string") return obj.image;
  }
  return "";
}

export function normalizeMedia(mediaArray: unknown[] | null | undefined): Array<{ url: string; [key: string]: unknown }> {
  if (!mediaArray || !Array.isArray(mediaArray)) return [];
  return mediaArray.map(m => {
    if (typeof m === "string") return { url: m };
    const obj = m as Record<string, unknown>;
    return {
      ...obj,
      url: getMediaUrl(m)
    };
  });
}

