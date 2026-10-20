import { catalogPageSize } from "@/lib/navigation/pagination";
import { filterResourceBrowserEntries, type ResourceBrowserFilters } from "@/lib/resources/browser";

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
