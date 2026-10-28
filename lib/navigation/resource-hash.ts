import { buildPageHref, catalogPageSize } from "@/lib/navigation/pagination";
import { defaultResourceBrowserFilters, filterResourceBrowserEntries, resourceBrowserEntries, type ResourceBrowserFilters } from "@/lib/resources/browser";

export function decodeResourceHash(hash: string): string | null {
  if (!hash.startsWith("#") || hash.length < 2) return null;
  try {
    return decodeURIComponent(hash.slice(1)) || null;
  } catch {
    return null;
  }
}

export function resolveResourceHash(hash: string, filters: ResourceBrowserFilters) {
  const id = decodeResourceHash(hash);
  if (!id?.startsWith("material-")) return null;
  const index = filterResourceBrowserEntries(filters).findIndex((entry) => `material-${entry.id}` === id);
  return index < 0 ? null : { id, page: Math.floor(index / catalogPageSize) + 1 };
}

export function getResourceGuideIndexHref(slug: string): string {
  const entry = resourceBrowserEntries.find((item) => item.kind === "guide" && item.resource.slug === slug);
  const root = "/project-cases?section=resources";
  if (!entry) return root;
  const target = resolveResourceHash(`#material-${entry.id}`, defaultResourceBrowserFilters);
  return target ? buildPageHref("/project-cases", new URLSearchParams({ section: "resources" }), target.page, target.id) : root;
}
