import { LOCALES, type Locale } from "@/types/domain";

export { LOCALES };
export type { Locale };

export const DEFAULT_LOCALE: Locale = "uz";

/** Intl API uchun to'liq locale kodlari (sana, raqam formatlash). */
export const INTL_LOCALE: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
};

/** <html lang> atributi. */
export const HTML_LANG: Record<Locale, string> = {
  uz: "uz-Latn-UZ",
  ru: "ru",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Accept-Language sarlavhasidan mos tilni tanlaydi.
 * Hech nima mos kelmasa — DEFAULT_LOCALE.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        quality: q ? Number.parseFloat(q.split("=")[1]) || 0 : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}
