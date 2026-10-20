import { describe, expect, it } from "vitest";
import { solutionBriefs } from "@/data/technical-library";
import { resources } from "@/lib/resources/catalog";
import { defaultResourceBrowserFilters, filterResourceBrowserEntries, getResourceBrowserCategories, getResourceBrowserPage, parseResourceBrowserFilters, resourceBrowserEntries, serializeResourceBrowserFilters } from "@/lib/resources/browser";

describe("resource browser", () => {
  it("includes every guide and solution source once with both types on page one", () => {
    expect(resourceBrowserEntries).toHaveLength(resources.length + solutionBriefs.length);
    expect(new Set(resourceBrowserEntries.map((entry) => entry.id)).size).toBe(resourceBrowserEntries.length);
    const first = getResourceBrowserPage(defaultResourceBrowserFilters);
    expect(first.items).toHaveLength(6);
    expect(first.items.filter((entry) => entry.kind === "source")).toHaveLength(3);
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

  it("constrains categories to the selected material type", () => {
    expect(getResourceBrowserCategories("guides")).toHaveLength(4);
    expect(getResourceBrowserCategories("sources")).toHaveLength(6);
    expect(getResourceBrowserCategories("all")).toHaveLength(10);
    expect(parseResourceBrowserFilters(new URLSearchParams("type=sources&category=system-selection")).category).toBe("all");
    const guides = filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, type: "guides", category: "system-selection" });
    expect(guides.length).toBeGreaterThan(0);
    expect(guides.every((entry) => entry.kind === "guide" && entry.categoryId === "system-selection")).toBe(true);
  });

  it("searches source attribution case insensitively without inventing matches", () => {
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: " SAITER " })).toHaveLength(solutionBriefs.length);
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "saiter" })).toHaveLength(solutionBriefs.length);
    expect(filterResourceBrowserEntries({ ...defaultResourceBrowserFilters, query: "nonexistent-resource-query" })).toEqual([]);
    expect(getResourceBrowserPage({ ...defaultResourceBrowserFilters, query: "nonexistent-resource-query", page: 42 }).page).toBe(1);
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
});
