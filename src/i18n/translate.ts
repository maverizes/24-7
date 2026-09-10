import type { Dictionary } from "./dictionaries";

/** Ichma-ich obyektdagi barcha "a.b.c" ko'rinishidagi kalitlar. */
type DotPaths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
    }[keyof T & string];

export type TranslationKey = DotPaths<Dictionary>;

export type TranslationVars = Record<string, string | number>;

export type Translator = (key: TranslationKey, vars?: TranslationVars) => string;

function resolve(dict: Dictionary, key: string): string | undefined {
  let current: unknown = dict;
  for (const segment of key.split(".")) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * `t("common.status.closesAt", { time: "23:00" })` → "23:00 da yopiladi".
 * Kalit topilmasa — kalitning o'zi qaytadi (UI buzilmaydi, xato ko'rinadi).
 */
export function createTranslator(dict: Dictionary): Translator {
  return (key, vars) => {
    const template = resolve(dict, key);
    if (template === undefined) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] Tarjima topilmadi: ${key}`);
      }
      return key;
    }
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}
