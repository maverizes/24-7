import type { Category, Subcategory } from "@/types/domain";

/**
 * TZ 3 — asosiy modullar. Gov/admin uchun mo'ljallangan «Tahlil va monitoring»
 * moduli (TZ 3.8) ommaviy katalog kategoriyasi emas, shuning uchun bu ro'yxatga
 * kirmaydi: u rol bilan himoyalangan dashboard sifatida quriladi.
 */

interface RawCategory {
  id: string;
  slug: string;
  name: Category["name"];
  description: Category["description"];
  icon: string;
  priority: number;
  isNightModule?: boolean;
  isEmergency?: boolean;
  subcategories: Array<{ slug: string; name: Subcategory["name"] }>;
}

const raw: RawCategory[] = [
  {
    id: "category-emergency",
    slug: "shoshilinch",
    name: { uz: "Shoshilinch xizmatlar", ru: "Экстренные службы", en: "Emergency services" },
    description: {
      uz: "Tez yordam, shifoxona, navbatchi dorixona, IIB va yong‘in xizmati",
      ru: "Скорая помощь, больницы, дежурные аптеки, ОВД и пожарная служба",
      en: "Ambulance, hospitals, duty pharmacies, police and fire service",
    },
    icon: "siren",
    priority: 1,
    isEmergency: true,
    subcategories: [
      { slug: "tez-yordam", name: { uz: "Tez yordam", ru: "Скорая помощь", en: "Ambulance" } },
      { slug: "shifoxona", name: { uz: "Shifoxona", ru: "Больница", en: "Hospital" } },
      {
        slug: "navbatchi-dorixona",
        name: { uz: "Navbatchi dorixona", ru: "Дежурная аптека", en: "Duty pharmacy" },
      },
      { slug: "iib", name: { uz: "IIB bo‘limi", ru: "Отдел ОВД", en: "Police station" } },
      {
        slug: "yongin-xizmati",
        name: { uz: "Yong‘in xizmati", ru: "Пожарная служба", en: "Fire service" },
      },
      {
        slug: "favqulodda-xizmat",
        name: { uz: "Favqulodda xizmat", ru: "Служба ЧС", en: "Emergency response" },
      },
    ],
  },
  {
    id: "category-food",
    slug: "ovqatlanish",
    name: { uz: "Ovqatlanish", ru: "Питание", en: "Dining" },
    description: {
      uz: "Restoran, kafe, milliy taomlar, osh markazlari va choyxonalar",
      ru: "Рестораны, кафе, национальная кухня, ошхоны и чайханы",
      en: "Restaurants, cafés, national cuisine, plov centres and teahouses",
    },
    icon: "utensils",
    priority: 2,
    subcategories: [
      { slug: "restoran", name: { uz: "Restoran", ru: "Ресторан", en: "Restaurant" } },
      { slug: "kafe", name: { uz: "Kafe", ru: "Кафе", en: "Café" } },
      { slug: "fast-food", name: { uz: "Fast food", ru: "Фастфуд", en: "Fast food" } },
      {
        slug: "milliy-taomlar",
        name: { uz: "Milliy taomlar", ru: "Национальная кухня", en: "National cuisine" },
      },
      { slug: "osh-markazi", name: { uz: "Osh markazi", ru: "Ошхона", en: "Plov centre" } },
      { slug: "choyxona", name: { uz: "Choyxona", ru: "Чайхана", en: "Teahouse" } },
      { slug: "coffee-shop", name: { uz: "Coffee shop", ru: "Кофейня", en: "Coffee shop" } },
      { slug: "bar", name: { uz: "Bar", ru: "Бар", en: "Bar" } },
      { slug: "delivery", name: { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" } },
    ],
  },
  {
    id: "category-night",
    slug: "tungi-xizmatlar",
    name: { uz: "Tungi xizmatlar", ru: "Ночные услуги", en: "Night services" },
    description: {
      uz: "24/7 yoki tungi vaqtda ishlaydigan dorixona, YOQSH, avtoservis va taksi",
      ru: "Круглосуточные аптеки, АЗС, автосервис и такси",
      en: "24/7 pharmacies, petrol stations, car service and taxi",
    },
    icon: "moon",
    priority: 3,
    isNightModule: true,
    subcategories: [
      {
        slug: "sutkalik-dorixona",
        name: { uz: "Sutkalik dorixona", ru: "Круглосуточная аптека", en: "24h pharmacy" },
      },
      { slug: "yoqsh", name: { uz: "YOQSH", ru: "АЗС", en: "Petrol station" } },
      {
        slug: "avtoservis",
        name: { uz: "Avtomobil servisi", ru: "Автосервис", en: "Car service" },
      },
      {
        slug: "shina-xizmati",
        name: { uz: "Shina xizmati", ru: "Шиномонтаж", en: "Tyre service" },
      },
      { slug: "taksi", name: { uz: "Taksi", ru: "Такси", en: "Taxi" } },
      { slug: "avto-yordam", name: { uz: "Avto-yordam", ru: "Автопомощь", en: "Roadside help" } },
    ],
  },
  {
    id: "category-bakery",
    slug: "shirinliklar",
    name: { uz: "Shirinliklar va nonvoyxona", ru: "Сладости и пекарни", en: "Bakery and sweets" },
    description: {
      uz: "Nonvoyxona, qandolat, tort, desert va muzqaymoq",
      ru: "Пекарни, кондитерские, торты, десерты и мороженое",
      en: "Bakeries, confectionery, cakes, desserts and ice cream",
    },
    icon: "croissant",
    priority: 4,
    subcategories: [
      { slug: "nonvoyxona", name: { uz: "Nonvoyxona", ru: "Пекарня", en: "Bakery" } },
      { slug: "qandolat", name: { uz: "Qandolat", ru: "Кондитерская", en: "Confectionery" } },
      { slug: "tort", name: { uz: "Tortlar", ru: "Торты", en: "Cakes" } },
      { slug: "desert", name: { uz: "Desert", ru: "Десерты", en: "Desserts" } },
      { slug: "muzqaymoq", name: { uz: "Muzqaymoq", ru: "Мороженое", en: "Ice cream" } },
    ],
  },
  {
    id: "category-household",
    slug: "maishiy-xizmat",
    name: { uz: "Maishiy xizmat", ru: "Бытовые услуги", en: "Household services" },
    description: {
      uz: "Sartaroshxona, go‘zallik saloni, kir yuvish, ta’mirlash xizmatlari",
      ru: "Парикмахерские, салоны красоты, прачечные, ремонтные услуги",
      en: "Barbers, beauty salons, laundry and repair services",
    },
    icon: "scissors",
    priority: 5,
    subcategories: [
      { slug: "sartaroshxona", name: { uz: "Sartaroshxona", ru: "Парикмахерская", en: "Barber" } },
      {
        slug: "beauty-salon",
        name: { uz: "Go‘zallik saloni", ru: "Салон красоты", en: "Beauty salon" },
      },
      { slug: "kir-yuvish", name: { uz: "Kir yuvish", ru: "Прачечная", en: "Laundry" } },
      {
        slug: "kimyoviy-tozalash",
        name: { uz: "Kimyoviy tozalash", ru: "Химчистка", en: "Dry cleaning" },
      },
      { slug: "tikuvchilik", name: { uz: "Tikuvchilik", ru: "Ателье", en: "Tailoring" } },
      {
        slug: "poyabzal-tamiri",
        name: { uz: "Poyabzal ta’miri", ru: "Ремонт обуви", en: "Shoe repair" },
      },
      {
        slug: "texnika-tamiri",
        name: { uz: "Texnika ta’miri", ru: "Ремонт техники", en: "Electronics repair" },
      },
    ],
  },
  {
    id: "category-leisure",
    slug: "dam-olish",
    name: { uz: "Joylashuv va dam olish", ru: "Отдых и развлечения", en: "Leisure" },
    description: {
      uz: "Park, dam olish maskani, sport obyektlari va bolalar markazlari",
      ru: "Парки, зоны отдыха, спортивные объекты и детские центры",
      en: "Parks, recreation areas, sports venues and family entertainment",
    },
    icon: "trees",
    priority: 6,
    subcategories: [
      { slug: "park", name: { uz: "Park", ru: "Парк", en: "Park" } },
      {
        slug: "dam-olish-maskani",
        name: { uz: "Dam olish maskani", ru: "Зона отдыха", en: "Recreation area" },
      },
      { slug: "plyaj", name: { uz: "Plyaj", ru: "Пляж", en: "Beach" } },
      {
        slug: "restoran-kompleks",
        name: { uz: "Restoran-kompleks", ru: "Ресторанный комплекс", en: "Dining complex" },
      },
      {
        slug: "bolalar-markazi",
        name: { uz: "Bolalar markazi", ru: "Детский центр", en: "Kids centre" },
      },
      {
        slug: "sport-obyekti",
        name: { uz: "Sport obyekti", ru: "Спортивный объект", en: "Sports venue" },
      },
      { slug: "piknik", name: { uz: "Piknik hududi", ru: "Зона пикника", en: "Picnic area" } },
    ],
  },
  {
    id: "category-tourism",
    slug: "turizm",
    name: { uz: "Turizm", ru: "Туризм", en: "Tourism" },
    description: {
      uz: "Tarixiy obyektlar, tog‘ maskanlari, mehmonxona va sanatoriylar",
      ru: "Исторические объекты, горные курорты, гостиницы и санатории",
      en: "Historic sites, mountain resorts, hotels and sanatoriums",
    },
    icon: "mountain",
    priority: 7,
    subcategories: [
      {
        slug: "tarixiy-obyekt",
        name: { uz: "Tarixiy obyekt", ru: "Исторический объект", en: "Historic site" },
      },
      {
        slug: "turistik-maskan",
        name: { uz: "Turistik maskan", ru: "Туристическое место", en: "Tourist attraction" },
      },
      {
        slug: "tog-maskani",
        name: { uz: "Tog‘ maskani", ru: "Горный курорт", en: "Mountain resort" },
      },
      { slug: "mehmonxona", name: { uz: "Mehmonxona", ru: "Гостиница", en: "Hotel" } },
      { slug: "guest-house", name: { uz: "Guest house", ru: "Гостевой дом", en: "Guest house" } },
      { slug: "sanatoriy", name: { uz: "Sanatoriy", ru: "Санаторий", en: "Sanatorium" } },
      { slug: "ekskursiya", name: { uz: "Ekskursiya", ru: "Экскурсия", en: "Excursion" } },
    ],
  },
];

export const CATEGORIES: Category[] = raw.map((category) => ({
  ...category,
  isNightModule: category.isNightModule ?? false,
  isEmergency: category.isEmergency ?? false,
  subcategories: category.subcategories.map((sub) => ({
    id: `${category.id}--${sub.slug}`,
    slug: sub.slug,
    categoryId: category.id,
    name: sub.name,
  })),
}));
