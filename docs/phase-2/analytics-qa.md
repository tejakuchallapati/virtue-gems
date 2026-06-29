# Phase 2 — Analytics & QA

## Analytics

- GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Events: `add_to_cart`, `begin_checkout`, `purchase` (WhatsApp order saved)
- Admin dashboard: replace static charts with real-time if needed

## Testing

- Playwright E2E: shop → cart → checkout → order API mock
- API unit tests: `validateOrderInput`, loyalty caps
- Load test: `/api/orders` rate limit under burst

## Monitoring

- `/api/health` already exists — wire to UptimeRobot
- Error tracking: Sentry optional
- Log aggregation on production host

## Pre-launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set on production
- [ ] UPI ID and WhatsApp number in env
- [ ] SMTP working for contact form
- [ ] Admin OTP email verified
