# Migration 004 — Fundraising

**Priority:** P2 (required for `launchMode: 'crowdfund'`)  
**Replaces:** Mock `fundraising` / `raisedPct` in `lib/marketplace-data.ts`  
**Unblocks:** `/marketplace/brand/[slug]/fundraising`, fundraising badges on brand pages

## Purpose

When a creator publishes with `launchMode: 'crowdfund'`, the brand enters fundraising state. Track goal, raised amount, shares sold, and individual contributions.

## Frontend fields today (mock)

```typescript
// lib/marketplace-data.ts
type MockBrand = {
  slug: string;
  name: string;
  tagline: string;
  fundraising: boolean;   // derived from launch_mode = 'crowdfund'
  raisedPct: number;        // 0–100
  bannerTone: string;
};
```

Fundraising page (`app/marketplace/brand/[slug]/fundraising/page.tsx`) reads `brand.fundraising` and `brand.raisedPct` for the progress bar.

## SQL

```sql
-- 004_fundraising.sql
-- Requires: 002_brands_catalog.sql

create table fundraising_campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null unique references brands(id) on delete cascade,
  goal_usd numeric(12,2),
  raised_usd numeric(12,2) not null default 0,
  raised_pct smallint not null default 0
    check (raised_pct between 0 and 100),
  shares_sold int not null default 0,
  supply int,
  status text not null default 'active'
    check (status in ('draft', 'active', 'completed', 'cancelled')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_fundraising_campaigns_status on fundraising_campaigns(status);

create table fundraising_contributions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references fundraising_campaigns(id) on delete cascade,
  wallet_address text not null,
  amount_usd numeric(12,2) not null,
  shares int,
  payment_mode text check (payment_mode in ('web2', 'web3')),
  tx_hash text,
  created_at timestamptz not null default now()
);

create index idx_contributions_campaign on fundraising_contributions(campaign_id);
create index idx_contributions_wallet on fundraising_contributions(wallet_address);

create trigger fundraising_campaigns_updated_at
  before update on fundraising_campaigns
  for each row execute function set_updated_at();

-- Keep raised_pct in sync (optional trigger)
create or replace function refresh_campaign_raised_pct()
returns trigger as $$
declare
  v_goal numeric(12,2);
  v_raised numeric(12,2);
begin
  select goal_usd, raised_usd into v_goal, v_raised
  from fundraising_campaigns where id = new.campaign_id;

  if v_goal is not null and v_goal > 0 then
    update fundraising_campaigns
    set raised_pct = least(100, round((v_raised / v_goal) * 100)::int)
    where id = new.campaign_id;
  end if;

  return new;
end;
$$ language plpgsql;
```

## Publish hook

On `POST /api/launch/publish` when `values.launchMode === 'crowdfund'`:

1. Set `brands.status = 'fundraising'`
2. Insert `fundraising_campaigns`:
   - `goal_usd` — TBD product decision (not in wizard today)
   - `supply` — from `values.supply` (parse to int)
   - `status = 'active'`
   - `starts_at = now()`

## Derived fields for frontend

| Mock field | DB source |
|------------|-----------|
| `fundraising` | `brands.launch_mode = 'crowdfund'` AND `brands.status = 'fundraising'` |
| `raisedPct` | `fundraising_campaigns.raised_pct` |

## Sample query (fundraising page)

```sql
select
  b.slug,
  b.name,
  b.story,
  b.banner_url,
  fc.goal_usd,
  fc.raised_usd,
  fc.raised_pct,
  fc.shares_sold,
  fc.supply,
  fc.status as campaign_status
from brands b
join fundraising_campaigns fc on fc.brand_id = b.id
where b.slug = $1
  and b.launch_mode = 'crowdfund';
```

## Future endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/fundraising/[slug]` | GET | Campaign stats + recent contributions |
| `/api/fundraising/[slug]/contribute` | POST | Record web2/web3 contribution |

## Rollback

```sql
drop table if exists fundraising_contributions;
drop table if exists fundraising_campaigns;
drop function if exists refresh_campaign_raised_pct();
```
