import { describe, expect, it } from "vitest";
import { CATEGORIES } from "./categories";
import { OBJECTS } from "./objects";
import { REGIONS } from "./regions";
import { SERVICES } from "./services";
import { LOCALES } from "@/types/domain";

describe("hududlar seed'i", () => {
  it("22 ta hudud: 15 tuman + 7 shahar (TZ 2)", () => {
    expect(REGIONS).toHaveLength(22);
    expect(REGIONS.filter((region) => region.kind === "DISTRICT")).toHaveLength(15);
    expect(REGIONS.filter((region) => region.kind === "CITY")).toHaveLength(7);
  });

  it("slug va id'lar takrorlanmaydi", () => {
    expect(new Set(REGIONS.map((region) => region.slug)).size).toBe(REGIONS.length);
    expect(new Set(REGIONS.map((region) => region.id)).size).toBe(REGIONS.length);
  });

  it("har bir hudud uchta tilda nomlangan", () => {
    for (const region of REGIONS) {
      for (const locale of LOCALES) {
        expect(region.name[locale].length).toBeGreaterThan(0);
      }
    }
  });
});

describe("kategoriyalar seed'i", () => {
  it("7 ta ommaviy modul mavjud", () => {
    expect(CATEGORIES).toHaveLength(7);
  });

  it("shoshilinch va tungi modullar belgilangan (TZ 3.3, 3.7)", () => {
    expect(CATEGORIES.filter((category) => category.isEmergency)).toHaveLength(1);
    expect(CATEGORIES.filter((category) => category.isNightModule)).toHaveLength(1);
    expect(CATEGORIES[0].isEmergency).toBe(true); // ustuvorlik bo'yicha birinchi
  });

  it("subkategoriya slug'lari kategoriya ichida takrorlanmaydi", () => {
    for (const category of CATEGORIES) {
      const slugs = category.subcategories.map((sub) => sub.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      expect(slugs.length).toBeGreaterThan(0);
    }
  });
});

describe("obyektlar seed'i", () => {
  it("har bir hududda kamida bitta obyekt bor", () => {
    for (const region of REGIONS) {
      const count = OBJECTS.filter((object) => object.regionId === region.id).length;
      expect(count, region.slug).toBeGreaterThan(0);
    }
  });

  it("slug'lar noyob", () => {
    const slugs = OBJECTS.map((object) => object.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("barcha havolalar (kategoriya, subkategoriya, hudud, xizmat) mavjud", () => {
    const regionIds = new Set(REGIONS.map((region) => region.id));
    const categoryIds = new Set(CATEGORIES.map((category) => category.id));
    const subcategoryIds = new Set(
      CATEGORIES.flatMap((category) => category.subcategories.map((sub) => sub.id)),
    );
    const serviceIds = new Set(SERVICES.map((service) => service.id));

    for (const object of OBJECTS) {
      expect(regionIds.has(object.regionId)).toBe(true);
      expect(categoryIds.has(object.categoryId)).toBe(true);
      expect(subcategoryIds.has(object.subcategoryId)).toBe(true);
      for (const serviceId of object.serviceIds) {
        expect(serviceIds.has(serviceId)).toBe(true);
      }
    }
  });

  it("ish vaqti har bir kun uchun to'ldirilgan", () => {
    for (const object of OBJECTS) {
      expect(object.openingHours).toHaveLength(7);
    }
  });

  it("24/7 obyektlar va shoshilinch xizmatlar mavjud", () => {
    expect(OBJECTS.filter((object) => object.is24Hours).length).toBeGreaterThan(50);
    expect(
      OBJECTS.filter((object) => object.categoryId === "category-emergency").length,
    ).toBeGreaterThan(60);
  });

  it("reyting va narx diapazonlari mantiqiy", () => {
    for (const object of OBJECTS) {
      expect(object.rating).toBeGreaterThanOrEqual(0);
      expect(object.rating).toBeLessThanOrEqual(5);
      if (object.price) {
        expect(object.price.dayMax).toBeGreaterThan(object.price.dayMin);
        expect(object.price.dayMin).toBeGreaterThan(0);
      }
      if (object.reviewCount === 0) expect(object.rating).toBe(0);
    }
  });
});
