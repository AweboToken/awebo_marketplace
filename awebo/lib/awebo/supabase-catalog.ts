import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import { createAdminClient } from '@/utils/supabase/admin';
import type {
  PublishedBrand,
  PublishedCollection,
  PublishedProduct,
} from '@/lib/awebo/catalog-types';
import { resolveProductImageUrl } from '@/lib/launch-catalog-images';

type BrandRow = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  story: string | null;
  logo_url: string | null;
  banner_url: string | null;
  launch_mode: 'self' | 'crowdfund';
  chain: string;
  supply: string;
  published_at: string | null;
  brand_collections: Array<{
    external_id: string;
    name: string;
    token_symbol: string;
    brand_products: Array<{
      id: string;
      name: string;
      price_usd: number;
      image_url: string | null;
      sku: string;
      evershop_uuid: string | null;
      evershop_url_key: string | null;
    }>;
  }>;
};

function mapBrandRow(row: BrandRow): PublishedBrand {
  const collections: PublishedCollection[] = (row.brand_collections ?? []).map(
    (collection) => ({
      id: collection.external_id,
      name: collection.name,
      tokenSymbol: collection.token_symbol,
      products: (collection.brand_products ?? []).map(
        (product): PublishedProduct => ({
          id: product.id,
          name: product.name,
          priceUsd: Number(product.price_usd),
          imageUrl: resolveProductImageUrl(product.image_url, product.id),
          sku: product.sku,
          evershopUuid: product.evershop_uuid ?? undefined,
          evershopUrlKey: product.evershop_url_key ?? undefined,
        })
      ),
    })
  );

  return {
    id: row.slug,
    slug: row.slug,
    ownerId: row.owner_id,
    name: row.name,
    story: row.story ?? '',
    logoUrl: row.logo_url,
    bannerUrl: row.banner_url,
    launchMode: row.launch_mode,
    chain: row.chain,
    supply: row.supply,
    publishedAt: row.published_at ?? new Date().toISOString(),
    collections,
  };
}

const BRAND_SELECT = `
  id,
  owner_id,
  slug,
  name,
  story,
  logo_url,
  banner_url,
  launch_mode,
  chain,
  supply,
  published_at,
  brand_collections (
    external_id,
    name,
    token_symbol,
    brand_products (
      id,
      name,
      price_usd,
      image_url,
      sku,
      evershop_uuid,
      evershop_url_key
    )
  )
`;

function supabaseErrorMessage(error: { message: string; details?: string; hint?: string }) {
  return [error.message, error.details, error.hint].filter(Boolean).join(' — ');
}

export async function ensureCreator(ownerId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('creators').upsert({ id: ownerId }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to upsert creator: ${supabaseErrorMessage(error)}`);
  }
}

export async function savePublishedBrandToSupabase(
  brand: PublishedBrand,
  values: LaunchWizardValues
): Promise<PublishedBrand> {
  if (!brand.ownerId) {
    throw new Error('ownerId is required to publish a brand.');
  }

  const supabase = createAdminClient();
  await ensureCreator(brand.ownerId);

  const brandStatus = brand.launchMode === 'crowdfund' ? 'fundraising' : 'published';
  const publishedAt = brand.publishedAt || new Date().toISOString();

  const { data: brandRow, error: brandError } = await supabase
    .from('brands')
    .upsert(
      {
        owner_id: brand.ownerId,
        slug: brand.slug,
        name: brand.name,
        story: brand.story,
        logo_url: brand.logoUrl,
        banner_url: brand.bannerUrl,
        symbol: values.symbol || null,
        twitter_url: values.twitter || null,
        instagram_url: values.instagram || null,
        launch_mode: brand.launchMode,
        chain: brand.chain,
        supply: brand.supply,
        owner_pct: values.ownerPct,
        max_wallet_pct: values.maxWalletPct,
        whitelist_enabled: values.whitelist,
        status: brandStatus,
        published_at: publishedAt,
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();

  if (brandError || !brandRow) {
    throw new Error(
      `Failed to save brand: ${supabaseErrorMessage(brandError ?? { message: 'No brand row returned' })}`
    );
  }

  const collection = brand.collections[0];
  if (!collection) {
    throw new Error('At least one collection is required to publish a brand.');
  }

  const { data: collectionRow, error: collectionError } = await supabase
    .from('brand_collections')
    .upsert(
      {
        brand_id: brandRow.id,
        external_id: collection.id,
        name: collection.name,
        token_symbol: collection.tokenSymbol,
        sort_order: 0,
      },
      { onConflict: 'brand_id,external_id' }
    )
    .select('id')
    .single();

  if (collectionError || !collectionRow) {
    throw new Error(
      `Failed to save collection: ${supabaseErrorMessage(
        collectionError ?? { message: 'No collection row returned' }
      )}`
    );
  }

  const productRows = collection.products.map((product) => ({
    collection_id: collectionRow.id,
    id: product.id,
    name: product.name,
    price_usd: product.priceUsd,
    image_url: product.imageUrl ?? null,
    sku: product.sku,
    status: 'Ready' as const,
    evershop_uuid: product.evershopUuid ?? null,
    evershop_url_key: product.evershopUrlKey ?? null,
  }));

  const { error: productsError } = await supabase
    .from('brand_products')
    .upsert(productRows, { onConflict: 'collection_id,id' });

  if (productsError) {
    throw new Error(`Failed to save products: ${supabaseErrorMessage(productsError)}`);
  }

  if (brand.launchMode === 'crowdfund') {
    const supply = Number.parseInt(values.supply, 10);
    const { error: campaignError } = await supabase.from('fundraising_campaigns').upsert(
      {
        brand_id: brandRow.id,
        supply: Number.isFinite(supply) ? supply : null,
        status: 'active',
      },
      { onConflict: 'brand_id' }
    );

    if (campaignError) {
      throw new Error(`Failed to save fundraising campaign: ${supabaseErrorMessage(campaignError)}`);
    }
  }

  const saved = await getPublishedBrandBySlugFromSupabase(brand.slug);
  if (!saved) {
    throw new Error('Brand was saved but could not be loaded.');
  }

  return saved;
}

export async function listPublishedBrandsFromSupabase(): Promise<PublishedBrand[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('brands')
    .select(BRAND_SELECT)
    .in('status', ['published', 'fundraising', 'live'])
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list brands: ${supabaseErrorMessage(error)}`);
  }

  return (data as BrandRow[]).map(mapBrandRow);
}

export async function listPublishedBrandsByOwnerFromSupabase(
  ownerId: string
): Promise<PublishedBrand[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('brands')
    .select(BRAND_SELECT)
    .eq('owner_id', ownerId)
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list creator brands: ${supabaseErrorMessage(error)}`);
  }

  return (data as BrandRow[]).map(mapBrandRow);
}

export async function getPublishedBrandBySlugFromSupabase(
  slug: string
): Promise<PublishedBrand | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('brands')
    .select(BRAND_SELECT)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load brand: ${supabaseErrorMessage(error)}`);
  }

  if (!data) return undefined;
  return mapBrandRow(data as BrandRow);
}
