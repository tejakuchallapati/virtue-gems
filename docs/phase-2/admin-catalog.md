# Phase 2 — Admin Catalog & Inventory

## Current (implemented locally)

- Products stored in SQLite `products` table (seeded from `src/data/products.json`)
- Admin **Products** page (`/admin/inventory`): create / edit / soft-delete
- Public shop reads live catalog via `getAllProducts()` → SQLite
- JSON backup written to `src/data/products.json` after each change

## Goals (remaining)

- Upload images to `/public/products/` or cloud storage (S3 / Cloudinary)
- Decrement stock when order marked **paid**

## Data model

```
products (id, slug, name, price, stock, images_json, category, tags_json, active, ...)
```

## Implementation notes

- Soft-delete sets `active = 0` so old orders still resolve names
- Slug auto-generated from name with uniqueness check
- Image field accepts paths like `/products/vg-001.jpg` (upload files to `public/products/` separately for now)
