import { getSiteUrl } from "@/lib/site";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

/** Organization, WebSite, and JewelryStore schema for local SEO. */
export function WebsiteJsonLd() {
  const siteUrl = getSiteUrl();
  const logo = `${siteUrl}/logo-with-text.png`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: logo,
        },
        email: "virtuegems777@gmail.com",
        telephone: "+91-73961-78039",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          addressCountry: "IN",
        },
        areaServed: [
          { "@type": "State", name: "Telangana" },
          { "@type": "State", name: "Andhra Pradesh" },
        ],
        sameAs: ["https://www.instagram.com/virtue_gems/"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "JewelryStore",
        "@id": `${siteUrl}/#store`,
        name: SITE_NAME,
        description: SITE_TAGLINE,
        url: siteUrl,
        image: logo,
        telephone: "+91-73961-78039",
        email: "virtuegems777@gmail.com",
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "UPI, Bank Transfer, WhatsApp Order",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 17.385,
          longitude: 78.4867,
        },
        areaServed: ["IN-TG", "IN-AP"],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "10:00",
          closes: "21:00",
        },
        parentOrganization: { "@id": `${siteUrl}/#organization` },
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
