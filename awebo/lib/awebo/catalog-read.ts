import {
  getPublishedBrandBySlug,
  listPublishedBrands,
  listPublishedBrandsByOwner,
} from '@/lib/awebo/catalog-registry';
import type { PublishedBrand } from '@/lib/awebo/catalog-types';

function logCatalogReadError(action: string, error: unknown) {
  console.error(`[awebo/catalog] ${action} failed:`, error);
}

/** Read published brands without taking down pages when Supabase is misconfigured. */
export async function listPublishedBrandsSafe(): Promise<PublishedBrand[]> {
  try {
    return await listPublishedBrands();
  } catch (error) {
    logCatalogReadError('listPublishedBrands', error);
    return [];
  }
}

export async function listPublishedBrandsByOwnerSafe(
  ownerId: string
): Promise<PublishedBrand[]> {
  try {
    return await listPublishedBrandsByOwner(ownerId);
  } catch (error) {
    logCatalogReadError('listPublishedBrandsByOwner', error);
    return [];
  }
}

export async function getPublishedBrandBySlugSafe(
  slug: string
): Promise<PublishedBrand | undefined> {
  try {
    return await getPublishedBrandBySlug(slug);
  } catch (error) {
    logCatalogReadError(`getPublishedBrandBySlug(${slug})`, error);
    return undefined;
  }
}
