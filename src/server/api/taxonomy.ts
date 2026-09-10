import type { Locale } from "@/types/domain";
import type { ObjectListItem } from "@/types/api";
import { CATEGORIES } from "@/server/db/categories";
import { OBJECTS } from "@/server/db/objects";
import { PROVINCE, REGIONS } from "@/server/db/regions";
import { SERVICES } from "@/server/db/services";
import { AWARD_LIST } from "@/server/db/awards";
import { computeOpenStatus } from "@/server/open-hours";
import { pick, toListItem } from "./mappers";

/** Kategoriya, hudud va xizmat ma'lumotnomalari — hisoblagichlari bilan. */

export interface CategorySummary {
  slug: string;
  name: string;
  description: string;
  icon: string;
  isEmergency: boolean;
  isNightModule: boolean;
  count: number;
  openNowCount: number;
  subcategories: Array<{ slug: string; name: string; count: number }>;
}

export interface RegionSummary {
  slug: string;
  name: string;
  kind: "DISTRICT" | "CITY";
  count: number;
  openNowCount: number;
  nightCount: number;
  awardCount: number;
  center: { lat: number; lng: number };
}

interface Counters {
  total: number;
  openNow: number;
  is24Hours: number;
  night: number;
  awards: number;
}

function emptyCounters(): Counters {
  return { total: 0, openNow: 0, is24Hours: 0, night: 0, awards: 0 };
}

const nightCategoryIds = new Set(
  CATEGORIES.filter((category) => category.isNightModule).map((category) => category.id),
);

/**
 * Barcha hisoblagichlar bir marta aylanishda yig'iladi — 900+ obyekt bo'yicha
 * har bir sahifa uchun qayta-qayta filtrlashning oldini oladi.
 */
function collectCounters(now: Date) {
  const byRegion = new Map<string, Counters>();
  const byCategory = new Map<string, Counters>();
  const bySubcategory = new Map<string, number>();
  const totals = emptyCounters();

  for (const object of OBJECTS) {
    const status = computeOpenStatus({
      is24Hours: object.is24Hours,
      openingHours: object.openingHours,
      status: object.status,
      now,
    });

    const region = byRegion.get(object.regionId) ?? emptyCounters();
    const category = byCategory.get(object.categoryId) ?? emptyCounters();
    const isNight = nightCategoryIds.has(object.categoryId);
    const hasAward = object.awards.length > 0;

    for (const counter of [region, category, totals]) {
      counter.total += 1;
      if (status.isOpenNow) counter.openNow += 1;
      if (status.is24Hours) counter.is24Hours += 1;
      if (isNight) counter.night += 1;
      if (hasAward) counter.awards += 1;
    }

    byRegion.set(object.regionId, region);
    byCategory.set(object.categoryId, category);
    bySubcategory.set(object.subcategoryId, (bySubcategory.get(object.subcategoryId) ?? 0) + 1);
  }

  return { byRegion, byCategory, bySubcategory, totals };
}

export function getPlatformStats(now = new Date()) {
  const { totals } = collectCounters(now);
  return {
    total: totals.total,
    openNow: totals.openNow,
    is24Hours: totals.is24Hours,
    night: totals.night,
    awards: totals.awards,
    regions: REGIONS.length,
  };
}

export function getCategories(locale: Locale, now = new Date()): CategorySummary[] {
  const { byCategory, bySubcategory } = collectCounters(now);

  return CATEGORIES.map((category) => {
    const counters = byCategory.get(category.id) ?? emptyCounters();
    return {
      slug: category.slug,
      name: pick(category.name, locale),
      description: pick(category.description, locale),
      icon: category.icon,
      isEmergency: category.isEmergency,
      isNightModule: category.isNightModule,
      count: counters.total,
      openNowCount: counters.openNow,
      subcategories: category.subcategories.map((sub) => ({
        slug: sub.slug,
        name: pick(sub.name, locale),
        count: bySubcategory.get(sub.id) ?? 0,
      })),
    };
  });
}

export function getCategoryBySlug(slug: string, locale: Locale): CategorySummary | null {
  return getCategories(locale).find((category) => category.slug === slug) ?? null;
}

export function getRegions(locale: Locale, now = new Date()): RegionSummary[] {
  const { byRegion } = collectCounters(now);

  return REGIONS.map((region) => {
    const counters = byRegion.get(region.id) ?? emptyCounters();
    return {
      slug: region.slug,
      name: pick(region.name, locale),
      kind: region.kind,
      count: counters.total,
      openNowCount: counters.openNow,
      nightCount: counters.night,
      awardCount: counters.awards,
      center: region.center,
    };
  });
}

export function getRegionBySlug(slug: string, locale: Locale): RegionSummary | null {
  return getRegions(locale).find((region) => region.slug === slug) ?? null;
}

/** Hudud sahifasi uchun kategoriya kesimi (TZ 15). */
export function getRegionCategoryBreakdown(regionSlug: string, locale: Locale) {
  const region = REGIONS.find((item) => item.slug === regionSlug);
  if (!region) return [];

  const now = new Date();
  return CATEGORIES.map((category) => {
    const objects = OBJECTS.filter(
      (object) => object.regionId === region.id && object.categoryId === category.id,
    );
    const openNow = objects.filter(
      (object) =>
        computeOpenStatus({
          is24Hours: object.is24Hours,
          openingHours: object.openingHours,
          status: object.status,
          now,
        }).isOpenNow,
    ).length;

    return {
      slug: category.slug,
      name: pick(category.name, locale),
      icon: category.icon,
      isEmergency: category.isEmergency,
      count: objects.length,
      openNowCount: openNow,
    };
  }).filter((category) => category.count > 0);
}

export function getServices(locale: Locale) {
  return SERVICES.map((service) => ({
    slug: service.slug,
    name: pick(service.name, locale),
    icon: service.icon,
  }));
}

export function getAwards(locale: Locale) {
  return AWARD_LIST.map((award) => ({
    key: award.key,
    slug: award.slug,
    name: pick(award.name, locale),
    description: pick(award.description, locale),
    icon: award.icon,
    year: award.year,
  }));
}

export function getProvince(locale: Locale) {
  return { slug: PROVINCE.slug, name: pick(PROVINCE.name, locale), center: PROVINCE.center };
}

/** Hudud yoki kategoriya sahifasidagi «ommabop obyektlar» bloki. */
export function getTopObjects(
  locale: Locale,
  filter: { regionSlug?: string; categorySlug?: string },
  limit = 6,
): ObjectListItem[] {
  const regionId = filter.regionSlug
    ? REGIONS.find((region) => region.slug === filter.regionSlug)?.id
    : undefined;
  const categoryId = filter.categorySlug
    ? CATEGORIES.find((category) => category.slug === filter.categorySlug)?.id
    : undefined;

  return OBJECTS.filter(
    (object) =>
      object.status === "ACTIVE" &&
      object.reviewCount > 0 &&
      (!regionId || object.regionId === regionId) &&
      (!categoryId || object.categoryId === categoryId),
  )
    .sort((a, b) => b.rating * Math.log10(b.reviewCount + 10) - a.rating * Math.log10(a.reviewCount + 10))
    .slice(0, limit)
    .map((object) => toListItem(object, locale));
}
