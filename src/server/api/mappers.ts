import type { Locale, LocalizedText, PlaceObject, GeoPoint } from "@/types/domain";
import type { ObjectListItem } from "@/types/api";
import { CATEGORIES } from "@/server/db/categories";
import { REGIONS } from "@/server/db/regions";
import { SERVICES } from "@/server/db/services";
import { computeOpenStatus } from "@/server/open-hours";
import { distanceKm } from "@/lib/geo";

/** Ko'p tilli matndan joriy til qiymatini oladi. */
export function pick(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.uz;
}

const categoryById = new Map(CATEGORIES.map((category) => [category.id, category]));
const subcategoryById = new Map(
  CATEGORIES.flatMap((category) => category.subcategories.map((sub) => [sub.id, sub] as const)),
);
const regionById = new Map(REGIONS.map((region) => [region.id, region]));
const serviceById = new Map(SERVICES.map((service) => [service.id, service]));

export function categoryOf(object: PlaceObject) {
  const category = categoryById.get(object.categoryId);
  if (!category) throw new Error(`Kategoriya topilmadi: ${object.categoryId}`);
  return category;
}

export function subcategoryOf(object: PlaceObject) {
  const subcategory = subcategoryById.get(object.subcategoryId);
  if (!subcategory) throw new Error(`Subkategoriya topilmadi: ${object.subcategoryId}`);
  return subcategory;
}

export function regionOf(object: PlaceObject) {
  const region = regionById.get(object.regionId);
  if (!region) throw new Error(`Hudud topilmadi: ${object.regionId}`);
  return region;
}

/** DB yozuvi → API javobi. `isOpenNow` shu yerda, server tomonida hisoblanadi. */
export function toListItem(
  object: PlaceObject,
  locale: Locale,
  origin?: GeoPoint,
  now?: Date,
): ObjectListItem {
  const category = categoryOf(object);
  const subcategory = subcategoryOf(object);
  const region = regionOf(object);

  return {
    id: object.id,
    slug: object.slug,
    name: pick(object.name, locale),
    category: {
      slug: category.slug,
      name: pick(category.name, locale),
      icon: category.icon,
    },
    subcategory: { slug: subcategory.slug, name: pick(subcategory.name, locale) },
    region: { slug: region.slug, name: pick(region.name, locale) },
    address: pick(object.address, locale),
    location: object.location,
    phone: object.phone,
    rating: object.rating,
    reviewCount: object.reviewCount,
    price: object.price,
    distanceKm: origin
      ? Number(distanceKm(origin, object.location).toFixed(2))
      : null,
    openStatus: computeOpenStatus({
      is24Hours: object.is24Hours,
      openingHours: object.openingHours,
      status: object.status,
      now,
    }),
    services: object.serviceIds
      .map((id) => serviceById.get(id))
      .filter((service) => service !== undefined)
      .map((service) => ({
        slug: service.slug,
        name: pick(service.name, locale),
        icon: service.icon,
      })),
    images: object.images,
    awards: object.awards,
    tags: object.tags,
    status: object.status,
    verification: {
      status: object.verificationStatus,
      lastVerifiedAt: object.lastVerifiedAt,
    },
  };
}
