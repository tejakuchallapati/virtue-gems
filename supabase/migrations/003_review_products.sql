-- Link a review to the product the customer bought, so approved reviews can
-- appear on that product's page (and in its Google structured data).
-- Reviews without a product stay general store reviews.

alter table public.store_reviews
  add column if not exists product_id text
    references public.products (id) on delete set null;

create index if not exists store_reviews_product_status_idx
  on public.store_reviews (product_id, status, created_at desc);

notify pgrst, 'reload schema';
