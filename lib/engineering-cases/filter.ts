import { engineeringCaseCategories, engineeringCases, type EngineeringCaseCategoryId } from "@/data/engineering-cases";
import { paginate, parsePageNumber } from "@/lib/navigation/pagination";

export const engineeringCaseIndexTitle = "EV Charger Engineering Case References";

export type EngineeringCaseFilters = {
  category: "all" | EngineeringCaseCategoryId;
  query: string;
  page: number;
};

export const defaultEngineeringCaseFilters: EngineeringCaseFilters = { category: "all", query: "", page: 1 };

function normalizeCategory(category: string | null): EngineeringCaseFilters["category"] {
  return engineeringCaseCategories.find((item) => item.id === category?.trim().toLowerCase())?.id ?? "all";
}

export function getEngineeringCaseCategoryLabel(category: string) {
  return engineeringCaseCategories.find((item) => item.id === category)?.label ?? "All references";
}

export function filterEngineeringCases(filters: EngineeringCaseFilters) {
  const category = normalizeCategory(filters.category);
  const query = filters.query.trim().slice(0, 120).toLocaleLowerCase();
  return engineeringCases.filter((entry) => {
    if (category !== "all" && entry.categoryId !== category) return false;
    const text = [entry.title, entry.summary, ...entry.technicalFocus, getEngineeringCaseCategoryLabel(entry.categoryId)].join(" ");
    return !query || text.toLocaleLowerCase().includes(query);
  });
}

export function getEngineeringCasePage(filters: EngineeringCaseFilters) {
  return paginate(filterEngineeringCases(filters), filters.page, 6);
}

export function parseEngineeringCaseFilters(params: URLSearchParams): EngineeringCaseFilters {
  const filters = {
    category: normalizeCategory(params.get("category")),
    query: (params.get("q") ?? "").trim().slice(0, 120),
    page: parsePageNumber(params.get("page")),
  };
  return { ...filters, page: getEngineeringCasePage(filters).page };
}

export function serializeEngineeringCaseFilters(filters: EngineeringCaseFilters, existing = new URLSearchParams()) {
  const params = new URLSearchParams(existing);
  for (const key of ["category", "q", "page"]) params.delete(key);
  const category = normalizeCategory(filters.category);
  if (category !== "all") params.set("category", category);
  const query = filters.query.trim().slice(0, 120);
  if (query) params.set("q", query);
  const page = getEngineeringCasePage({ ...filters, category }).page;
  if (page > 1) params.set("page", String(page));
  return params;
}
