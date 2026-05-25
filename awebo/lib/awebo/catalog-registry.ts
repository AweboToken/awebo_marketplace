import { promises as fs } from 'fs';
import path from 'path';
import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import type { PublishedBrand, PublishedProduct } from '@/lib/awebo/catalog-types';
import { isSupabaseAdminConfigured } from '@/utils/supabase/admin';
import {
  getPublishedBrandBySlugFromSupabase,
  listPublishedBrandsByOwnerFromSupabase,
  listPublishedBrandsFromSupabase,
  savePublishedBrandToSupabase,
} from '@/lib/awebo/supabase-catalog';

export type {
  PublishedBrand,
  PublishedCollection,
  PublishedProduct,
} from '@/lib/awebo/catalog-types';

type CatalogFile = {
  brands: PublishedBrand[];
};

const CATALOG_DIR = path.join(process.cwd(), 'data');
const CATALOG_PATH = path.join(CATALOG_DIR, 'awebo-catalog.json');

const CARD_TONES = [
  'bg-[#f3e8ef]',
  'bg-[#e3edf8]',
  'bg-[#e2f0ea]',
  'bg-[#f0ece3]',
  'bg-[#e8edf8]',
];

async function readCatalog(): Promise<CatalogFile> {
  try {
    const raw = await fs.readFile(CATALOG_PATH, 'utf8');
    const parsed = JSON.parse(raw) as CatalogFile;
    return { brands: parsed.brands ?? [] };
  } catch {
    return { brands: [] };
  }
}

async function writeCatalog(catalog: CatalogFile): Promise<void> {
  await fs.mkdir(CATALOG_DIR, { recursive: true });
  await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
}

export function slugifyBrandName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export async function savePublishedBrand(
  brand: PublishedBrand,
  values?: LaunchWizardValues
): Promise<PublishedBrand> {
  if (isSupabaseAdminConfigured()) {
    if (!values) {
      throw new Error('Launch wizard values are required when saving to Supabase.');
    }
    return savePublishedBrandToSupabase(brand, values);
  }

  const catalog = await readCatalog();
  const withoutExisting = catalog.brands.filter((entry) => entry.slug !== brand.slug);
  catalog.brands = [brand, ...withoutExisting];
  await writeCatalog(catalog);
  return brand;
}

export async function listPublishedBrands(): Promise<PublishedBrand[]> {
  if (isSupabaseAdminConfigured()) {
    return listPublishedBrandsFromSupabase();
  }

  const catalog = await readCatalog();
  return catalog.brands;
}

export async function listPublishedBrandsByOwner(
  ownerId: string
): Promise<PublishedBrand[]> {
  if (isSupabaseAdminConfigured()) {
    return listPublishedBrandsByOwnerFromSupabase(ownerId);
  }

  const catalog = await readCatalog();
  return catalog.brands.filter((brand) => brand.ownerId === ownerId);
}

export async function getPublishedBrandBySlug(
  slug: string
): Promise<PublishedBrand | undefined> {
  if (isSupabaseAdminConfigured()) {
    return getPublishedBrandBySlugFromSupabase(slug);
  }

  const catalog = await readCatalog();
  return catalog.brands.find((brand) => brand.slug === slug);
}

export function publishedBrandToExploreCard(
  brand: PublishedBrand,
  index: number
) {
  const productCount = brand.collections.reduce(
    (total, collection) => total + collection.products.length,
    0
  );

  return {
    slug: brand.slug,
    name: brand.name,
    description: brand.story || 'Creator brand on AWEBO.',
    category: brand.launchMode === 'crowdfund' ? 'Live' : 'NEW',
    itemCount: productCount,
    rating: 4.8,
    reviews: 12,
    image:
      brand.logoUrl ??
      'https://ext.same-assets.com/1892170632/415736903.png',
    cardTone: CARD_TONES[index % CARD_TONES.length],
    featured: index === 0,
    favorited: false,
    href: `/marketplace/brand/${brand.slug}`,
  };
}

export function publishedProductHref(product: PublishedProduct): string {
  if (product.evershopUrlKey) {
    return `/drops/product/${product.evershopUrlKey}`;
  }
  return `/marketplace/product/${product.id}`;
}

export function cardToneForIndex(index: number): string {
  return CARD_TONES[index % CARD_TONES.length];
}
