import { solutionBriefCategories, solutionBriefs, type TechnicalLibraryEntry } from "@/data/technical-library";
import { paginate, parsePageNumber } from "@/lib/navigation/pagination";
import { resources, type Resource } from "@/lib/resources/catalog";
import { resourceGroups } from "@/lib/resources/groups";

export type ResourceBrowserFilters = {
  type: "all" | "guides" | "sources";
  category: string;
  query: string;
  page: number;
};

export type ResourceBrowserEntry =
  | { kind: "guide"; id: string; categoryId: string; resource: Resource }
  | { kind: "source"; id: string; categoryId: string; material: TechnicalLibraryEntry };

export const defaultResourceBrowserFilters: ResourceBrowserFilters = { type: "all", category: "all", query: "", page: 1 };

const guideEntries: ResourceBrowserEntry[] = resources.map((resource) => ({
  kind: "guide",
  id: resource.slug,
  categoryId: resourceGroups.find((group) => group.resources.some((item) => item.slug === resource.slug))!.id,
  resource,
}));

const sourceEntries: ResourceBrowserEntry[] = solutionBriefs.map((material) => ({
  kind: "source", id: material.id, categoryId: material.categoryId, material,
}));

// Interleave the two collections so source materials are visible on the first page.
export const resourceBrowserEntries: ResourceBrowserEntry[] = Array.from(
  { length: Math.max(guideEntries.length, sourceEntries.length) },
  (_, index) => [sourceEntries[index], guideEntries[index]].filter((entry): entry is ResourceBrowserEntry => Boolean(entry)),
).flat();

export function getResourceBrowserCategories(type: ResourceBrowserFilters["type"]) {
  const guides = resourceGroups.map((group) => ({ id: group.id, label: group.eyebrow }));
  if (type === "guides") return guides;
  if (type === "sources") return solutionBriefCategories;
  return [...guides, ...solutionBriefCategories];
}

export function parseResourceBrowserFilters(params: URLSearchParams): ResourceBrowserFilters {
  const rawType = params.get("type");
  const type = rawType === "guides" || rawType === "sources" ? rawType : "all";
  const rawCategory = params.get("category");
  const category = getResourceBrowserCategories(type).some((item) => item.id === rawCategory) ? rawCategory! : "all";
  const filters: ResourceBrowserFilters = { type, category, query: (params.get("q") ?? "").trim().slice(0, 120), page: parsePageNumber(params.get("page")) };
  return { ...filters, page: getResourceBrowserPage(filters).page };
}

export function filterResourceBrowserEntries(filters: ResourceBrowserFilters) {
  const query = filters.query.trim().slice(0, 120).toLocaleLowerCase();
  return resourceBrowserEntries.filter((entry) => {
    if (filters.type === "guides" && entry.kind !== "guide") return false;
    if (filters.type === "sources" && entry.kind !== "source") return false;
    if (filters.category !== "all" && entry.categoryId !== filters.category) return false;
    const category = getResourceBrowserCategories("all").find((item) => item.id === entry.categoryId)?.label ?? "";
    const text = entry.kind === "guide"
      ? [entry.resource.title, entry.resource.description, entry.resource.topic, category].join(" ")
      : [entry.material.source.publisher, entry.material.source.title, entry.material.source.summary, entry.material.title, entry.material.summary, category].join(" ");
    return !query || text.toLocaleLowerCase().includes(query);
  });
}

export function getResourceBrowserPage(filters: ResourceBrowserFilters) {
  return paginate(filterResourceBrowserEntries(filters), filters.page, 6);
}

export function serializeResourceBrowserFilters(filters: ResourceBrowserFilters, existing = new URLSearchParams()) {
  const params = new URLSearchParams(existing);
  for (const key of ["type", "category", "q", "page"]) params.delete(key);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.category !== "all") params.set("category", filters.category);
  const query = filters.query.trim().slice(0, 120);
  if (query) params.set("q", query);
  const page = getResourceBrowserPage(filters).page;
  if (page > 1) params.set("page", String(page));
  return params;
}
