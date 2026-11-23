import type { ProtelBrand } from "@/types";

/** Anasayfa sekme sırası: 1. satır 4, 2. satır Jungleous + Bulung. */
export const PROTEL_BRAND_TAB_ORDER = [
  "pricing-coach",
  "opera-hotel-bosphorus",
  "ggpizza",
  "the-scholar-school",
  "jungleous",
  "bulung-lojistik",
] as const;

export function orderProtelBrands(brands: ProtelBrand[]): ProtelBrand[] {
  const rank = new Map(
    PROTEL_BRAND_TAB_ORDER.map((slug, index) => [slug, index]),
  );
  return [...brands]
    .map((brand, index) => ({
      brand,
      rank: rank.get(brand.slug) ?? PROTEL_BRAND_TAB_ORDER.length + index,
    }))
    .sort((a, b) => a.rank - b.rank || a.brand.sortOrder - b.brand.sortOrder)
    .map(({ brand, rank: r }) => ({ ...brand, sortOrder: r }));
}

export function partitionProtelTabBrands(brands: ProtelBrand[]): {
  primaryRow: ProtelBrand[];
  secondaryRow: ProtelBrand[];
} {
  const bySlug = new Map(brands.map((b) => [b.slug, b]));
  const primarySlugs = PROTEL_BRAND_TAB_ORDER.slice(0, 4);
  const secondarySlugs = PROTEL_BRAND_TAB_ORDER.slice(4);
  const primaryRow = primarySlugs
    .map((slug) => bySlug.get(slug))
    .filter((b): b is ProtelBrand => Boolean(b));
  const secondaryRow = secondarySlugs
    .map((slug) => bySlug.get(slug))
    .filter((b): b is ProtelBrand => Boolean(b));
  const placed = new Set<string>([...PROTEL_BRAND_TAB_ORDER]);
  for (const brand of brands) {
    if (!placed.has(brand.slug)) {
      primaryRow.push(brand);
    }
  }
  return { primaryRow, secondaryRow };
}