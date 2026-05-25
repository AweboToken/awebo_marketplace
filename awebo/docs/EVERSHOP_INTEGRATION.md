# EverShop + AWEBO integration

AWEBO is the creator-facing storefront. **EverShop** is the commerce backend for physical products: inventory, checkout, orders, and fulfillment.

## Data model

```
Creator (Privy login)
  └── Brand (Launch Brand wizard)
        └── Collection (Genesis collection today; more later)
              ├── Token (on-chain — future step)
              └── Products (physical SKUs in EverShop)
```

When a creator publishes from `/launch`:

1. AWEBO saves brand + collection metadata locally (`data/awebo-catalog.json`).
2. If EverShop admin credentials are configured, each priced product is created in EverShop via `POST /api/products`.
3. Marketplace (`/marketplace`) and Drops (`/drops`) read from `/api/evershop/products`.

## Environment variables

Add to `.env.local`:

```bash
# EverShop instance (separate process — only needed when commerce is enabled)
EVERSHOP_URL=http://127.0.0.1:3001
EVERSHOP_ADMIN_EMAIL=admin@example.com
EVERSHOP_ADMIN_PASSWORD=your-secure-password

# Keep false until EverShop is deployed (default: AWEBO preview pages only)
AWEBO_EVERSHOP_CHECKOUT=false
```

When `AWEBO_EVERSHOP_CHECKOUT` is `false` (default), publish saves to Supabase only and all product links stay on `/marketplace/product/...`. See [ARCHITECTURE.md](./ARCHITECTURE.md).

Restart `next dev` after changing env vars.

## 1. Install and run EverShop locally

```bash
# In a separate folder (not inside awebo repo)
npx create-evershop-app my-evershop-store
cd my-evershop-store
npm run dev
```

EverShop runs at **http://127.0.0.1:3001** by default.

Set `EVERSHOP_URL` in AWEBO to match.

## 2. EverShop admin — day-to-day guide

Open admin through AWEBO proxy:

**http://localhost:3000/drops/admin**

(or directly: `http://127.0.0.1:3001/admin`)

### Login

Use the admin user created during EverShop install.

### Products (inventory & merchandising)

Path: **Catalog → Products**

| Task | Where |
|------|--------|
| View products created by Launch Brand | Product grid — look for SKUs like `AWEBO-{brand}-{product}` |
| Edit price / description | Open product → save |
| Manage stock | Product → **Inventory** — set qty, enable *Manage stock* |
| Enable / disable sale | Product **Status** (enabled/disabled) |
| Product URL | `url_key` → served at `/drops/product/{url_key}` via AWEBO proxy |

Products published through Launch Brand are created with:

- `manage_stock: true`
- `qty: 100` (default — change in admin)
- `status: enabled`

### Orders

Path: **Sales → Orders**

| Task | Where |
|------|--------|
| See new orders | Orders list (newest first) |
| Order detail | Click order number |
| Mark shipped | Order → **Shipments** → create shipment + tracking |
| Cancel order | Order actions → Cancel |

AWEBO checkout will eventually create orders here; today you can test with EverShop’s native checkout at `/drops/product/{url_key}`.

### Customers

Path: **Customers → Customers**

Buyer accounts, order history, addresses.

### Categories & collections (optional)

Path: **Catalog → Categories** / **Collections**

Organize creator drops into browse groups. Launch Brand currently creates flat products; you can assign categories manually in admin until we automate it.

## 3. Publish flow (creator)

1. Creator logs in on AWEBO (Privy).
2. Completes **Launch Brand** wizard at `/launch`.
3. On **Review & publish**, sets a **USD price for every product**.
4. Clicks **Publish** → `POST /api/launch/publish`.
5. Products appear on:
   - **Marketplace** — brand card at top (Live badge)
   - **Drops** — product cards with EverShop inventory

## 4. URLs

| URL | Purpose |
|-----|---------|
| `/marketplace` | Brand discovery + live published brands |
| `/drops` | Drop feed (physical products) |
| `/drops/product/{url_key}` | EverShop product page (proxied) |
| `/drops/admin` | EverShop admin (proxied) |
| `/launch` | Creator publish wizard |

