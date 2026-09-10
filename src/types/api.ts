/**
 * API contract (TZ 33–34, 42).
 *
 * Hozircha ma'lumot mock data-layer'dan keladi, lekin shakl kelajakdagi
 * `GET /api/v1/objects` javobi bilan bir xil. Backend tayyor bo'lganda
 * faqat `src/server/api/*` ichidagi implementatsiya almashadi.
 */

import type {
  AwardKey,
  GeoPoint,
  MenuSection,
  ObjectImage,
  ObjectStatus,
  OpeningHour,
  OpenStatus,
  PriceRange,
  Review,
  VerificationStatus,
} from "./domain";

/** Ro'yxatdagi obyekt — kartochka uchun yetarli minimal to'plam (TZ 9). */
export interface ObjectListItem {
  id: string;
  slug: string;
  name: string;
  category: { slug: string; name: string; icon: string };
  subcategory: { slug: string; name: string };
  region: { slug: string; name: string };
  address: string;
  location: GeoPoint;
  phone: string | null;
  rating: number;
  reviewCount: number;
  price: PriceRange | null;
  /** Foydalanuvchi lokatsiyasi berilgan bo'lsa — km, aks holda null. */
  distanceKm: number | null;
  openStatus: OpenStatus;
  services: Array<{ slug: string; name: string; icon: string }>;
  images: ObjectImage[];
  awards: AwardKey[];
  tags: string[];
  status: ObjectStatus;
  verification: {
    status: VerificationStatus;
    lastVerifiedAt: string;
  };
}

/** Batafsil sahifa uchun (TZ 13). */
export interface ObjectDetail extends ObjectListItem {
  description: string;
  website: string | null;
  openingHours: Array<OpeningHour & { dayName: string; isToday: boolean }>;
  menu: Array<{
    id: string;
    name: string;
    items: Array<{ id: string; name: string; description: string; price: number }>;
  }>;
  reviews: ReviewItem[];
  /** TZ 45 — ma'lumot to'liqligi. */
  completenessScore: number;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
  helpfulCount: number;
}

/** TZ 34 — sahifalash meta. */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export type SortKey =
  | "recommended"
  | "rating"
  | "reviews"
  | "price_asc"
  | "price_desc"
  | "distance"
  | "newest"
  | "popular";

export type OpenStateFilter = "all" | "open_now" | "24_7" | "closed" | "opens_later";

export interface ObjectQuery {
  q?: string;
  category?: string;
  subcategory?: string;
  region?: string;
  services?: string[];
  ratingMin?: number;
  priceLevels?: number[];
  priceMax?: number;
  openState?: OpenStateFilter;
  /** km — faqat lokatsiya berilganda ishlaydi. */
  distanceMax?: number;
  awards?: AwardKey[];
  sort?: SortKey;
  page?: number;
  limit?: number;
  /** Foydalanuvchi lokatsiyasi (masofa va distance-sort uchun). */
  lat?: number;
  lng?: number;
}

/** Filtrlar panelidagi hisoblagichlar — natijasiz filtrlarni ko'rsatmaslik uchun. */
export interface FacetCount {
  slug: string;
  name: string;
  icon?: string;
  count: number;
}

export interface ObjectSearchResult extends Paginated<ObjectListItem> {
  /**
   * Natija bo'sh bo'lganda: «ayni damda ochiq» filtri olib tashlansa nechta
   * obyekt topilishi. Bo'sh holatda foydali taklif ko'rsatish uchun (TZ 44).
   */
  relaxedTotal: number;
  facets: {
    categories: FacetCount[];
    regions: FacetCount[];
    services: FacetCount[];
    openNow: number;
    is24Hours: number;
  };
}

/** TZ 42 — yagona xato formati. */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}

export type { MenuSection, Review };
