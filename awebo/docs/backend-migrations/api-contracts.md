# API Contracts — Launch + EverShop

Endpoints the frontend calls today. Backend team should ensure Supabase-backed implementations preserve these contracts.

---

## `GET /api/launch/draft`

**Query:** `ownerId` (string, 8–128 chars)

**Response 200:**

```json
{
  "draft": {
    "ownerId": "did:privy:abc123",
    "stepIndex": 2,
    "values": { /* LaunchWizardValues */ },
    "productPrices": { "hoodie": "89", "tee": "45" },
    "updatedAt": "2026-05-24T12:00:00.000Z",
    "status": "draft"
  }
}
```

If no draft: `{ "draft": null }`

**Errors:** `400` invalid owner id

---

## `PUT /api/launch/draft`

**Body:**

```json
{
  "ownerId": "did:privy:abc123",
  "stepIndex": 1,
  "values": {
    "brandName": "Lumen Atelier",
    "bannerUrl": null,
    "logoUrl": "https://...",
    "symbol": "LUMEN",
    "story": "...",
    "twitter": "",
    "instagram": "",
    "launchMode": "self",
    "chain": "Base",
    "supply": "100",
    "ownerPct": 80,
    "maxWalletPct": 5,
    "whitelist": false,
    "products": [
      { "id": "hoodie", "name": "Oversized hoodie", "status": "Draft" },
      { "id": "tee", "name": "Boxy tee", "status": "Pricing" }
    ]
  },
  "productPrices": { "hoodie": "89", "tee": "45" }
}
```

**Response 200:** `{ "draft": LaunchDraftRecord }`

**Errors:**

- `400` invalid owner id, missing fields, invalid stepIndex

---

## `POST /api/launch/publish`

**Body:**

```json
{
  "ownerId": "did:privy:abc123",
  "values": { /* LaunchWizardValues — brandName required */ },
  "products": [
    { "id": "hoodie", "name": "Oversized hoodie", "priceUsd": 89 },
    { "id": "tee", "name": "Boxy tee", "priceUsd": 45 }
  ]
}
```

**Validation:**

- `values.brandName` required (non-empty trim)
- At least one product
- Each `priceUsd` must be finite and > 0

**Response 200:**

```json
{
  "brand": {
    "id": "lumen-atelier",
    "slug": "lumen-atelier",
    "name": "Lumen Atelier",
    "story": "...",
    "logoUrl": null,
    "bannerUrl": null,
    "launchMode": "self",
    "chain": "Base",
    "supply": "100",
    "publishedAt": "2026-05-24T12:00:00.000Z",
    "collections": [
      {
        "id": "lumen-atelier-genesis",
        "name": "Genesis collection",
        "tokenSymbol": "LUMEN",
        "products": [
          {
            "id": "hoodie",
            "name": "Oversized hoodie",
            "priceUsd": 89,
            "sku": "AWEBO-LUMEN-ATELIER-HOODIE",
            "evershopUuid": "uuid-from-evershop",
            "evershopUrlKey": "lumen-atelier-hoodie"
          }
        ]
      }
    ]
  },
  "mode": "evershop",
  "warnings": []
}
```

**`mode` values:**

- `"evershop"` — at least one product created in EverShop
- `"local"` — saved to catalog only (EverShop credentials missing or all product creates failed)

**Warnings examples:**

- `"EverShop admin credentials missing — saved locally only..."`
- `"EverShop product \"Boxy tee\" failed: ..."`

**Side effects:**

1. Persist brand + products (today: JSON file → target: Supabase)
2. Create EverShop products via admin API (unchanged)
3. Mark draft `status = 'published'` when `ownerId` provided

**Errors:** `400` validation, `500` publish failure

---

## `GET /api/drops/my`

**Query:** `ownerId` (Privy user ID, 8–128 chars)

**Response 200:**

```json
{
  "ownerId": "did:privy:abc123",
  "stats": {
    "brandCount": 1,
    "productCount": 2,
    "latestPublishedAt": "2026-05-24T12:00:00.000Z",
    "selfFundedCount": 1,
    "crowdfundCount": 0
  },
  "brands": [
    {
      "slug": "lumen-atelier",
      "name": "Lumen Atelier",
      "story": "...",
      "logoUrl": null,
      "launchMode": "self",
      "publishedAt": "2026-05-24T12:00:00.000Z",
      "productCount": 2,
      "products": [ /* LiveCatalogProduct[] */ ]
    }
  ]
}
```

**V2:** Verify Privy JWT server-side; do not trust query param alone.

---

## `GET /api/evershop/products`

**Response 200:**

```json
{
  "brands": [
    {
      "slug": "lumen-atelier",
      "name": "Lumen Atelier",
      "description": "...",
      "category": "NEW",
      "itemCount": 2,
      "rating": 4.8,
      "reviews": 12,
      "image": "https://...",
      "cardTone": "bg-[#f3e8ef]",
      "featured": true,
      "favorited": false,
      "href": "/marketplace/brand/lumen-atelier"
    }
  ],
  "products": [
    {
      "id": "hoodie",
      "brandSlug": "lumen-atelier",
      "brandName": "Lumen Atelier",
      "name": "Oversized hoodie",
      "priceUsd": 89,
      "href": "/drops/product/lumen-atelier-hoodie",
      "imageTone": "bg-[#f3e8ef]",
      "source": "awebo"
    }
  ]
}
```

**Data sources today:**

1. Published brands from `awebo-catalog.json` → target: Supabase `brands`
2. EverShop GraphQL storefront (additional products with `source: "evershop"`)

---

## Proposed (not implemented)

### `POST /api/launch/upload-asset`

See [003-brand-assets-storage.md](./003-brand-assets-storage.md)

### `GET /api/fundraising/[slug]`

See [004-fundraising.md](./004-fundraising.md)

---

## EverShop admin API (external)

Called server-side from `lib/evershop/admin-client.ts` on publish:

```
POST {EVERSHOP_URL}/api/products
Authorization: Bearer {admin token}

Body:
{
  "name": "Lumen Atelier — Oversized hoodie",
  "url_key": "lumen-atelier-hoodie",
  "sku": "AWEBO-LUMEN-ATELIER-HOODIE",
  "price": 89,
  "qty": 100,
  "status": 1,
  "manage_stock": true,
  "short_description": "..."
}
```

Store returned `uuid` and `url_key` in `brand_products.evershop_uuid` / `evershop_url_key`.
