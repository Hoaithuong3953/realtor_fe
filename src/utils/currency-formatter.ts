type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

export function formatPrice(price?: number, t?: TranslationFn, locale: string = "vi-VN"): string {
  if (!price) return t ? t('common.updating') : "";

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(price);
}
