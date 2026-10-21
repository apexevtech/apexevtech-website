import { describe, expect, it } from "vitest";
import { engineeringCaseCategories, engineeringCases } from "@/data/engineering-cases";
import { defaultEngineeringCaseFilters, filterEngineeringCases, getEngineeringCaseCategoryLabel, getEngineeringCasePage, parseEngineeringCaseFilters, serializeEngineeringCaseFilters } from "./filter";

describe("engineering case filters", () => {
  it("paginates all 18 references exactly once without duplicating cases", () => {
    const first = getEngineeringCasePage(defaultEngineeringCaseFilters);
    expect(first.items).toHaveLength(6);
    expect(first.totalPages).toBe(3);
    expect(first.totalItems).toBe(18);
    const all = Array.from({ length: first.totalPages }, (_, index) => getEngineeringCasePage({ ...defaultEngineeringCaseFilters, page: index + 1 }).items).flat();
    expect(all.map((entry) => entry.id)).toEqual(engineeringCases.map((entry) => entry.id));
    expect(new Set(all.map((entry) => entry.id)).size).toBe(18);
  });

  it("filters each published category and searches titles, scope and technical focus", () => {
    expect(engineeringCaseCategories).toHaveLength(4);
    for (const category of engineeringCaseCategories) {
      const cases = filterEngineeringCases({ ...defaultEngineeringCaseFilters, category: category.id });
      expect(cases.length).toBeGreaterThan(0);
      expect(cases.every((entry) => entry.categoryId === category.id)).toBe(true);
      expect(getEngineeringCaseCategoryLabel(category.id)).toBe(category.label);
    }
    const first = engineeringCases[0];
    expect(filterEngineeringCases({ ...defaultEngineeringCaseFilters, query: ` ${first.title.toUpperCase()} ` }).map((entry) => entry.id)).toContain(first.id);
    expect(filterEngineeringCases({ ...defaultEngineeringCaseFilters, query: first.technicalFocus[0] }).map((entry) => entry.id)).toContain(first.id);
    expect(filterEngineeringCases({ ...defaultEngineeringCaseFilters, query: "no-matching-reference-258" })).toEqual([]);
  });

  it("normalizes invalid values and clamps pages to the filtered result count", () => {
    expect(parseEngineeringCaseFilters(new URLSearchParams("category=missing&page=-2"))).toEqual(defaultEngineeringCaseFilters);
    expect(parseEngineeringCaseFilters(new URLSearchParams("page=2.5"))).toEqual(defaultEngineeringCaseFilters);
    expect(parseEngineeringCaseFilters(new URLSearchParams("page=999")).page).toBe(3);
    const empty = parseEngineeringCaseFilters(new URLSearchParams("q=no-matching-reference-258&page=999"));
    expect(empty.page).toBe(1);
    expect(getEngineeringCasePage(empty).totalItems).toBe(0);
    expect(parseEngineeringCaseFilters(new URLSearchParams({ q: `  ${"x".repeat(150)}  ` })).query).toHaveLength(120);
    const category = engineeringCaseCategories[0];
    expect(parseEngineeringCaseFilters(new URLSearchParams({ category: ` ${category.id.toUpperCase()} ` })).category).toBe(category.id);
  });

  it("round-trips multiword searches and retains unrelated campaign parameters", () => {
    const query = engineeringCases[0].title;
    const filters = { ...defaultEngineeringCaseFilters, query };
    const params = serializeEngineeringCaseFilters(filters, new URLSearchParams("utm_source=partner&category=missing&q=old&page=999"));
    expect(params.get("utm_source")).toBe("partner");
    expect(params.get("q")).toBe(query);
    expect(parseEngineeringCaseFilters(params)).toEqual(filters);
    expect(params.has("category")).toBe(false);
    expect(params.has("page")).toBe(false);
    expect(serializeEngineeringCaseFilters(defaultEngineeringCaseFilters, params).toString()).toBe("utm_source=partner");
    const pageTwo = { ...defaultEngineeringCaseFilters, page: 2 };
    expect(parseEngineeringCaseFilters(serializeEngineeringCaseFilters(pageTwo))).toEqual(pageTwo);
  });
});
