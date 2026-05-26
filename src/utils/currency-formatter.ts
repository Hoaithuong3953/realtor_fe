type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

export function formatPrice(price?: number, t?: TranslationFn, locale: string = "vi-VN"): string {
  if (!price) return t ? t('common.updating') : "";

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(price);
}

export function formatCurrencyInput(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US");
}

export function parseCurrencyInput(value: string): number | null | undefined {
  const raw = value.replace(/,/g, "");
  if (/^\d*$/.test(raw)) {
    return raw ? Number(raw) : null;
  }
  return undefined;
}
