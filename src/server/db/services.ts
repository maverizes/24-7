import type { ServiceDefinition } from "@/types/domain";

/** TZ 11 — xizmat sharoitlari. Filtrlar va obyekt sahifasida ishlatiladi. */
export const SERVICES: ServiceDefinition[] = [
  {
    id: "service-wifi",
    slug: "wifi",
    name: { uz: "Wi-Fi", ru: "Wi-Fi", en: "Wi-Fi" },
    icon: "wifi",
  },
  {
    id: "service-parking",
    slug: "parking",
    name: { uz: "Parkovka", ru: "Парковка", en: "Parking" },
    icon: "parking",
  },
  {
    id: "service-card",
    slug: "karta",
    name: { uz: "Karta orqali to‘lov", ru: "Оплата картой", en: "Card payment" },
    icon: "card",
  },
  {
    id: "service-cash",
    slug: "naqd",
    name: { uz: "Naqd to‘lov", ru: "Оплата наличными", en: "Cash payment" },
    icon: "cash",
  },
  {
    id: "service-kids",
    slug: "bolalar-uchun",
    name: { uz: "Bolalar uchun", ru: "Для детей", en: "Kids friendly" },
    icon: "kids",
  },
  {
    id: "service-delivery",
    slug: "yetkazib-berish",
    name: { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" },
    icon: "delivery",
  },
  {
    id: "service-wheelchair",
    slug: "nogironlar-uchun",
    name: { uz: "Nogironlar uchun qulay", ru: "Доступно для инвалидов", en: "Wheelchair access" },
    icon: "wheelchair",
  },
  {
    id: "service-outdoor",
    slug: "ochiq-havoda",
    name: { uz: "Ochiq havoda", ru: "Открытая терраса", en: "Outdoor seating" },
    icon: "outdoor",
  },
  {
    id: "service-family",
    slug: "oilaviy",
    name: { uz: "Oilaviy", ru: "Для семей", en: "Family friendly" },
    icon: "family",
  },
];
