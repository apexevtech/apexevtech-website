import { describe, expect, it } from "vitest";
import { applicationScenarios, solutionBriefs } from "@/data/technical-library";
import { resources } from "@/lib/resources/catalog";
import { defaultResourceBrowserFilters, filterResourceBrowserEntries, getResourceBrowserCategories, getResourceBrowserCategoryLabel, getResourceBrowserPage, parseResourceBrowserFilters, resourceBrowserEntries, serializeResourceBrowserFilters } from "@/lib/resources/browser";

describe("resource browser", () => {
  it("searches Chinese guides and planning materials with stable paginated deep links", () => {
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "光伏与储能" }).map((entry) => entry.id)).toEqual(["pv-storage-integration-planning"]);
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, type: "guides", query: "国标" }).map((entry) => entry.id)).toEqual(["gbt-dc-charger-conformance-testing", "gbt-27930-2-charger-testing"]);
    const filters = { ...defaultResourceBrowserFilters, query: "接口与标准", page: 2 };
    expect(getResourceBrowserPage(filters).totalItems).toBeGreaterThan(6);
    expect(parseResourceBrowserFilters(serializeResourceBrowserFilters(filters, new URLSearchParams("section=resources&utm_source=qa")))).toEqual(filters);
  });

  it("includes every guide, solution and scenario once with all formats on page one", () => {
    expect(resourceBrowserEntries).toHaveLength(resources.length + solutionBriefs.length + applicationScenarios.length);
    expect(resourceBrowserEntries).toHaveLength(46);
    expect(new Set(resourceBrowserEntries.map((entry) => entry.id)).size).toBe(resourceBrowserEntries.length);
    const first = getResourceBrowserPage(defaultResourceBrowserFilters);
    expect(first.items).toHaveLength(6);
    expect(first.items.map((entry) => entry.kind)).toEqual(["guide", "source", "scenario", "guide", "source", "scenario"]);
    expect(first.totalPages).toBe(Math.ceil(resourceBrowserEntries.length / 6));
  });

  it("paginates every result exactly once and clamps out of range pages", () => {
    const first = getResourceBrowserPage(defaultResourceBrowserFilters);
    const all = Array.from({ length: first.totalPages }, (_, index) => getResourceBrowserPage({ ...defaultResourceBrowserFilters, page: index + 1 }).items).flat();
    expect(all.map((entry) => entry.id)).toEqual(resourceBrowserEntries.map((entry) => entry.id));
    const filters = parseResourceBrowserFilters(new URLSearchParams("page=999"));
    expect(filters.page).toBe(first.totalPages);
    expect(getResourceBrowserPage(filters).items.length).toBeGreaterThan(0);
  });

  it("offers five shared topics and hides topics without entries for the selected type", () => {
    expect(getResourceBrowserCategories("guides")).toHaveLength(4);
    expect(getResourceBrowserCategories("sources")).toHaveLength(5);
    expect(getResourceBrowserCategories("scenarios")).toHaveLength(5);
    expect(getResourceBrowserCategories("materials")).toHaveLength(5);
    expect(getResourceBrowserCategories("all").map((category) => category.id)).toEqual([
      "interfaces-standards", "system-selection", "laboratory-production", "field-commissioning", "energy-integration",
    ]);
    expect(parseResourceBrowserFilters(new URLSearchParams("type=guides&category=energy-integration")).category).toBe("all");
    const guides = filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, type: "guides", category: "system-selection" });
    expect(guides.length).toBeGreaterThan(0);
    expect(guides.every((entry) => entry.kind === "guide" && entry.categoryId === "system-selection")).toBe(true);
    expect(resourceBrowserEntries.every((entry) => getResourceBrowserCategoryLabel(entry.categoryId))).toBe(true);
  });

  it("preserves exact old material categories without adding them to the main topic menu", () => {
    const solution = parseResourceBrowserFilters(new URLSearchParams("type=sources&category=solution-pv-storage"));
    expect(solution.category).toBe("solution-pv-storage");
    expect(filterResourceBrowserEntries(solution).map((entry) => entry.id)).toEqual(["pv-storage-integration-planning"]);
    const scenarios = parseResourceBrowserFilters(new URLSearchParams("type=scenarios&category=audience-vehicle-engineering"));
    expect(scenarios.category).toBe("audience-vehicle-engineering");
    expect(filterResourceBrowserEntries(scenarios).map((entry) => entry.id)).toEqual(["vehicle-interaction-session-plan", "message-validation-planning"]);
    expect(filterResourceBrowserEntries(scenarios).every((entry) => entry.originalCategoryId === "audience-vehicle-engineering")).toBe(true);
    expect(getResourceBrowserCategoryLabel(scenarios.category)).toBe("Vehicle engineering");
    expect(getResourceBrowserCategories("scenarios").some((category) => category.id === scenarios.category)).toBe(false);
    expect(parseResourceBrowserFilters(new URLSearchParams("type=guides&category=solution-pv-storage")).category).toBe("all");
  });

  it("searches full planning content and topics as well as optional attribution", () => {
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: " SAITER " })).toHaveLength(solutionBriefs.length + applicationScenarios.length);
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "saiter" })).toHaveLength(solutionBriefs.length + applicationScenarios.length);
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "reference method" }).map((entry) => entry.id)).toContain("third-party-measurement-plan");
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "serial-number record fields" }).map((entry) => entry.id)).toEqual(["automatic-dc-production-planning"]);
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "Energy integration" }).every((entry) => entry.categoryId === "energy-integration")).toBe(true);
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "nonexistent-resource-query" })).toEqual([]);
    expect(getResourceBrowserPage({ ...defaultResourceBrowserFilters, query: "nonexistent-resource-query", page: 42 }).page).toBe(1);
  });

  it("keeps legacy Library views in their original material scope and gives explicit types priority", () => {
    const materials = parseResourceBrowserFilters(new URLSearchParams("view=all&page=2"));
    expect(materials).toEqual({ ...defaultResourceBrowserFilters, type: "materials", page: 2 });
    const materialPage = getResourceBrowserPage(materials);
    expect(materialPage.totalItems).toBe(24);
    expect(materialPage.totalPages).toBe(4);
    expect(materialPage.items.every((entry) => entry.kind !== "guide")).toBe(true);
    expect(materialPage.items.map((entry) => entry.id)).toEqual(applicationScenarios.slice(0, 6).map((entry) => entry.id));
    expect(parseResourceBrowserFilters(new URLSearchParams("view=solutions")).type).toBe("sources");
    expect(parseResourceBrowserFilters(new URLSearchParams("view=scenarios")).type).toBe("scenarios");
    expect(parseResourceBrowserFilters(new URLSearchParams("type=all&view=scenarios")).type).toBe("all");
    expect(parseResourceBrowserFilters(new URLSearchParams("type=guides&view=scenarios")).type).toBe("guides");
    expect(parseResourceBrowserFilters(new URLSearchParams("type=unknown&view=scenarios")).type).toBe("all");
    expect(parseResourceBrowserFilters(new URLSearchParams("view=unknown"))).toEqual(defaultResourceBrowserFilters);
    expect(parseResourceBrowserFilters(new URLSearchParams("view=%20SCENARIOS%20&category=%20AUDIENCE-VEHICLE-ENGINEERING%20"))).toEqual({
      ...defaultResourceBrowserFilters, type: "scenarios", category: "audience-vehicle-engineering",
    });
    expect(serializeResourceBrowserFilters(materials, new URLSearchParams("view=all&page=2")).toString()).toBe("type=materials&page=2");
  });

  it("paginates each material type without losing or duplicating entries", () => {
    for (const [type, expectedLength] of [["guides", 22], ["sources", 6], ["scenarios", 18], ["materials", 24]] as const) {
      const filters = { ...defaultResourceBrowserFilters, type };
      const first = getResourceBrowserPage(filters);
      const all = Array.from({ length: first.totalPages }, (_, index) => getResourceBrowserPage({ ...filters, page: index + 1 }).items).flat();
      expect(all).toHaveLength(expectedLength);
      expect(new Set(all.map((entry) => entry.id)).size).toBe(expectedLength);
      expect(all.map((entry) => entry.id)).toEqual(filterResourceBrowserEntries(filters).map((entry) => entry.id));
    }
  });

  it("normalizes invalid parameters and limits search input", () => {
    expect(parseResourceBrowserFilters(new URLSearchParams("type=unknown&category=missing&page=-3"))).toEqual(defaultResourceBrowserFilters);
    expect(parseResourceBrowserFilters(new URLSearchParams("page=2.5")).page).toBe(1);
    expect(parseResourceBrowserFilters(new URLSearchParams({ q: `  ${"x".repeat(160)}  ` })).query).toHaveLength(120);
  });

  it("round-trips deep links while retaining unrelated campaign parameters", () => {
    const filters = { ...defaultResourceBrowserFilters, type: "guides" as const, page: 2 };
    const params = serializeResourceBrowserFilters(filters, new URLSearchParams("utm_source=partner&type=sources&page=99"));
    expect(params.get("utm_source")).toBe("partner");
    expect(parseResourceBrowserFilters(params)).toEqual(filters);
    const reset = serializeResourceBrowserFilters(defaultResourceBrowserFilters, params);
    expect(reset.toString()).toBe("utm_source=partner");
  });

  it("serializes legacy views into canonical types while retaining exact legacy categories", () => {
    const existing = new URLSearchParams("view=scenarios&category=audience-independent-testing&page=999&utm_source=partner");
    const filters = parseResourceBrowserFilters(existing);
    const params = serializeResourceBrowserFilters(filters, existing);
    expect(params.has("view")).toBe(false);
    expect(params.get("type")).toBe("scenarios");
    expect(params.get("category")).toBe("audience-independent-testing");
    expect(params.get("utm_source")).toBe("partner");
    expect(params.get("page")).toBe("2");
    expect(parseResourceBrowserFilters(params)).toEqual(filters);
    const invalidCategory = serializeResourceBrowserFilters({ ...defaultResourceBrowserFilters, type: "guides", category: "solution-pv-storage" });
    expect(invalidCategory.has("category")).toBe(false);
  });
});
