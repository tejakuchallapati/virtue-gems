# Phase 2 — Analytics & QA

## Analytics (GA4)

Visitor analytics use **Google Analytics 4**. Counts and reports live in the [Google Analytics](https://analytics.google.com) dashboard — not inside `/admin` (admin stays order/sales focused).

### Setup

1. Create a GA4 property for `www.virtuegems.com` in Google Analytics.
2. Copy the Measurement ID (`G-XXXXXXXX`).
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX` in Vercel → Production → Environment Variables.
4. Redeploy. Confirm hits under GA4 → Reports → Realtime.

Local/dev stays quiet when the env var is empty. GA scripts are also skipped on `/admin` routes.

### What is tracked

- Page views (including App Router client navigations)
- `view_item` — product detail open
- `add_to_cart` — product card / PDP
- `begin_checkout` — checkout page with items in cart
- `generate_lead` / `purchase` — order successfully saved (WhatsApp checkout)

No PII in event payloads (no customer name or phone).

## Testing

- Playwright E2E: shop → cart → checkout → order API mock
- API unit tests: `validateOrderInput`, loyalty caps
- Load test: `/api/orders` rate limit under burst

## Monitoring

- `/api/health` already exists — wire to UptimeRobot
- Error tracking: Sentry optional
- Log aggregation on production host

## Pre-launch checklist

- [x] Custom domain connected (`https://www.virtuegems.com`)
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.virtuegems.com` set on Vercel production
- [ ] UPI ID and WhatsApp number in env
- [ ] SMTP working for contact form
- [ ] Admin OTP email verified
- [ ] Open `/robots.txt` and `/sitemap.xml` on the live domain and confirm URLs use `www.virtuegems.com`
