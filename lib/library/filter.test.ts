import { describe, expect, it } from "vitest";
import {
  applicationScenarioCategories,
  applicationScenarios,
  solutionBriefCategories,
  solutionBriefs,
} from "@/data/technical-library";
import {
  defaultLibraryFilters,
  filterLibraryEntries,
  getLibraryCategories,
  getLibraryPage,
  parseLibraryFilters,
  serializeLibraryFilters,
} from "@/lib/library/filter";

describe("technical library filters", () => {
  it("supports Chinese planning queries in legacy library views", () => {
    const result = filterLibraryEntries({ ...defaultLibraryFilters, query: "光伏与储能" });
    expect(result.solutions.map((entry) => entry.id)).toEqual(["pv-storage-integration-planning"]);
    expect(result.scenarios).toEqual([]);
    const filters = { ...defaultLibraryFilters, query: "接口与标准", page: 2 };
    expect(getLibraryPage(filters).totalItems).toBeGreaterThan(6);
    expect(parseLibraryFilters(serializeLibraryFilters(filters))).toEqual(filters);
  });

  it("shows all six briefs and eighteen scenarios by default without changing entries", () => {
    expect(parseLibraryFilters(new URLSearchParams())).toEqual(defaultLibraryFilters);
    const result = filterLibraryEntries(defaultLibraryFilters);
    expect(result.solutions).toHaveLength(6);
    expect(result.scenarios).toHaveLength(18);
    expect(result.solutions).toEqual(solutionBriefs);
    expect(result.scenarios).toEqual(applicationScenarios);
    expect(result.solutions[0]).toBe(solutionBriefs[0]);
    expect(result.scenarios[0]).toBe(applicationScenarios[0]);
  });

  it("returns relevant unique categories without a virtual all category", () => {
    expect(getLibraryCategories("solutions")).toEqual(solutionBriefCategories);
    expect(getLibraryCategories("scenarios")).toEqual(applicationScenarioCategories);
    const all = getLibraryCategories("all");
    expect(all).toEqual([...solutionBriefCategories, ...applicationScenarioCategories]);
    expect(new Set(all.map((category) => category.id)).size).toBe(all.length);
    expect(all.some((category) => category.id === "all")).toBe(false);
  });

  it("combines category and view filters", () => {
    const solutionCategory = solutionBriefCategories[0].id;
    const scenarioCategory = applicationScenarioCategories[0].id;
    const solutions = filterLibraryEntries({ ...defaultLibraryFilters, view: "solutions", category: solutionCategory });
    expect(solutions.solutions).toEqual(solutionBriefs.filter((entry) => entry.categoryId === solutionCategory));
    expect(solutions.scenarios).toEqual([]);
    const scenarios = filterLibraryEntries({ ...defaultLibraryFilters, view: "scenarios", category: scenarioCategory });
    expect(scenarios.solutions).toEqual([]);
    expect(scenarios.scenarios).toEqual(applicationScenarios.filter((entry) => entry.categoryId === scenarioCategory));
    expect(filterLibraryEntries({ ...defaultLibraryFilters, category: solutionCategory }).scenarios).toEqual([]);
    expect(filterLibraryEntries({ ...defaultLibraryFilters, category: scenarioCategory }).solutions).toEqual([]);
  });

  it("normalizes URL filters and rejects categories outside the selected view", () => {
    const category = solutionBriefCategories[0].id;
    expect(parseLibraryFilters(new URLSearchParams({ view: " SOLUTIONS ", category: ` ${category.toUpperCase()} `, q: " CCS2 " })))
      .toEqual({ view: "solutions", category, query: "CCS2", page: 1 });
    expect(parseLibraryFilters(new URLSearchParams({ view: "solutions", category: applicationScenarioCategories[0].id })).category).toBe("all");
    expect(parseLibraryFilters(new URLSearchParams({ view: "scenarios", category })).category).toBe("all");
    expect(parseLibraryFilters(new URLSearchParams({ view: "unknown", category: "unknown" })))
      .toEqual(defaultLibraryFilters);
  });

  it("preserves an all search and unrelated parameters while omitting default filters", () => {
    const existing = new URLSearchParams("view=solutions&category=solution-evse-laboratory&q=old&utm_source=qa");
    const params = serializeLibraryFilters({ ...defaultLibraryFilters, query: "all" }, existing);
    expect(params.toString()).toBe("q=all&utm_source=qa");
    expect(parseLibraryFilters(params).query).toBe("all");
    expect(existing.get("q")).toBe("old");
    expect(serializeLibraryFilters(defaultLibraryFilters, params).toString()).toBe("utm_source=qa");
    expect(serializeLibraryFilters({ ...defaultLibraryFilters, query: "EVSE " }).get("q")).toBe("EVSE ");
  });

  it("trims searches and matches title, summary, requirements, output and category labels case-insensitively", () => {
    const entry = solutionBriefs[0];
    const queries = [entry.title, entry.summary, entry.requirements[0], entry.reviewOutput, solutionBriefCategories[0].label];
    for (const query of queries) {
      expect(filterLibraryEntries({ ...defaultLibraryFilters, query: `  ${query.toUpperCase()}  ` }).solutions).toContain(entry);
    }
    expect(filterLibraryEntries({ ...defaultLibraryFilters, query: "cCs2" }))
      .toEqual(filterLibraryEntries({ ...defaultLibraryFilters, query: "CCS2" }));
    expect(filterLibraryEntries({ ...defaultLibraryFilters, query: "   " })).toEqual(filterLibraryEntries(defaultLibraryFilters));
  });

  it("bounds URL queries and treats markup or unsupported parameter values as plain input", () => {
    const query = "x".repeat(150);
    expect(parseLibraryFilters(new URLSearchParams({ q: ` ${query} ` })).query).toBe("x".repeat(120));
    expect(parseLibraryFilters(new URLSearchParams({ view: "__proto__", category: "constructor" })))
      .toEqual(defaultLibraryFilters);
    const filters = parseLibraryFilters(new URLSearchParams({ view: "<script>", category: "../products", q: "<script>alert(1)</script>" }));
    expect(filters).toEqual({ view: "all", category: "all", query: "<script>alert(1)</script>", page: 1 });
    expect(filterLibraryEntries(filters)).toEqual({ solutions: [], scenarios: [] });
  });

  it("returns empty sections for an unmatched query", () => {
    expect(filterLibraryEntries({ ...defaultLibraryFilters, query: "unmatched-example-987654321" }))
      .toEqual({ solutions: [], scenarios: [] });
  });

  it("paginates all materials without missing or repeated records", () => {
    const pages = [1, 2, 3, 4].map((page) => getLibraryPage({ ...defaultLibraryFilters, page }));
    expect(pages.map((page) => page.items.length)).toEqual([6, 6, 6, 6]);
    expect(new Set(pages.flatMap((page) => page.items.map((entry) => entry.id))).size).toBe(24);
    expect(pages[0].solutions).toHaveLength(6);
    expect(pages[1].scenarios).toHaveLength(6);
    expect(getLibraryPage({ ...defaultLibraryFilters, view: "solutions", page: 4 }).page).toBe(1);
    expect(parseLibraryFilters(new URLSearchParams("page=-3")).page).toBe(1);
    expect(serializeLibraryFilters({ ...defaultLibraryFilters, page: 2 }).get("page")).toBe("2");
    expect(filterLibraryEntries({ ...defaultLibraryFilters, query: "SAITER" }).solutions).toHaveLength(6);
  });
});
