-- Virtue Gems production schema: catalog, orders, customers, CRM and admin roles.
-- Run in Supabase SQL Editor, then create the first Auth user and execute:
-- insert into public.admin_profiles (id, email, role)
-- values ('AUTH_USER_UUID', 'owner@example.com', 'owner');

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'staff' check (role in ('owner', 'admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  long_description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2),
  images jsonb not null default '[]'::jsonb,
  category text not null check (category in ('rings','necklaces','earrings','bracelets','pendants')),
  tags jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  reviews jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  name text not null,
  email text,
  address text,
  city text,
  state text,
  pincode text,
  total_orders integer not null default 0,
  total_spent numeric(12,2) not null default 0,
  last_order_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_id uuid not null references public.customers(id),
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'pending'
    check (status in ('pending','confirmed','paid','shipped','delivered','cancelled')),
  source text not null default 'whatsapp',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id text references public.products(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) generated always as (quantity * unit_price) stored
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  changed_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  note text not null check (char_length(note) between 1 and 2000),
  created_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.follow_up_reminders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  order_id text references public.orders(id) on delete cascade,
  title text not null,
  details text,
  due_at timestamptz not null,
  completed_at timestamptz,
  assigned_to uuid references public.admin_profiles(id),
  created_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.loyalty_accounts (
  phone text primary key,
  name text,
  points integer not null default 0,
  lifetime_points integer not null default 0,
  history jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists products_active_category_idx
  on public.products(active, category);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists orders_phone_idx on public.orders(phone);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists notes_customer_idx
  on public.customer_notes(customer_id, created_at desc);
create index if not exists reminders_due_idx
  on public.follow_up_reminders(completed_at, due_at);

create or replace function public.is_admin(required_roles text[] default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles p
    where p.id = auth.uid()
      and p.active = true
      and (required_roles is null or p.role = any(required_roles))
  );
$$;

alter table public.admin_profiles enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.customer_notes enable row level security;
alter table public.follow_up_reminders enable row level security;
alter table public.loyalty_accounts enable row level security;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
  on public.products for select
  using (active = true or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins view profiles" on public.admin_profiles;
create policy "Admins view profiles"
  on public.admin_profiles for select using (public.is_admin());
drop policy if exists "Owners manage profiles" on public.admin_profiles;
create policy "Owners manage profiles"
  on public.admin_profiles for all
  using (public.is_admin(array['owner']))
  with check (public.is_admin(array['owner']));

drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers" on public.customers for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage status history" on public.order_status_history;
create policy "Admins manage status history" on public.order_status_history for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage notes" on public.customer_notes;
create policy "Admins manage notes" on public.customer_notes for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage reminders" on public.follow_up_reminders;
create policy "Admins manage reminders" on public.follow_up_reminders for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage loyalty" on public.loyalty_accounts;
create policy "Admins manage loyalty" on public.loyalty_accounts for all
  using (public.is_admin()) with check (public.is_admin());

-- Atomic WhatsApp order placement. Prices and stock are always read from the DB.
create or replace function public.place_whatsapp_order(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_city text,
  p_state text,
  p_pincode text,
  p_items jsonb,
  p_discount numeric default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id text;
  v_subtotal numeric(12,2) := 0;
  v_total numeric(12,2);
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
begin
  if nullif(trim(p_customer_name), '') is null then
    raise exception 'Customer name is required';
  end if;
  if p_phone !~ '^[0-9]{10,15}$' then
    raise exception 'Valid phone number is required';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must include at least one item';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    select * into v_product
      from public.products
      where id = v_item->>'productId' and active = true
      for update;
    if not found then raise exception 'A product is no longer available'; end if;
    if v_qty < 1 or v_qty > 99 then raise exception 'Invalid quantity'; end if;
    if v_product.stock < v_qty then
      raise exception '% only has % in stock', v_product.name, v_product.stock;
    end if;
    v_subtotal := v_subtotal + (v_product.price * v_qty);
  end loop;

  -- Promotions must be validated server-side before discounts are enabled.
  -- Never trust a browser-supplied total or discount.
  v_total := v_subtotal;
  v_order_id := 'ORD-' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISS') ||
    '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 5));

  insert into public.customers
    (phone, name, address, city, state, pincode, total_orders, total_spent, last_order_at)
  values
    (p_phone, trim(p_customer_name), trim(p_address), trim(p_city), p_state,
     p_pincode, 1, v_total, now())
  on conflict (phone) do update set
    name = excluded.name,
    address = excluded.address,
    city = excluded.city,
    state = excluded.state,
    pincode = excluded.pincode,
    total_orders = customers.total_orders + 1,
    total_spent = customers.total_spent + v_total,
    last_order_at = now(),
    updated_at = now()
  returning id into v_customer_id;

  insert into public.orders
    (id, customer_id, customer_name, phone, address, city, state, pincode,
     subtotal, discount, total, status, source)
  values
    (v_order_id, v_customer_id, trim(p_customer_name), p_phone, trim(p_address),
     trim(p_city), p_state, p_pincode, v_subtotal, 0,
     v_total, 'pending', 'whatsapp');

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    select * into v_product from public.products
      where id = v_item->>'productId' for update;
    update public.products set stock = stock - v_qty, updated_at = now()
      where id = v_product.id;
    insert into public.order_items
      (order_id, product_id, product_name, quantity, unit_price)
    values
      (v_order_id, v_product.id, v_product.name, v_qty, v_product.price);
  end loop;

  insert into public.order_status_history(order_id, from_status, to_status, note)
  values (v_order_id, null, 'pending', 'Order placed through WhatsApp checkout');

  return jsonb_build_object(
    'id', v_order_id,
    'customerName', trim(p_customer_name),
    'phone', p_phone,
    'address', trim(p_address),
    'city', trim(p_city),
    'state', p_state,
    'pincode', p_pincode,
    'items', p_items,
    'total', v_total,
    'status', 'pending',
    'createdAt', now()
  );
end;
$$;

revoke all on function public.place_whatsapp_order(
  text,text,text,text,text,text,jsonb,numeric
) from public, anon, authenticated;
grant execute on function public.place_whatsapp_order(
  text,text,text,text,text,text,jsonb,numeric
) to service_role;

-- Admin-only atomic status change. Cancelling restores stock once; reopening a
-- cancelled order reserves stock again.
create or replace function public.change_order_status(
  p_order_id text,
  p_status text,
  p_changed_by uuid default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_item record;
begin
  if p_status not in ('pending','confirmed','paid','shipped','delivered','cancelled') then
    raise exception 'Invalid status';
  end if;
  select status into v_old_status
    from public.orders where id = p_order_id for update;
  if not found then return null; end if;
  if v_old_status = p_status then return p_status; end if;

  if p_status = 'cancelled' and v_old_status <> 'cancelled' then
    update public.products p
      set stock = p.stock + i.quantity, updated_at = now()
      from public.order_items i
      where i.order_id = p_order_id and i.product_id = p.id;
    update public.customers c
      set total_spent = greatest(0, c.total_spent - o.total), updated_at = now()
      from public.orders o
      where o.id = p_order_id and c.id = o.customer_id;
  elsif v_old_status = 'cancelled' and p_status <> 'cancelled' then
    for v_item in
      select i.product_id, i.quantity, p.name, p.stock
      from public.order_items i
      join public.products p on p.id = i.product_id
      where i.order_id = p_order_id
      for update of p
    loop
      if v_item.stock < v_item.quantity then
        raise exception '% does not have enough stock to reopen this order', v_item.name;
      end if;
      update public.products
        set stock = stock - v_item.quantity, updated_at = now()
        where id = v_item.product_id;
    end loop;
    update public.customers c
      set total_spent = c.total_spent + o.total, updated_at = now()
      from public.orders o
      where o.id = p_order_id and c.id = o.customer_id;
  end if;

  update public.orders
    set status = p_status, updated_at = now()
    where id = p_order_id;
  insert into public.order_status_history
    (order_id, from_status, to_status, changed_by)
  values (p_order_id, v_old_status, p_status, p_changed_by);
  return p_status;
end;
$$;

revoke all on function public.change_order_status(text,text,uuid) from public;
grant execute on function public.change_order_status(text,text,uuid) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  15728640,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects for select
  using (bucket_id = 'product-images');
drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects for insert
  to authenticated with check (
    bucket_id = 'product-images' and public.is_admin()
  );
drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects for update
  to authenticated using (
    bucket_id = 'product-images' and public.is_admin()
  );
drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects for delete
  to authenticated using (
    bucket_id = 'product-images' and public.is_admin()
  );
