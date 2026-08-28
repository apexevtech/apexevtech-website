import { company } from "@/data/site";
import { getVerifiedSameAs } from "@/lib/seo/site-urls";

type StructuredData = Record<string, unknown>;

export function buildStructuredData(siteUrl: string): StructuredData[] {
  const organization: StructuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: company.name,
      alternateName: company.brand,
      url: siteUrl,
      email: company.email,
      telephone: company.phone,
      ...(getVerifiedSameAs().length ? { sameAs: getVerifiedSameAs() } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: company.location,
        addressCountry: "CN",
      },
    };
  return [organization,
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
