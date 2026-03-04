# Drops & Merch: EverShop Setup

This project uses a **monorepo** with the same domain: the main Next.js app (AWEBO) and EverShop (drops/merch) run together, with `/drops` routed to EverShop.

## Architecture

- **Main app (Next.js)**: runs on port **3000** (default). All routes except `/drops` and `/drops/*`.
- **EverShop**: runs on port **3001**. Serves the storefront and admin; linked under `/drops` via Next.js rewrites.
- **Same domain**: Users see `https://yourdomain.com/drops` for the shop and `https://yourdomain.com/drops/admin` for the EverShop admin panel.

## Monorepo structure

```
awebo/                    # repo root
├── package.json          # root workspaces + scripts
├── awebo/                # Next.js app (main site)
│   └── app/drops/*       # proxied to EverShop, no local page
├── evershop-dev/         # EverShop (Node, React, GraphQL, PostgreSQL)
│   ├── config/           # shop.homeUrl = main app URL + /drops
│   └── packages/evershop/
└── docs/
    └── drops-evershop-setup.md  # this file
```

## Prerequisites

- **Node.js 20+**
- **PostgreSQL 13+** (running locally or via Docker)
- From [EverShop system requirements](https://evershop.io/docs/development/getting-started/system-requirements)

## First-time EverShop setup (evershop-dev)

EverShop needs a database and an admin user before it can run.

1. **Install dependencies** (from **repo root** so root `node_modules` has `swc`; EverShop compile uses it):

   ```bash
   cd /path/to/awebo   # monorepo root (parent of awebo/ and evershop-dev/)
   npm install
   ```

2. **Compile EverShop** (from `evershop-dev`; run once or after pulling changes):

   ```bash
   cd evershop-dev
   npm run compile
   npm run compile:db
   ```

3. **Install runtime deps for the core package** (needed so `build` finds `config`, `winston`, etc.):

   ```bash
   cd packages/evershop && npm install && cd ../..
   ```

4. **Run the installer** (creates `.env` with DB settings and DB schema + admin user):

   ```bash
   npm run setup
   ```

   When prompted:

   - **Database**: host (e.g. `localhost`), port (`5432`), name (e.g. `evershop`), user, password.
   - **Admin**: email and password for the EverShop admin panel.

5. **Build the storefront** (after first setup):

   ```bash
   npm run build
   ```

6. **Optional: seed demo data** (dev only):

   ```bash
   npm run seed
   ```

## Running the monorepo

From the **repo root** (`awebo/`):

```bash
# Run both Next.js and EverShop (recommended)
npm run dev
```

- **Next.js**: http://localhost:3000  
- **Drops (EverShop)**: http://localhost:3000/drops  
- **EverShop admin**: http://localhost:3000/drops/admin  

Or run them separately:

```bash
npm run dev:web    # Next.js only (port 3000)
npm run dev:drops  # EverShop only (port 3001); then open http://localhost:3001
```

If only the main app is running, visiting `/drops` will hit the proxy and fail if EverShop is not running on 3001.

## Configuration

### EverShop URL (Next.js proxy target)

Next.js rewrites `/drops` and `/drops/*` to the EverShop app. The target URL is:

- **Default**: `http://127.0.0.1:3001`
- **Override**: set `EVERSHOP_URL` in `.env.local` (e.g. `EVERSHOP_URL=http://127.0.0.1:3001`).

### EverShop `shop.homeUrl`

So that links and redirects stay under `/drops`, EverShop is configured with:

- **Development**: `http://localhost:3000/drops` (in `evershop-dev/config/default.json`).
- **Production**: set `shop.homeUrl` in EverShop config to your real domain + `/drops` (e.g. `https://yourdomain.com/drops`), e.g. via `evershop-dev/config/production.json` or env-based config.

### EverShop port

EverShop runs on **3001** when started with `npm run dev` in `evershop-dev` (or via root `npm run dev:drops`). This is set in the `dev` script; for production, set `PORT` in the environment as needed.

## Managing drops and merch

- **Storefront**: open `/drops` on the main site (or `http://localhost:3001` when running EverShop alone).
- **Admin**: open `/drops/admin` (or `http://localhost:3001/admin`). Use the admin email/password you set during `npm run setup`.
- Products, categories, orders, and customers are managed in the EverShop admin; the main AWEBO app only proxies `/drops` to EverShop.

## References

- [EverShop introduction](https://evershop.io/docs/development/getting-started/introduction)
- [EverShop installation guide](https://evershop.io/docs/development/getting-started/installation-guide)
- [EverShop system requirements](https://evershop.io/docs/development/getting-started/system-requirements)
