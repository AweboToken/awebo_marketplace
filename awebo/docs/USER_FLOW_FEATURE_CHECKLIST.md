# PDF feature inventory vs production readiness

Cross-check of **Creator User Flow — Brand Studio** and **User Flow — marketplace** against the current app.  
**Ship-ready** = suitable for real users (backed, secure, tested as needed). **Partial** = UI or flow exists but missing backend, auth, payments, or hardening. **Stub / not in app** = missing or placeholder only.

---

## A. Brand Studio PDF (creator flow)

| Feature / component | Status | Note |
|---------------------|--------|------|
| Set brand name / create brand intent | Partial | Form fields only; no persisted brand record. |
| Login / access gate (Web3 wallet) | Partial | Privy exists app-wide; not enforced on `/launch` or gated actions. |
| Login / access gate (Web2: Google, Apple, email) | Partial | Same as above. |
| Step indicator (1 of 4 … 4 of 4) | Ship-ready* | *UI only; no server-enforced step order. |
| **Step 1 — Brand setup** | | |
| Upload banner | Stub | Placeholder drop zone; no storage or CDN. |
| Upload logo | Stub | Same. |
| Brand symbol / ticker | Partial | Field present; no validation or on-chain symbol reservation. |
| Narrative / story | Partial | Local textarea only. |
| Social links | Partial | URL fields only; no “verified links” pipeline. |
| Live preview of profile | Partial | Static preview panel; not bound to saved brand. |
| **Step 2 — Catalog & products** | | |
| Catalog home: search bar | Stub | Search in studio step is decorative. |
| Main categories (Men / Women / Kids / Home / Misc) | Partial | Chips as labels; link out to marketplace category as reference. |
| Rotating topic rails (6–8 topics) | Stub | Not implemented in studio; marketplace home has static rails. |
| Mega category overlay (all categories) | Partial | Studio: link only; marketplace: dropdown list (not full mega overlay). |
| Product category listing | Partial | Real listing only via `/marketplace/category/[slug]` with mock data. |
| Filter / sort (popular, newest, price, …) | Partial | Category page has controls; not wired to data or URL. |
| Category topic template / pick base garment | Stub | Copy only; no template system. |
| Product details + base cost | Partial | PDP mock shows price; no real cost engine. |
| “Start designing” entry | Partial | Opens overlay; no persistence. |
| Product editor overlay: upload artwork | Stub | Placeholder area. |
| Placement: Front / Back / Label | Partial | Toggle buttons; no real editor. |
| Variants: colors / sizes | Partial | UI on PDP and editor; not tied to SKU/inventory. |
| Preview mockups | Stub | No mockup generation service. |
| Save product / discard | Partial | Closes overlay only; no save API. |
| My products / my collections | Partial | Sample table; not connected to drafts. |
| Product status: Draft / Pricing / Ready | Partial | Display only in table. |
| **Step 3 — Brand contract** | | |
| Chain selection | Partial | Clickable chips; no chain config or wallet network lock. |
| Fixed supply (e.g. 100) | Stub | Read-only demo field. |
| Owner % / community % | Partial | Sliders local only. |
| Self-funded path (no shares / whitelist / crowdfunding) | Partial | Mode selectable; no contract branch logic on server. |
| Community funding path (crowdfunding mechanics) | Partial | UI copy + whitelist checkbox when selected; no raise logic. |
| Max % per wallet | Partial | Input present; not enforced on-chain. |
| Whitelist option | Partial | Checkbox only. |
| Holder earnings mechanics | Stub | Mentioned in PDF; not modeled in UI. |
| Create contract + wallet sign | Stub | Button only; no deployment or signing flow. |
| Show contract / contract address | Stub | Not shown after “deploy.” |
| Live on marketplace vs fundraising outcome | Partial | Simulated checkbox + post-publish links only. |
| **Step 4 — Review & publish** | | |
| Final review checklist | Partial | Checkboxes; not validated against real data. |
| “Pricing required for ALL products” | Partial | Table + inputs; no enforcement or API. |
| Final sale price (mandatory) per product | Partial | Same. |
| Public vs private (whitelist) at publish | Stub | Checkbox in checklist only. |
| Optional order sample (does not block publish) | Stub | Mentioned in copy; no flow. |
| Publish confirmation modal (“locks editing if fundraising”) | Partial | Modal works; no server lock. |
| After publish: redirect to fundraising page | Partial | Link to mock fundraising brand when simulated. |
| After publish: brand/products live on marketplace | Partial | Link to `/marketplace`; no automatic listing pipeline. |

---

## B. Marketplace PDF (shopper + brand surface)

