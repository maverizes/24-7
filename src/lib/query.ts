import type { AwardKey } from "@/types/domain";
import type { ObjectQuery, OpenStateFilter, SortKey } from "@/types/api";

/**
 * Filtrlar URL query parametrlari bilan sinxron ishlaydi (TZ 11).
 * Shu tufayli natijalar ulashiladigan, orqaga/oldinga tugmalari ishlaydigan
 * va SSR uchun to'liq takrorlanadigan bo'ladi.
 */

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const SORT_KEYS: SortKey[] = [
  "recommended",
  "rating",
  "reviews",
  "price_asc",
  "price_desc",
  "distance",
  "newest",
  "popular",
];

export const OPEN_STATES: OpenStateFilter[] = [
  "all",
  "open_now",
  "24_7",
  "closed",
  "opens_later",
];

export const RATING_STEPS = [4.5, 4, 3.5, 3] as const;
export const DISTANCE_STEPS = [0.5, 1, 3, 5, 10] as const;
export const PRICE_LEVELS = [1, 2, 3, 4] as const;
export const DEFAULT_PAGE_SIZE = 20;

/** «Ayni damda ochiq» sukut bo'yicha yoqilgan (TZ 6, 10). */
export const DEFAULT_OPEN_STATE: OpenStateFilter = "open_now";

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function list(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value;
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function num(value: string | string[] | undefined): number | undefined {
  const raw = first(value);
  if (raw === undefined || raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseObjectQuery(
  params: RawSearchParams,
  defaults: Partial<ObjectQuery> = {},
): ObjectQuery {
  const openRaw = first(params.open);
  const openState = OPEN_STATES.includes(openRaw as OpenStateFilter)
    ? (openRaw as OpenStateFilter)
    : (defaults.openState ?? DEFAULT_OPEN_STATE);

  const sortRaw = first(params.sort);
  const sort = SORT_KEYS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : "recommended";

  const page = Math.max(1, Math.floor(num(params.page) ?? 1));
  const priceLevels = list(params.price)
    .map(Number)
    .filter((level) => PRICE_LEVELS.includes(level as (typeof PRICE_LEVELS)[number]));

  return {
    q: first(params.q)?.trim() || undefined,
    category: first(params.category) || defaults.category,
    subcategory: first(params.subcategory) || defaults.subcategory,
    region: first(params.region) || defaults.region,
    services: list(params.services),
    ratingMin: num(params.rating),
    priceLevels,
    openState,
    distanceMax: num(params.distance),
    awards: list(params.awards) as AwardKey[],
    sort,
    page,
    limit: defaults.limit ?? DEFAULT_PAGE_SIZE,
    lat: num(params.lat),
    lng: num(params.lng),
  };
}

/** ObjectQuery → URLSearchParams (faqat sukutdan farq qiladiganlari). */
export function toSearchParams(query: ObjectQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.subcategory) params.set("subcategory", query.subcategory);
  if (query.region) params.set("region", query.region);
  if (query.services?.length) params.set("services", query.services.join(","));
  if (query.ratingMin) params.set("rating", String(query.ratingMin));
  if (query.priceLevels?.length) params.set("price", query.priceLevels.join(","));
  if (query.openState && query.openState !== DEFAULT_OPEN_STATE) {
    params.set("open", query.openState);
  }
  if (query.distanceMax) params.set("distance", String(query.distanceMax));
  if (query.awards?.length) params.set("awards", query.awards.join(","));
  if (query.sort && query.sort !== "recommended") params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.lat !== undefined && query.lng !== undefined) {
    params.set("lat", query.lat.toFixed(5));
    params.set("lng", query.lng.toFixed(5));
  }

  return params;
}

/** Filtr o'zgarganda sahifa 1-ga qaytadi. */
export function buildHref(
  pathname: string,
  query: ObjectQuery,
  patch: Partial<ObjectQuery> = {},
): string {
  const next: ObjectQuery = { ...query, ...patch };
  if (!("page" in patch)) next.page = 1;

  const params = toSearchParams(next);
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

/** Faol filtrlar soni — mobil «Filtr» tugmasidagi hisoblagich uchun. */
export function countActiveFilters(query: ObjectQuery): number {
  let count = 0;
  if (query.openState && query.openState !== DEFAULT_OPEN_STATE) count += 1;
  if (query.category) count += 1;
  if (query.subcategory) count += 1;
  if (query.region) count += 1;
  if (query.ratingMin) count += 1;
  if (query.priceLevels?.length) count += 1;
  if (query.distanceMax) count += 1;
  if (query.awards?.length) count += 1;
  count += query.services?.length ?? 0;
  return count;
}

/** Filtrlarni tozalash: qidiruv so'zi va lokatsiya saqlanadi. */
export function clearedQuery(query: ObjectQuery): ObjectQuery {
  return {
    q: query.q,
    lat: query.lat,
    lng: query.lng,
    openState: DEFAULT_OPEN_STATE,
    sort: "recommended",
    page: 1,
    limit: query.limit,
    services: [],
    priceLevels: [],
    awards: [],
  };
}
