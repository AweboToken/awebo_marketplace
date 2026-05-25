import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import {
  savePublishedBrand,
  slugifyBrandName,
  type PublishedBrand,
  type PublishedProduct,
} from '@/lib/awebo/catalog-registry';
import { createEvershopProduct } from '@/lib/evershop/admin-client';
import { isEvershopSyncEnabled } from '@/lib/awebo/commerce-config';
import { isSupabaseAdminConfigured } from '@/utils/supabase/admin';

export type LaunchProductInput = {
  id: string;
  name: string;
  priceUsd: number;
};

export type PublishLaunchInput = {
  ownerId?: string;
  values: LaunchWizardValues;
  products: LaunchProductInput[];
};

export type PublishLaunchResult = {
  brand: PublishedBrand;
  mode: 'evershop' | 'local';
  warnings: string[];
};

function buildSku(brandSlug: string, productId: string): string {
  return `AWEBO-${brandSlug}-${productId}`.toUpperCase().replace(/[^A-Z0-9-]/g, '-');
}

function buildUrlKey(brandSlug: string, productId: string): string {
  return `${brandSlug}-${productId}`.replace(/[^a-z0-9-]/g, '-');
}

export async function publishLaunchBrand(
  input: PublishLaunchInput
): Promise<PublishLaunchResult> {
  const { values, products, ownerId } = input;
  const normalizedOwnerId = ownerId?.trim();

  if (isSupabaseAdminConfigured() && (!normalizedOwnerId || normalizedOwnerId.length < 8)) {
    throw new Error('A signed-in creator account is required to publish.');
  }

  const brandSlug = slugifyBrandName(values.brandName || values.symbol || 'brand');
  const collectionSlug = slugifyBrandName(values.collectionName || 'genesis');
  const collectionName = values.collectionName.trim() || 'Genesis collection';
  const warnings: string[] = [];
  const publishedProducts: PublishedProduct[] = [];
  const evershopConfigured = isEvershopSyncEnabled();

  if (!evershopConfigured) {
    warnings.push(
      'EverShop sync is disabled — products use AWEBO preview pages. Set AWEBO_EVERSHOP_CHECKOUT=true and EverShop admin credentials when ready.'
    );
  }

  for (const product of products) {
    const sku = buildSku(brandSlug, product.id);
    const urlKey = buildUrlKey(brandSlug, product.id);
    let evershopUuid: string | undefined;
    let evershopUrlKey: string | undefined;

    if (evershopConfigured) {
      try {
        const created = await createEvershopProduct({
          name: `${values.brandName} — ${product.name}`,
          url_key: urlKey,
          sku,
          price: product.priceUsd,
          qty: 100,
          short_description: values.story.slice(0, 240) || undefined,
          status: 1,
        });
        evershopUuid = created.uuid;
        evershopUrlKey = created.url_key ?? urlKey;
      } catch (error) {
        warnings.push(
          `EverShop product "${product.name}" failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }

    publishedProducts.push({
      id: product.id,
      name: product.name,
      priceUsd: product.priceUsd,
      evershopUuid,
      evershopUrlKey,
      sku,
    });
  }

  const brand: PublishedBrand = {
    id: brandSlug,
    slug: brandSlug,
    ownerId: normalizedOwnerId || undefined,
    name: values.brandName || 'Untitled brand',
    story: values.story,
    logoUrl: values.logoUrl,
    bannerUrl: values.bannerUrl,
    launchMode: values.launchMode,
    chain: values.chain,
    supply: values.supply,
    publishedAt: new Date().toISOString(),
    collections: [
      {
        id: `${brandSlug}-${collectionSlug}`,
        name: collectionName,
        tokenSymbol: values.symbol || brandSlug.toUpperCase(),
        products: publishedProducts,
      },
    ],
  };

  await savePublishedBrand(brand, values);

  return {
    brand,
    mode: publishedProducts.some((product) => product.evershopUuid) ? 'evershop' : 'local',
    warnings,
  };
}
