/**
 * O'zbekistondagi rasmiy shoshilinch qisqa raqamlar (TZ 3.7).
 * Konfiguratsiya sifatida saqlanadi — komponentlarda hardcode qilinmaydi.
 */
export interface EmergencyNumber {
  /** Shoshilinch kategoriyasidagi subkategoriya slug'i. */
  subcategorySlug: string;
  number: string;
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { subcategorySlug: "yongin-xizmati", number: "101" },
  { subcategorySlug: "iib", number: "102" },
  { subcategorySlug: "tez-yordam", number: "103" },
  { subcategorySlug: "favqulodda-xizmat", number: "1050" },
];
