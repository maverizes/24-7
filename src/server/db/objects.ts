import {
  DAYS_OF_WEEK,
  type AwardKey,
  type DayOfWeek,
  type LocalizedText,
  type ObjectImage,
  type OpeningHour,
  type PlaceObject,
  type PriceRange,
  type Region,
  type VerificationStatus,
} from "@/types/domain";
import { CATEGORIES } from "./categories";
import { REGIONS } from "./regions";
import { SERVICES } from "./services";

/**
 * Deterministik demo ma'lumotlar generatori.
 *
 * Har bir build'da bir xil natija beradi (seed'li PRNG), shuning uchun
 * SSR va klient bir xil ma'lumotni ko'radi. Backend ulanganda bu fayl
 * migration seed'iga aylanadi.
 */

/** Ma'lumot yangiligi hisob-kitobi uchun mustahkam tayanch sana. */
const ANCHOR_DATE = new Date("2026-09-10T00:00:00+05:00");

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Rng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  chance(probability: number): boolean;
}

function createRng(seed: number): Rng {
  const random = mulberry32(seed);
  const next = () => random();
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (items) => items[Math.floor(next() * items.length)],
    chance: (probability) => next() < probability,
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/* ------------------------------------------------------------------ */
/* Nom havzalari                                                       */
/* ------------------------------------------------------------------ */

/** Tijorat obyektlari brend nomlari — barcha tillarda lotin yozuvida. */
const BRANDS: Record<string, string[]> = {
  "category-food": [
    "Registon", "Bahor", "Chinor", "Guliston", "Oq Saroy", "Zarafshon", "Anhor",
    "Lazzat", "Do‘stlik", "Navro‘z", "Choshtepa", "Oltin Vodiy", "Mezon",
    "Tanovul", "Beshqozon", "Farovon", "Sharq", "Buloq", "Diyor", "Yulduz",
  ],
  "category-bakery": [
    "Shirin", "Tandir Non", "Qandolat Uyi", "Sweet House", "Nur Bakery",
    "Sarvinoz", "Oq Tandir", "Shakar", "Tortlar Uyi", "Nozima", "Baraka Non",
    "Malika Cake",
  ],
  "category-night": [
    "24 Dorixona", "Oq Dori", "Uz Petrol", "Neft Servis", "Avto Servis 24",
    "Shina Master", "Taksi 24", "Yo‘l Yordam", "Night Pharm", "Turbo Servis",
    "Avtoline", "Express Taxi",
  ],
  "category-household": [
    "Barber House", "Zebo Salon", "Nafis", "Toza Kir", "Master Servis",
    "Tez Ta’mir", "Style Barber", "Malika Salon", "Oq Bulut", "Servis Plus",
    "Usta Aka", "Gulnora Atelye",
  ],
  "category-leisure": [
    "Chorbog‘", "Yoshlar Bog‘i", "Sport Majmuasi", "Bolalar Olami", "Yashil Vodiy",
    "Anhor Piknik", "Suv Parki", "Oila Bog‘i", "Sog‘lom Avlod", "Zilol",
  ],
  "category-tourism": [
    "Chimyon", "Beldersoy", "Charvoq Resort", "Amirsoy", "Humsan", "Gulshan",
    "Oqtosh", "Tog‘ Bulog‘i", "Nur Hotel", "Vodiy Resort", "Sayyoh", "Zangiota",
  ],
};

/**
 * Ba'zi subkategoriyalarda brend nomi xizmat turini bildiradi — bunday
 * hollarda umumiy kategoriya havzasi o'rniga aniqroq havza ishlatiladi.
 */
const SUBCATEGORY_BRANDS: Record<string, string[]> = {
  "sutkalik-dorixona": ["24 Dorixona", "Oq Dori", "Night Pharm", "Shifo Dori", "Salomat"],
  yoqsh: ["Uz Petrol", "Neft Servis", "Avto Yoqilg‘i", "Energy Oil", "Vodiy Petrol"],
  avtoservis: ["Avto Servis 24", "Turbo Servis", "Avtoline", "Usta Motors"],
  "shina-xizmati": ["Shina Master", "Balans Servis", "Profi Shina"],
  taksi: ["Taksi 24", "Express Taxi", "Shahar Taksi", "Tez Taksi"],
  "avto-yordam": ["Yo‘l Yordam", "Evakuator 24", "Avto Yordam Servis"],
  "osh-markazi": ["Beshqozon", "Bek Osh Markazi", "Choshtepa Osh", "Oltin Qozon"],
  choyxona: ["Bahor Choyxona", "Chinor Choyxona", "Anhor Choyxona", "Buloq"],
  "coffee-shop": ["Mezon Coffee", "Nur Coffee", "Vodiy Coffee", "Chinor Coffee"],
  nonvoyxona: ["Tandir Non", "Oq Tandir", "Baraka Non", "Non Uyi"],
  mehmonxona: ["Nur Hotel", "Vodiy Hotel", "Chimyon Hotel", "Sayyoh Hotel"],
  "guest-house": ["Humsan Guest House", "Tog‘ Bulog‘i", "Oqtosh Guest House"],
  sanatoriy: ["Gulshan Sanatoriysi", "Zilol Sanatoriy", "Shifo Sanatoriysi"],
  "tog-maskani": ["Chimyon", "Beldersoy", "Amirsoy", "Oqtosh"],
  sartaroshxona: ["Barber House", "Style Barber", "Usta Aka"],
  "beauty-salon": ["Zebo Salon", "Malika Salon", "Nafis"],
  "kir-yuvish": ["Toza Kir", "Oq Bulut", "Kristall"],
  "texnika-tamiri": ["Master Servis", "Tez Ta’mir", "Servis Plus"],
};

/** Shoshilinch xizmatlar — davlat muassasalari, nomi to'liq tarjima qilinadi. */
const EMERGENCY_NAMES: Record<string, (region: Region, index: number) => LocalizedText> = {
  "tez-yordam": (region, index) => ({
    uz: `Tez tibbiy yordam stansiyasi №${index}`,
    ru: `Станция скорой медицинской помощи №${index}`,
    en: `Emergency Medical Station No.${index}`,
  }),
  shifoxona: (region) => ({
    uz: `${region.name.uz} tibbiyot birlashmasi`,
    ru: `Медицинское объединение (${region.name.ru})`,
    en: `${region.name.en} Medical Centre`,
  }),
  "navbatchi-dorixona": (region, index) => ({
    uz: `Navbatchi dorixona №${index}`,
    ru: `Дежурная аптека №${index}`,
    en: `Duty Pharmacy No.${index}`,
  }),
  iib: (region) => ({
    uz: `${region.name.uz} IIB bo‘limi`,
    ru: `Отдел ОВД (${region.name.ru})`,
    en: `${region.name.en} Police Department`,
  }),
  "yongin-xizmati": (region) => ({
    uz: `${region.name.uz} yong‘in xavfsizligi bo‘limi`,
    ru: `Отдел пожарной безопасности (${region.name.ru})`,
    en: `${region.name.en} Fire Safety Department`,
  }),
  "favqulodda-xizmat": (region) => ({
    uz: `FVV ${region.name.uz} bo‘limi`,
    ru: `Отдел МЧС (${region.name.ru})`,
    en: `${region.name.en} Emergency Situations Office`,
  }),
};

const STREETS: LocalizedText[] = [
  { uz: "Amir Temur", ru: "Амира Темура", en: "Amir Temur" },
  { uz: "Alisher Navoiy", ru: "Алишера Навои", en: "Alisher Navoiy" },
  { uz: "Mustaqillik", ru: "Мустакиллик", en: "Mustaqillik" },
  { uz: "Bobur", ru: "Бабура", en: "Bobur" },
  { uz: "Do‘stlik", ru: "Дустлик", en: "Do‘stlik" },
  { uz: "Yoshlik", ru: "Ёшлик", en: "Yoshlik" },
  { uz: "Fidokor", ru: "Фидокор", en: "Fidokor" },
  { uz: "Chorsu", ru: "Чорсу", en: "Chorsu" },
  { uz: "Bunyodkor", ru: "Бунёдкор", en: "Bunyodkor" },
  { uz: "Guliston", ru: "Гулистан", en: "Guliston" },
];

/* ------------------------------------------------------------------ */
/* Ish vaqti profillari                                                */
/* ------------------------------------------------------------------ */

interface HoursProfile {
  open: string;
  close: string;
  is24Hours?: boolean;
  /** Haftalik dam olish kunlari. */
  closedDays?: DayOfWeek[];
}

const HOURS_PROFILES: Record<string, HoursProfile> = {
  // Shoshilinch — deyarli barchasi 24/7
  "tez-yordam": { open: "00:00", close: "24:00", is24Hours: true },
  shifoxona: { open: "00:00", close: "24:00", is24Hours: true },
  "navbatchi-dorixona": { open: "00:00", close: "24:00", is24Hours: true },
  iib: { open: "00:00", close: "24:00", is24Hours: true },
  "yongin-xizmati": { open: "00:00", close: "24:00", is24Hours: true },
  "favqulodda-xizmat": { open: "00:00", close: "24:00", is24Hours: true },
  // Tungi xizmatlar
  "sutkalik-dorixona": { open: "00:00", close: "24:00", is24Hours: true },
  yoqsh: { open: "00:00", close: "24:00", is24Hours: true },
  taksi: { open: "00:00", close: "24:00", is24Hours: true },
  "avto-yordam": { open: "00:00", close: "24:00", is24Hours: true },
  avtoservis: { open: "08:00", close: "22:00" },
  "shina-xizmati": { open: "08:00", close: "23:00" },
  // Ovqatlanish
  restoran: { open: "11:00", close: "23:00" },
  kafe: { open: "09:00", close: "22:00" },
  "fast-food": { open: "10:00", close: "23:00" },
  "milliy-taomlar": { open: "10:00", close: "22:00" },
  "osh-markazi": { open: "07:00", close: "15:00" },
  choyxona: { open: "08:00", close: "22:00" },
  "coffee-shop": { open: "08:00", close: "22:00" },
  bar: { open: "18:00", close: "02:00" },
  delivery: { open: "10:00", close: "23:00" },
  // Shirinliklar
  nonvoyxona: { open: "06:00", close: "20:00" },
  qandolat: { open: "09:00", close: "21:00" },
  tort: { open: "09:00", close: "20:00" },
  desert: { open: "10:00", close: "22:00" },
  muzqaymoq: { open: "10:00", close: "23:00" },
  // Maishiy xizmat
  sartaroshxona: { open: "09:00", close: "20:00" },
  "beauty-salon": { open: "09:00", close: "20:00" },
  "kir-yuvish": { open: "08:00", close: "20:00" },
  "kimyoviy-tozalash": { open: "09:00", close: "19:00", closedDays: ["SUNDAY"] },
  tikuvchilik: { open: "09:00", close: "18:00", closedDays: ["SUNDAY"] },
  "poyabzal-tamiri": { open: "09:00", close: "18:00", closedDays: ["SUNDAY"] },
  "texnika-tamiri": { open: "09:00", close: "19:00" },
  // Dam olish
  park: { open: "06:00", close: "23:00" },
  "dam-olish-maskani": { open: "08:00", close: "22:00" },
  plyaj: { open: "07:00", close: "21:00" },
  "restoran-kompleks": { open: "11:00", close: "01:00" },
  "bolalar-markazi": { open: "10:00", close: "20:00" },
  "sport-obyekti": { open: "07:00", close: "23:00" },
  piknik: { open: "08:00", close: "20:00" },
  // Turizm
  "tarixiy-obyekt": { open: "08:00", close: "18:00", closedDays: ["MONDAY"] },
  "turistik-maskan": { open: "08:00", close: "20:00" },
  "tog-maskani": { open: "08:00", close: "18:00" },
  mehmonxona: { open: "00:00", close: "24:00", is24Hours: true },
  "guest-house": { open: "00:00", close: "24:00", is24Hours: true },
  sanatoriy: { open: "00:00", close: "24:00", is24Hours: true },
  ekskursiya: { open: "09:00", close: "18:00" },
};

const DEFAULT_PROFILE: HoursProfile = { open: "09:00", close: "18:00" };

function buildOpeningHours(profile: HoursProfile, rng: Rng): OpeningHour[] {
  if (profile.is24Hours) {
    return DAYS_OF_WEEK.map((dayOfWeek) => ({
      dayOfWeek,
      openTime: "00:00",
      closeTime: "24:00",
      isClosed: false,
      is24Hours: true,
    }));
  }

  // Dam olish kunlarida ba'zi obyektlar bir soat kechroq ochiladi.
  const weekendShift = rng.chance(0.4) ? 1 : 0;

  return DAYS_OF_WEEK.map((dayOfWeek) => {
    const isWeekend = dayOfWeek === "SATURDAY" || dayOfWeek === "SUNDAY";
    const isClosed = profile.closedDays?.includes(dayOfWeek) ?? false;
    const openHour = Number(profile.open.split(":")[0]) + (isWeekend ? weekendShift : 0);

    return {
      dayOfWeek,
      openTime: `${String(Math.min(openHour, 23)).padStart(2, "0")}:00`,
      closeTime: profile.close,
      isClosed,
      is24Hours: false,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Narx, xizmat va sharh profillari                                    */
/* ------------------------------------------------------------------ */

/** Kunduzgi narx diapazoni asosi (so'm). Narxi bo'lmagan kategoriyalar — null. */
const PRICE_BASE: Record<string, [number, number] | null> = {
  "category-food": [40000, 180000],
  "category-bakery": [8000, 60000],
  "category-night": [20000, 220000],
  "category-household": [25000, 250000],
  "category-leisure": [15000, 150000],
  "category-tourism": [120000, 1400000],
  "category-emergency": null,
};

const SERVICE_PROFILE: Record<string, string[]> = {
  "category-food": ["wifi", "parking", "karta", "naqd", "bolalar-uchun", "yetkazib-berish", "ochiq-havoda", "oilaviy"],
  "category-bakery": ["karta", "naqd", "yetkazib-berish", "oilaviy"],
  "category-night": ["parking", "karta", "naqd"],
  "category-household": ["karta", "naqd", "wifi", "nogironlar-uchun"],
  "category-leisure": ["parking", "bolalar-uchun", "oilaviy", "ochiq-havoda", "naqd", "karta"],
  "category-tourism": ["wifi", "parking", "karta", "oilaviy", "nogironlar-uchun", "ochiq-havoda"],
  "category-emergency": ["parking", "nogironlar-uchun"],
};

const DESCRIPTIONS: Record<string, LocalizedText[]> = {
  "category-food": [
    {
      uz: "Milliy va zamonaviy taomlar, oilaviy zallar va tezkor xizmat ko‘rsatish.",
      ru: "Национальная и современная кухня, семейные залы и быстрое обслуживание.",
      en: "National and modern cuisine, family halls and quick service.",
    },
    {
      uz: "Kunduzgi biznes-lanch va kechki menyu, banket zallari mavjud.",
      ru: "Дневной бизнес-ланч и вечернее меню, есть банкетные залы.",
      en: "Business lunch during the day, evening menu and banquet halls.",
    },
  ],
  "category-bakery": [
    {
      uz: "Har kuni yangi pishirilgan non, tort va shirinliklar.",
      ru: "Свежая выпечка, торты и сладости каждый день.",
      en: "Freshly baked bread, cakes and sweets every day.",
    },
  ],
  "category-night": [
    {
      uz: "Kechayu kunduz ishlaydigan xizmat nuqtasi — shoshilinch ehtiyojlar uchun.",
      ru: "Круглосуточная точка обслуживания — для срочных потребностей.",
      en: "Round-the-clock service point for urgent needs.",
    },
  ],
  "category-household": [
    {
      uz: "Tajribali ustalar, navbatga yozilish va kafolatli xizmat.",
      ru: "Опытные мастера, запись по очереди и гарантия на услуги.",
      en: "Experienced specialists, booking by appointment and guaranteed service.",
    },
  ],
  "category-leisure": [
    {
      uz: "Oilaviy dam olish uchun maydonchalar, ochiq havo va bolalar zonasi.",
      ru: "Площадки для семейного отдыха, открытый воздух и детская зона.",
      en: "Family recreation areas, open air and a kids zone.",
    },
  ],
  "category-tourism": [
    {
      uz: "Toshkent viloyatining mashhur yo‘nalishlaridan biri, yil davomida ochiq.",
      ru: "Одно из популярных направлений Ташкентской области, открыто круглый год.",
      en: "One of Tashkent Region's popular destinations, open year-round.",
    },
  ],
  "category-emergency": [
    {
      uz: "Aholiga shoshilinch yordam ko‘rsatuvchi davlat xizmati.",
      ru: "Государственная служба экстренной помощи населению.",
      en: "State service providing emergency assistance to the public.",
    },
  ],
};

const REVIEW_TEXTS: LocalizedText[] = [
  {
    uz: "Xizmat tez va sifatli, narxlar hamyonbop. Yana boramiz.",
    ru: "Обслуживание быстрое и качественное, цены доступные. Ещё вернёмся.",
    en: "Fast, good service and fair prices. We will come back.",
  },
  {
    uz: "Joylashuvi qulay, avtoturargoh bor. Ish vaqti saytdagidek to‘g‘ri.",
    ru: "Удобное расположение, есть парковка. Часы работы совпадают с сайтом.",
    en: "Convenient location with parking. Opening hours matched the site.",
  },
  {
    uz: "Umuman yaxshi, lekin kechqurun navbat bo‘ldi.",
    ru: "В целом хорошо, но вечером была очередь.",
    en: "Good overall, though there was a queue in the evening.",
  },
  {
    uz: "Toza, oilaviy dam olish uchun qulay joy.",
    ru: "Чисто, удобное место для семейного отдыха.",
    en: "Clean and comfortable for a family visit.",
  },
  {
    uz: "Narxlar biroz oshgan, lekin sifat o‘zgarmagan.",
    ru: "Цены немного выросли, но качество осталось прежним.",
    en: "Prices went up a little, but the quality stayed the same.",
  },
];

const REVIEW_AUTHORS = [
  "Aziz R.", "Dilnoza K.", "Sardor T.", "Malika A.", "Jasur N.", "Nilufar S.",
  "Bekzod H.", "Zilola M.", "Otabek Y.", "Kamola I.", "Rustam D.", "Sevara B.",
];

const MENU_ITEMS: Record<string, Array<{ name: LocalizedText; price: number }>> = {
  "category-food": [
    { name: { uz: "Osh", ru: "Плов", en: "Plov" }, price: 35000 },
    { name: { uz: "Shashlik", ru: "Шашлык", en: "Kebab" }, price: 28000 },
    { name: { uz: "Lag‘mon", ru: "Лагман", en: "Lagman" }, price: 32000 },
    { name: { uz: "Somsa", ru: "Самса", en: "Samsa" }, price: 12000 },
    { name: { uz: "Sho‘rva", ru: "Шурпа", en: "Shurpa" }, price: 30000 },
    { name: { uz: "Choy (choynak)", ru: "Чай (чайник)", en: "Tea (pot)" }, price: 8000 },
  ],
  "category-bakery": [
    { name: { uz: "Tandir non", ru: "Тандырная лепёшка", en: "Tandoor bread" }, price: 6000 },
    { name: { uz: "Napoleon torti", ru: "Торт «Наполеон»", en: "Napoleon cake" }, price: 95000 },
    { name: { uz: "Ekler", ru: "Эклер", en: "Éclair" }, price: 9000 },
    { name: { uz: "Muzqaymoq", ru: "Мороженое", en: "Ice cream" }, price: 12000 },
  ],
};

const SERVICE_MENU: Record<string, Array<{ name: LocalizedText; price: number }>> = {
  "category-household": [
    { name: { uz: "Soch olish", ru: "Стрижка", en: "Haircut" }, price: 50000 },
    { name: { uz: "Soqol olish", ru: "Бритьё", en: "Shave" }, price: 30000 },
    { name: { uz: "Manikyur", ru: "Маникюр", en: "Manicure" }, price: 80000 },
    { name: { uz: "Kir yuvish (1 kg)", ru: "Стирка (1 кг)", en: "Laundry (1 kg)" }, price: 15000 },
  ],
  "category-night": [
    { name: { uz: "Moy almashtirish", ru: "Замена масла", en: "Oil change" }, price: 120000 },
    { name: { uz: "Shina balansi", ru: "Балансировка колёс", en: "Wheel balancing" }, price: 60000 },
    { name: { uz: "Diagnostika", ru: "Диагностика", en: "Diagnostics" }, price: 90000 },
  ],
};

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */

/** Har bir hududda nechta obyekt bo'lishi: shaharlar va yirik tumanlar zichroq. */
const REGION_WEIGHT: Record<string, number> = {
  "city-chirchiq": 3,
  "city-angren": 2.5,
  "city-olmaliq": 2.5,
  "city-nurafshon": 2,
  "city-bekobod": 2,
  "city-yangiyol": 2,
  "city-ohangaron": 1.5,
  "district-bostonliq": 3,
  "district-zangiota": 2.5,
  "district-qibray": 2.5,
  "district-yangiyol": 2,
  "district-parkent": 2,
  "district-toshkent": 2,
};

const BASE_COUNT: Record<string, number> = {
  "category-emergency": 3,
  "category-food": 5,
  "category-night": 4,
  "category-bakery": 3,
  "category-household": 4,
  "category-leisure": 3,
  "category-tourism": 2,
};

/** Bo'stonliq — turizm markazi, tog' maskanlari shu yerda ko'p. */
const TOURISM_BOOST: Record<string, number> = {
  "district-bostonliq": 8,
  "district-parkent": 3,
  "district-ohangaron": 2,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[‘’'ʻ`]/g, "")
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function daysAgo(days: number): string {
  const date = new Date(ANCHOR_DATE);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function verificationFor(rng: Rng): {
  status: VerificationStatus;
  lastVerifiedAt: string;
} {
  const roll = rng.next();
  if (roll < 0.62) return { status: "VERIFIED", lastVerifiedAt: daysAgo(rng.int(1, 80)) };
  if (roll < 0.82) return { status: "VERIFIED", lastVerifiedAt: daysAgo(rng.int(81, 170)) };
  if (roll < 0.95) return { status: "STALE", lastVerifiedAt: daysAgo(rng.int(200, 420)) };
  return { status: "NEEDS_REVIEW", lastVerifiedAt: daysAgo(rng.int(120, 300)) };
}

function priceFor(categoryId: string, rng: Rng, is24Hours: boolean): PriceRange | null {
  const base = PRICE_BASE[categoryId];
  if (!base) return null;
  if (rng.chance(0.12)) return null; // narx ko'rsatilmagan obyektlar

  const [floor, ceiling] = base;
  const dayMin = Math.round((floor + rng.next() * (ceiling - floor) * 0.4) / 1000) * 1000;
  const dayMax = Math.round((dayMin * (1.6 + rng.next() * 1.2)) / 1000) * 1000;
  const hasEvening = !is24Hours && rng.chance(0.55);

  const level: PriceRange["level"] =
    dayMax <= 60000 ? 1 : dayMax <= 180000 ? 2 : dayMax <= 500000 ? 3 : 4;

  return {
    currency: "UZS",
    dayMin,
    dayMax,
    eveningMin: hasEvening ? Math.round((dayMin * 1.25) / 1000) * 1000 : null,
    eveningMax: hasEvening ? Math.round((dayMax * 1.3) / 1000) * 1000 : null,
    level,
  };
}

function imagesFor(name: string, rng: Rng): ObjectImage[] {
  const count = rng.int(0, 3);
  return Array.from({ length: count }, (_, index) => ({
    id: `${slugify(name)}-img-${index}`,
    url: null, // haqiqiy fayl saqlash ulanmaguncha UI placeholder ko'rsatadi
    alt: { uz: name, ru: name, en: name },
    isCover: index === 0,
  }));
}

function awardsFor(rating: number, reviewCount: number, rng: Rng): AwardKey[] {
  const awards: AwardKey[] = [];
  if (rating >= 4.7 && reviewCount > 90 && rng.chance(0.7)) awards.push("CHOICE");
  if (rating >= 4.5 && reviewCount > 60 && rng.chance(0.5)) awards.push("TOP_100");
  if (rating >= 4.3 && rng.chance(0.35)) awards.push("RECOMMENDED");
  return awards;
}

function buildObject(
  region: Region,
  categoryId: string,
  subcategorySlug: string,
  index: number,
): PlaceObject {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  if (!category) throw new Error(`Noma'lum kategoriya: ${categoryId}`);
  const subcategory = category.subcategories.find((item) => item.slug === subcategorySlug);
  if (!subcategory) throw new Error(`Noma'lum subkategoriya: ${subcategorySlug}`);

  const seed = hashString(`${region.id}:${categoryId}:${subcategorySlug}:${index}`);
  const rng = createRng(seed);

  const emergencyName = EMERGENCY_NAMES[subcategorySlug];
  const brandPool =
    SUBCATEGORY_BRANDS[subcategorySlug] ?? BRANDS[categoryId] ?? BRANDS["category-food"];
  const brand = brandPool[(hashString(`${region.id}${subcategorySlug}${index}`) >>> 0) % brandPool.length];

  const name: LocalizedText = emergencyName
    ? emergencyName(region, index + 1)
    : { uz: brand, ru: brand, en: brand };

  const street = rng.pick(STREETS);
  const house = rng.int(1, 148);
  const address: LocalizedText = {
    uz: `${region.name.uz}, ${street.uz} ko‘chasi, ${house}-uy`,
    ru: `${region.name.ru}, ул. ${street.ru}, ${house}`,
    en: `${house} ${street.en} St, ${region.name.en}`,
  };

  const profile = HOURS_PROFILES[subcategorySlug] ?? DEFAULT_PROFILE;
  const openingHours = buildOpeningHours(profile, rng);
  const is24Hours = profile.is24Hours === true;

  const rating = Math.round((3.3 + rng.next() * 1.6) * 10) / 10;
  const reviewCount = rng.int(0, 40) === 0 ? 0 : rng.int(3, 420);
  const { status: verificationStatus, lastVerifiedAt } = verificationFor(rng);

  const availableServices = SERVICE_PROFILE[categoryId] ?? [];
  const serviceIds = SERVICES.filter(
    (service) => availableServices.includes(service.slug) && rng.chance(0.55),
  ).map((service) => service.id);

  const menuPool = MENU_ITEMS[categoryId] ?? SERVICE_MENU[categoryId];
  const menu = menuPool
    ? [
        {
          id: `${slugify(name.uz)}-menu-main`,
          name:
            categoryId === "category-food" || categoryId === "category-bakery"
              ? { uz: "Asosiy taomlar", ru: "Основные блюда", en: "Main dishes" }
              : { uz: "Asosiy xizmatlar", ru: "Основные услуги", en: "Main services" },
          items: menuPool.slice(0, rng.int(3, menuPool.length)).map((item, itemIndex) => ({
            id: `${slugify(name.uz)}-menu-item-${itemIndex}`,
            name: item.name,
            description: { uz: "", ru: "", en: "" },
            price: Math.round((item.price * (0.85 + rng.next() * 0.5)) / 1000) * 1000,
          })),
        },
      ]
    : [];

  const objectStatus =
    !emergencyName && rng.chance(0.03)
      ? ("TEMPORARILY_CLOSED" as const)
      : ("ACTIVE" as const);

  const slugBase = slugify(`${name.uz}-${subcategorySlug}-${region.slug}`);

  return {
    id: `object-${slugBase}-${index}`,
    slug: `${slugBase}-${index}`,
    name,
    description: rng.pick(DESCRIPTIONS[categoryId] ?? DESCRIPTIONS["category-food"]),
    categoryId,
    subcategoryId: subcategory.id,
    regionId: region.id,
    address,
    location: {
      lat: Number((region.center.lat + (rng.next() - 0.5) * 0.09).toFixed(5)),
      lng: Number((region.center.lng + (rng.next() - 0.5) * 0.12).toFixed(5)),
    },
    phone: `+998 ${rng.int(70, 99)} ${rng.int(200, 999)}-${rng.int(10, 99)}-${rng.int(10, 99)}`,
    website: rng.chance(0.25) ? `https://${slugify(brand)}.uz` : null,
    rating: reviewCount === 0 ? 0 : rating,
    reviewCount,
    price: priceFor(categoryId, rng, is24Hours),
    is24Hours,
    openingHours,
    serviceIds,
    images: imagesFor(name.uz, rng),
    menu,
    awards: reviewCount === 0 ? [] : awardsFor(rating, reviewCount, rng),
    tags: [subcategory.slug],
    status: objectStatus,
    verificationStatus,
    lastVerifiedAt,
    createdAt: daysAgo(rng.int(30, 700)),
    updatedAt: lastVerifiedAt,
    viewCount: rng.int(40, 24000),
  };
}

function generateObjects(): PlaceObject[] {
  const objects: PlaceObject[] = [];

  for (const region of REGIONS) {
    const weight = REGION_WEIGHT[region.id] ?? 1;

    for (const category of CATEGORIES) {
      const base = BASE_COUNT[category.id] ?? 2;
      const boost = category.id === "category-tourism" ? (TOURISM_BOOST[region.id] ?? 0) : 0;
      const count = Math.max(1, Math.round(base * weight) + boost);

      for (let index = 0; index < count; index += 1) {
        const subcategory = category.subcategories[index % category.subcategories.length];
        objects.push(buildObject(region, category.id, subcategory.slug, index));
      }
    }
  }

  return objects;
}

export const OBJECTS: PlaceObject[] = generateObjects();

/** Sharhlar obyektning reviewCount'iga mos ravishda deterministik yaratiladi. */
export function reviewsForObject(objectId: string, count: number) {
  const rng = createRng(hashString(`reviews:${objectId}`));
  const total = Math.min(count, 6);

  return Array.from({ length: total }, (_, index) => ({
    id: `${objectId}-review-${index}`,
    objectId,
    authorName: rng.pick(REVIEW_AUTHORS),
    rating: rng.int(3, 5),
    text: rng.pick(REVIEW_TEXTS),
    createdAt: daysAgo(rng.int(3, 400)),
    helpfulCount: rng.int(0, 48),
    status: "PUBLISHED" as const,
  }));
}
