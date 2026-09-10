import uzCommon from "./locales/uz/common.json";
import uzHome from "./locales/uz/home.json";
import uzSearch from "./locales/uz/search.json";
import uzObject from "./locales/uz/object.json";
import uzErrors from "./locales/uz/errors.json";
import type { Locale } from "./config";

/**
 * Lug'atning shakli o'zbek tilidagi fayllardan olinadi — bu barcha tillar
 * uchun yagona kalit to'plamini kafolatlaydi (yetishmayotgan kalit =
 * TypeScript xatosi).
 */
export interface Dictionary {
  common: typeof uzCommon;
  home: typeof uzHome;
  search: typeof uzSearch;
  object: typeof uzObject;
  errors: typeof uzErrors;
}

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  uz: async () => ({
    common: uzCommon,
    home: uzHome,
    search: uzSearch,
    object: uzObject,
    errors: uzErrors,
  }),
  ru: async () => ({
    common: (await import("./locales/ru/common.json")).default,
    home: (await import("./locales/ru/home.json")).default,
    search: (await import("./locales/ru/search.json")).default,
    object: (await import("./locales/ru/object.json")).default,
    errors: (await import("./locales/ru/errors.json")).default,
  }),
  en: async () => ({
    common: (await import("./locales/en/common.json")).default,
    home: (await import("./locales/en/home.json")).default,
    search: (await import("./locales/en/search.json")).default,
    object: (await import("./locales/en/object.json")).default,
    errors: (await import("./locales/en/errors.json")).default,
  }),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