| Feature / component | Status | Note |
|---------------------|--------|------|
| **Global header** | | |
| Logo → home | Ship-ready* | *Link works; prod needs canonical URL and analytics. |
| Search (products + brands) | Stub | Inputs do not query anything. |
| Favorites (login required) | Stub | Page shell; no auth or saved data. |
| Notifications | Stub | Dropdown + page placeholder; no feed source. |
| Profile (login) | Partial | Links to `/app/profile`; marketplace-specific profile not unified. |
| Cart (limited-time memory) | Stub | Query param demo; no TTL store or merge-on-login. |
| Category menu → category page | Partial | Dropdown + routes work; data is mock. |
| Day / night toggle (optional) | Stub | Mentioned as optional on home; not implemented. |
| **Marketplace home** | | |
| Category tiles / shortcuts | Partial | Tiles link to categories; content from `lib/marketplace-data.ts`. |
| Curated rails (Bestsellers, New arrivals, …) | Partial | Static grids from mock list; not CMS-driven. |
| Infinite scroll mixed feed | Stub | Static grid + copy; no infinite scroll or API. |
| Product card: view product | Partial | Links to PDP mock. |
| Product card: favorite (login) | Stub | No favorite action wired. |
| Product card: quick add to cart (optional) | Partial | “Add to cart” link with `?add=` only. |
| Featured brands | Partial | Horizontal strip from mock brands. |
| Trending products | Partial | Same mock data. |
| View brand | Partial | Links to brand page mock. |
| **Category page** | | |
| Breadcrumb (Home / Category) | Ship-ready* | *With mock routes. |
| Filters: price range, shipping, new/trending, color/size | Partial | UI only; no URL sync or query to backend. |
| Sort (trending, newest, price) | Partial | `<select>` not wired. |
| Product grid + infinite scroll | Partial | Grid only; no infinite load. |
| **PDP** | | |
| Hero: name, price | Partial | Mock product. |
| Image gallery + zoom | Stub | Single gradient placeholder. |
| Variants: color, size, quantity | Partial | Controls present; not persisted to cart line. |
| Shipping estimate + returns snippet | Stub | Static copy. |
| Buy now / add to cart | Partial | Navigation only; no inventory check. |
| View brand / contact brand (login rule) | Stub | Buttons / copy; no modal or auth gate wired. |
| Description, size guide, material, care | Stub | Placeholder section. |
| Reviews: average, list, write (login + verified purchase) | Stub | Section placeholder only. |
| **Cart** | | |
| Line items (image, name, variant, qty, subtotal) | Partial | Demo line when `?add=`; no multi-SKU cart. |
| Order summary (subtotal, shipping, tax, total) | Stub | Mostly static. |
| Continue shopping | Ship-ready* | *Link only. |
| **Checkout** | | |
| Step 1 — Delivery (full form) | Partial | Fields present; no validation or address API. |
| Step 2 — Payment Web2 (card, PayPal) | Stub | Tabs only; no Stripe/PayPal integration. |
| Step 2 — Payment Web3 (wallet, stablecoin, EVM note) | Stub | No wallet session or chain payment. |
| Step 3 — Confirmation (order ID, tracking, email) | Stub | Generated ID on confirm only; no email or OMS. |
| **Brand page (public storefront)** | | |
| Hero: banner, logo, name, narrative, read more | Partial | Mock layout; narrative not collapsible. |
| Verified links row | Stub | Label only. |
| Favorite brand / share / contact (login rules) | Stub | Buttons only. |
| Tabs: Products, Collections, Activity, About | Partial | URL `?tab=`; collections/activity are placeholders. |
| Fundraising tab when active | Partial | Link to dedicated fundraising route for one mock brand. |
| Products tab: filters, sort, add to cart | Partial | Same as marketplace grid mock. |
| Collections tab: cards, count, view | Stub | Static placeholder cards. |
| Activity tab: posts, milestones, BTS | Stub | Static list; no V2 social. |
| About: story, policies, links | Stub | Short placeholder. |
| **Fundraising page** | | |
| Mini hero, title “Support [Brand]” | Partial | Mock page for `lumen-atelier` only. |
| Progress bar, raised vs goal, shares optional | Stub | Static percentages. |
| Supporters list (masked wallets) | Stub | Fake rows. |
| Products being funded | Partial | Reuses mock product cards. |
| Support module: amount, Web2/Web3, terms, CTA | Stub | No payment or compliance capture. |
| **Favorites** | Stub | Empty state + tab UI; no persistence. |
| **Notifications feed** | Stub | Single placeholder row. |
| **User profile** | Partial | Points to existing `/app/profile`; not merged with marketplace-only fields from PDF. |
| **Global floating chat (Intercom-style, logged in)** | Stub | Floating button + placeholder panel; not gated by login. |
| **Reviews / contact / chat rules** | Stub | Described in copy; not enforced. |

---

## C. Summary counts (approximate)

| Bucket | Count (items above) |
|--------|---------------------|
| **Ship-ready** (end-to-end for real users) | Very few: basic routing, static navigation, some layout chrome. |
| **Partial** | Many: anything with real pages but mock or local-only state. |
| **Stub / not in app** | Many: payments, uploads, contracts, search, reviews, favorites persistence, infinite scroll, mega-overlay spec, verified links, email/OMS, auth gates on marketplace. |

---

## D. Fast mental model

- **What is closest to “real”:** URL structure, layouts, step flow in Brand Studio, checkout step *sequence*, category → PDP → brand navigation with **mock** `lib/marketplace-data.ts`.  
- **What blocks production:** **Auth enforcement**, **persistent data**, **payments**, **cart/order services**, **file storage**, **on-chain contracts**, **search/index**, **email/webhooks**, **monitoring**, and **tests** on money-adjacent paths.

---

*Related: [`USER_FLOW_DIAGRAMS.md`](./USER_FLOW_DIAGRAMS.md), [`USER_FLOW_IMPLEMENTATION_REPORT.md`](./USER_FLOW_IMPLEMENTATION_REPORT.md).*
