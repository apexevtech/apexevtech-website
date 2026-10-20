import {
  applicationScenarioCategories,
  applicationScenarios,
  solutionBriefCategories,
  solutionBriefs,
  type TechnicalLibraryCategory,
  type TechnicalLibraryEntry,
} from "@/data/technical-library";
import { paginate, parsePageNumber } from "@/lib/navigation/pagination";

export type LibraryFilters = {
  view: "all" | "solutions" | "scenarios";
  category: string;
  query: string;
  page: number;
};

export const defaultLibraryFilters: LibraryFilters = {
  view: "all",
  category: "all",
  query: "",
  page: 1,
};

export function getLibraryCategories(view: LibraryFilters["view"]): TechnicalLibraryCategory[] {
  const categories = view === "solutions"
    ? solutionBriefCategories
    : view === "scenarios"
      ? applicationScenarioCategories
      : [...solutionBriefCategories, ...applicationScenarioCategories];

  return [...new Map(categories.map((category) => [category.id, category])).values()];
}

export function parseLibraryFilters(params: URLSearchParams): LibraryFilters {
  const candidateView = params.get("view")?.trim().toLowerCase();
  const view = candidateView === "solutions" || candidateView === "scenarios" ? candidateView : "all";
  const candidateCategory = params.get("category")?.trim().toLowerCase();
  const category = getLibraryCategories(view).some((item) => item.id === candidateCategory)
    ? candidateCategory!
    : "all";

  return {
    view,
    category,
    query: (params.get("q") || "").trim().slice(0, 120),
    page: parsePageNumber(params.get("page")),
  };
}

export function serializeLibraryFilters(filters: LibraryFilters, existing = new URLSearchParams()): URLSearchParams {
  const params = new URLSearchParams(existing);
  for (const [key, value] of Object.entries({ view: filters.view, category: filters.category, q: filters.query })) {
    if (!value || (key !== "q" && value === "all")) params.delete(key);
    else params.set(key, value);
  }
  if (filters.page > 1) params.set("page", String(filters.page));
  else params.delete("page");
  return params;
}

export function filterLibraryEntries(filters: LibraryFilters): {
  solutions: TechnicalLibraryEntry[];
  scenarios: TechnicalLibraryEntry[];
} {
  const query = filters.query.trim().toLowerCase();
  const matches = (entry: TechnicalLibraryEntry, categories: TechnicalLibraryCategory[]) => {
    if (filters.category !== "all" && entry.categoryId !== filters.category) return false;
    const categoryLabel = categories.find((category) => category.id === entry.categoryId)?.label || "";
    const searchableText = [entry.title, entry.summary, ...entry.requirements, categoryLabel, entry.reviewOutput, entry.source.publisher, entry.source.title, entry.source.summary]
      .join(" ")
      .toLowerCase();
    return !query || searchableText.includes(query);
  };

  return {
    solutions: filters.view === "scenarios" ? [] : solutionBriefs.filter((entry) => matches(entry, solutionBriefCategories)),
    scenarios: filters.view === "solutions" ? [] : applicationScenarios.filter((entry) => matches(entry, applicationScenarioCategories)),
  };
}

export function getLibraryPage(filters: LibraryFilters) {
  const { solutions, scenarios } = filterLibraryEntries(filters);
  const result = paginate([...solutions, ...scenarios], filters.page);
  const solutionIds = new Set(solutions.map((entry) => entry.id));
  return {
    ...result,
    solutions: result.items.filter((entry) => solutionIds.has(entry.id)),
    scenarios: result.items.filter((entry) => !solutionIds.has(entry.id)),
  };
}
