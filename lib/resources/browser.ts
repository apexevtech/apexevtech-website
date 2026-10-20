import { applicationScenarioCategories, applicationScenarios, solutionBriefCategories, solutionBriefs, type TechnicalLibraryEntry } from "@/data/technical-library";
import { paginate, parsePageNumber } from "@/lib/navigation/pagination";
import { resources, type Resource } from "@/lib/resources/catalog";
import { resourceGroups } from "@/lib/resources/groups";

export type ResourceBrowserFilters = {
  type: "all" | "guides" | "sources" | "scenarios" | "materials";
  category: string;
  query: string;
  page: number;
};

export type ResourceBrowserEntry =
  | { kind: "guide"; id: string; categoryId: string; originalCategoryId: string; resource: Resource }
  | { kind: "source"; id: string; categoryId: string; originalCategoryId: string; material: TechnicalLibraryEntry }
  | { kind: "scenario"; id: string; categoryId: string; originalCategoryId: string; material: TechnicalLibraryEntry };

export const defaultResourceBrowserFilters: ResourceBrowserFilters = { type: "all", category: "all", query: "", page: 1 };

const resourceTopics = [
  ...resourceGroups.map((group) => ({ id: group.id, label: group.eyebrow })),
  { id: "energy-integration", label: "Energy integration" },
];

// Topic assignments describe each planning document, not the source case's audience.
const materialTopics: Record<string, string> = {
  "evse-laboratory-planning": "laboratory-production",
  "vehicle-charger-interaction-planning": "interfaces-standards",
  "pv-storage-integration-planning": "energy-integration",
  "battery-power-interface-planning": "energy-integration",
  "field-diagnostics-planning": "field-commissioning",
  "custom-test-integration-planning": "system-selection",
  "ccs2-laboratory-scope": "interfaces-standards",
  "site-fault-diagnosis": "field-commissioning",
  "interoperability-scope-review": "interfaces-standards",
  "european-interface-evaluation": "interfaces-standards",
  "third-party-measurement-plan": "laboratory-production",
  "charging-power-scenario-plan": "energy-integration",
  "high-power-duty-review": "system-selection",
  "integrated-measurement-plan": "laboratory-production",
  "dc-charger-validation-plan": "laboratory-production",
  "protocol-suite-planning": "interfaces-standards",
  "ac-dc-measurement-station": "laboratory-production",
  "charging-site-inspection-plan": "field-commissioning",
  "custom-dc-test-scope": "system-selection",
  "embedded-end-of-line-planning": "laboratory-production",
  "vehicle-interaction-session-plan": "interfaces-standards",
  "message-validation-planning": "interfaces-standards",
  "automatic-dc-production-planning": "laboratory-production",
  "ultrafast-charging-load-planning": "energy-integration",
};

const guideEntries: ResourceBrowserEntry[] = resources.map((resource) => {
  const group = resourceGroups.find((group) => group.resources.some((item) => item.slug === resource.slug));
  if (!group) throw new Error(`Missing resource topic for guide: ${resource.slug}`);
  return { kind: "guide", id: resource.slug, categoryId: group.id, originalCategoryId: group.id, resource };
});

function materialEntry(material: TechnicalLibraryEntry, kind: "source" | "scenario"): ResourceBrowserEntry {
  const categoryId = materialTopics[material.id];
  if (!categoryId || !resourceTopics.some((topic) => topic.id === categoryId)) {
    throw new Error(`Missing resource topic for material: ${material.id}`);
  }
  return { kind, id: material.id, categoryId, originalCategoryId: material.categoryId, material };
}

const sourceEntries = solutionBriefs.map((material) => materialEntry(material, "source"));
const scenarioEntries = applicationScenarios.map((material) => materialEntry(material, "scenario"));

// Mix all three formats without duplicating documents or hiding planning materials.
export const resourceBrowserEntries: ResourceBrowserEntry[] = Array.from(
  { length: Math.max(guideEntries.length, sourceEntries.length, scenarioEntries.length) },
  (_, index) => [guideEntries[index], sourceEntries[index], scenarioEntries[index]].filter((entry): entry is ResourceBrowserEntry => Boolean(entry)),
).flat();