## 5. API reference (AWEBO)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/launch/publish` | POST | Publish brand + create EverShop products |
| `/api/evershop/products` | GET | Merged catalog for marketplace/drops |

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `/drops/admin` 502 | Start EverShop; verify `EVERSHOP_URL` |
| Publish saves locally only | Set `EVERSHOP_ADMIN_EMAIL` + `EVERSHOP_ADMIN_PASSWORD` |
| Product not in drops feed | Confirm product **status = enabled** in EverShop admin |
| GraphQL empty | EverShop must be running; check `/graphql` on EverShop URL |

## 8. Production deployment (EverShop + AWEBO on Vercel)

EverShop is a **separate Node.js app with PostgreSQL**. AWEBO on Vercel proxies to it via `EVERSHOP_URL` rewrites in `next.config.js`. You cannot run EverShop inside the AWEBO Vercel project.

### Recommended architecture

```
Creator → AWEBO (Vercel)          EverShop (Railway / Render / DO / VPS)
              │                              │
              ├── Supabase (brands/catalog)  ├── PostgreSQL
              └── EVERSHOP_URL ─────────────►└── Products, orders, checkout
```

### Step 1 — Deploy EverShop (Docker Compose)

On any host with Docker (Railway, Render, a VPS, etc.):

```bash
mkdir awebo-evershop && cd awebo-evershop
curl -sSL https://raw.githubusercontent.com/evershopcommerce/evershop/main/docker-compose.yml > docker-compose.yml
docker compose up -d
```

EverShop listens on **port 3000** inside the container. Expose it on a public URL, e.g. `https://shop.yourdomain.com`.

First visit: complete EverShop install wizard and create an **admin user**. Save that email/password — AWEBO uses them server-side only.

**Production checklist for EverShop:**

| Item | Notes |
|------|--------|
| PostgreSQL 13+ | Required; use managed DB on your host |
| Persistent `/app/media` volume | Product images survive redeploys |
| HTTPS public URL | e.g. `https://shop.awebo.app` |
| Admin user | One platform admin — creators never get these creds |

Official guides: [EverShop installation](https://evershop.io/docs/development/getting-started/installation-guide), [DigitalOcean App Platform](https://evershop.io/docs/development/deployment/deploy-evershop-to-digitalocean-app-platform).

### Step 2 — Wire AWEBO (Vercel env vars)

In the **AWEBO** Vercel project → Settings → Environment Variables:

```bash
EVERSHOP_URL=https://shop.yourdomain.com
EVERSHOP_ADMIN_EMAIL=admin@yourdomain.com
EVERSHOP_ADMIN_PASSWORD=your-secure-password
```

Also required (if not already set):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
```

Redeploy AWEBO after saving env vars.

### Step 3 — Republish brands (creators)

Brands published **before** EverShop was configured were saved without `evershopUrlKey`. Each creator should:

1. Open `/launch` (logged in)
2. Re-run **Review & publish** with prices set
3. Confirm publish response has `mode: "evershop"` (not warnings about missing credentials)

On publish, AWEBO calls `POST {EVERSHOP_URL}/api/products` for each SKU and stores `evershopUrlKey` in Supabase.

### Step 4 — Verify end-to-end

| Check | Expected |
|-------|----------|
| `https://awebo.vercel.app/drops/admin` | EverShop admin login |
| `/api/evershop/products` | `collections` + `products` arrays with your brand |
| `/marketplace/brand/{slug}` | Brand banner, logo, products |
| `/drops/product/{url_key}` | EverShop checkout page (proxied) |
| EverShop admin → Catalog → Products | SKUs like `AWEBO-{brand}-{product}` |

### Day-to-day product management

Creators do **not** log into EverShop directly. Platform ops use **Drops admin** (`/drops/admin`):

- **Catalog → Products** — edit price, stock, enable/disable
- **Sales → Orders** — fulfill shipments
- Products created at publish appear automatically; assign categories/collections manually until automated

### Common production failures

| Symptom | Cause | Fix |
|---------|--------|-----|
| Brand page 404 | Slug only in Supabase, page was using mock data | Fixed — page reads Supabase; republish if slug changed |
| Product links go to AWEBO 404 | No `evershopUrlKey` on product | Set EverShop env vars + republish |
| `/drops/admin` 502 | EverShop down or wrong `EVERSHOP_URL` | Start EverShop; use HTTPS URL without trailing slash |
| Publish warnings “saved locally only” | Missing `EVERSHOP_ADMIN_*` on Vercel | Add admin credentials and redeploy |
| Checkout 404 | EverShop product disabled or wrong `url_key` | Enable product in EverShop admin |

