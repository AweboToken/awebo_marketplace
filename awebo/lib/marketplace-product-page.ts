import { getPublishedCatalogProduct } from '@/lib/awebo/catalog-product-links';
import { resolveProductImageUrl } from '@/lib/launch-catalog-images';

export type ProductPageView = {
  id: string;
  name: string;
  priceUsd: number;
  brandSlug: string;
  brandName: string;
  collectionName?: string;
  tokenSymbol?: string;
  imageUrl: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  imageTone: string;
  brandFundraising: boolean;
  story?: string;
  published: boolean;
  sku?: string;
};

function catalogToView(
  catalog: NonNullable<Awaited<ReturnType<typeof getPublishedCatalogProduct>>>
): ProductPageView {
  const { brand, product, collectionName, tokenSymbol, compositeId } = catalog;

  const productImageUrl =
    resolveProductImageUrl(product.imageUrl, product.id) ??
    brand.logoUrl ??
    brand.bannerUrl;

  return {
    id: compositeId,
    name: product.name,
    priceUsd: product.priceUsd,
    brandSlug: brand.slug,
    brandName: brand.name,
    collectionName,
    tokenSymbol,
    imageUrl: productImageUrl,
    logoUrl: brand.logoUrl,
    bannerUrl: brand.bannerUrl,
    imageTone: 'from-violet-800/80 to-air-force-blue/60',
    brandFundraising: brand.launchMode === 'crowdfund',
    story: brand.story,
    published: true,
    sku: product.sku,
  };
}

export async function resolveProductPageView(
  productRef: string
): Promise<ProductPageView | undefined> {
  const catalog = await getPublishedCatalogProduct(productRef);
  if (!catalog) return undefined;
  return catalogToView(catalog);
}
