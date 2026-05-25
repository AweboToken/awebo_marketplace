import { cardToneForIndex } from '@/lib/awebo/catalog-registry';
import { listPublishedBrandsSafe } from '@/lib/awebo/catalog-read';
import type { PublishedBrand, PublishedCollection } from '@/lib/awebo/catalog-types';
import { publishedProductHref } from '@/lib/awebo/catalog-product-links';
import { isEvershopCheckoutEnabled } from '@/lib/awebo/commerce-config';
import { listEvershopProducts } from '@/lib/evershop/storefront-client';
import { resolveProductImageUrl } from '@/lib/launch-catalog-images';
import type { LiveCatalogProduct } from '@/components/marketplace/LiveProductCard';

export type DropsCollectionSection = {
  id: string;
  brandSlug: string;
  brandName: string;
  collectionId: string;
  collectionName: string;
  tokenSymbol: string;
  products: LiveCatalogProduct[];
  brandHref: string;
};

function collectionSection(
  brand: PublishedBrand,
  collection: PublishedCollection
): DropsCollectionSection | null {
  if (collection.products.length === 0) return null;

  const products: LiveCatalogProduct[] = collection.products.map((product, index) => ({
    id: `${brand.slug}-${product.id}`,
    brandSlug: brand.slug,
    brandName: brand.name,
    collectionName: collection.name,
    tokenSymbol: collection.tokenSymbol,
    name: product.name,
    priceUsd: product.priceUsd,
    href: publishedProductHref(product, brand.slug),
    image: resolveProductImageUrl(product.imageUrl, product.id) ?? brand.logoUrl,
    cardTone: cardToneForIndex(index),
    source: 'awebo' as const,
  }));

  return {
    id: `${brand.slug}-${collection.id}`,
    brandSlug: brand.slug,
    brandName: brand.name,
    collectionId: collection.id,
    collectionName: collection.name,
    tokenSymbol: collection.tokenSymbol,
    products,
    brandHref: `/marketplace/brand/${brand.slug}`,
  };
}

export async function listDropsCollectionSections(): Promise<DropsCollectionSection[]> {
  const publishedBrands = await listPublishedBrandsSafe();

  const sections = publishedBrands.flatMap((brand) =>
    brand.collections
      .map((collection) => collectionSection(brand, collection))
      .filter((section): section is DropsCollectionSection => section !== null)
  );

  if (isEvershopCheckoutEnabled()) {
    try {
      const items = await listEvershopProducts();
      if (items.length > 0) {
        sections.push({
          id: 'evershop-catalog',
          brandSlug: 'evershop',
          brandName: 'EverShop',
          collectionId: 'evershop',
          collectionName: 'EverShop catalog',
          tokenSymbol: 'MERCH',
          brandHref: '/drops',
          products: items.map((item, index) => ({
            id: `evershop-${item.productId}`,
            brandSlug: item.urlKey.split('-')[0] ?? 'evershop',
            brandName: item.name.split('—')[0]?.trim() || item.name,
            collectionName: 'EverShop catalog',
            tokenSymbol: 'MERCH',
            name: item.name,
            priceUsd: item.priceUsd,
            href: `/drops/product/${item.urlKey}`,
            image: item.imageUrl,
            cardTone: cardToneForIndex(index + sections.length),
            source: 'evershop' as const,
          })),
        });
      }
    } catch {
      // EverShop may be offline.
    }
  }

  return sections;
}
