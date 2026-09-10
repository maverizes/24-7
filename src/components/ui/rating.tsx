import { formatCount, formatRating } from "@/lib/format";
import { Icon } from "./icon";

/** Reyting + sharhlar soni. Sharh bo'lmasa — bo'sh holat matni. */
export function Rating({
  value,
  reviewCount,
  reviewLabel,
  noReviewsLabel,
  size = "md",
}: {
  value: number;
  reviewCount: number;
  reviewLabel: string;
  noReviewsLabel: string;
  size?: "sm" | "md";
}) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  if (reviewCount === 0) {
    return <span className={`${textSize} text-ink-subtle`}>{noReviewsLabel}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${textSize}`}>
      <Icon name="star" className="size-4 fill-award text-award" strokeWidth={0} />
      <span className="font-semibold tabular-nums text-ink">{formatRating(value)}</span>
      <span className="text-ink-subtle">
        {reviewLabel.replace("{count}", formatCount(reviewCount))}
      </span>
    </span>
  );
}
