"use client";

import type { ObjectStatus, OpenStatus } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/provider";

/**
 * «Ayni damda ochiq» ko'rsatkichi.
 *
 * Holat backend hisoblab bergan `OpenStatus` asosida chiziladi — bu komponent
 * hech qanday vaqt hisob-kitobi qilmaydi (TZ 10).
 */
export function OpenStatusBadge({
  status,
  objectStatus,
  size = "md",
}: {
  status: OpenStatus;
  objectStatus: ObjectStatus;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();

  if (objectStatus === "TEMPORARILY_CLOSED") {
    return (
      <Badge tone="warn" icon="warning" size={size}>
        {t("common.status.temporarilyClosed")}
      </Badge>
    );
  }

  if (objectStatus === "PERMANENTLY_CLOSED") {
    return (
      <Badge tone="closed" icon="close" size={size}>
        {t("common.status.permanentlyClosed")}
      </Badge>
    );
  }

  if (status.is24Hours) {
    return (
      <Badge tone="night" icon="clock" size={size}>
        {t("common.status.open24")}
      </Badge>
    );
  }

  if (status.isOpenNow) {
    return (
      <Badge tone="open" icon="check" size={size}>
        {t("common.status.openNow")}
      </Badge>
    );
  }

  return (
    <Badge tone="closed" icon="clock" size={size}>
      {t("common.status.closed")}
    </Badge>
  );
}

/** Badge yonidagi ikkilamchi matn: «23:00 da yopiladi» / «09:00 da ochiladi». */
export function OpenStatusHint({
  status,
  objectStatus,
  className = "",
}: {
  status: OpenStatus;
  objectStatus: ObjectStatus;
  className?: string;
}) {
  const { t } = useI18n();

  if (objectStatus !== "ACTIVE" || status.is24Hours) return null;

  if (status.isOpenNow && status.closesAt) {
    return (
      <span className={`text-xs text-ink-subtle ${className}`}>
        {t("common.status.closesAt", { time: status.closesAt })}
      </span>
    );
  }

  if (!status.isOpenNow && status.opensAt) {
    const label = status.opensOn
      ? t("common.status.opensOn", {
          day: t(`common.daysShort.${status.opensOn}` as "common.daysShort.MONDAY"),
          time: status.opensAt,
        })
      : t("common.status.opensAt", { time: status.opensAt });

    return <span className={`text-xs text-ink-subtle ${className}`}>{label}</span>;
  }

  return null;
}
