# SEO guide — Virtue Gems (`virtuegems.com`)

Technical SEO is wired in the app. Ranking on Google also needs **Search Console**, good content, and time.

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

## Required: Google Search Console (do this once)

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property → **URL prefix** → `https://virtuegems.com`
3. Verify with **HTML tag** method
4. Copy the content value (looks like `abc123...`) into Vercel env:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123...
```

5. Redeploy, then click **Verify** in Search Console
6. Submit sitemap: `https://virtuegems.com/sitemap.xml`

## Vercel env checklist

```
NEXT_PUBLIC_SITE_URL=https://virtuegems.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code-from-search-console
```

## Tips to rank higher (beyond code)

- Post weekly on Instagram (`@virtue_gems`) and link to product pages
- Ask happy customers for Google reviews if you add a Google Business Profile
- Keep product titles and descriptions unique (already in catalog)
- Share WhatsApp catalog links that point to `virtuegems.com/product/...`
- Expect **weeks/months** for new domains — Google needs crawl history

## Quick self-check after deploy

- [ ] https://virtuegems.com loads with HTTPS
- [ ] View source → see `og:url` with `virtuegems.com`
- [ ] https://virtuegems.com/sitemap.xml lists products
- [ ] https://virtuegems.com/robots.txt allows `/` and points to sitemap
- [ ] Search Console shows sitemap as “Success”
