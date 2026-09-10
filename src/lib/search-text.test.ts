import { describe, expect, it } from "vitest";
import { editDistance, matchesQuery, matchScore, normalizeText } from "./search-text";

describe("normalizeText", () => {
  it("kirill yozuvini lotinga o'giradi", () => {
    expect(normalizeText("Чиноз")).toBe("chinoz");
    expect(normalizeText("Ресторан")).toBe("restoran");
  });

  it("apostrof va diakritikani olib tashlaydi", () => {
    expect(normalizeText("Bo‘stonliq")).toBe("bostonlik");
    expect(normalizeText("O‘rtachirchiq")).toBe("ortachirchik");
  });

  it("talaffuzi yaqin harflarni birlashtiradi (x/h, q/k)", () => {
    expect(normalizeText("Toshkent")).toBe(normalizeText("Тошкент"));
    expect(normalizeText("choyxona")).toBe(normalizeText("choyhona"));
  });
});

describe("matchesQuery — xato bardoshlilik (TZ 7)", () => {
  it("harf xatosi bilan ham topadi", () => {
    expect(matchesQuery("restaran", "Registon restoran")).toBe(true);
    expect(matchesQuery("dorixona", "Navbatchi dorixona №1")).toBe(true);
  });

  it("kirill so'rov lotin matnni topadi (TZ 48)", () => {
    expect(matchesQuery("Чиланзар", "Chilonzor")).toBe(true);
    expect(matchesQuery("аптека", "apteka dorixona")).toBe(true);
  });

  it("so'z boshidan qidiradi", () => {
    expect(matchesQuery("meh", "Mehmonxona Nur Hotel")).toBe(true);
  });

  it("bir nechta so'zning barchasi mos kelishi kerak", () => {
    expect(matchesQuery("osh markazi", "Beshqozon osh markazi")).toBe(true);
    expect(matchesQuery("osh mehmonxona", "Beshqozon osh markazi")).toBe(false);
  });

  it("bo'sh so'rov hamma narsaga mos keladi", () => {
    expect(matchesQuery("", "istalgan matn")).toBe(true);
    expect(matchesQuery("   ", "istalgan matn")).toBe(true);
  });

  it("mutlaqo boshqa so'zni topmaydi", () => {
    expect(matchesQuery("mehmonxona", "Registon restoran")).toBe(false);
  });
});

describe("matchScore", () => {
  it("aniq moslikka yuqori ball beradi", () => {
    expect(matchScore("restoran", "Registon restoran")).toBeGreaterThan(
      matchScore("restaran", "Registon restoran"),
    );
  });
});

describe("editDistance", () => {
  it("chegaradan oshsa erta to'xtaydi", () => {
    expect(editDistance("abc", "abc")).toBe(0);
    expect(editDistance("kitob", "kitab", 2)).toBe(1);
    expect(editDistance("qisqa", "juda uzun matn", 2)).toBeGreaterThan(2);
  });
});
