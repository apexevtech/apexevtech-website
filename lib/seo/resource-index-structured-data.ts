import type { Resource } from "@/data/resources";

export function buildResourceIndexStructuredData(resources: Resource[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EV Charger Testing Guides",
    url: new URL("/resources", baseUrl).toString(),
    numberOfItems: resources.length,
    itemListElement: resources.map((resource, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: resource.title,
      url: new URL(`/resources/${resource.slug}`, baseUrl).toString(),
    })),
  };
}
