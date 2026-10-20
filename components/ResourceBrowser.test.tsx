import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ResourceBrowser } from "./ResourceBrowser";
import { defaultResourceBrowserFilters, getResourceBrowserPage } from "@/lib/resources/browser";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("resource browser presentation", () => {
  it("prerenders six mixed materials in a single separated list with accessible controls", () => {
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: defaultResourceBrowserFilters }));
    expect(html.match(/<article\b/g)).toHaveLength(6);
    expect(html.match(/data-source-material=/g)).toHaveLength(3);
    expect(html).toContain("1-6 of 28 materials");
    expect(html).toContain("divide-y divide-slate-200");
    expect(html).toContain('name="resource-type"');
    expect(html).toContain("Search materials");
    expect(html).toContain('type="search"');
    expect(html).toContain("Category");
    expect(html).toContain('id="resource-results"');
    expect(html).toContain('aria-label="Pagination"');
    expect(html).not.toMatch(/saiter\.cn|Source:|Source reference image/);
  });

  it("keeps guide-only pagination and structured data aligned with the visible guide rows", () => {
    const filters = { ...defaultResourceBrowserFilters, type: "guides" as const, page: 2 };
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: filters }));
    const page = getResourceBrowserPage(filters);
    const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
    expect(html.match(/<article\b/g)).toHaveLength(6);
    expect(html).toContain("7-12 of 22 materials");
    expect(html).not.toContain("data-source-material=");
    expect(html).toContain("type=guides&amp;page=3#resource-results");
    expect(structuredData.numberOfItems).toBe(6);
    expect(structuredData.itemListElement.map((item: { name: string }) => item.name)).toEqual(page.items.flatMap((entry) => entry.kind === "guide" ? [entry.resource.title] : []));
  });

  it("renders an empty result state without stale materials or pagination", () => {
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: { ...defaultResourceBrowserFilters, query: "no-matching-material-258" } }));
    expect(html).toContain("No matching materials");
    expect(html).toContain("Reset filters");
    expect(html).not.toContain("<article");
    expect(html).not.toContain('aria-label="Pagination"');
  });
});
