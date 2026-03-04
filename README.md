# AWEBO monorepo

Next.js app (marketing + app) and EverShop (drops/merch) on one domain.

- **`awebo/`** – Next.js app (port 3000). Landing, app home, launch, etc.
- **`evershop-dev/`** – EverShop store (port 3001). Served at `/drops` via proxy.

## Quick start

```bash
npm install
npm run dev          # runs Next.js + EverShop
# Or: npm run dev:web (Next only), npm run dev:drops (EverShop only)
```

- **Main site:** http://localhost:3000  
- **Drops (EverShop):** http://localhost:3000/drops  
- **EverShop admin:** http://localhost:3000/drops/admin  

See [docs/drops-evershop-setup.md](awebo/docs/drops-evershop-setup.md) for full EverShop setup (PostgreSQL, compile, setup, build).

---

## Sanity Studio CMS

Landing and app home content is managed in **Sanity Studio**, embedded at `/studio`.

### 1. Configure env

In **`awebo/.env.local`** add:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

Get the project ID from [sanity.io/manage](https://sanity.io/manage).

### 2. Open the Studio

- **URL:** http://localhost:3000/studio (with the Next.js dev server running)
- Or use the **“Content (Studio)”** link in the site footer.

If the env vars are missing, `/studio` shows a short setup message instead of the Studio UI.

### 3. What you can edit

| In Studio | Used on the site |
|-----------|-------------------|
| **Home Page** (singleton) | Landing `/`: hero, how it works, ecosystem, CTA |
| **App Page** (singleton) | App home `/app`: hero, projects grid, banner, featured |
| **Top Creators** | Landing “Top creators” section |
| **Trusted by partners** | Landing “Trusted by” logos |
| **Phygital items** | Landing phygital section |
| **How it works cards** | Landing “How it works” |
| **Projects** | App home projects grid |

Create the **Home Page** and **App Page** documents in Studio and set their document IDs to `homePage` and `appPage` (singletons). More detail: [awebo/docs/sanity-setup.md](awebo/docs/sanity-setup.md).
