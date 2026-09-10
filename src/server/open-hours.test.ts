import { describe, expect, it } from "vitest";
import { computeOpenStatus, getLocalNow, opensLaterToday, shiftDay } from "./open-hours";
import type { DayOfWeek, OpeningHour } from "@/types/domain";

/** Toshkent vaqti UTC+5, yozgi vaqt siljishi yo'q. */
function tashkent(iso: string): Date {
  return new Date(`${iso}+05:00`);
}

// 2026-09-07 — dushanba.
const MONDAY = "2026-09-07";
const TUESDAY = "2026-09-08";

function hour(
  dayOfWeek: DayOfWeek,
  openTime: string,
  closeTime: string,
  extra: Partial<OpeningHour> = {},
): OpeningHour {
  return { dayOfWeek, openTime, closeTime, isClosed: false, is24Hours: false, ...extra };
}

const weekdays: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function everyDay(openTime: string, closeTime: string): OpeningHour[] {
  return weekdays.map((day) => hour(day, openTime, closeTime));
}

function status(openingHours: OpeningHour[], at: string, overrides = {}) {
  return computeOpenStatus({
    is24Hours: false,
    status: "ACTIVE",
    openingHours,
    now: tashkent(at),
    ...overrides,
  });
}

describe("getLocalNow", () => {
  it("UTC vaqtni Toshkent mintaqasiga o'giradi", () => {
    // 2026-09-07T20:30Z → Toshkentda 08-sentabr 01:30 (seshanba).
    expect(getLocalNow(new Date("2026-09-07T20:30:00Z"))).toEqual({
      day: "TUESDAY",
      minutes: 90,
    });
  });

  it("kun chegarasini to'g'ri hisoblaydi", () => {
    expect(getLocalNow(new Date("2026-09-07T19:00:00Z"))).toEqual({
      day: "TUESDAY",
      minutes: 0,
    });
  });
});

describe("shiftDay", () => {
  it("hafta boshi va oxiridan aylanadi", () => {
    expect(shiftDay("MONDAY", -1)).toBe("SUNDAY");
    expect(shiftDay("SUNDAY", 1)).toBe("MONDAY");
    expect(shiftDay("FRIDAY", 3)).toBe("MONDAY");
  });
});

describe("computeOpenStatus — oddiy kunduzgi jadval", () => {
  const schedule = everyDay("09:00", "18:00");

  it("ish vaqti ichida ochiq va yopilish vaqtini qaytaradi", () => {
    expect(status(schedule, `${MONDAY}T12:00:00`)).toMatchObject({
      isOpenNow: true,
      closesAt: "18:00",
      opensAt: null,
      timezone: "Asia/Tashkent",
    });
  });

  it("ochilishdan oldin yopiq, bugungi ochilish vaqtini beradi", () => {
    const result = status(schedule, `${MONDAY}T07:30:00`);
    expect(result).toMatchObject({ isOpenNow: false, opensAt: "09:00", opensOn: null });
    expect(opensLaterToday(result)).toBe(true);
  });

  it("yopilish daqiqasida allaqachon yopiq", () => {
    expect(status(schedule, `${MONDAY}T18:00:00`)).toMatchObject({ isOpenNow: false });
  });

  it("kechqurun yopiq va ertangi kunni ko'rsatadi", () => {
    const result = status(schedule, `${MONDAY}T21:00:00`);
    expect(result).toMatchObject({ isOpenNow: false, opensAt: "09:00", opensOn: "TUESDAY" });
    expect(opensLaterToday(result)).toBe(false);
  });
});

describe("computeOpenStatus — tungi (overnight) jadval", () => {
  const schedule = everyDay("22:00", "02:00");

  it("yarim tundan oldin ochiq", () => {
    expect(status(schedule, `${MONDAY}T23:30:00`)).toMatchObject({
      isOpenNow: true,
      closesAt: "02:00",
    });
  });

  it("yarim tundan keyin kechagi interval hisobiga ochiq", () => {
    expect(status(schedule, `${TUESDAY}T01:00:00`)).toMatchObject({
      isOpenNow: true,
      closesAt: "02:00",
    });
  });

  it("yopilgandan keyin yopiq va o'sha kuni qayta ochiladi", () => {
    expect(status(schedule, `${TUESDAY}T03:00:00`)).toMatchObject({
      isOpenNow: false,
      opensAt: "22:00",
      opensOn: null,
    });
  });
});

describe("computeOpenStatus — 24/7 va dam olish kunlari", () => {
  it("obyekt darajasidagi is24Hours har doim ochiq", () => {
    expect(status([], `${MONDAY}T03:00:00`, { is24Hours: true })).toMatchObject({
      isOpenNow: true,
      is24Hours: true,
      closesAt: null,
    });
  });

  it("kunlik is24Hours bayrog'i ham ochiq deb hisoblanadi", () => {
    const schedule = [hour("MONDAY", "00:00", "24:00", { is24Hours: true })];
    expect(status(schedule, `${MONDAY}T04:00:00`)).toMatchObject({
      isOpenNow: true,
      is24Hours: true,
    });
  });

  it("dam olish kunini o'tkazib, keyingi ish kunini topadi", () => {
    const schedule = [
      hour("MONDAY", "09:00", "18:00", { isClosed: true }),
      hour("TUESDAY", "10:00", "19:00"),
    ];
    expect(status(schedule, `${MONDAY}T12:00:00`)).toMatchObject({
      isOpenNow: false,
      opensAt: "10:00",
      opensOn: "TUESDAY",
    });
  });

  it("jadval umuman bo'lmasa — yopiq, ochilish vaqti noma'lum", () => {
    expect(status([], `${MONDAY}T12:00:00`)).toMatchObject({
      isOpenNow: false,
      opensAt: null,
      opensOn: null,
    });
  });
});

describe("computeOpenStatus — obyekt holati", () => {
  it("vaqtincha yopilgan obyekt ochiq ko'rsatilmaydi", () => {
    expect(
      status(everyDay("09:00", "18:00"), `${MONDAY}T12:00:00`, {
        status: "TEMPORARILY_CLOSED",
      }),
    ).toMatchObject({ isOpenNow: false, is24Hours: false });
  });

  it("butunlay yopilgan obyekt 24/7 bo'lsa ham ochiq emas", () => {
    expect(
      status([], `${MONDAY}T12:00:00`, {
        status: "PERMANENTLY_CLOSED",
        is24Hours: true,
      }),
    ).toMatchObject({ isOpenNow: false });
  });
});
