# Virtue Gems

A responsive jewellery storefront with WhatsApp checkout, permanent Supabase
data, cloud product images and a role-based admin CRM.

**Repository:** https://github.com/tejakuchallapati/virtue-gems

## Email notifications

The project sends automated emails to `virtuegems777@gmail.com` for:

1. **Contact form** — messages from `/contact`
2. **Project updates** — via `POST /api/notify` (API key required)
3. **GitHub** — every push to `main` and every pull request event

## Setup

For production database/auth/storage setup, follow
[`docs/supabase-production-setup.md`](docs/supabase-production-setup.md).
For the complete client operating guide, see
[`docs/client-handoff.md`](docs/client-handoff.md).

### 1. Install dependencies

```bash
npm install
```

### 2. Configure email (Gmail SMTP)

Copy the example env file and add your Gmail **App Password** (not your regular password):

```bash
cp .env.example .env.local
```

| Variable | Value |
|----------|-------|
| `SMTP_USER` | `virtuegems777@gmail.com` |
| `SMTP_PASS` | [Gmail App Password](https://myaccount.google.com/apppasswords) |
| `NOTIFY_EMAIL` | `virtuegems777@gmail.com` |
| `NOTIFY_API_KEY` | Any long random string |

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3001 — try the contact form at `/contact`.

### 4. Send the "project started" email (once)

```bash
npm run notify:startup
```

### 5. GitHub Actions email alerts

In your repo **Settings → Secrets and variables → Actions**, add:

| Secret | Example |
|--------|---------|
| `SMTP_SERVER` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USERNAME` | `virtuegems777@gmail.com` |
| `SMTP_PASSWORD` | Your Gmail App Password |
| `NOTIFY_EMAIL` | `virtuegems777@gmail.com` |

After secrets are set, every push to `main` and every PR open/update/close will email you.

## Project update API

Send a manual project notification from a script or CI:

```bash
curl -X POST http://localhost:3001/api/notify \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_NOTIFY_API_KEY" \
  -d '{
    "title": "Design phase complete",
    "message": "Homepage mockups are ready for review.",
    "details": { "Phase": "Design", "Status": "Ready" }
  }'
```

## Production checklist (client handoff)

**Live domain:** [https://www.virtuegems.com](https://www.virtuegems.com)

Before going live (or after connecting a custom domain on Vercel), set these in your hosting provider — copy from `.env.example`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.virtuegems.com` (sitemap, SEO, WhatsApp links) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp checkout number |
| `NEXT_PUBLIC_UPI_ID` | UPI ID for payment replies |
| `SMTP_*` / `NOTIFY_EMAIL` | Contact form & order emails |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production data and admin sessions |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database administration |
| `OTP_SECRET` / `ADMIN_EMAIL` | Local fallback login before Supabase setup |

Run `npm run build` locally to verify before deploy. Supabase is the production
source of truth; `data/virtue-gems.db` is retained only for local fallback and
the one-time migration.

**Custom domain tip:** Apex (`virtuegems.com`) redirects to **www**. Set `NEXT_PUBLIC_SITE_URL=https://www.virtuegems.com` in Vercel so invoices, sitemap, and WhatsApp links never use a `*.vercel.app` preview host.

## Future roadmap

Supabase auth, admin CRUD and PostgreSQL are implemented. Remaining optional
work includes Razorpay and other enhancements in
[`docs/phase-2/README.md`](./docs/phase-2/README.md).

## SEO & Google ranking

See [docs/seo.md](./docs/seo.md) for Search Console setup, sitemap checks, and ranking tips for `www.virtuegems.com`.

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase Postgres, Auth and Storage
- Nodemailer (Gmail SMTP)