function matchesType(entry: ResourceBrowserEntry, type: ResourceBrowserFilters["type"]) {
  if (type === "guides") return entry.kind === "guide";
  if (type === "sources") return entry.kind === "source";
  if (type === "scenarios") return entry.kind === "scenario";
  if (type === "materials") return entry.kind !== "guide";
  return true;
}

function matchesCategory(entry: ResourceBrowserEntry, category: string) {
  return category === "all" || entry.categoryId === category || entry.originalCategoryId === category;
}

function normalizeCategory(type: ResourceBrowserFilters["type"], category: string | null) {
  return category && resourceBrowserEntries.some((entry) => matchesType(entry, type) && matchesCategory(entry, category)) ? category : "all";
}

export function getResourceBrowserCategoryLabel(id: string) {
  return [...resourceTopics, ...solutionBriefCategories, ...applicationScenarioCategories].find((category) => category.id === id)?.label ?? "";
}

export function getResourceBrowserCategories(type: ResourceBrowserFilters["type"]) {
  return resourceTopics.filter((topic) => resourceBrowserEntries.some((entry) => matchesType(entry, type) && entry.categoryId === topic.id));
}

export function parseResourceBrowserFilters(params: URLSearchParams): ResourceBrowserFilters {
  const rawType = params.get("type");
  const legacyView = params.get("view")?.trim().toLowerCase();
  const type: ResourceBrowserFilters["type"] = rawType === null
    ? legacyView === "all" ? "materials" : legacyView === "solutions" ? "sources" : legacyView === "scenarios" ? "scenarios" : "all"
    : rawType === "guides" || rawType === "sources" || rawType === "scenarios" || rawType === "materials" ? rawType : "all";
  const category = normalizeCategory(type, params.get("category")?.trim().toLowerCase() ?? null);
  const filters: ResourceBrowserFilters = { type, category, query: (params.get("q") ?? "").trim().slice(0, 120), page: parsePageNumber(params.get("page")) };
  return { ...filters, page: getResourceBrowserPage(filters).page };
}

export function filterResourceBrowserEntries(filters: ResourceBrowserFilters) {
  const query = filters.query.trim().slice(0, 120).toLocaleLowerCase();
  // Keep old Library page numbers attached to the same material sequence.
  const entries = filters.type === "materials" ? [...sourceEntries, ...scenarioEntries] : resourceBrowserEntries;
  return entries.filter((entry) => {
    if (!matchesType(entry, filters.type) || !matchesCategory(entry, filters.category)) return false;
    const category = `${getResourceBrowserCategoryLabel(entry.categoryId)} ${getResourceBrowserCategoryLabel(entry.originalCategoryId)}`;
    const text = entry.kind === "guide"
      ? [entry.resource.title, entry.resource.description, entry.resource.topic, category].join(" ")
      : [entry.material.title, entry.material.summary, ...entry.material.requirements, entry.material.reviewOutput, entry.material.planningNote, entry.material.relatedLabel, entry.material.source.publisher, entry.material.source.title, entry.material.source.summary, entry.material.source.scopeNote, category].join(" ");
    return !query || text.toLocaleLowerCase().includes(query);
  });
}

export function getResourceBrowserPage(filters: ResourceBrowserFilters) {
  return paginate(filterResourceBrowserEntries(filters), filters.page, 6);
}

export function serializeResourceBrowserFilters(filters: ResourceBrowserFilters, existing = new URLSearchParams()) {
  const params = new URLSearchParams(existing);
  for (const key of ["view", "type", "category", "q", "page"]) params.delete(key);
  if (filters.type !== "all") params.set("type", filters.type);
  const category = normalizeCategory(filters.type, filters.category);
  if (category !== "all") params.set("category", category);
  const query = filters.query.trim().slice(0, 120);
  if (query) params.set("q", query);
  const page = getResourceBrowserPage({ ...filters, category }).page;
  if (page > 1) params.set("page", String(page));
  return params;
}
