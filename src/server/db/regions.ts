import type { Region } from "@/types/domain";

/**
 * Toshkent viloyati: 15 ta tuman + 7 ta shahar (TZ 2).
 * Koordinatalar — ma'muriy markazlarning taxminiy nuqtalari.
 */

export const PROVINCE_ID = "region-tashkent-province";

const districts: Array<Omit<Region, "kind" | "parentId">> = [
  {
    id: "district-bekobod",
    slug: "bekobod-tumani",
    name: { uz: "Bekobod tumani", ru: "Бекабадский район", en: "Bekobod District" },
    center: { lat: 40.26, lng: 69.29 },
  },
  {
    id: "district-bostonliq",
    slug: "bostonliq-tumani",
    name: { uz: "Bo‘stonliq tumani", ru: "Бостанлыкский район", en: "Bo‘stonliq District" },
    center: { lat: 41.5578, lng: 69.7681 },
  },
  {
    id: "district-boka",
    slug: "boka-tumani",
    name: { uz: "Bo‘ka tumani", ru: "Букинский район", en: "Bo‘ka District" },
    center: { lat: 40.8114, lng: 69.205 },
  },
  {
    id: "district-chinoz",
    slug: "chinoz-tumani",
    name: { uz: "Chinoz tumani", ru: "Чиназский район", en: "Chinoz District" },
    center: { lat: 40.9364, lng: 68.7639 },
  },
  {
    id: "district-oqqorgon",
    slug: "oqqorgon-tumani",
    name: { uz: "Oqqo‘rg‘on tumani", ru: "Аккурганский район", en: "Oqqo‘rg‘on District" },
    center: { lat: 40.91, lng: 69.04 },
  },
  {
    id: "district-ohangaron",
    slug: "ohangaron-tumani",
    name: { uz: "Ohangaron tumani", ru: "Ахангаранский район", en: "Ohangaron District" },
    center: { lat: 40.9089, lng: 69.6383 },
  },
  {
    id: "district-parkent",
    slug: "parkent-tumani",
    name: { uz: "Parkent tumani", ru: "Паркентский район", en: "Parkent District" },
    center: { lat: 41.295, lng: 69.6772 },
  },
  {
    id: "district-piskent",
    slug: "piskent-tumani",
    name: { uz: "Piskent tumani", ru: "Пскентский район", en: "Piskent District" },
    center: { lat: 40.8931, lng: 69.3403 },
  },
  {
    id: "district-quyichirchiq",
    slug: "quyichirchiq-tumani",
    name: { uz: "Quyichirchiq tumani", ru: "Куйичирчикский район", en: "Quyichirchiq District" },
    center: { lat: 40.9906, lng: 69.2503 },
  },
  {
    id: "district-yuqorichirchiq",
    slug: "yuqorichirchiq-tumani",
    name: {
      uz: "Yuqorichirchiq tumani",
      ru: "Юкоричирчикский район",
      en: "Yuqorichirchiq District",
    },
    center: { lat: 41.05, lng: 69.4667 },
  },
  {
    id: "district-ortachirchiq",
    slug: "ortachirchiq-tumani",
    name: { uz: "O‘rtachirchiq tumani", ru: "Уртачирчикский район", en: "O‘rtachirchiq District" },
    center: { lat: 41.04, lng: 69.33 },
  },
  {
    id: "district-yangiyol",
    slug: "yangiyol-tumani",
    name: { uz: "Yangiyo‘l tumani", ru: "Янгиюльский район", en: "Yangiyo‘l District" },
    center: { lat: 41.1128, lng: 69.0472 },
  },
  {
    id: "district-zangiota",
    slug: "zangiota-tumani",
    name: { uz: "Zangiota tumani", ru: "Зангиатинский район", en: "Zangiota District" },
    center: { lat: 41.1667, lng: 69.15 },
  },
  {
    id: "district-qibray",
    slug: "qibray-tumani",
    name: { uz: "Qibray tumani", ru: "Кибрайский район", en: "Qibray District" },
    center: { lat: 41.3906, lng: 69.4569 },
  },
  {
    id: "district-toshkent",
    slug: "toshkent-tumani",
    name: { uz: "Toshkent tumani", ru: "Ташкентский район", en: "Toshkent District" },
    center: { lat: 41.22, lng: 69.14 },
  },
];

const cities: Array<Omit<Region, "kind" | "parentId">> = [
  {
    id: "city-nurafshon",
    slug: "nurafshon",
    name: { uz: "Nurafshon shahri", ru: "город Нурафшан", en: "Nurafshon City" },
    center: { lat: 41.0167, lng: 69.35 },
  },
  {
    id: "city-olmaliq",
    slug: "olmaliq",
    name: { uz: "Olmaliq shahri", ru: "город Алмалык", en: "Olmaliq City" },
    center: { lat: 40.8446, lng: 69.5983 },
  },
  {
    id: "city-angren",
    slug: "angren",
    name: { uz: "Angren shahri", ru: "город Ангрен", en: "Angren City" },
    center: { lat: 41.0167, lng: 70.1436 },
  },
  {
    id: "city-bekobod",
    slug: "bekobod-shahri",
    name: { uz: "Bekobod shahri", ru: "город Бекабад", en: "Bekobod City" },
    center: { lat: 40.2206, lng: 69.2694 },
  },
  {
    id: "city-chirchiq",
    slug: "chirchiq",
    name: { uz: "Chirchiq shahri", ru: "город Чирчик", en: "Chirchiq City" },
    center: { lat: 41.4689, lng: 69.5822 },
  },
  {
    id: "city-ohangaron",
    slug: "ohangaron-shahri",
    name: { uz: "Ohangaron shahri", ru: "город Ахангаран", en: "Ohangaron City" },
    center: { lat: 40.9089, lng: 69.6383 },
  },
  {
    id: "city-yangiyol",
    slug: "yangiyol-shahri",
    name: { uz: "Yangiyo‘l shahri", ru: "город Янгиюль", en: "Yangiyo‘l City" },
    center: { lat: 41.1128, lng: 69.0472 },
  },
];

export const REGIONS: Region[] = [
  ...districts.map((district) => ({
    ...district,
    kind: "DISTRICT" as const,
    parentId: PROVINCE_ID,
  })),
  ...cities.map((city) => ({ ...city, kind: "CITY" as const, parentId: PROVINCE_ID })),
];

export const PROVINCE = {
  id: PROVINCE_ID,
  slug: "toshkent-viloyati",
  name: { uz: "Toshkent viloyati", ru: "Ташкентская область", en: "Tashkent Region" },
  center: { lat: 41.05, lng: 69.4 },
};
