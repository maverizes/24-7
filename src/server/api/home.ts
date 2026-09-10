import type { Locale } from "@/types/domain";
import type { ObjectListItem } from "@/types/api";
import { CATEGORIES } from "@/server/db/categories";
import { OBJECTS } from "@/server/db/objects";
import { computeOpenStatus } from "@/server/open-hours";
import { toListItem } from "./mappers";
import {
  getCategories,
  getPlatformStats,
  getRegions,
  type CategorySummary,
  type RegionSummary,
} from "./taxonomy";

/** Bosh sahifa uchun barcha ma'lumot bir joyda (TZ 6). */
export interface HomeData {
  stats: ReturnType<typeof getPlatformStats>;
  categories: CategorySummary[];
  districts: RegionSummary[];
  cities: RegionSummary[];
  nightServices: ObjectListItem[];
  emergencyServices: ObjectListItem[];
  awardWinners: ObjectListItem[];
  popular: ObjectListItem[];
}

const emergencyCategoryId = CATEGORIES.find((category) => category.isEmergency)?.id;
const nightCategoryId = CATEGORIES.find((category) => category.isNightModule)?.id;

function isOpen(objectId: string, now: Date): boolean {
  const object = OBJECTS.find((item) => item.id === objectId);
  if (!object) return false;
  return computeOpenStatus({
    is24Hours: object.is24Hours,
    openingHours: object.openingHours,
    status: object.status,
    now,
  }).isOpenNow;
}

export function getHomeData(locale: Locale, now = new Date()): HomeData {
  const regions = getRegions(locale, now);

  const nightServices = OBJECTS.filter(
    (object) =>
      object.status === "ACTIVE" &&
      object.categoryId === nightCategoryId &&
      object.reviewCount > 20,
  )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map((object) => toListItem(object, locale, undefined, now));

  const emergencyServices = OBJECTS.filter(
    (object) => object.categoryId === emergencyCategoryId && object.status === "ACTIVE",
  )
    .sort((a, b) => a.name.uz.localeCompare(b.name.uz))
    .slice(0, 6)
    .map((object) => toListItem(object, locale, undefined, now));

  const awardWinners = OBJECTS.filter(
    (object) => object.awards.includes("CHOICE") && object.status === "ACTIVE",
  )
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 6)
    .map((object) => toListItem(object, locale, undefined, now));

  const popular = OBJECTS.filter(
    (object) =>
      object.status === "ACTIVE" &&
      object.reviewCount > 40 &&
      object.categoryId !== emergencyCategoryId &&
      isOpen(object.id, now),
  )
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6)
    .map((object) => toListItem(object, locale, undefined, now));

  return {
    stats: getPlatformStats(now),
    categories: getCategories(locale, now),
    districts: regions.filter((region) => region.kind === "DISTRICT"),
    cities: regions.filter((region) => region.kind === "CITY"),
    nightServices,
    emergencyServices,
    awardWinners,
    popular,
  };
}
