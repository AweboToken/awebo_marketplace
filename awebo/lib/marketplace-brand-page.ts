import { cardToneForIndex } from '@/lib/awebo/catalog-registry';
import { publishedProductHref } from '@/lib/awebo/catalog-product-links';
import { getPublishedBrandBySlugSafe } from '@/lib/awebo/catalog-read';
import type { PublishedBrand } from '@/lib/awebo/catalog-types';

export type BrandPageProduct = {
  id: string;
  name: string;
  brandSlug: string;
  brandName: string;
  priceUsd: number;
  imageTone: string;
  imageUrl: string | null;
  href: string;
  collectionName: string;
  tokenSymbol: string;
};

export type BrandPageCollection = {
  id: string;
  name: string;
  tokenSymbol: string;
  productCount: number;
};

export type BrandPageView = {
  slug: string;
  name: string;
  tagline: string;
  story: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  bannerTone: string;
  fundraising: boolean;
  raisedPct: number;
  chain: string;
  published: boolean;
  products: BrandPageProduct[];
  collections: BrandPageCollection[];
};

function publishedBrandToPageView(brand: PublishedBrand): BrandPageView {
  let productIndex = 0;
  const products: BrandPageProduct[] = [];
  const collections: BrandPageCollection[] = brand.collections.map((collection) => {
    for (const product of collection.products) {
      products.push({
        id: `${brand.slug}-${product.id}`,
        name: product.name,
        brandSlug: brand.slug,
        brandName: brand.name,
        priceUsd: product.priceUsd,
        imageTone: cardToneForIndex(productIndex),
        imageUrl: brand.logoUrl,
        href: publishedProductHref(product, brand.slug),
        collectionName: collection.name,
        tokenSymbol: collection.tokenSymbol,
      });
      productIndex += 1;
    }

    return {
      id: collection.id,
      name: collection.name,
      tokenSymbol: collection.tokenSymbol,
      productCount: collection.products.length,
    };
  });

  return {
    slug: brand.slug,
    name: brand.name,
    tagline: brand.story.slice(0, 160) || 'Creator brand on AWEBO.',
    story: brand.story,
    logoUrl: brand.logoUrl,
    bannerUrl: brand.bannerUrl,
    bannerTone: 'from-violet-900/70 to-air-force-blue/60',
    fundraising: brand.launchMode === 'crowdfund',
    raisedPct: brand.launchMode === 'crowdfund' ? 42 : 0,
    chain: brand.chain,
    published: true,
    products,
    collections,
  };
}

export async function resolveBrandPageView(slug: string): Promise<BrandPageView | undefined> {
  const published = await getPublishedBrandBySlugSafe(slug);
  if (!published) return undefined;
  return publishedBrandToPageView(published);
}
