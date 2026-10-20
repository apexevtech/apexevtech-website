import { parseResourceBrowserFilters, serializeResourceBrowserFilters } from "@/lib/resources/browser";

export function getLibraryResourceHref(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  const view = params.get("view")?.trim().toLowerCase();
  if (!params.has("type") && !["all", "solutions", "scenarios"].includes(view || "")) params.set("type", "materials");
  const filters = parseResourceBrowserFilters(params);
  const query = serializeResourceBrowserFilters(filters, params).toString();
  return `/resources${query ? `?${query}` : ""}`;
}
