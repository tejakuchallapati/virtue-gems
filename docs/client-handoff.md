# Virtue Gems — client handoff and operating guide

## What the website does

Virtue Gems is a responsive jewellery storefront with a WhatsApp-first checkout
and an authenticated CRM/admin portal.

### Customer storefront

1. Customer browses Home or Shop.
2. Product pages show multiple high-quality images, price, stock, details,
   similar products and reviews.
3. Customer adds products to cart and enters delivery details at Checkout.
4. The server validates live prices and stock, permanently saves the order,
   reduces inventory atomically, and creates/updates the customer profile.
5. WhatsApp opens with the prepared order message and invoice link.
6. The customer can revisit the generated invoice while the order exists.

No card payment is taken on the website. Payment confirmation continues through
WhatsApp/UPI according to the business process.

### Admin CRM

The `/admin` portal provides:

- secure Supabase email/password login with persistent sessions;
- owner/admin/staff roles;
- dashboard totals and recognized revenue;
- product catalog, stock, images, soft-delete/restore and bulk upload;
- grouped upload for several photos of one product (up to eight);
- WhatsApp order workflow and status timeline;
- permanent customer profiles and complete order history;
- internal customer notes;
- dated follow-up reminders;
- direct customer WhatsApp actions;
- real sales analytics and product leaders;
- Orders, Customers and Products CSV exports;
- downloadable JSON backups;
- owner-only team account management.

## Daily client workflow

### Add one product

1. Admin → Products → Add product.
2. Enter name, description, price, category and stock.
3. Select up to eight photos together.
4. Set the best photo as the cover.
5. Save and check the live product page.

### Bulk add different products

1. Admin → Products → Bulk upload.
2. Select a folder or several photos.
3. Leave “These photos belong to one product” unchecked.
4. Complete name, price, category and stock for each row.
5. Create products.

### Add several photos of one product

1. Select all photos in Bulk upload.
2. Enable “These photos belong to one product”.
3. Enter one product name, price, stock and category.
4. Create one product gallery.

### Process an order

1. Open Admin → Orders.
2. Move the order through Pending → Confirmed → Paid → Shipped → Delivered.
3. Copy/send the relevant WhatsApp response.
4. The timeline records every production status change.
5. Cancelling automatically restores stock and removes the order value from
   customer spend; reopening reserves the stock again.

### Customer follow-up

1. Open Admin → Customers.
2. Search by name or phone.
3. Review all orders and total spend.
4. Add private notes (preferences, sizing, requests).
5. Schedule follow-up reminders and mark them complete.

## Data and infrastructure

- Website and API backend: Next.js on Vercel.
- Products, stock, orders, customers and CRM: Supabase Postgres.
- Admin accounts and sessions: Supabase Auth.
- Product photos: Supabase Storage.
- Visitor analytics: Google Analytics 4.
- Customer communication: WhatsApp.
- Local development fallback: SQLite + `public/products`.

The Supabase service-role key is server-only. Public storefront users can read
active products and public product images, but cannot read CRM/order/customer
tables. Admin access is checked against active role profiles.

## Responsive design expectations

- Storefront navigation and product grids support small phones through desktop.
- Inputs use mobile-safe sizes to avoid iOS zoom.
- Product/cart/checkout controls have touch-friendly targets.
- Fixed product/cart controls account for the mobile bottom navigation.
- Admin product cards use one column on very narrow phones and scale up.
- CRM uses a searchable customer list plus responsive details.
- Modals use dynamic viewport height and safe-area padding.
- Horizontal tables are limited to data-heavy admin screens and scroll inside
  their own container.

## Maintenance

- Keep product images under 15 MB each; JPG/WebP is recommended.
- Download an admin JSON backup regularly.
- Review pending follow-ups daily.
- Never share or commit `.env.local`.
- Disable former staff immediately in Admin → Team.
- Check stock before campaigns or Instagram promotions.
- Verify Vercel and Supabase usage monthly; free tiers are suitable initially,
  but production limits depend on traffic and image volume.

## Production setup

Follow [`docs/supabase-production-setup.md`](supabase-production-setup.md) before
giving live admin access to the client.
