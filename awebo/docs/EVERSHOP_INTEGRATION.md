# EverShop + AWEBO integration

AWEBO is the creator-facing storefront. **EverShop** is the commerce backend for physical products: inventory, checkout, orders, and fulfillment.

EverShop runs as a **separate Node.js service** (Docker on a VPS). AWEBO proxies storefront and admin URLs through `next.config.js` rewrites — EverShop is never embedded inside the Next.js app.

## Architecture

```
Creator → AWEBO (Next.js / Vercel or VPS)
              │
              ├── Supabase — brands, collections, products, launch drafts
              │
              └── EVERSHOP_URL ──► EverShop (VPS + Docker)
                                        ├── PostgreSQL 16
                                        └── Catalog, cart, checkout, orders
```

### Data model

```
Creator (Privy login)
  └── Brand (Launch Brand wizard → POST /api/launch/publish)
        └── Collection (Genesis collection today)
              └── Products (SKUs synced to EverShop when commerce is enabled)
```

When a creator publishes from `/launch`:

1. AWEBO saves brand + collection + products to **Supabase** (or `data/awebo-catalog.json` in file mode).
2. If `AWEBO_EVERSHOP_CHECKOUT=true` and admin credentials are set, each product is created in EverShop via `POST /api/products`.
3. `evershop_url_key` is stored on each `brand_products` row for proxied checkout URLs.

## Environment variables (AWEBO)

Add to `.env.local` (development) or your host’s env (production):

```bash
# EverShop instance — no trailing slash
EVERSHOP_URL=http://127.0.0.1:3000
EVERSHOP_ADMIN_EMAIL=admin@yourdomain.com
EVERSHOP_ADMIN_PASSWORD=your-secure-password

# false = AWEBO preview pages only (default until EverShop is live)
AWEBO_EVERSHOP_CHECKOUT=false
```

| Variable | Required | Description |
|----------|----------|-------------|
| `EVERSHOP_URL` | Yes (when commerce on) | Public base URL of EverShop, e.g. `https://shop.awebo.app` |
| `EVERSHOP_ADMIN_EMAIL` | Yes (for publish sync) | Platform admin user — server-side only, never exposed to the browser |
| `EVERSHOP_ADMIN_PASSWORD` | Yes (for publish sync) | Admin password for `POST /api/user/tokens` |
| `AWEBO_EVERSHOP_CHECKOUT` | No | `true` enables EverShop product creation at publish and `/drops/product/{url_key}` links |

Also required for production AWEBO:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_ID=
PRIVY_APP_SECRET=
```

Restart the AWEBO process after changing env vars.

### Commerce flags (code)

- `isEvershopCheckoutEnabled()` — `AWEBO_EVERSHOP_CHECKOUT === 'true'`
- `isEvershopSyncEnabled()` — checkout enabled **and** admin email/password set

When checkout is **false** (default), publish saves to Supabase only and product links stay on `/marketplace/product/{brandSlug}-{productId}`.

## AWEBO proxy routes

Configured in `next.config.js`:

| Public URL on AWEBO | Proxied to EverShop |
|---------------------|---------------------|
| `/drops/product/:path*` | `/product/:path*` |
| `/drops/admin` | `/admin` |
| `/drops/admin/:path*` | `/admin/:path*` |
| `/graphql` | `/graphql` |
| `/api/products`, `/api/products/:path*` | Same on EverShop |
| `/api/orders/:path*`, `/api/user/:path*`, etc. | Same on EverShop |

Creators use **AWEBO** `/launch` to publish. Ops use **`https://your-awebo-domain/drops/admin`** for catalog and orders (no separate EverShop hostname required for day-to-day work).

## API reference (AWEBO)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/launch/publish` | POST | Publish brand; optionally create EverShop SKUs |
| `/api/evershop/products` | GET | Merged catalog for marketplace + drops |

Implementation: `lib/evershop/admin-client.ts`, `lib/evershop/storefront-client.ts`, `lib/awebo/launch-publish.ts`.

---

## VPS deployment guide (backend)

