# Migration 002 — Brands, Collections, Products

**Priority:** P0 (required for publish)  
**Replaces:** `data/awebo-catalog.json`  
**Unblocks:** `POST /api/launch/publish`, `GET /api/evershop/products`, marketplace/drops feeds

## Purpose

Store published brand metadata and the link to EverShop SKUs. One brand can have multiple collections later; today every publish creates a single **Genesis collection**.

## TypeScript source of truth

```typescript
// lib/awebo/catalog-registry.ts
type PublishedBrand = {
  id: string;           // today: same as slug
  slug: string;
  name: string;
  story: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  launchMode: 'self' | 'crowdfund';
  chain: string;
  supply: string;
  publishedAt: string;
  collections: PublishedCollection[];
};

type PublishedCollection = {
  id: string;           // e.g. "{slug}-genesis"
  name: string;
  tokenSymbol: string;
  products: PublishedProduct[];
};

type PublishedProduct = {
  id: string;
  name: string;
  priceUsd: number;
  sku: string;
  evershopUuid?: string;
  evershopUrlKey?: string;
};
```

## Known gap to fix on publish

`publishLaunchBrand()` accepts `ownerId` in the API route but **does not persist it** to the catalog today. The DB schema requires `brands.owner_id`.

## SQL

```sql
-- 002_brands_catalog.sql
-- Requires: 001_creators_and_launch_drafts.sql

create table brands (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null references creators(id) on delete cascade,
  slug text not null unique,
  name text not null,
  story text default '',
  logo_url text,
  banner_url text,
  symbol text,
  twitter_url text,
  instagram_url text,
  launch_mode text not null default 'self'
    check (launch_mode in ('self', 'crowdfund')),
  chain text not null default 'Base',
  supply text not null default '100',
  owner_pct smallint not null default 80,
  max_wallet_pct smallint not null default 5,
  whitelist_enabled boolean not null default false,
  contract_address text,
  status text not null default 'published'
    check (status in ('draft', 'published', 'fundraising', 'live')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_brands_owner on brands(owner_id);
create index idx_brands_slug on brands(slug);
create index idx_brands_status on brands(status);
create index idx_brands_launch_mode on brands(launch_mode);

create table brand_collections (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  external_id text not null,
  name text not null,
  token_symbol text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (brand_id, external_id)
);

create index idx_brand_collections_brand on brand_collections(brand_id);

create table brand_products (
  id text not null,
  collection_id uuid not null references brand_collections(id) on delete cascade,
  name text not null,
  price_usd numeric(10,2) not null,
  sku text not null,
  status text not null default 'Ready'
    check (status in ('Draft', 'Pricing', 'Ready')),
  evershop_uuid text,
  evershop_url_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection_id, id)
);

create index idx_brand_products_sku on brand_products(sku);
create index idx_brand_products_evershop on brand_products(evershop_url_key);

create trigger brands_updated_at
  before update on brands
  for each row execute function set_updated_at();

create trigger brand_products_updated_at
  before update on brand_products
  for each row execute function set_updated_at();
```

## Publish transaction (recommended)

When `POST /api/launch/publish` succeeds:

1. Upsert `creators` for `owner_id`
2. Insert `brands` row (or update if re-publishing same slug — product decision)
3. Insert `brand_collections` with `external_id = '{slug}-genesis'`
4. Insert each `brand_products` row
5. If `launch_mode = 'crowdfund'`, set `brands.status = 'fundraising'` and create campaign (see 004)
6. Mark `launch_drafts.status = 'published'`
7. Create EverShop products (external API — unchanged)

## Product href logic (frontend)

```typescript
// If evershop_url_key exists → /drops/product/{evershop_url_key}
// Else → /marketplace/product/{id}
```

## Sample read query (marketplace feed)

```sql
select
  b.slug,
  b.name,
  b.story,
  b.logo_url,
  b.launch_mode,
  b.published_at,
  count(bp.id) as product_count
from brands b
join brand_collections bc on bc.brand_id = b.id
join brand_products bp on bp.collection_id = bc.id
where b.status in ('published', 'fundraising', 'live')
group by b.id
order by b.published_at desc;
```

## Sample read query (single brand page)

```sql
select
  b.*,
  json_agg(
    json_build_object(
      'collection', bc.external_id,
      'collectionName', bc.name,
      'tokenSymbol', bc.token_symbol,
      'products', (
        select json_agg(json_build_object(
          'id', bp.id,
          'name', bp.name,
          'priceUsd', bp.price_usd,
          'sku', bp.sku,
          'evershopUuid', bp.evershop_uuid,
          'evershopUrlKey', bp.evershop_url_key
        ))
        from brand_products bp
        where bp.collection_id = bc.id
      )
    )
  ) as collections
from brands b
join brand_collections bc on bc.brand_id = b.id
where b.slug = $1
group by b.id;
```

## Rollback

```sql
drop table if exists brand_products;
drop table if exists brand_collections;
drop table if exists brands;
```
