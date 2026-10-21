import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ResourceBrowser } from "./ResourceBrowser";
import ResourcesPage from "@/app/resources/page";
import { defaultResourceBrowserFilters, getResourceBrowserPage } from "@/lib/resources/browser";
import { resourceGroups } from "@/lib/resources/groups";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("resource browser presentation", () => {
  it("prerenders six illustrated mixed materials in a gallery with accessible controls", () => {
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: defaultResourceBrowserFilters }));
    expect(html.match(/<article\b/g)).toHaveLength(6);
    const page = getResourceBrowserPage(defaultResourceBrowserFilters);
    expect(html.match(/data-material-type=/g)).toHaveLength(6);
    expect(html).toContain("1-6 of 46 materials");
    expect(html).toContain("sm:grid-cols-2");
    expect(html).toContain("lg:grid-cols-3");
    expect(html).toContain("bg-[#f3f4f5]");
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html.match(/<img\b/g)).toHaveLength(6);
    expect(html.match(/<select\b/g)).toHaveLength(2);
    expect(html).toContain('name="resource-type"');
    expect(html).toContain("Search materials");
    expect(html).toContain('type="search"');
    expect(html).toContain("Topic");
    expect(html.match(/name="resource-type"/g)).toHaveLength(4);
    expect(html).toContain("Solution briefs");
    expect(html).toContain("Applications");
    for (const entry of page.items) expect(html).toContain(`id="material-${entry.id}"`);
    expect(html).toContain('id="resource-results"');
    expect(html).toContain('id="library-results"');
    expect(html).toContain('id="solution-briefs"');
    expect(html).toContain('id="application-scenarios"');
    expect(html).toContain('aria-label="Pagination"');
    expect(html).not.toMatch(/saiter\.cn|Source:|Source reference image/);
  });

  it("keeps guide-only pagination and structured data aligned with the visible guide cards", () => {
    const filters = { ...defaultResourceBrowserFilters, type: "guides" as const, page: 2 };
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: filters }));
    const page = getResourceBrowserPage(filters);
    const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
    expect(html.match(/<article\b/g)).toHaveLength(6);
    expect(html.match(/<img\b/g)).toHaveLength(6);
    expect(html).toContain("7-12 of 22 materials");
    expect(html).not.toContain('data-material-type="source"');
    expect(html).not.toContain('data-material-type="scenario"');
    expect(html).toContain("type=guides&amp;page=3#resource-results");
    expect(structuredData.numberOfItems).toBe(6);
    expect(structuredData.itemListElement.map((item: { name: string }) => item.name)).toEqual(page.items.flatMap((entry) => entry.kind === "guide" ? [entry.resource.title] : []));
  });

  it("presents original planning briefs with one thumbnail and complete expandable context", () => {
    const filters = { ...defaultResourceBrowserFilters, type: "sources" as const };
    const page = getResourceBrowserPage(filters);
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: filters }));
    expect(html).toContain("1-6 of 6 materials");
    expect(html.match(/<img\b/g)).toHaveLength(6);
    expect(html.match(/Planning checklist/g)).toHaveLength(6);
    expect(html.match(/Technical context/g)).toHaveLength(6);
    for (const entry of page.items) {
      if (entry.kind === "guide") continue;
      expect(html).toContain(entry.material.title);
      expect(html).toContain(entry.material.summary);
      expect(html).toContain(entry.material.reviewOutput);
      expect(html).toContain(entry.material.planningNote);
      expect(html).toContain(entry.material.source.scopeNote);
      for (const requirement of entry.material.requirements) expect(html).toContain(requirement);
    }
    for (const row of html.split("</article>").slice(0, -1)) expect(row.match(/<article\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/saiter\.cn|Source reference image/);
  });

  it("includes all application scenarios with a selected type and visible planning summaries", () => {
    const filters = { ...defaultResourceBrowserFilters, type: "scenarios" as const, page: 2 };
    const page = getResourceBrowserPage(filters);
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: filters }));
    expect(html).toContain("7-12 of 18 materials");
    expect(html.match(/data-material-type="scenario"/g)).toHaveLength(6);
    expect(html.match(/<img\b/g)).toHaveLength(6);
    expect(html).toContain("type=scenarios&amp;page=3#resource-results");
    const selected = html.match(/<input[^>]+>/g)!.filter((tag) => tag.includes('checked=""'));
    expect(selected).toHaveLength(1);
    expect(selected[0]).toContain('value="scenarios"');
    expect(html).toContain('<option value="scenarios" selected="">');
    for (const entry of page.items) {
      if (entry.kind === "guide") continue;
      expect(html).toContain(entry.material.title);
      expect(html).toContain(entry.material.summary);
    }
    const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
    expect(structuredData.numberOfItems).toBe(0);
  });

  it("keeps the all-materials tab selected for legacy library filters with a removable chip", () => {
    const filters = { ...defaultResourceBrowserFilters, type: "materials" as const, category: "solution-evse-laboratory" };
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: filters }));
    expect(html).toContain("Planning materials");
    expect(html).toContain('aria-label="Remove planning materials filter"');
    expect(html).toContain('<option value="solution-evse-laboratory" selected="">EVSE laboratory</option>');
    const selected = html.match(/<input[^>]+>/g)!.filter((tag) => tag.includes('checked=""'));
    expect(selected).toHaveLength(1);
    expect(selected[0]).toContain('value="all"');
    expect(html).toContain("EVSE Laboratory Planning");
  });

  it("renders an empty result state without stale materials or pagination", () => {
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: { ...defaultResourceBrowserFilters, query: "no-matching-material-258" } }));
    expect(html).toContain("No matching materials");
    expect(html).toContain("Reset filters");
    expect(html).not.toContain("<article");
    expect(html).not.toContain('aria-label="Pagination"');
  });

  it("renders a naturally full-width resource banner with its original title and subtitle", async () => {
    const html = renderToStaticMarkup(await ResourcesPage({ searchParams: Promise.resolve({}) }));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toMatch(/<h1\b[^>]*>Resource Center<\/h1>/);
    const heroSection = html.match(/<section\b[^>]*>/)![0];
    expect(heroSection).not.toMatch(/(?:^|\s)(?:\w+:)*(?:h-|min-h-|max-h-|aspect-)/);
    const hero = html.match(/<section\b[^>]*>([\s\S]*?)<\/section>/)![1];
    expect(hero).toContain("%2Fassets%2Fengineering-cases%2Fcases-banner.webp");
    expect(hero).toContain('sizes="100vw"');
    expect(hero).toContain('width="1587"');
    expect(hero).toContain('height="895"');
    expect(hero).toContain('class="block h-auto w-full"');
    expect(hero).not.toMatch(/data-nimg="fill"|object-cover|object-contain|object-\[/);
    expect(hero).toContain("Technical guides, solution briefs and application planning for laboratory, production and field testing.");
    const imagePreloads = html.match(/<link\b[^>]+rel="preload"[^>]*>/g) ?? [];
    expect(imagePreloads.some((link) => link.includes('as="image"') && link.includes("%2Fassets%2Fengineering-cases%2Fcases-banner.webp"))).toBe(true);
  });

  it("keeps all guide links and legacy topic anchors in the collapsed directory", async () => {
    const html = renderToStaticMarkup(await ResourcesPage({ searchParams: Promise.resolve({}) }));
    expect(html).toContain("Resource Center");
    expect(html).not.toContain('href="/library"');
    const directory = html.slice(html.indexOf('<details class="group/directory"'));
    expect(directory).not.toContain('<details class="group/directory" open');
    expect(directory.match(/href="\/resources\//g)).toHaveLength(22);
    for (const group of resourceGroups) {
      expect(directory).toContain(`id="${group.id}"`);
      for (const guide of group.resources) expect(directory).toContain(`href="/resources/${guide.slug}"`);
    }
  });
});
