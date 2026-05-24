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
# EverShop instance (separate process, default port 3001)
EVERSHOP_URL=http://127.0.0.1:3001

# Server-only admin API credentials (create in EverShop admin → Users)
EVERSHOP_ADMIN_EMAIL=admin@example.com
EVERSHOP_ADMIN_PASSWORD=your-secure-password
```

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

## 7. Next implementation steps

- [ ] Wire Privy user ID → brand ownership in catalog registry
- [ ] Token mint step after publish (collection contract)
- [ ] AWEBO-native checkout → EverShop order API
- [ ] Auto-create EverShop category per brand
- [ ] Webhook: EverShop order → AWEBO notifications
