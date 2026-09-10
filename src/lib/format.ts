/**
 * Formatlash yordamchilari.
 *
 * Muhim: barcha formatlash deterministik (Intl'ga bog'liq emas), shuning uchun
 * server va klientda bir xil natija chiqadi va hydration mismatch bo'lmaydi.
 */

const NBSP = " ";

/** 123456 → "123 456" (uzilmas probel bilan). */
export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return sign + Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** Katta sonlarni qisqartiradi: 24000 → "24 000", 1284 → "1 284". */
export const formatCount = formatNumber;

export function formatPriceRange(min: number, max: number): string {
  return `${formatNumber(min)}${NBSP}–${NBSP}${formatNumber(max)}`;
}

/** Reyting doim bitta kasr bilan: 4.8 */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

export interface FormattedDistance {
  value: string;
  unit: "km" | "m";
}

export function formatDistance(km: number): FormattedDistance {
  if (km < 1) {
    return { value: String(Math.max(10, Math.round((km * 1000) / 10) * 10)), unit: "m" };
  }
  return { value: km < 10 ? km.toFixed(1) : String(Math.round(km)), unit: "km" };
}

/** ISO sana → "10.09.2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getUTCFullYear()}`;
}

/** Telefon raqamni bosiladigan havolaga aylantiradi. */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Narx darajasi → "$", "$$" … */
export function priceLevelSymbol(level: number): string {
  return "$".repeat(Math.min(Math.max(level, 1), 4));
}
