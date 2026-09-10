import type { Award, AwardKey } from "@/types/domain";

/** TZ 17 — «24/7 Tanlovi» mukofot tizimi. */
export const AWARD_YEAR = 2026;

export const AWARDS: Record<AwardKey, Award> = {
  CHOICE: {
    id: "award-choice",
    slug: "24-7-tanlovi",
    key: "CHOICE",
    name: { uz: "24/7 Tanlovi", ru: "Выбор 24/7", en: "24/7 Choice" },
    description: {
      uz: "Yuqori reyting va sifatli xizmat uchun yillik tanlov g‘olibi",
      ru: "Победитель ежегодного отбора за высокий рейтинг и качество",
      en: "Annual selection winner for high rating and service quality",
    },
    icon: "trophy",
    year: AWARD_YEAR,
  },
  TOP_100: {
    id: "award-top-100",
    slug: "24-7-top-100",
    key: "TOP_100",
    name: { uz: "24/7 Top 100", ru: "24/7 Топ 100", en: "24/7 Top 100" },
    description: {
      uz: "Viloyat bo‘yicha eng yaxshi 100 ta obyekt ro‘yxatida",
      ru: "В списке 100 лучших объектов области",
      en: "Among the region's 100 best places",
    },
    icon: "medal",
    year: AWARD_YEAR,
  },
  RECOMMENDED: {
    id: "award-recommended",
    slug: "24-7-tavsiya",
    key: "RECOMMENDED",
    name: { uz: "24/7 Tavsiya", ru: "24/7 Рекомендует", en: "24/7 Recommended" },
    description: {
      uz: "Foydalanuvchilar sharhlari asosida tavsiya etilgan",
      ru: "Рекомендовано на основе отзывов пользователей",
      en: "Recommended based on user reviews",
    },
    icon: "thumbs-up",
    year: AWARD_YEAR,
  },
  TRUSTED: {
    id: "award-trusted",
    slug: "24-7-ishonchli",
    key: "TRUSTED",
    name: { uz: "24/7 Ishonchli", ru: "24/7 Надёжный", en: "24/7 Trusted" },
    description: {
      uz: "Ma’lumotlari muntazam tasdiqlanib turadigan obyekt",
      ru: "Объект с регулярно подтверждаемыми данными",
      en: "A place whose data is verified regularly",
    },
    icon: "shield-check",
    year: AWARD_YEAR,
  },
};

export const AWARD_LIST: Award[] = Object.values(AWARDS);
