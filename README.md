# Virtue Gems

A super phone-responsive jewellery e-commerce website.

**Repository:** https://github.com/tejakuchallapati/virtue-gems

## Email notifications

The project sends automated emails to `virtuegems777@gmail.com` for:

1. **Contact form** — messages from `/contact`
2. **Project updates** — via `POST /api/notify` (API key required)
3. **GitHub** — every push to `main` and every pull request event

## Setup

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

Before going live, set these in your hosting provider (e.g. Vercel) — copy from `.env.example`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your live domain (sitemap, SEO) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp checkout number |
| `NEXT_PUBLIC_UPI_ID` | UPI ID for payment replies |
| `SMTP_*` / `NOTIFY_EMAIL` | Contact form & order emails |
| `OTP_SECRET` / `ADMIN_EMAIL` | Admin login |

Run `npm run build` locally to verify before deploy. Orders and loyalty data live in `data/virtue-gems.db` (SQLite).

## Phase 2 roadmap

See [docs/phase-2/README.md](./docs/phase-2/README.md) for the post-launch plan (Razorpay, auth, admin CRUD, PostgreSQL).

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Nodemailer (Gmail SMTP)
