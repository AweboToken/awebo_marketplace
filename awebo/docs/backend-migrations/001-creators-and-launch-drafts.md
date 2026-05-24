# Migration 001 — Creators + Launch Drafts

**Priority:** P0 (required first)  
**Replaces:** `data/launch-drafts.json`  
**Unblocks:** Launch wizard autosave (`PUT /api/launch/draft`)

## Purpose

Persist in-progress wizard state per creator. One active draft per `owner_id` (Privy user ID or guest UUID).

## TypeScript source of truth

```typescript
// lib/awebo/launch-draft-store.ts
type LaunchDraftRecord = {
  ownerId: string;
  stepIndex: number;              // 0–3
  values: LaunchWizardValues;     // see type-mappings.md
  productPrices: Record<string, string>;  // productId → USD price string
  updatedAt: string;              // ISO 8601
  status: 'draft' | 'published';
};
```

## SQL

```sql
-- 001_creators_and_launch_drafts.sql

create extension if not exists "pgcrypto";

create table creators (
  id text primary key,                          -- did:privy:... or guest-{uuid}
  supabase_user_id uuid references auth.users(id),
  wallet_address text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table launch_drafts (
  owner_id text primary key references creators(id) on delete cascade,
  step_index smallint not null default 0
    check (step_index between 0 and 3),
  values jsonb not null default '{}',
  product_prices jsonb not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  updated_at timestamptz not null default now()
);

create index idx_launch_drafts_status on launch_drafts(status);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger launch_drafts_updated_at
  before update on launch_drafts
  for each row execute function set_updated_at();

create trigger creators_updated_at
  before update on creators
  for each row execute function set_updated_at();
```

## API behavior to preserve

### `GET /api/launch/draft?ownerId={id}`

- Validate `ownerId`: length 8–128
- Return `{ draft: LaunchDraftRecord | null }`
- Only return drafts where `status = 'draft'`

### `PUT /api/launch/draft`

Body:

```json
{
  "ownerId": "did:privy:abc123",
  "stepIndex": 2,
  "values": { /* LaunchWizardValues */ },
  "productPrices": { "hoodie": "89.00", "tee": "45.00" }
}
```

- Upsert creator row if not exists (`insert ... on conflict do nothing`)
- Upsert draft on `owner_id`
- Strip blob URLs from `values.bannerUrl` / `values.logoUrl` before save (client sends blob previews; only persist durable URLs)

### On publish (`POST /api/launch/publish`)

- Set `launch_drafts.status = 'published'` for the `ownerId`

## Sample queries

```sql
-- Upsert creator + draft (service role from API route)
insert into creators (id) values ($1)
on conflict (id) do nothing;

insert into launch_drafts (owner_id, step_index, values, product_prices)
values ($1, $2, $3::jsonb, $4::jsonb)
on conflict (owner_id) do update set
  step_index = excluded.step_index,
  values = excluded.values,
  product_prices = excluded.product_prices,
  updated_at = now();

-- Get active draft
select * from launch_drafts
where owner_id = $1 and status = 'draft';
```

## Rollback

```sql
drop trigger if exists launch_drafts_updated_at on launch_drafts;
drop trigger if exists creators_updated_at on creators;
drop table if exists launch_drafts;
drop table if exists creators;
-- Note: drop function set_updated_at only if not used by other tables
```
