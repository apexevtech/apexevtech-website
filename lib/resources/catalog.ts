import { resources, type Resource } from "@/data/resources";

export { resources };
export type { Resource };
export function getResource(slug: string) { return resources.find((resource) => resource.slug === slug); }
export function getRelatedResources(resource: Resource) {
  return resource.relatedResourceSlugs.map((slug) => getResource(slug)).filter((item): item is Resource => Boolean(item));
}
