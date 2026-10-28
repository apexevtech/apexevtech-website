import { describe, expect, it } from "vitest";
import { applicationScenarios, solutionBriefs } from "@/data/technical-library";
import { decodeResourceHash, getResourceGuideIndexHref, resolveResourceHash } from "@/lib/navigation/resource-hash";
import { defaultResourceBrowserFilters, filterResourceBrowserEntries, getResourceBrowserPage, parseResourceBrowserFilters, resourceBrowserEntries } from "@/lib/resources/browser";
import { resources } from "@/lib/resources/catalog";

describe("resource fragment resolution", () => {
  it("locates material anchors in the combined catalog's interleaved order", () => {
    expect(resolveResourceHash("#material-evse-laboratory-planning", defaultResourceBrowserFilters))
      .toEqual({ id: "material-evse-laboratory-planning", page: 1 });
    expect(resolveResourceHash("#material-site-fault-diagnosis", defaultResourceBrowserFilters))
      .toEqual({ id: "material-site-fault-diagnosis", page: 1 });
    const final = resourceBrowserEntries.at(-1)!;
    expect(resolveResourceHash(`#material-${final.id}`, defaultResourceBrowserFilters))
      .toEqual({ id: `material-${final.id}`, page: 8 });
  });

  it("preserves the former Library's briefs-first pagination", () => {
    const filters = { ...defaultResourceBrowserFilters, type: "materials" as const };
    expect(resolveResourceHash(`#material-${solutionBriefs[5].id}`, filters)?.page).toBe(1);
    expect(resolveResourceHash(`#material-${applicationScenarios[0].id}`, filters)?.page).toBe(2);
    expect(resolveResourceHash(`#material-${applicationScenarios[17].id}`, filters)?.page).toBe(4);
  });

  it("resolves both sides of every six-entry page boundary", () => {
    const entries = filterResourceBrowserEntries(defaultResourceBrowserFilters);
    for (const index of [0, 5, 6, 11, 12, 17, 18, 23, 24, 29, 30, 35, 36, 41, 42, 45]) {
      expect(resolveResourceHash(`#material-${entries[index].id}`, defaultResourceBrowserFilters)?.page)
        .toBe(Math.floor(index / 6) + 1);
    }
  });

  it("respects active type, category and search filters without widening the result set", () => {
    const hash = `#material-${applicationScenarios[0].id}`;
    expect(resolveResourceHash(hash, { ...defaultResourceBrowserFilters, type: "guides" })).toBeNull();
    expect(resolveResourceHash(hash, { ...defaultResourceBrowserFilters, category: "energy-integration" })).toBeNull();
    expect(resolveResourceHash(hash, { ...defaultResourceBrowserFilters, query: "no-matching-material-258" })).toBeNull();
    expect(resolveResourceHash(hash, { ...defaultResourceBrowserFilters, type: "scenarios", page: 3 }))
      .toEqual({ id: `material-${applicationScenarios[0].id}`, page: 1 });
  });

  it("safely decodes fragments and ignores unrelated, missing and malformed targets", () => {
    expect(decodeResourceHash("#interfaces%2Dstandards")).toBe("interfaces-standards");
    expect(resolveResourceHash("#%6Daterial-evse-laboratory-planning", defaultResourceBrowserFilters))
      .toEqual({ id: "material-evse-laboratory-planning", page: 1 });
    for (const hash of ["", "#", "material-evse-laboratory-planning", "#library-results", "#material-missing", "#material-%E0%A4%A", "#material-%"]) {
      expect(resolveResourceHash(hash, defaultResourceBrowserFilters)).toBeNull();
    }
    expect(decodeResourceHash("#%")).toBeNull();
  });

  it("returns every guide to its real mixed-material page without requiring a client redirect", () => {
    for (const resource of resources) {
      const url = new URL(getResourceGuideIndexHref(resource.slug), "https://www.link-jl.com");
      expect(url.pathname).toBe("/project-cases");
      expect(url.searchParams.get("section")).toBe("resources");
      expect([...url.searchParams.keys()]).toEqual(url.searchParams.has("page") ? ["section", "page"] : ["section"]);
      expect(url.hash).toBe(`#material-${resource.slug}`);
      const filters = parseResourceBrowserFilters(url.searchParams);
      expect(filters.type).toBe("all");
      expect(filters.category).toBe("all");
      expect(filters.query).toBe("");
      expect(getResourceBrowserPage(filters).items.some((entry) => entry.kind === "guide" && entry.resource.slug === resource.slug)).toBe(true);
      expect(resolveResourceHash(url.hash, filters)?.page).toBe(filters.page);
    }
  });

  it("rejects arbitrary guide return targets and non-guide material identifiers", () => {
    for (const slug of ["", "unknown", "__proto__", "../contact", "https://example.com", `${resources[0].slug}?email=private@example.com`, `${resources[0].slug}#private`, applicationScenarios[0].id]) {
      expect(getResourceGuideIndexHref(slug)).toBe("/project-cases?section=resources");
    }
  });
});
