# Migration 003 — Brand Assets Storage

**Priority:** P1 (needed before production uploads)  
**Replaces:** Ephemeral blob URLs in wizard drafts  
**Unblocks:** Banner/logo persistence across sessions

## Problem

The launch wizard stores uploaded images as `blob:` URLs. These are stripped on autosave and lost on page reload:

```typescript
// lib/awebo/launch-draft-store.ts
bannerUrl: values.bannerUrl?.startsWith('blob:') ? null : values.bannerUrl
```

## Solution

Upload files to **Supabase Storage** during wizard step 1 or on publish. Persist public URLs in `brands.logo_url` / `brands.banner_url` and in draft `values` JSON.

## Bucket configuration

| Setting | Value |
|---------|-------|
| Bucket name | `brand-assets` |
| Public | Yes (read) |
| File size limit | 5 MB recommended |
| Allowed MIME | `image/jpeg`, `image/png`, `image/webp` |

## Path convention

```
brand-assets/{owner_id}/{brand_slug}/banner.webp
brand-assets/{owner_id}/{brand_slug}/logo.webp
```

Use `brand_slug` from draft `values.brandName` (slugified) or a temporary `draft` folder until name is set:

```
brand-assets/{owner_id}/draft/banner.webp
```

## Storage policies (SQL)

Run in Supabase SQL editor after creating the bucket in the dashboard:

```sql
-- 003_brand_assets_storage.sql

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Public read
create policy "public_read_brand_assets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'brand-assets');

-- Authenticated upload to own folder (when using Supabase Auth)
-- For Privy + service role API uploads, skip client upload policy
-- and handle uploads server-side with service role key.

create policy "owner_upload_brand_assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );

create policy "owner_update_brand_assets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );

create policy "owner_delete_brand_assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );
```

## Recommended API endpoint (new)

```
POST /api/launch/upload-asset
Content-Type: multipart/form-data

Fields:
  ownerId: string
  assetType: 'banner' | 'logo'
  file: File

Response:
  { url: "https://...supabase.co/storage/v1/object/public/brand-assets/..." }
```

Implement with **service role** key; validate `ownerId` matches authenticated Privy session.

## Public URL format

```
{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/brand-assets/{path}
```

## No additional Postgres tables required

Asset URLs live on `brands.logo_url`, `brands.banner_url`, and inside `launch_drafts.values` JSON during draft phase.
