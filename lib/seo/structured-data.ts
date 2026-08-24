import { company } from "@/data/site";

type StructuredData = Record<string, unknown>;

export function buildStructuredData(siteUrl: string): StructuredData[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: company.name,
      alternateName: company.brand,
      url: siteUrl,
      email: company.email,
      telephone: company.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: company.location,
        addressCountry: "CN",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "APEX EV Charging Test & Validation Solutions",
      url: siteUrl,
      publisher: {
        "@type": "Organization",
        name: company.name,
      },
    },
  ];
}
