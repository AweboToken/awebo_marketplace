# AWEBO Backend Migrations — Launchpad + EverShop

Handoff package for the backend team. These migrations replace the current **file-based** persistence (`data/launch-drafts.json`, `data/awebo-catalog.json`) with **Supabase Postgres** while keeping **EverShop** as the system of record for inventory, checkout, and orders.

## Current state

| Layer | Today | Target |
|-------|-------|--------|
| Wizard drafts | `data/launch-drafts.json` | `launch_drafts` table |
| Published brands | `data/awebo-catalog.json` | `brands`, `brand_collections`, `brand_products` |
| Creator identity | Privy (`did:privy:...`) | `creators` table |
| Product inventory | EverShop (external) | EverShop — store FKs only in `brand_products` |
| Auth sessions | Supabase (middleware only) | Same + RLS on app tables |

## Architecture

```
Creator (Privy)
  └── Brand (Launch wizard → publish)
        └── Collection (Genesis collection)
              ├── Token (on-chain — future)
              └── Products → EverShop SKUs (evershop_uuid, evershop_url_key)
```

**Do not duplicate EverShop inventory in Supabase.** AWEBO stores brand metadata and EverShop foreign keys; EverShop owns stock, pricing sync, checkout, and fulfillment.

## Migration order

Run in this sequence:

| # | File | Purpose |
|---|------|---------|
| 1 | [001-creators-and-launch-drafts.md](./001-creators-and-launch-drafts.md) | Creator identity + wizard autosave |
| 2 | [002-brands-catalog.md](./002-brands-catalog.md) | Published brands, collections, products |
| 3 | [003-brand-assets-storage.md](./003-brand-assets-storage.md) | Supabase Storage for banner/logo |
| 4 | [004-fundraising.md](./004-fundraising.md) | Crowdfund campaigns + contributions |
| 5 | [005-orders-and-referrals.md](./005-orders-and-referrals.md) | Order sync + referral codes (future) |
| 6 | [006-rls-policies.md](./006-rls-policies.md) | Row Level Security |

Also read:

- [api-contracts.md](./api-contracts.md) — HTTP endpoints the frontend calls today
- [type-mappings.md](./type-mappings.md) — TypeScript types ↔ DB columns

## Environment variables (already in frontend `.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://kzqkgczqgwhctfrljsua.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable__...

# Server-only (backend team — not in repo)
SUPABASE_SERVICE_ROLE_KEY=...

# EverShop (separate commerce DB)
EVERSHOP_URL=http://127.0.0.1:3001
EVERSHOP_ADMIN_EMAIL=...
EVERSHOP_ADMIN_PASSWORD=...
```

## Identity model (decision required)

The launch wizard uses **Privy** for creator login. Supabase Auth is wired for session refresh only.

**Recommended for v1:** API routes (`/api/launch/*`) use the **Supabase service role** key server-side. `owner_id` on all rows is the Privy user ID (`did:privy:...` or `guest-{uuid}`).

**Later:** Map Privy JWT → Supabase custom claims for direct client RLS.

## SKU / URL conventions (from publish code)

| Field | Pattern | Example |
|-------|---------|---------|
| Brand slug | lowercase, hyphenated | `lumen-atelier` |
| Product id | wizard id | `hoodie`, `tee` |
| SKU | `AWEBO-{brandSlug}-{productId}` | `AWEBO-LUMEN-ATELIER-HOODIE` |
| EverShop url_key | `{brandSlug}-{productId}` | `lumen-atelier-hoodie` |
| Collection external_id | `{brandSlug}-genesis` | `lumen-atelier-genesis` |

## Frontend files to rewire after migrations

| File | Change |
|------|--------|
| `lib/awebo/launch-draft-store.ts` | Read/write `launch_drafts` instead of JSON |
| `lib/awebo/catalog-registry.ts` | Read/write `brands` + related tables |
| `lib/awebo/launch-publish.ts` | Persist `owner_id`; insert fundraising row when `launchMode = crowdfund` |
| `app/marketplace/brand/[slug]/page.tsx` | Query Supabase instead of `lib/marketplace-data.ts` mocks |

## Out of scope (do not migrate)

- Legacy schema in `docs/IMPLEMENTATION_PLAN.md` (`merch_items`, `launchpad_tokens`, etc.)
- EverShop internal tables (products, orders, customers)
- Sanity CMS (`topCreator` schema) — marketing content only
