"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

/** Sayt osti. Demo ma'lumotlar haqidagi ogohlantirish shu yerda ko'rsatiladi. */
export function Footer() {
  const { t, locale } = useI18n();

  return (
    <footer className="mt-10 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="rounded bg-brand px-1.5 py-1 text-sm font-bold text-white">24/7</span>
          <p className="text-sm text-ink-muted">{t("common.brand.tagline")}</p>
        </div>

        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
          <Link href={`/${locale}/search`} className="hover:text-brand">
            {t("common.nav.search")}
          </Link>
          <Link href={`/${locale}/regions`} className="hover:text-brand">
            {t("common.nav.regions")}
          </Link>
          <Link href={`/${locale}/search?open=24_7`} className="hover:text-brand">
            {t("home.night.title")}
          </Link>
          <Link href={`/${locale}/category/shoshilinch`} className="hover:text-brand">
            {t("home.emergency.title")}
          </Link>
        </nav>

        <p className="mt-4 rounded border border-award/30 bg-award-soft px-3 py-2 text-xs text-award">
          {t("common.demo.notice")}
        </p>
      </div>
    </footer>
  );
}
