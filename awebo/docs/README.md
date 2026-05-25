# AWEBO Documentation Index

Start here for platform architecture and backend handoff.

## Core architecture

| Document | Description |
|----------|-------------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | **Start here** — brands, collections, products, pages, data flow, preview vs EverShop commerce |
| [EVERSHOP_INTEGRATION.md](./EVERSHOP_INTEGRATION.md) | EverShop setup, admin guide, production deployment |
| [backend-migrations/README.md](./backend-migrations/README.md) | Supabase schema migrations (001–007) |
| [backend-migrations/api-contracts.md](./backend-migrations/api-contracts.md) | API request/response shapes |
| [backend-migrations/type-mappings.md](./backend-migrations/type-mappings.md) | TypeScript ↔ Postgres columns |

## Product & UX

| Document | Description |
|----------|-------------|
| [USER_FLOW_DIAGRAMS.md](./USER_FLOW_DIAGRAMS.md) | User journey diagrams |
| [USER_FLOW_FEATURE_CHECKLIST.md](./USER_FLOW_FEATURE_CHECKLIST.md) | Feature checklist |
| [SCOPE_UX_FRONTEND.md](./SCOPE_UX_FRONTEND.md) | Frontend scope |
| [BRAND_MANUAL.md](./BRAND_MANUAL.md) | Brand guidelines |

## Implementation & ops

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Sprint implementation plan |
| [merch-backend-considerations.md](./merch-backend-considerations.md) | Merch backend notes |
| [referral-and-shipping.md](./referral-and-shipping.md) | Referrals + shipping |
| [sanity-setup.md](./sanity-setup.md) | Sanity CMS |

## Quick reference: routes

| Route | Purpose |
|-------|---------|
| `/launch` | Publish a brand |
| `/marketplace` | Collection token performance |
| `/marketplace/brand/[slug]` | Brand storefront |
| `/marketplace/product/[id]` | Product detail (preview checkout) |
| `/drops` | Physical product feed |
| `/drops/my` | Creator dashboard |

## Commerce flag

Preview mode (current default): `AWEBO_EVERSHOP_CHECKOUT=false`

All product links use AWEBO pages. EverShop is skipped at publish and in the catalog API.

When EverShop is deployed: set `AWEBO_EVERSHOP_CHECKOUT=true` and configure `EVERSHOP_*` env vars. See [EVERSHOP_INTEGRATION.md](./EVERSHOP_INTEGRATION.md).
