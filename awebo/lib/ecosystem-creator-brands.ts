import { listPublishedBrandsSafe } from '@/lib/awebo/catalog-read';
import type { PublishedBrand } from '@/lib/awebo/catalog-types';
import { resolveProductImageUrl } from '@/lib/launch-catalog-images';

export type EcosystemCreatorProductPreview = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type EcosystemCreatorBrandCard = {
  slug: string;
  name: string;
  story: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  tokenSymbol: string;
  collectionName: string;
  productCount: number;
  products: EcosystemCreatorProductPreview[];
  href: string;
  fundraising: boolean;
};

function isDisplayableImageUrl(url: string | null | undefined): url is string {
  if (!url?.trim()) return false;
  return !url.startsWith('blob:');
}

export function publishedBrandToEcosystemCard(brand: PublishedBrand): EcosystemCreatorBrandCard {
  const collection = brand.collections[0];
  const products = (collection?.products ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: resolveProductImageUrl(product.imageUrl, product.id),
  }));

  return {
    slug: brand.slug,
    name: brand.name,
    story: brand.story,
    logoUrl: isDisplayableImageUrl(brand.logoUrl) ? brand.logoUrl : null,
    bannerUrl: isDisplayableImageUrl(brand.bannerUrl) ? brand.bannerUrl : null,
    tokenSymbol: collection?.tokenSymbol ?? brand.slug.toUpperCase(),
    collectionName: collection?.name ?? 'Genesis collection',
    productCount: products.length,
    products: products.slice(0, 4),
    href: `/marketplace/brand/${brand.slug}`,
    fundraising: brand.launchMode === 'crowdfund',
  };
}

/** Published brands with at least one product — for ecosystem “creators building” rail. */
export async function listEcosystemCreatorBrands(): Promise<EcosystemCreatorBrandCard[]> {
  const brands = await listPublishedBrandsSafe();

  return brands
    .map(publishedBrandToEcosystemCard)
    .filter((brand) => brand.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount);
}
