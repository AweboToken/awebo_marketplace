import { NextResponse } from 'next/server';
import {
  cardToneForIndex,
  listPublishedBrands,
  publishedBrandToExploreCard,
  publishedProductHref,
} from '@/lib/awebo/catalog-registry';
import { listEvershopProducts } from '@/lib/evershop/storefront-client';

export async function GET() {
  const publishedBrands = await listPublishedBrands();
  const brandCards = publishedBrands.map((brand, index) =>
    publishedBrandToExploreCard(brand, index)
  );

  const publishedProducts = publishedBrands.flatMap((brand) =>
    brand.collections.flatMap((collection) =>
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
    // EverShop may be offline during local development.
  }

  return NextResponse.json({
    brands: brandCards,
    products: [...publishedProducts, ...evershopProducts],
  });
}
