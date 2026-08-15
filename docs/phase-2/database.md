# PostgreSQL migration status

## Current

- Supabase Postgres is implemented for production products, orders, customers,
  CRM notes, reminders, status history and admin profiles.
- Supabase Storage is implemented for product photos.
- SQLite at `data/virtue-gems.db` remains a local fallback and migration source.

## Production setup

Follow [`../supabase-production-setup.md`](../supabase-production-setup.md).

The one-time migration command is:

```bash
npm run migrate:supabase
```

Do not configure `DATABASE_URL`; this project uses Supabase URL and API keys
documented in `.env.example`.
