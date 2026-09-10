import type { GeoPoint, Locale, PlaceObject } from "@/types/domain";
import type {
  FacetCount,
  ObjectDetail,
  ObjectListItem,
  ObjectQuery,
  ObjectSearchResult,
} from "@/types/api";
import { CATEGORIES } from "@/server/db/categories";
import { OBJECTS, reviewsForObject } from "@/server/db/objects";
import { REGIONS } from "@/server/db/regions";
import { SERVICES } from "@/server/db/services";
import { computeOpenStatus, getLocalNow, opensLaterToday } from "@/server/open-hours";
import { matchesQuery, matchScore, normalizeText } from "@/lib/search-text";
import { isValidPoint } from "@/lib/geo";
import { DEFAULT_PAGE_SIZE } from "@/lib/query";
import { categoryOf, pick, regionOf, subcategoryOf, toListItem } from "./mappers";

/**
 * Obyektlar bo'yicha «API». Hozircha xotiradagi seed ustida ishlaydi, lekin
 * kirish/chiqish shakli `GET /api/v1/objects` bilan bir xil (TZ 34), shuning
 * uchun backend ulanganda faqat shu fayl almashadi.
 */

/** Qidiruv indeksi — barcha tillardagi matn bir marta normallashtiriladi. */
const searchIndex = new Map<string, string>(
  OBJECTS.map((object) => {
    const category = categoryOf(object);
    const subcategory = subcategoryOf(object);
    const region = regionOf(object);

    const haystack = [
      object.name.uz,
      object.name.ru,
      object.name.en,
      category.name.uz,
      category.name.ru,
      category.name.en,
      subcategory.name.uz,
      subcategory.name.ru,
      subcategory.name.en,
      region.name.uz,
      region.name.ru,
      region.name.en,
      object.address.uz,
      object.address.ru,
      ...object.tags,
    ].join(" ");

    return [object.id, normalizeText(haystack)];
  }),
);

function textMatches(object: PlaceObject, q: string | undefined): boolean {
  if (!q) return true;
  return matchesQuery(q, searchIndex.get(object.id) ?? "");
}

function originFrom(query: ObjectQuery): GeoPoint | undefined {
  const point = { lat: query.lat, lng: query.lng };
  return isValidPoint(point) ? point : undefined;
}

interface Prepared {
  object: PlaceObject;
  item: ObjectListItem;
}

function passesOpenState(item: ObjectListItem, query: ObjectQuery): boolean {
  switch (query.openState) {
    case "open_now":
      return item.openStatus.isOpenNow;
    case "24_7":
      return item.openStatus.is24Hours;
    case "closed":
      return !item.openStatus.isOpenNow;
    case "opens_later":
      return opensLaterToday(item.openStatus);
    default:
      return true;
  }
}

function passesFilters(entry: Prepared, query: ObjectQuery): boolean {
  const { object, item } = entry;

  if (!passesOpenState(item, query)) return false;
  if (query.category && item.category.slug !== query.category) return false;
  if (query.subcategory && item.subcategory.slug !== query.subcategory) return false;
  if (query.region && item.region.slug !== query.region) return false;
  if (query.ratingMin && object.rating < query.ratingMin) return false;

  if (query.priceLevels?.length) {
    if (!object.price || !query.priceLevels.includes(object.price.level)) return false;
  }

  if (query.priceMax && (!object.price || object.price.dayMin > query.priceMax)) return false;

  if (query.services?.length) {
    const slugs = new Set(item.services.map((service) => service.slug));
    if (!query.services.every((slug) => slugs.has(slug))) return false;
  }

  if (query.awards?.length) {
    if (!query.awards.some((award) => object.awards.includes(award))) return false;
  }

  if (query.distanceMax !== undefined && query.distanceMax > 0) {
    if (item.distanceKm === null || item.distanceKm > query.distanceMax) return false;
  }

  return true;
}

function recommendedScore(entry: Prepared): number {
  const { object, item } = entry;
  const popularity = object.rating * Math.log10(object.reviewCount + 10);
  const openBonus = item.openStatus.isOpenNow ? 1.6 : 0;
  const verifiedBonus = object.verificationStatus === "VERIFIED" ? 0.8 : 0;
  const awardBonus = object.awards.length * 0.5;
  return popularity + openBonus + verifiedBonus + awardBonus;
}

function compare(a: Prepared, b: Prepared, query: ObjectQuery, queryText?: string): number {
  switch (query.sort) {
    case "rating":
      return b.object.rating - a.object.rating || b.object.reviewCount - a.object.reviewCount;
    case "reviews":
      return b.object.reviewCount - a.object.reviewCount;
    case "price_asc":
      return (a.object.price?.dayMin ?? Number.MAX_SAFE_INTEGER) -
        (b.object.price?.dayMin ?? Number.MAX_SAFE_INTEGER);
    case "price_desc":
      return (b.object.price?.dayMax ?? -1) - (a.object.price?.dayMax ?? -1);
    case "distance":
      return (a.item.distanceKm ?? Number.MAX_SAFE_INTEGER) -
        (b.item.distanceKm ?? Number.MAX_SAFE_INTEGER);
    case "newest":
      return b.object.createdAt.localeCompare(a.object.createdAt);
    case "popular":
      return b.object.viewCount - a.object.viewCount;
    default: {
      // Tavsiya etilgan: matnga mos kelish + mashhurlik.
      if (queryText) {
        const scoreDiff =
          matchScore(queryText, searchIndex.get(b.object.id) ?? "") -
          matchScore(queryText, searchIndex.get(a.object.id) ?? "");
        if (scoreDiff !== 0) return scoreDiff;
      }
      return recommendedScore(b) - recommendedScore(a);
    }
  }
}

