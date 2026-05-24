# Multi-Tenant Creators — Architecture

**Priority:** P0 (foundational)  
**Applies to:** All launch, drops, and commerce migrations

## Principle

AWEBO is a **multi-creator marketplace**, not a single storefront with one admin.

| Role | What they use | Auth |
|------|---------------|------|
| **Creator** | `/launch`, `/drops/my` (My Drops dashboard) | Privy (AWEBO account) |
| **Shopper** | `/drops`, `/marketplace`, checkout | Optional wallet / guest |
| **Platform ops** | EverShop admin (`/drops/admin` dev proxy) | EverShop service account (server-only) |

**Creators never receive EverShop admin credentials.** The platform uses `EVERSHOP_ADMIN_EMAIL` / `EVERSHOP_ADMIN_PASSWORD` server-side to create SKUs when a creator publishes. Each creator sees only their own brands and products via `owner_id`.

## Data ownership model

```
Privy user (did:privy:...)
  └── creators.id
        └── brands.owner_id
              └── brand_collections
                    └── brand_products
                          └── evershop_uuid (platform-created SKU)
```

Every published brand **must** store `owner_id` = Privy user ID at publish time.

## Creator-facing surfaces (frontend)

| Route | Purpose |
|-------|---------|
| `/launch` | Auth-gated wizard (Privy + custom modal) |
| `/drops/my` | Creator dashboard — brands, products, stats for `owner_id` |
| `/drops` | Public feed + **My Drops** button (auth-gated) |

### API

| Endpoint | Description |
|----------|-------------|
| `GET /api/drops/my?ownerId=` | Brands + products + stats for one creator |
| `POST /api/launch/publish` | Persists `ownerId` on brand record |

**V1 note:** `ownerId` is passed from the authenticated client. **V2:** verify Privy JWT server-side before returning or writing data.

## EverShop integration (platform-level)

```
Creator publishes
  → AWEBO API (service role)
    → EverShop POST /api/products (platform admin token)
    → Store evershop_uuid on brand_products
  → Creator views /drops/my (AWEBO-native, filtered by owner_id)
```

EverShop remains system of record for:
- Inventory quantity
- Checkout / orders
- Fulfillment

AWEBO stores:
- Brand metadata
- `owner_id` linkage
- EverShop foreign keys (`evershop_uuid`, `evershop_url_key`, `sku`)

## Stats & orders (future)

Creator stats on `/drops/my` should eventually pull from:

```sql
-- Products per creator (available now)
select count(*) from brand_products bp
join brand_collections bc on bc.id = bp.collection_id
join brands b on b.id = bc.brand_id
where b.owner_id = $1;

-- Orders per creator (migration 005)
select count(*), sum(total_usd) from orders o
join brands b on b.id = o.brand_id
where b.owner_id = $1;
```

Do **not** expose EverShop admin order screens to creators.

## RLS implications

```sql
-- Creators read only their brands
create policy "owner_read_own_brands"
  on brands for select to authenticated
  using (owner_id = (auth.jwt() ->> 'sub'));

-- Public feed reads published brands from all creators
create policy "public_read_published_brands"
  on brands for select to anon, authenticated
  using (status in ('published', 'fundraising', 'live'));
```

## Migration checklist for backend team

- [ ] `brands.owner_id` NOT NULL after backfill
- [ ] Publish API rejects missing `ownerId` when Privy auth is enforced
- [ ] `GET /api/drops/my` verifies Privy JWT (replace query-param trust)
- [ ] EverShop admin creds only in server env — never per creator
- [ ] Order webhooks attribute sales to `brands.owner_id` for creator stats
- [ ] No documentation directing creators to `/drops/admin`

## Backfill existing catalog

Brands published before `owner_id` was added will not appear in My Drops until republished or manually backfilled:

```sql
update brands set owner_id = 'did:privy:...' where slug = 'brand-slug';
```
