/**
 * 24/7 — domain model.
 *
 * Bu tiplar TZ 30–32 bo'limlaridagi entity'larga mos keladi va kelajakdagi
 * backend (NestJS + PostgreSQL) entity'lari uchun yagona manba bo'lib xizmat
 * qiladi. Frontend faqat shu shakldagi ma'lumot bilan ishlaydi.
 */

export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Ko'p tilli matn. Dinamik kontent ham tarjima qilinadi (TZ 24). */
export type LocalizedText = Record<Locale, string>;

export const TIMEZONE = "Asia/Tashkent" as const;
export type Timezone = typeof TIMEZONE;

/* ------------------------------------------------------------------ */
/* Hudud                                                               */
/* ------------------------------------------------------------------ */

export type RegionKind = "DISTRICT" | "CITY";

export interface Region {
  id: string;
  slug: string;
  name: LocalizedText;
  kind: RegionKind;
  /** Ota hudud (viloyat). Ierarxiya DB'da boshqariladi. */
  parentId: string | null;
  center: GeoPoint;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

/* ------------------------------------------------------------------ */
/* Kategoriya                                                          */
/* ------------------------------------------------------------------ */

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Ikonka kaliti — UI ikonka registrida hal qilinadi. */
  icon: string;
  /** Modul ustuvorligi: shoshilinch xizmatlar yuqorida turadi (TZ 3.7). */
  priority: number;
  /** Tungi/24-soatlik xizmatlar moduli (TZ 3.3). */
  isNightModule: boolean;
  /** Shoshilinch xizmatlar moduli — alohida UX (TZ 3.7). */
  isEmergency: boolean;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  categoryId: string;
  name: LocalizedText;
}

/* ------------------------------------------------------------------ */
/* Xizmat sharoitlari                                                  */
/* ------------------------------------------------------------------ */

export interface ServiceDefinition {
  id: string;
  slug: string;
  name: LocalizedText;
  icon: string;
}

/* ------------------------------------------------------------------ */
/* Ish vaqti (TZ 32)                                                   */
/* ------------------------------------------------------------------ */

export const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export interface OpeningHour {
  dayOfWeek: DayOfWeek;
  /** "HH:mm" mahalliy vaqt (Asia/Tashkent). */
  openTime: string;
  /** "HH:mm". openTime'dan kichik bo'lsa — tungi interval (22:00–02:00). */
  closeTime: string;
  isClosed: boolean;
  is24Hours: boolean;
}

/**
 * Backend qaytaradigan canonical holat (TZ 10).
 * Frontend `isOpenNow`ni mustaqil hisoblamaydi.
 */
export interface OpenStatus {
  isOpenNow: boolean;
  is24Hours: boolean;
  /** Yopiq bo'lsa — keyingi ochilish vaqti, "HH:mm". */
  opensAt: string | null;
  /** Ochiq bo'lsa — yopilish vaqti, "HH:mm". */
  closesAt: string | null;
  /** Keyingi ochilish bugun emas, ertaga/keyinroq bo'lsa. */
  opensOn: DayOfWeek | null;
  timezone: Timezone;
}

/* ------------------------------------------------------------------ */
/* Obyekt (TZ 31)                                                      */
/* ------------------------------------------------------------------ */

export type ObjectStatus = "ACTIVE" | "TEMPORARILY_CLOSED" | "PERMANENTLY_CLOSED";

/** TZ 18 — ma'lumot yangiligi. */
export type VerificationStatus = "VERIFIED" | "STALE" | "NEEDS_REVIEW" | "SUSPENDED";

export type AwardKey =
  | "CHOICE"
  | "TOP_100"
  | "RECOMMENDED"
  | "TRUSTED";

export interface Award {
  id: string;
  slug: string;
  key: AwardKey;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  year: number;
}

export interface ObjectImage {
  id: string;
  /** Bo'sh bo'lsa — UI placeholder ko'rsatadi. */
  url: string | null;
  alt: LocalizedText;
  isCover: boolean;
}

/** Narx diapazoni. Ba'zi obyektlarga tegishli emas (TZ 13). */
export interface PriceRange {
  currency: "UZS";
  dayMin: number;
  dayMax: number;
  eveningMin: number | null;
  eveningMax: number | null;
  /** 1..4 → $ .. $$$$ */
  level: 1 | 2 | 3 | 4;
}

export interface MenuItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
}

export interface MenuSection {
  id: string;
  name: LocalizedText;
  items: MenuItem[];
}

export interface Review {
  id: string;
  objectId: string;
  authorName: string;
  rating: number;
  text: LocalizedText;
  createdAt: string;
  helpfulCount: number;
  status: "PUBLISHED" | "PENDING" | "REJECTED";
}

/** Bazadagi obyekt yozuvi. */
export interface PlaceObject {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  subcategoryId: string;
  regionId: string;
  address: LocalizedText;
  location: GeoPoint;
  phone: string | null;
  website: string | null;
  rating: number;
  reviewCount: number;
  price: PriceRange | null;
  is24Hours: boolean;
  openingHours: OpeningHour[];
  serviceIds: string[];
  images: ObjectImage[];
  menu: MenuSection[];
  awards: AwardKey[];
  tags: string[];
  status: ObjectStatus;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}
