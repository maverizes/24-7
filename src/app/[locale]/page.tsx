import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createTranslator } from "@/i18n/translate";
import { getHomeData } from "@/server/api/home";
import { Section } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { SearchHero } from "@/components/home/search-hero";
import { StatsStrip } from "@/components/home/stats-strip";
import { CategoryGrid } from "@/components/home/category-grid";
import { RegionList } from "@/components/home/region-list";
import { EmergencyBlock } from "@/components/home/emergency-block";
import { ObjectGrid } from "@/components/object/object-grid";

/**
 * «Ayni damda ochiq» hisoblagichlari eskirmasligi uchun sahifa har daqiqada
 * qayta generatsiya qilinadi (TZ 10, 26 — real vaqtga yaqinlik + tezlik).
 */
export const revalidate = 60;

/** Bosh sahifa (TZ 6) — platformaning asosiy kirish nuqtasi. */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = createTranslator(await getDictionary(locale));
  const data = getHomeData(locale);
  const emergencyCategory = data.categories.find((category) => category.isEmergency);
  const nightCategory = data.categories.find((category) => category.isNightModule);

  return (
    <div className="pb-6">
      {/* Hero: qidiruv + statistika */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {t("home.hero.title")}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">{t("home.hero.subtitle")}</p>

          <div className="mt-4">
            <SearchHero
              regions={[...data.districts, ...data.cities].map((region) => ({
                slug: region.slug,
                name: region.name,
                kind: region.kind,
              }))}
            />
          </div>

          <div className="mt-3">
            <StatsStrip t={t} stats={data.stats} />
          </div>
        </div>
      </div>

      {/* «Ayni damda ochiq» — platformaning asosiy differensiatori (TZ 10) */}
      <div className="mx-auto max-w-6xl px-4 pt-5">
        <Link
          href={`/${locale}/search`}
          className="flex items-center justify-between gap-3 rounded-card border border-open/30 bg-open-soft px-4 py-3 hover:border-open"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-open text-white">
              <Icon name="check" className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">
                {t("home.openNow.title")}
              </span>
              <span className="block truncate text-xs text-ink-muted">
                {t("home.openNow.subtitle")}
              </span>
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-open">
            <span className="tabular-nums">{data.stats.openNow}</span>
            <Icon name="chevron-right" className="size-4" />
          </span>
        </Link>
      </div>

      {emergencyCategory ? (
        <Section
          id="emergency"
          title={t("home.emergency.title")}
          subtitle={t("home.emergency.subtitle")}
          tone="alert"
        >
          <EmergencyBlock t={t} locale={locale} category={emergencyCategory} />
        </Section>
      ) : null}

      <Section
        id="categories"
        title={t("home.categories.title")}
        subtitle={t("home.categories.subtitle")}
      >
        <CategoryGrid t={t} locale={locale} categories={data.categories} />
      </Section>

      {nightCategory ? (
        <Section
          id="night"
          title={t("home.night.title")}
          subtitle={t("home.night.subtitle")}
          action={{ href: `/${locale}/search?open=24_7`, label: t("home.night.cta") }}
        >
          <ObjectGrid items={data.nightServices} showDistance={false} />
        </Section>
      ) : null}

      <Section
        id="awards"
        title={t("home.awards.title")}
        subtitle={t("home.awards.subtitle")}
        action={{ href: `/${locale}/search?awards=CHOICE`, label: t("home.awards.cta") }}
      >
        <ObjectGrid items={data.awardWinners} showDistance={false} />
      </Section>

      <Section
        id="popular"
        title={t("home.popular.title")}
        subtitle={t("home.popular.subtitle")}
      >
        <ObjectGrid items={data.popular} showDistance={false} />
      </Section>

      <Section
        id="regions"
        title={t("home.regions.title")}
        subtitle={t("home.regions.subtitle")}
        action={{ href: `/${locale}/regions`, label: t("common.action.showAll") }}
      >
        <div className="space-y-4">
          <RegionList
            t={t}
            locale={locale}
            title={t("home.regions.districts")}
            regions={data.districts}
          />
          <RegionList
            t={t}
            locale={locale}
            title={t("home.regions.cities")}
            regions={data.cities}
          />
        </div>
      </Section>
    </div>
  );
}
