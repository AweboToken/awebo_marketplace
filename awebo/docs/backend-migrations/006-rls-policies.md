# Migration 006 — Row Level Security

**Priority:** P0 (apply with migrations 001–002)  
**Applies to:** All app tables in Supabase

## Strategy

**V1 (recommended):** Frontend API routes use `SUPABASE_SERVICE_ROLE_KEY` server-side. RLS enabled with restrictive policies; service role bypasses RLS.

**V2:** Privy JWT mapped to Supabase custom claims; client reads via anon key + RLS.

## Enable RLS

```sql
-- 006_rls_policies.sql
-- Requires: 001, 002, 004 tables

alter table creators enable row level security;
alter table launch_drafts enable row level security;
alter table brands enable row level security;
alter table brand_collections enable row level security;
alter table brand_products enable row level security;
alter table fundraising_campaigns enable row level security;
alter table fundraising_contributions enable row level security;
alter table referral_codes enable row level security;
alter table orders enable row level security;
```

## Public read — published catalog

```sql
create policy "public_read_published_brands"
  on brands for select
  to anon, authenticated
  using (status in ('published', 'fundraising', 'live'));

create policy "public_read_collections"
  on brand_collections for select
  to anon, authenticated
  using (
    exists (
      select 1 from brands b
      where b.id = brand_id
        and b.status in ('published', 'fundraising', 'live')
    )
  );

create policy "public_read_products"
  on brand_products for select
  to anon, authenticated
  using (
    exists (
      select 1 from brand_collections c
      join brands b on b.id = c.brand_id
      where c.id = collection_id
        and b.status in ('published', 'fundraising', 'live')
    )
  );

create policy "public_read_active_fundraising"
  on fundraising_campaigns for select
  to anon, authenticated
  using (
    status = 'active'
    and exists (
      select 1 from brands b
      where b.id = brand_id and b.status = 'fundraising'
    )
  );
```

## Owner access — drafts

Assumes `auth.jwt() ->> 'sub'` equals Privy `owner_id` once JWT mapping exists:

```sql
create policy "owner_read_own_draft"
  on launch_drafts for select
  to authenticated
  using (owner_id = (auth.jwt() ->> 'sub'));

create policy "owner_upsert_own_draft"
  on launch_drafts for insert
  to authenticated
  with check (owner_id = (auth.jwt() ->> 'sub'));

create policy "owner_update_own_draft"
  on launch_drafts for update
  to authenticated
  using (owner_id = (auth.jwt() ->> 'sub'))
  with check (owner_id = (auth.jwt() ->> 'sub'));
```

## Owner access — brands

```sql
create policy "owner_read_own_brands"
  on brands for select
  to authenticated
  using (owner_id = (auth.jwt() ->> 'sub'));

create policy "owner_insert_own_brands"
  on brands for insert
  to authenticated
  with check (owner_id = (auth.jwt() ->> 'sub'));

create policy "owner_update_own_brands"
  on brands for update
  to authenticated
  using (owner_id = (auth.jwt() ->> 'sub'))
  with check (owner_id = (auth.jwt() ->> 'sub'));
```

## Orders — buyer access (future)

```sql
create policy "buyer_read_own_orders"
  on orders for select
  to authenticated
  using (user_wallet = (auth.jwt() ->> 'wallet_address'));
```

## Service role note

Server-side Next.js API routes should use:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

## Security checklist

- [ ] RLS enabled on all public tables
- [ ] Service role key only in server env
- [ ] Validate Privy session in API routes before writing as `owner_id`
- [ ] No direct client writes to `brand_products` without auth
- [ ] Fundraising contributions inserted server-side only
- [ ] Storage upload policies scoped to owner folder
