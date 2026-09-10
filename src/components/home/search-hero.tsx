"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";

interface RegionOption {
  slug: string;
  name: string;
  kind: "DISTRICT" | "CITY";
}

const MY_LOCATION = "__my_location__";

/**
 * Asosiy qidiruv (TZ 6): «Nima kerak?» + «Qayerda?».
 * «Mening lokatsiyam» tanlansa — brauzer geolokatsiyasi so'raladi va
 * koordinatalar query parametrlarga qo'shiladi (masofa serverda hisoblanadi).
 */
export function SearchHero({ regions }: { regions: RegionOption[] }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [where, setWhere] = useState("");
  const [isLocating, setLocating] = useState(false);

  function go(params: URLSearchParams) {
    const search = params.toString();
    router.push(`/${locale}/search${search ? `?${search}` : ""}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());

    if (where === MY_LOCATION) {
      if (!navigator.geolocation) {
        go(params);
        return;
      }
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          params.set("lat", position.coords.latitude.toFixed(5));
          params.set("lng", position.coords.longitude.toFixed(5));
          params.set("sort", "distance");
          setLocating(false);
          go(params);
        },
        () => {
          setLocating(false);
          go(params);
        },
        { timeout: 8000 },
      );
      return;
    }

    if (where) params.set("region", where);
    go(params);
  }

  const districts = regions.filter((region) => region.kind === "DISTRICT");
  const cities = regions.filter((region) => region.kind === "CITY");

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-line bg-surface p-3 shadow-sm"
      role="search"
    >
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label
              htmlFor="hero-query"
              className="mb-1 block text-xs font-medium text-ink-muted"
            >
              {t("home.hero.whatLabel")}
            </label>
            <div className="flex h-11 items-center gap-2 rounded border border-line bg-canvas px-3 focus-within:border-brand">
              <Icon name="search" className="size-4 shrink-0 text-ink-subtle" />
              <input
                id="hero-query"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("home.hero.whatPlaceholder")}
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-ink-subtle"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="hero-where"
              className="mb-1 block text-xs font-medium text-ink-muted"
            >
              {t("home.hero.whereLabel")}
            </label>
            <div className="flex h-11 items-center gap-2 rounded border border-line bg-canvas px-3 focus-within:border-brand">
              <Icon name="map-pin" className="size-4 shrink-0 text-ink-subtle" />
              <select
                id="hero-where"
                value={where}
                onChange={(event) => setWhere(event.target.value)}
                className="h-full w-full bg-transparent text-sm outline-none"
              >
                <option value="">{t("home.hero.whereAll")}</option>
                <option value={MY_LOCATION}>{t("home.hero.whereMyLocation")}</option>
                <optgroup label={t("home.regions.districts")}>
                  {districts.map((region) => (
                    <option key={region.slug} value={region.slug}>
                      {region.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t("home.regions.cities")}>
                  {cities.map((region) => (
                    <option key={region.slug} value={region.slug}>
                      {region.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLocating}
          className="h-11 rounded bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-70 sm:mt-[22px] sm:self-start"
        >
          {isLocating ? t("search.location.loading") : t("home.hero.cta")}
        </button>
      </div>
    </form>
  );
}
