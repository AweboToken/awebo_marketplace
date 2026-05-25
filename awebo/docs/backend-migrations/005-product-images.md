# Migration 005 — Product images

**Priority:** P1  
**Unblocks:** Persisted product mockups on marketplace, drops, and cart

## SQL

```sql
alter table brand_products
  add column if not exists image_url text;
```

## Rollback

```sql
alter table brand_products drop column if exists image_url;
```
