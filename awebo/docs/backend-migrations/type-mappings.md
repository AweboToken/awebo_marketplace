# Type Mappings — TypeScript ↔ Postgres

Reference for backend team aligning DB columns with frontend types.

---

## `LaunchWizardValues`

**Source:** `lib/launch-wizard-types.ts`  
**Stored in:** `launch_drafts.values` (jsonb)

| TS field | JSON key | DB column (when published) | Notes |
|----------|----------|----------------------------|-------|
| `brandName` | `brandName` | `brands.name` | Required for publish |
| `bannerUrl` | `bannerUrl` | `brands.banner_url` | Nullable; blob URLs stripped |
| `logoUrl` | `logoUrl` | `brands.logo_url` | Nullable |
| `symbol` | `symbol` | `brands.symbol`, `brand_collections.token_symbol` | Token ticker |
| `story` | `story` | `brands.story` | |
| `twitter` | `twitter` | `brands.twitter_url` | |
| `instagram` | `instagram` | `brands.instagram_url` | |
| `launchMode` | `launchMode` | `brands.launch_mode` | `'self'` \| `'crowdfund'` |
| `chain` | `chain` | `brands.chain` | Default `'Base'` |
| `supply` | `supply` | `brands.supply` | String in TS; int in fundraising |
| `ownerPct` | `ownerPct` | `brands.owner_pct` | 0–100 |
| `maxWalletPct` | `maxWalletPct` | `brands.max_wallet_pct` | 0–100 |
| `whitelist` | `whitelist` | `brands.whitelist_enabled` | boolean |
| `products[]` | `products` | `brand_products` rows | See below |

### `LaunchWizardProduct` (inside `values.products`)

| TS field | DB column |
|----------|-----------|
| `id` | `brand_products.id` |
| `name` | `brand_products.name` |
| `status` | `brand_products.status` |

---

## `LaunchDraftRecord`

**Source:** `lib/awebo/launch-draft-store.ts`  
**Table:** `launch_drafts`

| TS field | DB column | Type |
|----------|-----------|------|
| `ownerId` | `owner_id` | text PK, FK → creators |
| `stepIndex` | `step_index` | smallint 0–3 |
| `values` | `values` | jsonb |
| `productPrices` | `product_prices` | jsonb |
| `updatedAt` | `updated_at` | timestamptz |
| `status` | `status` | `'draft'` \| `'published'` |

---

## `PublishedBrand`

**Source:** `lib/awebo/catalog-registry.ts`  
**Table:** `brands` (+ joined collections/products)

| TS field | DB column | Notes |
|----------|-----------|-------|
| `id` | `brands.id` (uuid) or `slug` | TS uses slug as id today |
| `ownerId` | `brands.owner_id` | Privy user ID — required for My Drops |
| `slug` | `brands.slug` | unique |
| `name` | `brands.name` | |
| `story` | `brands.story` | |
| `logoUrl` | `brands.logo_url` | snake_case in DB |
| `bannerUrl` | `brands.banner_url` | |
| `launchMode` | `brands.launch_mode` | |
| `chain` | `brands.chain` | |
| `supply` | `brands.supply` | |
| `publishedAt` | `brands.published_at` | |
| `collections` | join `brand_collections` + `brand_products` | |

**Not in TS type today but in DB:**

| DB column | Source |
|-----------|--------|
| `owner_id` | `POST /api/launch/publish` body `ownerId` |
| `symbol` | `values.symbol` |
| `twitter_url`, `instagram_url` | wizard socials |
| `owner_pct`, `max_wallet_pct`, `whitelist_enabled` | contract step |
| `contract_address` | future on-chain |
| `status` | `'published'` or `'fundraising'` |

---

## `PublishedCollection`

**Table:** `brand_collections`

| TS field | DB column |
|----------|-----------|
| `id` | `external_id` |
| `name` | `name` |
| `tokenSymbol` | `token_symbol` |
| `products` | join `brand_products` |

---

## `PublishedProduct`

**Table:** `brand_products`

| TS field | DB column |
|----------|-----------|
| `id` | `id` (composite PK with collection_id) |
| `name` | `name` |
| `priceUsd` | `price_usd` |
| `sku` | `sku` |
| `evershopUuid` | `evershop_uuid` |
| `evershopUrlKey` | `evershop_url_key` |

---

## Slug generation

**Source:** `lib/awebo/catalog-registry.ts` → `slugifyBrandName()`

```
trim → lowercase → replace non-alphanumeric with `-` → trim hyphens → max 64 chars
```

Publish uses: `slugifyBrandName(values.brandName || values.symbol || 'brand')`

---

## SKU / URL key generation

**Source:** `lib/awebo/launch-publish.ts`

```typescript
sku = `AWEBO-${brandSlug}-${productId}`.toUpperCase().replace(/[^A-Z0-9-]/g, '-')
urlKey = `${brandSlug}-${productId}`.replace(/[^a-z0-9-]/g, '-')
```

---

## Enum reference

| Field | Allowed values |
|-------|----------------|
| `launch_mode` | `self`, `crowdfund` |
| `brands.status` | `draft`, `published`, `fundraising`, `live` |
| `launch_drafts.status` | `draft`, `published` |
| `brand_products.status` | `Draft`, `Pricing`, `Ready` |
| `fundraising_campaigns.status` | `draft`, `active`, `completed`, `cancelled` |
| `fundraising_contributions.payment_mode` | `web2`, `web3` |
| `orders.status` | `pending`, `paid`, `shipped`, `delivered`, `cancelled`, `refunded` |
