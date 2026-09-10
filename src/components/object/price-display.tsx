"use client";

import type { PriceRange } from "@/types/domain";
import { formatPriceRange } from "@/lib/format";
import { useI18n } from "@/i18n/provider";

/** Kunduzgi va kechki narx diapazonlari (TZ 9, 13). */
export function PriceDisplay({
  price,
  variant = "compact",
}: {
  price: PriceRange | null;
  variant?: "compact" | "detailed";
}) {
  const { t } = useI18n();

  if (!price) {
    return variant === "detailed" ? (
      <p className="text-sm text-ink-subtle">{t("common.price.notApplicable")}</p>
    ) : null;
  }

  const currency = t("common.price.currency");

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
        <span className="tabular-nums text-ink">
          <span className="text-ink-subtle">{t("common.price.day")}: </span>
          {formatPriceRange(price.dayMin, price.dayMax)} {currency}
        </span>
        {price.eveningMin !== null && price.eveningMax !== null ? (
          <span className="tabular-nums text-ink">
            <span className="text-ink-subtle">{t("common.price.evening")}: </span>
            {formatPriceRange(price.eveningMin, price.eveningMax)} {currency}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      <div className="rounded border border-line bg-canvas px-3 py-2">
        <dt className="text-xs text-ink-subtle">{t("common.price.day")}</dt>
        <dd className="mt-0.5 font-semibold tabular-nums text-ink">
          {formatPriceRange(price.dayMin, price.dayMax)} {currency}
        </dd>
      </div>
      {price.eveningMin !== null && price.eveningMax !== null ? (
        <div className="rounded border border-line bg-canvas px-3 py-2">
          <dt className="text-xs text-ink-subtle">{t("common.price.evening")}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-ink">
            {formatPriceRange(price.eveningMin, price.eveningMax)} {currency}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
