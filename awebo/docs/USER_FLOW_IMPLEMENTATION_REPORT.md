# User flow implementation — pre-commit report

**Related:** Spec-aligned flowcharts (Mermaid) → [`USER_FLOW_DIAGRAMS.md`](./USER_FLOW_DIAGRAMS.md).

**Scope:** Marketplace user flow (PDF) + Brand Studio / creator flow (PDF), implemented as **Next.js App Router UI scaffolding** with **mock data** (no new backend, auth, or payments wired yet).

**Date:** April 25, 2026

---

## Summary

- New **`/marketplace`** area mirrors the marketplace sitemap: discovery home, category listing, product detail, public brand storefront, fundraising page, cart, multi-step checkout, favorites, notifications, and shared chrome (header, footer, floating support stub).
- **`/launch`** (and **`LaunchWizardModal`**) were refactored from five generic steps to **four steps** aligned with the Brand Studio PDF: brand setup → catalog and products → brand contract → review and publish.
- **`/explore`** now **redirects** to **`/marketplace`**; marketing nav and footer links were updated to point at the marketplace.

---

## Marketplace (`/marketplace`)

| Route | Purpose |
|--------|--------|
| `/marketplace` | Landing: search (UI), category dropdown, category tiles, featured brands, curated rails, mixed product grid |
| `/marketplace/category/[slug]` | Breadcrumb, filters (sidebar), sort, product grid |
| `/marketplace/product/[id]` | PDP: hero placeholder, variants, CTAs, details/reviews placeholders |
| `/marketplace/brand/[slug]` | Public storefront: hero, actions, tabs via `?tab=` (products, collections, activity, about), fundraising link when applicable |
| `/marketplace/brand/[slug]/fundraising` | Campaign UI (progress, supporters stub, products, support module); **404** if brand is not in fundraising mode in mock data |
| `/marketplace/cart` | Line items; optional **`?add={productId}`** to simulate one item |
| `/marketplace/checkout` | Three steps: delivery → payment (Web2/Web3 stubs) → confirmation with generated order id |
| `/marketplace/favorites` | Tabs + empty state + login copy hook |
| `/marketplace/notifications` | Platform announcements placeholder |

**Layout:** `app/marketplace/layout.tsx` wraps routes with `MarketplaceHeader`, `MarketplaceFooter`, `FloatingSupportStub`.

**Data:** `lib/marketplace-data.ts` — categories, mock products, mock brands (including one fundraising brand for demo).

**Components:** `components/marketplace/` — `MarketplaceHeader`, `MarketplaceFooter`, `ProductCard`, `FloatingSupportStub`.

---

## Brand Studio (`/launch`)

**Steps (4):** Defined in `app/launch/launch-steps.tsx` and used by `LaunchWizard.tsx` and `LaunchWizardModal.tsx`.

1. **Brand setup** — Name, banner/logo uploads (placeholders), symbol, narrative, social URLs, live profile preview panel.
2. **Catalog and products** — Catalog strip mock, “Start designing” overlay (product editor stub), my products table with Draft / Pricing / Ready.
3. **Brand contract** — Self-funded vs community funding, chain chips, fixed supply field, owner/community split, max % per wallet, optional whitelist when crowdfunding, “Create contract” stub.
4. **Review and publish** — Checklist, per-product final price inputs, optional sample note, publish confirmation modal, simulated post-publish CTA (fundraising vs marketplace).

**Copy/branding:** Header subtitle **BRAND STUDIO**; footer **AWEBO BRAND STUDIO V.1.0**.

---

## Navigation and redirects

- `components/Navigation.tsx` — primary discovery link label **MARKETPLACE** → `/marketplace`.
- `components/Footer.tsx` — **Marketplace** link.
- `components/landing/LandingPhygital.tsx` — default rail hrefs → `/marketplace`.
- `app/explore/page.tsx` — `redirect('/marketplace')`.

---

## Build

- `npm run build` succeeds (Next.js 14.2.5).

---

## Explicitly out of scope (this pass)

- Real authentication (favorites, contact brand, checkout rules still copy/UI only).
- Cart persistence, inventory, payments, wallet signing, contracts.
- Search, infinite scroll, and filter state backed by APIs or URL sync beyond placeholders.
- Sanity or DB models for marketplace entities.

---

## Suggested commit message

```
feat: marketplace routes + 4-step Brand Studio from UX PDFs

- Add /marketplace (home, category, PDP, brand, fundraising, cart, checkout, favorites, notifications)
- Refactor /launch wizard to four steps; align LaunchWizardModal
- Mock catalog in lib/marketplace-data; shared marketplace components
- Redirect /explore to /marketplace; update nav/footer/phygital links
```

---

## Files to review in PR

- `app/marketplace/**`
- `app/launch/LaunchWizard.tsx`, `LaunchWizardModal.tsx`, `launch-steps.tsx`
- `app/explore/page.tsx`
- `components/marketplace/**`
- `components/Navigation.tsx`, `Footer.tsx`, `landing/LandingPhygital.tsx`
- `lib/marketplace-data.ts`
