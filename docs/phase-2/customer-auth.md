# Phase 2 — Customer Auth

## Goals

- Phone OTP login (matches existing loyalty phone)
- View order history and reward balance
- Optional saved addresses

## Suggested stack

- JWT in httpOnly cookie (or NextAuth with credentials + OTP)
- `customers` table linked to `loyalty_accounts.phone`
- Protected routes: `/account`, `/account/orders`

## API sketch

- `POST /api/auth/otp/send` — rate limited
- `POST /api/auth/otp/verify` — issue session
- `GET /api/account/orders` — orders for logged-in phone

## Migration

- Guest checkout remains — no forced login
- Loyalty points merge when phone matches
