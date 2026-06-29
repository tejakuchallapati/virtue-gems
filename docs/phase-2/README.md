# Virtue Gems — Phase 2 Roadmap

Client handoff is complete for Phase 1 (WhatsApp checkout, loyalty, admin orders, SEO, try-on).

Phase 2 focuses on scaling sales, payments, and catalog management without over-engineering the startup flow.

## Principles

- Keep WhatsApp for trust and support — never remove it
- Add online payments only when order volume justifies automation
- Ship in small PRs; one feature per deploy when possible

## Documents

| Doc | Topic |
|-----|--------|
| [payments.md](./payments.md) | Razorpay payment links → full checkout |
| [customer-auth.md](./customer-auth.md) | Accounts, order history, JWT |
| [admin-catalog.md](./admin-catalog.md) | Product CRUD, inventory |
| [coupons-delivery.md](./coupons-delivery.md) | Coupon codes, delivery zones |
| [database.md](./database.md) | PostgreSQL migration from SQLite |
| [analytics-qa.md](./analytics-qa.md) | GA4, E2E tests, monitoring |

## Suggested order

1. Payments (Razorpay links)
2. Admin product CRUD
3. Coupon codes
4. Customer auth
5. PostgreSQL
6. Analytics & automated tests
