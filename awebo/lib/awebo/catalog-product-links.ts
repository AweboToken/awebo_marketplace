import type { PublishedBrand, PublishedProduct } from '@/lib/awebo/catalog-types';
import { listPublishedBrandsSafe } from '@/lib/awebo/catalog-read';
import { isEvershopCheckoutEnabled } from '@/lib/awebo/commerce-config';

export type PublishedCatalogProductView = {
  brand: PublishedBrand;
  collectionName: string;
  tokenSymbol: string;
  product: PublishedProduct;
  compositeId: string;
};

function normalizeRef(value: string): string {
  return value.trim().toLowerCase();
}

function matchesProductRef(
  productRef: string,
  brand: PublishedBrand,
  product: PublishedProduct
): boolean {
  const compositeId = `${brand.slug}-${product.id}`;
  const normalizedRef = normalizeRef(productRef);
  const candidates = [
    productRef,
    compositeId,
    product.id,
    product.sku,
    product.evershopUrlKey,
    `${brand.slug}/${product.id}`,
  ]
    .filter(Boolean)
    .map((value) => normalizeRef(value as string));

  return candidates.includes(normalizedRef);
}

/** Resolve a published creator product from catalog (not mock marketplace data). */
export async function getPublishedCatalogProduct(
  productRef: string
): Promise<PublishedCatalogProductView | null> {
  const brands = await listPublishedBrandsSafe();

  for (const brand of brands) {
    for (const collection of brand.collections) {
      for (const product of collection.products) {
        if (!matchesProductRef(productRef, brand, product)) continue;
        return {
          brand,
          collectionName: collection.name,
          tokenSymbol: collection.tokenSymbol,
          product,
          compositeId: `${brand.slug}-${product.id}`,
        };
      }
    }
  }

  return null;
}

export function publishedProductHref(
  product: PublishedProduct,
  brandSlug: string
): string {
  if (isEvershopCheckoutEnabled() && product.evershopUrlKey) {
    return `/drops/product/${product.evershopUrlKey}`;
  }
  return `/marketplace/product/${brandSlug}-${product.id}`;
}
