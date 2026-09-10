/**
 * Qidiruv matnini normallashtirish (TZ 47–48).
 *
 * Maqsad: o'zbek (lotin/kirill), rus va ingliz tilidagi so'rovlar bir xil
 * natijaga olib kelishi. Masalan: "Чиланзар", "Chilonzor", "chilanzor".
 *
 * Backend (PostgreSQL trigram/full-text yoki search engine) ulanganda ayni shu
 * normalizatsiya qoidalari server tomonida takrorlanadi.
 */

const CYRILLIC_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts", ч: "ch", ш: "sh", щ: "sh",
  ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  // O'zbek kirill harflari
  ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

/** Yozuv tizimidan qat'i nazar bir xil ko'rinishga keltiradi. */
export function normalizeText(value: string): string {
  const lowered = value.toLowerCase().normalize("NFKD");

  let result = "";
  for (const char of lowered) {
    if (char in CYRILLIC_MAP) {
      result += CYRILLIC_MAP[char];
      continue;
    }
    // Diakritik belgilar va apostroflar tashlab yuboriladi: o‘ → o, ’ → ""
    if (/[̀-ͯ‘’'ʻ`´]/.test(char)) continue;
    result += char;
  }

  return result
    .replace(/[^a-z0-9\s]/g, " ")
    // Talaffuzi yaqin harflarni yagona shaklga keltiramiz.
    .replace(/x/g, "h")
    .replace(/q/g, "k")
    .replace(/ts/g, "s")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(value: string): string[] {
  const normalized = normalizeText(value);
  return normalized.length === 0 ? [] : normalized.split(" ");
}

/** Levenshtein masofasi — chegaradan oshganda erta to'xtaydi. */
export function editDistance(a: string, b: string, max = 3): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowMin = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
      current.push(value);
      rowMin = Math.min(rowMin, value);
    }

    if (rowMin > max) return max + 1;
    previous = current;
  }

  return previous[b.length];
}

/** So'z uzunligiga qarab ruxsat etilgan xato miqdori. */
function toleranceFor(token: string): number {
  if (token.length <= 3) return 0;
  if (token.length <= 6) return 1;
  return 2;
}

/** Bitta so'rov tokeni matndagi biror so'zga mos keladimi. */
export function tokenMatches(token: string, haystackTokens: string[]): boolean {
  const tolerance = toleranceFor(token);

  for (const word of haystackTokens) {
    if (word.startsWith(token)) return true;
    if (tolerance > 0 && editDistance(token, word, tolerance) <= tolerance) return true;
  }

  return false;
}

/**
 * So'rovdagi barcha tokenlar matnda uchrashi kerak (AND mantiqi).
 * Bo'sh so'rov — hamma narsa mos keladi.
 */
export function matchesQuery(query: string, haystack: string): boolean {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return true;

  const haystackTokens = tokenize(haystack);
  return queryTokens.every((token) => tokenMatches(token, haystackTokens));
}

/** Reyting uchun: aniq mos kelish yuqoriroq ball oladi. */
export function matchScore(query: string, haystack: string): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const haystackTokens = tokenize(haystack);
  let score = 0;

  for (const token of queryTokens) {
    if (haystackTokens.includes(token)) score += 3;
    else if (haystackTokens.some((word) => word.startsWith(token))) score += 2;
    else if (tokenMatches(token, haystackTokens)) score += 1;
  }

  return score;
}
