# SEO guide — Virtue Gems (`www.virtuegems.com`)

Technical SEO is wired in the app. Ranking on Google also needs **Search Console**, good content, and time.

## Canonical domain

Your live site redirects:

- `https://virtuegems.com` → `https://www.virtuegems.com`

So the **canonical** URL is **`https://www.virtuegems.com`**.

Always set in Vercel (Production):

```
NEXT_PUBLIC_SITE_URL=https://www.virtuegems.com
```

Without this, sitemap/robots can accidentally list a temporary `*.vercel.app` URL and Google will fail to fetch.

## Visitor analytics (GA4)

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX` on Vercel Production after creating a GA4 property. Reports (users, pages, devices, sources) appear in [Google Analytics](https://analytics.google.com), not `/admin`. Setup details: [`docs/phase-2/analytics-qa.md`](phase-2/analytics-qa.md).

## What the site already does

| Feature | Where |
|---------|--------|
| Custom domain canonicals | `NEXT_PUBLIC_SITE_URL` + `metadataBase` |
| Sitemap + product image URLs | `/sitemap.xml` |
| Robots | `/robots.txt` |
| Open Graph / Twitter cards | Layout + `opengraph-image` |
| Organization / JewelryStore / WebSite JSON-LD | Home |
| Product + Offer + shipping schema | Product pages |
| FAQPage schema | `/faq` |
| BreadcrumbList schema | Shop, product, about, FAQ, rewards, try-on |
| Local keywords (Hyderabad, AP, Telangana) | Page metadata |
| Cart / checkout / wishlist | `noindex` (not for Google) |
| Web app manifest | `/manifest.webmanifest` |

## Google Search Console

### Preferred: Domain property

1. Search Console → Add property → **Domain** → `virtuegems.com`
2. Verify via DNS (TXT record at Hostinger)
3. Submit sitemap: `https://www.virtuegems.com/sitemap.xml`

### Or: URL-prefix property

1. Add **`https://www.virtuegems.com/`** (with `www`)
2. Verify (HTML file already at `/google65b9989051857934.html`)
3. Submit sitemap: `https://www.virtuegems.com/sitemap.xml`

> If you only verified `https://virtuegems.com/` (no www), Google may show **Couldn't fetch** for `/sitemap.xml` because that host **308-redirects** to www. Use the www property or a Domain property.

## Vercel env checklist

```
NEXT_PUBLIC_SITE_URL=https://www.virtuegems.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code-from-search-console
```

Redeploy after saving env vars.

## Google customer reviews

1. Create or verify the Virtue Gems
   [Google Business Profile](https://www.google.com/business/).
2. In the profile, choose **Ask for reviews** and copy the official review URL.
3. Set it in local/Vercel Production:

```
NEXT_PUBLIC_GOOGLE_REVIEW_URL=https://g.page/r/your-business-id/review
```

After redeploying, the home-page customer review section displays a
**Review Virtue Gems on Google** button. Only request honest reviews from real
customers. Do not purchase or fabricate reviews; Google can remove them and
lower trust in the business profile.

Product pages also publish genuine saved product reviews in Product JSON-LD,
making them eligible for Google product review enhancements when Google’s
content and quality requirements are met.

## Tips to rank higher (beyond code)

- Post weekly on Instagram (`@virtue_gems`) and link to product pages
- Ask happy customers for Google reviews if you add a Google Business Profile
- Keep product titles and descriptions unique (already in catalog)
- Share WhatsApp links that point to `https://www.virtuegems.com/product/...`
- Expect **weeks/months** for new domains — Google needs crawl history

## Quick self-check after deploy

- [ ] https://www.virtuegems.com loads with HTTPS
- [ ] https://www.virtuegems.com/sitemap.xml shows `www.virtuegems.com` URLs (not `*.vercel.app`)
- [ ] https://www.virtuegems.com/robots.txt Sitemap line uses `www.virtuegems.com`
- [ ] Search Console sitemap status becomes **Success**
- [ ] Home-page Google review button opens the official Virtue Gems review form
- [ ] Product pages pass Google Rich Results Test without review-schema errors
