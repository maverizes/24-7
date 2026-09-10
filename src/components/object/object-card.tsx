"use client";

import Link from "next/link";
import type { ObjectListItem } from "@/types/api";
import { formatDistance } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Photo } from "@/components/ui/photo";
import { Rating } from "@/components/ui/rating";
import { useI18n } from "@/i18n/provider";
import { OpenStatusBadge, OpenStatusHint } from "./open-status";
import { PriceDisplay } from "./price-display";
import { VerificationNote } from "./verification-note";

/**
 * Obyekt kartochkasi (TZ 9).
 *
 * Ma'lumotga to'yingan: foto, reyting, narx, holat, masofa, xizmatlar va
 * ma'lumot tasdiqlangan sana — barchasi bitta ko'rish maydonida.
 */
export function ObjectCard({
  item,
  showDistance = true,
}: {
  item: ObjectListItem;
  showDistance?: boolean;
}) {
  const { t, locale } = useI18n();
  const distance = item.distanceKm !== null ? formatDistance(item.distanceKm) : null;
  const extraPhotos = item.images.slice(1, 3);
  const visibleServices = item.services.slice(0, 3);
  const hiddenServices = item.services.length - visibleServices.length;

  return (
    <article className="group rounded-card border border-line bg-surface transition-colors hover:border-line-strong focus-within:border-brand">
      <Link
        href={`/${locale}/object/${item.slug}`}
        className="flex gap-3 p-3 focus-visible:outline-none"
      >
        <div className="flex w-24 shrink-0 gap-1 sm:w-40">
          <Photo
            name={`${item.name}-cover`}
            icon={item.category.icon}
            label={item.name}
            className="aspect-square flex-1 rounded"
            iconClassName="size-8"
          />
          {extraPhotos.length > 0 ? (
            <div className="hidden w-1/3 flex-col gap-1 sm:flex">
              {extraPhotos.map((image) => (
                <Photo
                  key={image.id}
                  name={image.id}
                  icon="image"
                  label={item.name}
                  className="flex-1 rounded"
                  iconClassName="size-4"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-ink group-hover:text-brand">
              {item.name}
            </h3>
            {item.awards.includes("CHOICE") ? (
              <Badge tone="award" icon="trophy" size="sm" className="shrink-0">
                {t("home.awards.title")}
              </Badge>
            ) : null}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Rating
              value={item.rating}
              reviewCount={item.reviewCount}
              reviewLabel={t("common.rating.reviews")}
              noReviewsLabel={t("common.rating.noReviews")}
              size="sm"
            />
            <span className="text-xs text-ink-subtle">·</span>
            <span className="truncate text-xs text-ink-muted">{item.subcategory.name}</span>
          </div>

          <div className="mt-1.5">
            <PriceDisplay price={item.price} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <OpenStatusBadge status={item.openStatus} objectStatus={item.status} size="sm" />
            <OpenStatusHint status={item.openStatus} objectStatus={item.status} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <Icon name="map-pin" className="size-3.5 text-ink-subtle" />
              <span className="truncate">{item.region.name}</span>
            </span>
            {showDistance && distance ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Icon name="navigation" className="size-3.5 text-ink-subtle" />
                {t(`common.distance.${distance.unit}`, { value: distance.value })}
              </span>
            ) : null}
            {visibleServices.map((service) => (
              <span key={service.slug} className="inline-flex items-center gap-1">
                <Icon name={service.icon} className="size-3.5 text-ink-subtle" />
                <span className="hidden sm:inline">{service.name}</span>
              </span>
            ))}
            {hiddenServices > 0 ? (
              <span className="text-ink-subtle">+{hiddenServices}</span>
            ) : null}
          </div>

          <VerificationNote
            status={item.verification.status}
            lastVerifiedAt={item.verification.lastVerifiedAt}
            className="mt-2"
          />
        </div>
      </Link>
    </article>
  );
}

/** Ro'yxat yuklanayotganda ko'rsatiladigan skelet (TZ 43). */
export function ObjectCardSkeleton() {
  return (
    <div className="rounded-card border border-line bg-surface p-3">
      <div className="flex gap-3">
        <div className="aspect-square w-24 shrink-0 animate-pulse rounded bg-line/70 sm:w-40" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 w-2/3 animate-pulse rounded bg-line/70" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-line/70" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-line/70" />
          <div className="h-5 w-24 animate-pulse rounded bg-line/70" />
          <div className="h-3 w-2/5 animate-pulse rounded bg-line/70" />
        </div>
      </div>
    </div>
  );
}
