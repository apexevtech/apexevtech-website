import type { ApplicationExample } from "@/data/applications";
import { company } from "@/data/site";

export function buildApplicationStructuredData(application: ApplicationExample, baseUrl: string) {
  const url = new URL(`/applications/${application.slug}`, baseUrl).toString();
  const organization = { "@type": "Organization", name: company.name, url: new URL("/", baseUrl).toString() };
  return {
    articleData: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: application.title,
      description: application.description,
      image: new URL(application.image, baseUrl).toString(),
      url,
      mainEntityOfPage: url,
      datePublished: application.publishedAt,
      dateModified: application.modifiedAt,
      author: organization,
      publisher: organization,
      about: application.category,
    },
    breadcrumbData: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", baseUrl).toString() },
        { "@type": "ListItem", position: 2, name: "Applications", item: new URL("/applications", baseUrl).toString() },
        { "@type": "ListItem", position: 3, name: application.title, item: url },
      ],
    },
  };
}

export function buildApplicationIndexStructuredData(applications: ApplicationExample[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EV Charger Test Application Architectures",
    url: new URL("/applications", baseUrl).toString(),
    numberOfItems: applications.length,
    itemListElement: applications.map((application, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: application.title,
      url: new URL(`/applications/${application.slug}`, baseUrl).toString(),
    })),
  };
}
