import {
  DAYS_OF_WEEK,
  TIMEZONE,
  type DayOfWeek,
  type ObjectStatus,
  type OpeningHour,
  type OpenStatus,
} from "@/types/domain";

/**
 * «Ayni damda ochiq» — platformaning core feature'i (TZ 10).
 *
 * Bu hisob-kitob faqat server tomonida bajariladi va UI'ga tayyor
 * `OpenStatus` shaklida yetkaziladi. Frontend `isOpenNow`ni o'zi
 * hisoblamaydi (TZ Rule 9, Rule A).
 *
 * Barcha vaqtlar Asia/Tashkent mintaqasida talqin qilinadi (TZ Rule 10).
 */

const WEEKDAY_TO_DAY: Record<string, DayOfWeek> = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
};

const MINUTES_IN_DAY = 24 * 60;

export interface LocalNow {
  day: DayOfWeek;
  /** Yarim tundan boshlab o'tgan daqiqalar (0–1439). */
  minutes: number;
}

const nowFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Joriy vaqtni Toshkent mintaqasida hafta kuni + daqiqa sifatida qaytaradi. */
export function getLocalNow(now: Date = new Date()): LocalNow {
  const parts = nowFormatter.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return {
    day: WEEKDAY_TO_DAY[weekday] ?? "MONDAY",
    minutes: (hour % 24) * 60 + minute,
  };
}

/** "HH:mm" → yarim tundan boshlab daqiqalar. "24:00" → 1440. */
export function parseTime(value: string): number {
  const [rawHour, rawMinute] = value.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute ?? "0");
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return hour * 60 + minute;
}

export function formatTime(minutes: number): string {
  const normalized = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function shiftDay(day: DayOfWeek, offset: number): DayOfWeek {
  const index = DAYS_OF_WEEK.indexOf(day);
  const next = (index + offset + DAYS_OF_WEEK.length * 2) % DAYS_OF_WEEK.length;
  return DAYS_OF_WEEK[next];
}

interface Interval {
  open: number;
  close: number;
  /** 22:00–02:00 kabi ertangi kunga o'tuvchi interval. */
  overnight: boolean;
  is24Hours: boolean;
  closeLabel: string;
  openLabel: string;
}

function intervalsFor(hours: OpeningHour[], day: DayOfWeek): Interval[] {
  return hours
    .filter((hour) => hour.dayOfWeek === day && !hour.isClosed)
    .map((hour) => {
      const open = parseTime(hour.openTime);
      const close = parseTime(hour.closeTime);
      return {
        open,
        close,
        overnight: !hour.is24Hours && close <= open,
        is24Hours: hour.is24Hours,
        openLabel: hour.openTime,
        closeLabel: hour.closeTime,
      };
    })
    .sort((a, b) => a.open - b.open);
}

const CLOSED_STATUSES: ReadonlySet<ObjectStatus> = new Set([
  "TEMPORARILY_CLOSED",
  "PERMANENTLY_CLOSED",
]);

export interface OpenStatusInput {
  is24Hours: boolean;
  openingHours: OpeningHour[];
  status: ObjectStatus;
  now?: Date;
}

/** Obyektning ayni damdagi canonical holati. */
export function computeOpenStatus({
  is24Hours,
  openingHours,
  status,
  now = new Date(),
}: OpenStatusInput): OpenStatus {
  const base = {
    is24Hours,
    opensAt: null,
    closesAt: null,
    opensOn: null,
    timezone: TIMEZONE,
  } satisfies Omit<OpenStatus, "isOpenNow">;

  if (CLOSED_STATUSES.has(status)) {
    return { ...base, is24Hours: false, isOpenNow: false };
  }

  if (is24Hours) {
    return { ...base, isOpenNow: true };
  }

  const { day, minutes } = getLocalNow(now);

  // 1. Bugungi intervallar.
  for (const interval of intervalsFor(openingHours, day)) {
    if (interval.is24Hours) {
      return { ...base, is24Hours: true, isOpenNow: true };
    }
    const openNow = interval.overnight
      ? minutes >= interval.open
      : minutes >= interval.open && minutes < interval.close;

    if (openNow) {
      return { ...base, isOpenNow: true, closesAt: interval.closeLabel };
    }
  }

  // 2. Kechagi tungi interval bugungi kunga cho'zilgan bo'lishi mumkin.
  for (const interval of intervalsFor(openingHours, shiftDay(day, -1))) {
    if (interval.overnight && minutes < interval.close) {
      return { ...base, isOpenNow: true, closesAt: interval.closeLabel };
    }
  }

  // 3. Yopiq — keyingi ochilish vaqtini topamiz (bir hafta ichida).
  for (let offset = 0; offset <= DAYS_OF_WEEK.length; offset += 1) {
    const targetDay = shiftDay(day, offset);
    for (const interval of intervalsFor(openingHours, targetDay)) {
      if (offset === 0 && interval.open <= minutes) continue;
      return {
        ...base,
        isOpenNow: false,
        opensAt: interval.is24Hours ? "00:00" : interval.openLabel,
        opensOn: offset === 0 ? null : targetDay,
      };
    }
  }

  return { ...base, isOpenNow: false };
}

/** Filtrlar uchun: obyekt bugun keyinroq ochiladimi (TZ 11). */
export function opensLaterToday(status: OpenStatus): boolean {
  return !status.isOpenNow && status.opensAt !== null && status.opensOn === null;
}
