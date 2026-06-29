# Phase 2 — Admin Catalog & Inventory

## Current

- Products live in `src/data/products.json`
- Admin products/inventory pages are read-only views

## Goals

- CRUD products from admin (name, price, images, stock, tags)
- Upload images to `/public/products/` or cloud storage (S3 / Cloudinary)
- Decrement stock when order marked **paid**

## Data model

```
products (id, slug, name, price, stock, images_json, category, tags_json, ...)
```

## Implementation notes

- Start with SQLite columns mirroring JSON shape
- Admin form validation matches `validateOrderInput` catalog lookups
- Slug auto-generate from name; unique constraint