This section is the handoff for deploying EverShop on a Linux VPS (Ubuntu 22.04/24.04 recommended). AWEBO can stay on Vercel; only EverShop needs the VPS.

### 1. Server requirements

| Resource | Minimum |
|----------|---------|
| CPU | 2 vCPU |
| RAM | 4 GB |
| Disk | 40 GB SSD |
| OS | Ubuntu 22.04+ |
| Ports | 80, 443 (public); 3000 internal only |

Software on the VPS:

- Docker Engine + Docker Compose plugin
- Nginx (reverse proxy + TLS)
- Optional: `ufw` firewall

### 2. Install Docker (Ubuntu)

```bash
sudo apt update && sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
# Log out and back in so docker runs without sudo
```

### 3. Deploy EverShop with Docker Compose

On the VPS:

```bash
sudo mkdir -p /opt/awebo-evershop && cd /opt/awebo-evershop
sudo curl -sSL https://raw.githubusercontent.com/evershopcommerce/evershop/main/docker-compose.yml -o docker-compose.yml
```

**Production hardening** — edit `docker-compose.yml` before `up`:

1. Change Postgres `POSTGRES_PASSWORD` and matching `DB_PASSWORD` to a strong secret.
2. Remove the `database` service `ports: "5432:5432"` mapping so Postgres is **not** exposed to the internet (EverShop reaches it on the internal Docker network).
3. Keep `app` listening on `3000:3000` bound to `127.0.0.1` only if you use Nginx on the same host:

```yaml
    ports:
      - "127.0.0.1:3000:3000"
```

Start the stack:

```bash
cd /opt/awebo-evershop
docker compose up -d
docker compose ps
docker compose logs -f app
```

EverShop serves HTTP on port **3000** inside the compose file (not 3001).

### 4. First-time EverShop setup

1. Open `http://YOUR_VPS_IP:3000` (temporarily, or via Nginx once configured).
2. Complete the **installation wizard** (store name, locale, currency).
3. Create the **admin user** — use the same email/password you will set in AWEBO as `EVERSHOP_ADMIN_EMAIL` / `EVERSHOP_ADMIN_PASSWORD`.

Verify admin login at `/admin` on the EverShop URL.

### 5. Nginx + HTTPS (recommended)

