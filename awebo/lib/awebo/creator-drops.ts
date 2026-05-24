import {
  cardToneForIndex,
  listPublishedBrandsByOwner,
  publishedProductHref,
  type PublishedBrand,
} from '@/lib/awebo/catalog-registry';
import type { LiveCatalogProduct } from '@/components/marketplace/LiveProductCard';

export type CreatorDropsStats = {
  brandCount: number;
  productCount: number;
  latestPublishedAt: string | null;
  selfFundedCount: number;
  crowdfundCount: number;
};

export type CreatorDropsBrand = {
  slug: string;
  name: string;
  story: string;
  logoUrl: string | null;
  launchMode: PublishedBrand['launchMode'];
  publishedAt: string;
  productCount: number;
  products: LiveCatalogProduct[];
};

export type CreatorDropsPayload = {
  ownerId: string;
  stats: CreatorDropsStats;
  brands: CreatorDropsBrand[];
};

function brandToProducts(brand: PublishedBrand): LiveCatalogProduct[] {
  return brand.collections.flatMap((collection) =>
    collection.products.map((product, index) => ({
      id: `${brand.slug}-${product.id}`,
      brandSlug: brand.slug,
      brandName: brand.name,
      collectionName: collection.name,
      tokenSymbol: collection.tokenSymbol,
      name: product.name,
      priceUsd: product.priceUsd,
      href: publishedProductHref(product),
      image: brand.logoUrl,
      cardTone: cardToneForIndex(index),
      source: 'awebo' as const,
    }))
  );
}

export async function getCreatorDropsByOwnerId(
  ownerId: string
): Promise<CreatorDropsPayload> {
  const brands = await listPublishedBrandsByOwner(ownerId);
  const mappedBrands: CreatorDropsBrand[] = brands.map((brand) => {
    const products = brandToProducts(brand);
    return {
      slug: brand.slug,
      name: brand.name,
      story: brand.story,
      logoUrl: brand.logoUrl,
      launchMode: brand.launchMode,
      publishedAt: brand.publishedAt,
      productCount: products.length,
      products,
    };
  });

  const allProducts = mappedBrands.flatMap((brand) => brand.products);
  const latestPublishedAt =
    brands.length > 0
      ? brands.reduce((latest, brand) =>
          brand.publishedAt > latest ? brand.publishedAt : latest
        , brands[0].publishedAt)
      : null;

  return {
    ownerId,
    stats: {
      brandCount: brands.length,
      productCount: allProducts.length,
      latestPublishedAt,
      selfFundedCount: brands.filter((brand) => brand.launchMode === 'self').length,
      crowdfundCount: brands.filter((brand) => brand.launchMode === 'crowdfund').length,
    },
    brands: mappedBrands,
  };
}
