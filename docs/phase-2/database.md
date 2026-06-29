# Phase 2 — PostgreSQL Migration

## Current

- SQLite at `data/virtue-gems.db`
- JSON backup sync for orders/loyalty

## When to migrate

- Deploying to Vercel serverless with multiple instances (SQLite file locking)
- Need concurrent writes at scale
- Client wants hosted DB backups (Supabase, Neon, RDS)

## Steps

1. Choose provider (Neon serverless Postgres recommended for Next.js)
2. Mirror schema from `src/lib/db/schema.ts`
3. Dual-write period or one-time migration script
4. Swap `getDb()` for `pg` / Drizzle / Prisma client
5. Keep JSON export as disaster backup

## Env

```
DATABASE_URL=postgresql://...
```
