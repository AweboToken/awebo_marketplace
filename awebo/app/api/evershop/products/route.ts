import { NextResponse } from 'next/server';
import { cardToneForIndex } from '@/lib/awebo/catalog-registry';
import { listPublishedBrandsSafe } from '@/lib/awebo/catalog-read';
import { publishedProductHref } from '@/lib/awebo/catalog-product-links';
import { isEvershopCheckoutEnabled } from '@/lib/awebo/commerce-config';
import { publishedBrandToCollectionCards } from '@/lib/marketplace-collection-cards';
import { listEvershopProducts } from '@/lib/evershop/storefront-client';
import { resolveProductImageUrl } from '@/lib/launch-catalog-images';

export async function GET() {
  const publishedBrands = await listPublishedBrandsSafe();
  const collectionCards = publishedBrands.flatMap((brand) =>
    publishedBrandToCollectionCards(brand, { live: true })
  );

  const publishedProducts = publishedBrands.flatMap((brand) =>
    brand.collections.flatMap((collection) =>
      collection.products.map((product, index) => ({
        id: `${brand.slug}-${product.id}`,
        brandSlug: brand.slug,
        brandName: brand.name,
        collectionName: collection.name,
        collectionId: collection.id,
        tokenSymbol: collection.tokenSymbol,
        name: product.name,
        priceUsd: product.priceUsd,
        href: publishedProductHref(product, brand.slug),
        image: resolveProductImageUrl(product.imageUrl, product.id) ?? brand.logoUrl,
        cardTone: cardToneForIndex(index),
        source: 'awebo' as const,
      }))
    )
  );

  let evershopProducts: Array<{
    id: string;
    brandSlug: string;
    brandName: string;
    collectionName: string;
    tokenSymbol: string;
    name: string;
    priceUsd: number;
    href: string;
    image: string | null;
    cardTone: string;
    source: 'evershop';
  }> = [];

  if (isEvershopCheckoutEnabled()) {
    try {
      const items = await listEvershopProducts();
      evershopProducts = items.map((item, index) => ({
        id: `evershop-${item.productId}`,
        brandSlug: item.urlKey.split('-')[0] ?? 'evershop',
        brandName: item.name.split('—')[0]?.trim() || item.name,
        collectionName: 'EverShop catalog',
        tokenSymbol: 'MERCH',
        name: item.name,
        priceUsd: item.priceUsd,
        href: `/drops/product/${item.urlKey}`,
        image: item.imageUrl,
        cardTone: cardToneForIndex(index + publishedProducts.length),
        source: 'evershop' as const,
      }));
    } catch {
      // EverShop may be offline.
    }
  }

  return NextResponse.json({
    collections: collectionCards,
    products: [...publishedProducts, ...evershopProducts],
  });
}
