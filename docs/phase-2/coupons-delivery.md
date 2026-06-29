# Phase 2 — Coupons & Delivery

## Coupons

Distinct from loyalty rewards (points). Coupon codes are marketing campaigns.

| Field | Example |
|-------|---------|
| code | FESTIVE15 |
| type | percent_off / flat_off |
| value | 15 |
| min_order | 999 |
| max_uses | 100 |
| expires_at | ISO date |

- Validate server-side at checkout
- Stack policy: either coupon OR loyalty reward, not both (keep simple)

## Delivery expansion

- Phase 1: AP & Telangana only (enforced in `validateOrderInput`)
- Phase 2: `delivery_zones` table with pincodes or state lists
- Optional shipping fee per zone