function buildFacets(entries: Prepared[], locale: Locale): ObjectSearchResult["facets"] {
  const countBy = (key: (entry: Prepared) => string) => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      const value = key(entry);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return counts;
  };

  const categoryCounts = countBy((entry) => entry.item.category.slug);
  const regionCounts = countBy((entry) => entry.item.region.slug);

  const serviceCounts = new Map<string, number>();
  for (const entry of entries) {
    for (const service of entry.item.services) {
      serviceCounts.set(service.slug, (serviceCounts.get(service.slug) ?? 0) + 1);
    }
  }

  const categories: FacetCount[] = CATEGORIES.map((category) => ({
    slug: category.slug,
    name: pick(category.name, locale),
    icon: category.icon,
    count: categoryCounts.get(category.slug) ?? 0,
  }));

  const regions: FacetCount[] = REGIONS.map((region) => ({
    slug: region.slug,
    name: pick(region.name, locale),
    count: regionCounts.get(region.slug) ?? 0,
  }));

  const services: FacetCount[] = SERVICES.map((service) => ({
    slug: service.slug,
    name: pick(service.name, locale),
    icon: service.icon,
    count: serviceCounts.get(service.slug) ?? 0,
  }));

  return {
    categories,
    regions,
    services,
    openNow: entries.filter((entry) => entry.item.openStatus.isOpenNow).length,
    is24Hours: entries.filter((entry) => entry.item.openStatus.is24Hours).length,
  };
}

/** TZ 34 — obyektlar ro'yxati: filtr + saralash + sahifalash + facet'lar. */
export function searchObjects(query: ObjectQuery, locale: Locale): ObjectSearchResult {
  const origin = originFrom(query);
  const now = new Date();

  // 1. Matn bo'yicha tanlab olish (eng qimmat bosqich — birinchi bajariladi).
  const textFiltered = query.q
    ? OBJECTS.filter((object) => textMatches(object, query.q))
    : OBJECTS;

  // 2. API shakliga o'tkazish (open status shu yerda hisoblanadi).
  const prepared: Prepared[] = textFiltered.map((object) => ({
    object,
    item: toListItem(object, locale, origin, now),
  }));

  // 3. Filtrlar.
  const filtered = prepared.filter((entry) => passesFilters(entry, query));

  // 4. Facet'lar filtrlangan to'plam ustidan hisoblanadi.
  const facets = buildFacets(filtered, locale);

  // 5. Saralash va sahifalash.
  const sorted = [...filtered].sort((a, b) => compare(a, b, query, query.q));

  const limit = query.limit ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, query.page ?? 1);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  // Natija bo'sh bo'lsa — «ochiq» filtrisiz nechta obyekt borligini ham beramiz.
  const relaxedTotal =
    total === 0 && query.openState && query.openState !== "all"
      ? prepared.filter((entry) => passesFilters(entry, { ...query, openState: "all" })).length
      : 0;

  return {
    data: sorted.slice(start, start + limit).map((entry) => entry.item),
    meta: { page, limit, total, totalPages },
    facets,
    relaxedTotal,
  };
}

/** Xarita uchun: sahifalanmagan, lekin cheklangan to'plam. */
export function searchObjectsForMap(
  query: ObjectQuery,
  locale: Locale,
  limit = 300,
): ObjectListItem[] {
  const result = searchObjects({ ...query, page: 1, limit }, locale);
  return result.data;
}

function completenessScore(object: PlaceObject): number {
  const checks = [
    object.description.uz.length > 0,
    object.phone !== null,
    object.website !== null,
    object.images.length > 0,
    object.price !== null,
    object.menu.length > 0,
    object.serviceIds.length > 0,
    object.openingHours.length === 7,
    object.address.uz.length > 0,
    object.verificationStatus === "VERIFIED",
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

/** TZ 13 — obyektning batafsil sahifasi. */
export function getObjectBySlug(slug: string, locale: Locale): ObjectDetail | null {
  const object = OBJECTS.find((candidate) => candidate.slug === slug);
  if (!object) return null;

  const item = toListItem(object, locale);
  const todayStatus = computeOpenStatus({
    is24Hours: object.is24Hours,
    openingHours: object.openingHours,
    status: object.status,
  });

  const today = getLocalNow().day;

  return {
    ...item,
    openStatus: todayStatus,
    description: pick(object.description, locale),
    website: object.website,
    openingHours: object.openingHours.map((hour) => ({
      ...hour,
      dayName: hour.dayOfWeek,
      isToday: hour.dayOfWeek === today,
    })),
    menu: object.menu.map((section) => ({
      id: section.id,
      name: pick(section.name, locale),
      items: section.items.map((menuItem) => ({
        id: menuItem.id,
        name: pick(menuItem.name, locale),
        description: pick(menuItem.description, locale),
        price: menuItem.price,
      })),
    })),
    reviews: reviewsForObject(object.id, object.reviewCount).map((review) => ({
      id: review.id,
      authorName: review.authorName,
      rating: review.rating,
      text: pick(review.text, locale),
      createdAt: review.createdAt,
      helpfulCount: review.helpfulCount,
    })),
    completenessScore: completenessScore(object),
  };
}

/** Bir xil subkategoriya va hududdagi yaqin obyektlar. */
export function getSimilarObjects(
  detail: ObjectDetail,
  locale: Locale,
  limit = 4,
): ObjectListItem[] {
  return OBJECTS.filter(
    (object) =>
      object.slug !== detail.slug &&
      object.status === "ACTIVE" &&
      subcategoryOf(object).slug === detail.subcategory.slug &&
      regionOf(object).slug === detail.region.slug,
  )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map((object) => toListItem(object, locale));
}

export function getAllObjectSlugs(): string[] {
  return OBJECTS.map((object) => object.slug);
}
