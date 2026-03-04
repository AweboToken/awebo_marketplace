# Merch backend: considering EverShop

**Status:** Under consideration (not decided).

We’re evaluating [EverShop](https://evershop.io/docs/development/getting-started/introduction) as the backend for **managing merch products on sale** and fulfillment.

## Why EverShop

- **Open-source**, Node.js + TypeScript, aligns with our stack.
- **Product management**: SKUs, variants, categories, images — fits launch merch catalog.
- **Orders & fulfillment**: Order lifecycle, shipping, admin panel for ops.
- **GraphQL API**: Can be consumed by the AWEBO Next.js app for “eligible” checkout flows.
- **PostgreSQL**: Matches the DB assumed in `system-flow-diagram.md`.

## Fit with AWEBO

- **AWEBO merch is launch- and eligibility-bound** (token/NFT holders get access), not an open store. EverShop would likely be used as:
  - **Product catalog + order/fulfillment backend** (admin: manage products, SKUs, shipping).
  - **API for checkout**: AWEBO frontend verifies eligibility (wallet/chain), then creates cart/order via EverShop API or a thin backend that delegates to EverShop.
- **Out of scope for now**: Full EverShop storefront; we keep the AWEBO Next.js UI as the only storefront, and use EverShop for backend/product/order management.

## Next steps (when we proceed)

1. Install EverShop (see [installation guide](https://evershop.io/docs/development/getting-started/installation-guide)) — likely as a separate service or sub-repo.
2. Define how **launch merch** maps to EverShop products (e.g. one product per launch SKU, or one product per launch with variants).
3. Design **eligibility gateway**: AWEBO API checks wallet/participation, then allows creating/updating EverShop cart or order (GraphQL or REST).
4. Connect **referral & shipping** flow from `referral-and-shipping.md` to EverShop orders (e.g. `?ref=` → order metadata; tracking back into our DB or EverShop).

No commitment to EverShop yet; this doc is to capture the option and link to the [EverShop introduction](https://evershop.io/docs/development/getting-started/introduction) before we lock the stack.
