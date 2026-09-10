# Supabase production setup

Virtue Gems uses Supabase for permanent products, orders, customers, CRM data,
admin accounts and product images. SQLite remains a local fallback only when
Supabase variables are absent.

## 1. Create the project

1. Create a Supabase project in the closest India/Asia region available.
2. Open **SQL Editor**.
3. Run [`supabase/migrations/001_virtue_gems_crm.sql`](../supabase/migrations/001_virtue_gems_crm.sql).
4. Confirm the `product-images` bucket appears under Storage.

## 2. Configure local environment

Copy these values from **Project Settings → API** into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=product-images
```

Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
Use the project URL, the public/anon (or publishable) key, and the secret
service-role key from the same project. Placeholder values are intentionally
ignored so local OTP mode continues to work.

## 3. Migrate existing SQLite data and create the owner

Temporarily add:

```env
INITIAL_ADMIN_EMAIL=owner@example.com
INITIAL_ADMIN_PASSWORD=a-strong-temporary-password
```

Then run:

```bash
npm run migrate:supabase
```

The migration is safe to rerun. It:

- uploads local catalog photos to Supabase Storage;
- upserts products;
- creates customers from historical order phone numbers;
- migrates orders and order items;
- creates status-history records;
- migrates loyalty data;
- creates the first owner Auth account and role profile.

After a successful migration, remove `INITIAL_ADMIN_PASSWORD` from
`.env.local`. Sign in at `/admin/login` and change/manage team access from
**Admin → Team**.

Create the requested team from **Admin → Team**:

1. Keep the migrated account as **Owner**.
2. Create an **Admin** account for catalog / product uploads.
3. Create a **Manager** account for order handling.
4. Give each person a unique temporary password through a private channel.
5. Never put admin passwords in source code, documentation, or chat history.

## 4. Configure Vercel

Add the four Supabase variables to **Vercel → Project → Settings → Environment
Variables** for Production and Preview as appropriate. Do not add the temporary
initial-owner password.

Redeploy after saving variables. Supabase Auth URL settings should include:

- Site URL: `https://www.virtuegems.com`
- Redirect URL: `https://www.virtuegems.com/admin/**`

## 5. Verify before client handoff

1. Sign in at `/admin/login`.
2. Open Products and upload 2–3 photos.
3. Test both bulk modes:
   - one photo per product;
   - “These photos belong to one product”.
4. Place a test WhatsApp order from the storefront.
5. Confirm the order, customer, stock reduction and status timeline in admin.
6. Add a customer note and follow-up reminder.
7. Download Orders CSV and a JSON backup.
8. Delete/disable test records if they should not remain.

## Data ownership and backups

Supabase is the production source of truth. Download periodic JSON backups from
the admin header and use Supabase automatic backups according to the selected
plan. The local SQLite file is not synchronized automatically after production
is enabled.

## Roles

Everyone signs in at the same URL: `/admin/login` (Supabase email + password).

| Role (UI) | Stored as | Access |
|-----------|-----------|--------|
| **Owner** | `owner` | Team management, backups, products, orders, CRM |
| **Admin** | `admin` | Products (add/edit), analytics, orders, customers, backups |
| **Manager** | `staff` | Orders and customers only — no product catalog edits |

Create the two daily logins from **Admin → Team** (owner only):

1. Keep the migrated account as **Owner**.
2. Create an **Admin** account for catalog / product uploads.
3. Create a **Manager** account for order handling.

OTP login (no Supabase) is single-owner only and cannot support Admin + Manager.
