-- Customer reviews submitted on the storefront. New reviews stay "pending"
-- until an admin approves them. Photos live in the product-images bucket
-- under reviews/ and are uploaded server-side with the service role.

create table if not exists public.store_reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(author_name) between 1 and 80),
  city text check (city is null or char_length(city) <= 80),
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 10 and 1500),
  photos text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists store_reviews_status_created_idx
  on public.store_reviews (status, created_at desc);

alter table public.store_reviews enable row level security;

drop policy if exists "Public can view approved reviews" on public.store_reviews;
create policy "Public can view approved reviews"
  on public.store_reviews for select
  using (status = 'approved' or public.is_admin());

drop policy if exists "Admins manage reviews" on public.store_reviews;
create policy "Admins manage reviews"
  on public.store_reviews for all
  using (public.is_admin())
  with check (public.is_admin());