Point DNS `shop.yourdomain.com` → VPS public IP.

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/evershop`:

```nginx
server {
    listen 80;
    server_name shop.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable and obtain TLS:

```bash
sudo ln -s /etc/nginx/sites-available/evershop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d shop.yourdomain.com
```

Public EverShop base URL: **`https://shop.yourdomain.com`** (no trailing slash).

### 6. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Do not open port 3000 or 5432 publicly if Nginx terminates TLS on 443.

### 7. Persist media and database

| Data | Location |
|------|----------|
| PostgreSQL | Docker volume `postgres-data` (defined in compose) |
| Product images | EverShop container `/app/media` — add a bind mount or named volume in compose for upgrades |

Example media volume on `app` service:

```yaml
    volumes:
      - evershop-media:/app/media
```

Back up Postgres regularly:

```bash
docker compose exec database pg_dump -U postgres postgres > backup-$(date +%F).sql
```

### 8. Wire AWEBO to the VPS EverShop

On the **AWEBO** host (Vercel → Project → Environment Variables, or `.env` on a VPS):

```bash
EVERSHOP_URL=https://shop.yourdomain.com
EVERSHOP_ADMIN_EMAIL=admin@yourdomain.com
EVERSHOP_ADMIN_PASSWORD=<same password as EverShop admin>
AWEBO_EVERSHOP_CHECKOUT=true
```

Redeploy AWEBO after saving.

### 9. Run Supabase migrations

Ensure brand catalog tables exist (see `docs/backend-migrations/README.md`), including product images:

```sql
alter table brand_products add column if not exists image_url text;
```

### 10. Verification checklist

Run these after both services are up:

| Step | Command / URL | Expected |
|------|----------------|----------|
| EverShop health | `curl -sI https://shop.yourdomain.com` | `200` |
| Admin UI | `https://your-awebo-domain/drops/admin` | EverShop login (proxied) |
| AWEBO catalog API | `GET https://your-awebo-domain/api/evershop/products` | JSON with `products` array |
| Publish test | Creator publishes at `/launch` | Response `mode: "evershop"`, no EverShop warnings |
| EverShop catalog | Admin → Catalog → Products | SKUs `AWEBO-{brand}-{productId}` |
| Checkout | `/drops/product/{evershop_url_key}` | EverShop product/checkout page |
| Direct GraphQL | `curl -s https://shop.yourdomain.com/graphql` | EverShop responds (optional) |

### 11. Republish existing brands

Brands published **before** EverShop was configured lack `evershop_url_key`. Each creator should:

1. Log in and open `/launch`
2. Complete **Review & publish** with valid prices
3. Confirm API response includes `mode: "evershop"` and no credential warnings

---

## Local development

### EverShop (Docker — matches production)

```bash
mkdir -p ~/awebo-evershop && cd ~/awebo-evershop
curl -sSL https://raw.githubusercontent.com/evershopcommerce/evershop/main/docker-compose.yml -o docker-compose.yml
docker compose up -d
```

EverShop: **http://127.0.0.1:3000**

AWEBO `.env.local`:

```bash
EVERSHOP_URL=http://127.0.0.1:3000
EVERSHOP_ADMIN_EMAIL=<admin from install wizard>
EVERSHOP_ADMIN_PASSWORD=<password>
AWEBO_EVERSHOP_CHECKOUT=true   # only when testing commerce
```

### AWEBO

```bash
npm install
npm run dev
```

- Storefront proxy: http://localhost:3000/drops/admin
- Publish: http://localhost:3000/launch

---

## Publish flow (creators)

1. Creator logs in (Privy).
2. Completes **Launch Brand** at `/launch`.
3. On **Review & publish**, sets a **USD price for every product**.
4. `POST /api/launch/publish` saves to Supabase and, if sync is enabled, creates EverShop products with:
   - `sku`: `AWEBO-{brandSlug}-{productId}`
   - `url_key`: `{brandSlug}-{productId}`
   - `qty: 100`, `manage_stock: true`, `status: enabled`
   - `images`: product `image_url` when set
5. Products appear on `/marketplace`, `/drops`, and brand pages.

## Day-to-day operations (platform admin)

Use **AWEBO** `/drops/admin` (proxied EverShop admin):

| Task | EverShop path |
|------|----------------|
| Edit price / stock | Catalog → Products → open SKU |
| Fulfill orders | Sales → Orders |
| Disable a SKU | Product → Status |
| Categories | Catalog → Categories (manual until automated) |

Creators do **not** receive EverShop credentials.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|--------|-----|
| `/drops/admin` 502 | EverShop down or wrong `EVERSHOP_URL` | `docker compose ps`; fix URL; no trailing slash |
| Publish warnings “saved locally only” | Missing admin env or `AWEBO_EVERSHOP_CHECKOUT=false` | Set all `EVERSHOP_*` vars; redeploy AWEBO |
| Product links 404 on AWEBO | No `evershop_url_key` | Republish with commerce enabled |
| `/drops/product/...` 502 | EverShop unreachable from AWEBO host | Vercel must reach public `EVERSHOP_URL`; test with `curl` |
| GraphQL / catalog empty | EverShop not running | Start compose stack; check app logs |
| Wrong port locally | CLI scaffold uses 3001; Docker uses **3000** | Set `EVERSHOP_URL` to the port you actually use |
| Postgres connection errors | Password mismatch or DB not ready | Align `DB_*` with `POSTGRES_*`; `docker compose logs database` |
| SSL mixed content | `EVERSHOP_URL` must be `https://` in production | Match Nginx TLS URL |

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — brands, routes, preview vs live commerce
- [backend-migrations/README.md](./backend-migrations/README.md) — Supabase schema
- [backend-migrations/api-contracts.md](./backend-migrations/api-contracts.md) — publish API shapes

Official EverShop references: [Installation](https://evershop.io/docs/development/getting-started/installation-guide), [Docker image](https://hub.docker.com/r/evershop/evershop).
