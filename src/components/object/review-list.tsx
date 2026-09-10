import Link from "next/link";
import type { ReviewItem } from "@/types/api";
import { formatCount, formatDate, formatRating } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import type { Translator } from "@/i18n/translate";

export type ReviewSort = "newest" | "helpful" | "highest" | "lowest";

export const REVIEW_SORTS: ReviewSort[] = ["newest", "helpful", "highest", "lowest"];

export function sortReviews(reviews: ReviewItem[], sort: ReviewSort): ReviewItem[] {
  const sorted = [...reviews];
  switch (sort) {
    case "helpful":
      return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
    case "highest":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "lowest":
      return sorted.sort((a, b) => a.rating - b.rating);
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

/** Sharhlar ro'yxati (TZ 13). Sharh yozish — avtorizatsiya talab qiladi (Rule C). */
export function ReviewList({
  t,
  reviews,
  sort,
  basePath,
}: {
  t: Translator;
  reviews: ReviewItem[];
  sort: ReviewSort;
  basePath: string;
}) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink-muted">{t("object.reviews.empty")}</p>;
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {REVIEW_SORTS.map((key) => (
          <Link
            key={key}
            href={key === "newest" ? basePath : `${basePath}?reviews=${key}`}
            scroll={false}
            aria-current={sort === key ? "true" : undefined}
            className={`inline-flex h-8 items-center rounded border px-2.5 text-xs font-medium ${
              sort === key
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-surface text-ink-muted hover:border-line-strong"
            }`}
          >
            {t(`object.reviews.sort.${key}` as "object.reviews.sort.newest")}
          </Link>
        ))}
      </div>

      <ul className="space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded border border-line bg-surface p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-ink-muted">
                  {review.authorName.slice(0, 1)}
                </span>
                <span className="text-sm font-medium text-ink">{review.authorName}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-sm">
                <Icon name="star" className="size-4 fill-award text-award" strokeWidth={0} />
                <span className="font-semibold tabular-nums">{formatRating(review.rating)}</span>
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-muted">{review.text}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 text-xs text-ink-subtle">
              <span>{formatDate(review.createdAt)}</span>
              {review.helpfulCount > 0 ? (
                <span>
                  {t("object.reviews.helpful", { count: formatCount(review.helpfulCount) })}
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
