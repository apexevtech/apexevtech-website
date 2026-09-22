import { company } from "@/data/site";
import type { Resource } from "@/lib/resources/catalog";

export function buildResourceStructuredData(resource: Resource, baseUrl: string) {
  const url = new URL(`/resources/${resource.slug}`, baseUrl).toString();
  const organization = { "@type": "Organization", name: company.name, url: new URL("/", baseUrl).toString() };

  return {
    articleData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: resource.title,
      description: resource.description,
      datePublished: resource.publishedAt,
      dateModified: resource.modifiedAt,
      mainEntityOfPage: url,
      url,
      inLanguage: "en",
      author: organization,
      publisher: organization,
    },
    breadcrumbData: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", baseUrl).toString() },
        { "@type": "ListItem", position: 2, name: "Resources", item: new URL("/resources", baseUrl).toString() },
        { "@type": "ListItem", position: 3, name: resource.title, item: url },
      ],
    },
  };
}
