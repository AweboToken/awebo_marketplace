import type { PublishedBrand } from '@/lib/awebo/catalog-types';

export type MarketplaceCollectionCard = {
  id: string;
  brandSlug: string;
  brandName: string;
  collectionId: string;
  collectionName: string;
  tokenSymbol: string;
  story: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  launchMode: PublishedBrand['launchMode'];
  chain: string;
  productCount: number;
  priceUsd: number;
  change24hPct: number;
  marketCapUsd: number;
  volume24hUsd: number;
  holders: number;
  live: boolean;
  href: string;
};

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Deterministic mock token stats until on-chain feeds are wired. */
export function mockTokenMetrics(collectionKey: string) {
  const seed = hashString(collectionKey);
  const priceUsd = Number(((seed % 9000) / 1000 + 0.008).toFixed(4));
  const change24hPct = Number((((seed % 4000) - 2000) / 100).toFixed(2));
  const marketCapUsd = Math.round(priceUsd * (50000 + (seed % 250000)));
  const volume24hUsd = Math.round(marketCapUsd * (0.02 + (seed % 15) / 100));
  const holders = 120 + (seed % 4800);
  return { priceUsd, change24hPct, marketCapUsd, volume24hUsd, holders };
}

export function publishedBrandToCollectionCards(
  brand: PublishedBrand,
  options?: { live?: boolean }
): MarketplaceCollectionCard[] {
  return brand.collections.map((collection) => {
    const collectionKey = `${brand.slug}-${collection.id}`;
    const metrics = mockTokenMetrics(collectionKey);
    const productCount = collection.products.length;

    return {
      id: collectionKey,
      brandSlug: brand.slug,
      brandName: brand.name,
      collectionId: collection.id,
      collectionName: collection.name,
      tokenSymbol: collection.tokenSymbol,
      story: brand.story,
      logoUrl: brand.logoUrl,
      bannerUrl: brand.bannerUrl,
      launchMode: brand.launchMode,
      chain: brand.chain,
      productCount,
      ...metrics,
      live: options?.live ?? true,
      href: `/marketplace/brand/${brand.slug}`,
    };
  });
}

export function formatCompactUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

/** Generate mock chart points for modal sparkline. */
export function mockChartSeries(collectionKey: string, points = 24): number[] {
  const seed = hashString(collectionKey);
  const series: number[] = [];
  let value = 40 + (seed % 30);
  for (let i = 0; i < points; i += 1) {
    const delta = ((seed + i * 17) % 11) - 5;
    value = Math.max(12, Math.min(92, value + delta));
    series.push(value);
  }
  return series;
}
