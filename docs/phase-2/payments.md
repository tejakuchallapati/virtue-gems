# Phase 2 — Payments

## Current (Phase 1)

- Checkout saves order → opens WhatsApp bill
- Payment via UPI / bank transfer on WhatsApp
- Admin marks order: pending → confirmed → paid → shipped → delivered

## Step 1 — Razorpay Payment Links (recommended first)

- Create payment link in Razorpay dashboard or admin button
- Send link on WhatsApp after confirming order
- Webhook or manual check marks order **paid**
- No checkout UI change required

## Step 2 — Full Razorpay checkout

When you get **10+ orders/day** or customers ask to pay on-site:

- `POST /api/payments/create-order` → Razorpay order id
- Client opens Razorpay checkout modal
- Webhook `payment.captured` → update order status to **paid**
- Refunds via Razorpay dashboard initially

## Env vars (future)

```
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

## Do not

- Remove WhatsApp checkout — keep as fallback
- Build payments + auth + CRUD in one release
