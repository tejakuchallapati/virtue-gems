import { getSiteUrl, PRODUCTION_SITE_URL } from "@/lib/site";

/** Site-wide Organization + WebSite JSON-LD for the custom domain. */
export function WebsiteJsonLd() {
  const siteUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Virtue Gems",
        url: siteUrl,
        email: "virtuegems777@gmail.com",
        telephone: "+91-73961-78039",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          addressCountry: "IN",
        },
        sameAs: ["https://www.instagram.com/virtue_gems/"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Virtue Gems",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: `${PRODUCTION_SITE_URL}/shop?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
