"use client";

import type { VerificationStatus } from "@/types/domain";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";

/**
 * Ma'lumot yangiligi (TZ 18) — platformaning ishonch mexanizmi.
 * Sana + holat birga ko'rsatiladi, faqat rang bilan emas.
 */
export function VerificationNote({
  status,
  lastVerifiedAt,
  className = "",
}: {
  status: VerificationStatus;
  lastVerifiedAt: string;
  className?: string;
}) {
  const { t } = useI18n();
  const date = formatDate(lastVerifiedAt);

  if (status === "VERIFIED") {
    return (
      <p className={`inline-flex items-center gap-1 text-xs text-ink-subtle ${className}`}>
        <Icon name="verified" className="size-3.5 text-open" />
        {t("common.verification.verifiedOn", { date })}
      </p>
    );
  }

  const label =
    status === "STALE"
      ? t("common.verification.stale")
      : status === "NEEDS_REVIEW"
        ? t("common.verification.needsReview")
        : t("common.verification.suspended");

  return (
    <p className={`inline-flex items-center gap-1 text-xs text-award ${className}`}>
      <Icon name="warning" className="size-3.5" />
      {label}
      <span className="text-ink-subtle">· {date}</span>
    </p>
  );
}
