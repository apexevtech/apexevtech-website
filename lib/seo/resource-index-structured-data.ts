import type { Resource } from "@/data/resources";

export function buildResourceIndexStructuredData(resources: Resource[], baseUrl: string, path = "/project-cases?section=resources") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EV Charger Testing Guides",
    url: new URL(path.split("#")[0], baseUrl).toString(),
    numberOfItems: resources.length,
    itemListElement: resources.map((resource, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: resource.title,
      url: new URL(`/resources/${resource.slug}`, baseUrl).toString(),
    })),
  };
}
