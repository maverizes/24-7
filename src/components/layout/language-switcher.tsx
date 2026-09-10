"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LOCALES, type Locale } from "@/i18n/config";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";

/**
 * Til almashtirish. Joriy yo'lning til segmenti almashtiriladi, query
 * parametrlar (filtrlar) saqlanadi. Tanlov cookie'da eslab qolinadi.
 */
export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    setOpen(false);
    document.cookie = `locale=${next};path=/;max-age=31536000;samesite=lax`;

    const segments = pathname.split("/");
    segments[1] = next;
    // Filtrlar saqlanib qolishi uchun joriy query string ko'chiriladi.
    const query = window.location.search;

    startTransition(() => {
      router.push(`${segments.join("/")}${query}`);
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 items-center gap-1.5 rounded px-2 text-sm font-medium text-ink-muted hover:bg-canvas"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("common.language.label")}
        disabled={isPending}
      >
        <Icon name="languages" className="size-4" />
        <span className="uppercase">{locale}</span>
        <Icon name="chevron-down" className="size-3.5" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label={t("common.action.close")}
            onClick={() => setOpen(false)}
          />
          <ul
            className="absolute right-0 z-50 mt-1 min-w-40 overflow-hidden rounded-card border border-line bg-surface py-1 shadow-lg"
            role="listbox"
          >
            {LOCALES.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item === locale}
                  onClick={() => switchTo(item)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-canvas ${
                    item === locale ? "font-semibold text-brand" : "text-ink-muted"
                  }`}
                >
                  {t(`common.language.${item}` as "common.language.uz")}
                  {item === locale ? <Icon name="check" className="size-4" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
