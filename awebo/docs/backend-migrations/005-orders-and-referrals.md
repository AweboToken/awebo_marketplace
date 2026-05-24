# Migration 005 — Orders + Referrals (Future)

**Priority:** P3 (not blocking launch wizard)  
**Replaces:** Nothing live yet — checkout/cart use mocks  
**Unblocks:** AWEBO-native checkout → EverShop order sync, referral tracking

## Purpose

EverShop already handles checkout at `/drops/product/{url_key}`. These tables track AWEBO-side order metadata, referral attribution, and shipping sync when the native checkout flow is built.

Referenced in project docs: `docs/referral-and-shipping.md`, `docs/system-flow-diagram.md`.

## SQL

```sql
-- 005_orders_and_referrals.sql
-- Requires: 002_brands_catalog.sql

create table referral_codes (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  ref_hash text not null unique,
  created_at timestamptz not null default now()
);

create index idx_referral_codes_hash on referral_codes(ref_hash);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_wallet text,
  referral_ref text references referral_codes(ref_hash),
  brand_id uuid references brands(id),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  shipping_address jsonb,
  line_items jsonb not null default '[]',
  tracking_code text,
  evershop_order_id text,
  evershop_order_number text,
  total_usd numeric(12,2),
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_brand on orders(brand_id);
create index idx_orders_wallet on orders(user_wallet);
create index idx_orders_evershop on orders(evershop_order_id);
create index idx_orders_status on orders(status);

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();
```

## `line_items` JSON shape (suggested)

```json
[
  {
    "productId": "hoodie",
    "sku": "AWEBO-LUMEN-ATELIER-HOODIE",
    "name": "Oversized hoodie",
    "quantity": 1,
    "priceUsd": 89.00,
    "evershopProductId": null
  }
]
```

## `shipping_address` JSON shape (suggested)

```json
{
  "fullName": "Jane Doe",
  "line1": "123 Main St",
  "line2": "",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90001",
  "country": "US",
  "phone": "+1..."
}
```

## Integration points (future)

| Event | Action |
|-------|--------|
| Checkout complete | Insert `orders` row with `evershop_order_id` from EverShop API |
| EverShop webhook: order shipped | Update `orders.status`, set `tracking_code` |
| User connects wallet | Upsert `referral_codes` with unique `ref_hash` |
| Order with `?ref=` param | Store `referral_ref` on order row |

## EverShop remains source of truth for

- Inventory quantities
- Payment processing
- Fulfillment / shipments
- Customer records

AWEBO `orders` is a **mirror + attribution layer**, not a replacement.

## Rollback

```sql
drop table if exists orders;
drop table if exists referral_codes;
```
