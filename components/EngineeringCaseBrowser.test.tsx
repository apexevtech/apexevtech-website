import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import EngineeringCasesPage, { generateMetadata } from "@/app/engineering-cases/page";
import { engineeringCaseCategories } from "@/data/engineering-cases";
import { defaultEngineeringCaseFilters, engineeringCaseIndexTitle, getEngineeringCasePage } from "@/lib/engineering-cases/filter";
import { EngineeringCaseBrowser } from "./EngineeringCaseBrowser";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("engineering case browser", () => {
  it("prerenders six gallery cards with counted categories and complete expandable technical focus", () => {
    const html = renderToStaticMarkup(createElement(EngineeringCaseBrowser, { initialFilters: defaultEngineeringCaseFilters }));
    const page = getEngineeringCasePage(defaultEngineeringCaseFilters);
    expect(html.match(/<article\b/g)).toHaveLength(6);
    const categoryRadios = html.match(/<input[^>]+name="engineering-case-category"[^>]*>/g) ?? [];
    expect(categoryRadios).toHaveLength(4);
    expect(categoryRadios.every((radio) => !radio.includes('checked=""'))).toBe(true);
    expect(html.match(/<select\b/g)).toHaveLength(1);
    expect(html.match(/<option\b/g)).toHaveLength(5);
    expect(html).toContain("All cases");
    for (const category of engineeringCaseCategories) expect(html).toContain(category.label);
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain("bg-[#f3f4f5]");
    expect(html).toContain("1-6 of 18 references");
    expect(html).toContain('type="search"');
    expect(html).toContain('id="engineering-case-results"');
    expect(html).toContain("sm:grid-cols-2");
    expect(html).toContain("lg:grid-cols-3");
    expect(html.match(/<details\b/g)).toHaveLength(6);
    expect(html.match(/<summary\b/g)).toHaveLength(6);
    expect((html.match(/<img\b/g) ?? []).length).toBe(page.items.filter((entry) => entry.image).length);
    for (const entry of page.items) {
      expect(html).toContain(`id="${entry.slug}"`);
      expect(html).toContain(entry.title.replaceAll("&", "&amp;"));
      expect(html).toContain(`aria-label="Technical details: ${entry.title.replaceAll("&", "&amp;")}"`);
      expect(html).toContain(`href="/resources/${entry.relatedResourceSlug}"`);
      for (const focus of entry.technicalFocus) expect(html).toContain(focus.replaceAll("&", "&amp;"));
    }
    expect(html).toContain("page=2#engineering-case-results");
    expect(html).not.toMatch(/href="https:\/\/[^\"]*saiter|Source reference image|APEX customers|verified APEX projects/);
  });

  it("keeps page two cards, crawlable pagination and structured data in sync", () => {
    const filters = { ...defaultEngineeringCaseFilters, page: 2 };
    const page = getEngineeringCasePage(filters);
    const html = renderToStaticMarkup(createElement(EngineeringCaseBrowser, { initialFilters: filters }));
    expect(html).toContain("7-12 of 18 references");
    expect(html).toContain('aria-label="Page 2" aria-current="page"');
    expect(html).toContain("page=3#engineering-case-results");
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
    expect(data.numberOfItems).toBe(6);
    expect(data.itemListElement.map((item: { name: string }) => item.name)).toEqual(page.items.map((entry) => entry.title));
    expect(data.itemListElement.map((item: { url: string }) => item.url)).toEqual(page.items.map((entry) => `https://www.link-jl.com/engineering-cases?page=2#${entry.slug}`));
    expect(JSON.stringify(data)).not.toMatch(/author|customer|review|rating/);
  });

  it("marks the selected category and renders an empty state without stale cases", () => {
    const category = engineeringCaseCategories[0].id;
    const html = renderToStaticMarkup(createElement(EngineeringCaseBrowser, { initialFilters: { ...defaultEngineeringCaseFilters, category } }));
    const selected = html.match(/<input[^>]+>/g)!.filter((tag) => tag.includes('checked=""'));
    expect(selected).toHaveLength(1);
    expect(selected[0]).toContain(`value="${category}"`);
    expect(html).toContain(`<option value="${category}" selected="">`);
    const empty = renderToStaticMarkup(createElement(EngineeringCaseBrowser, { initialFilters: { ...defaultEngineeringCaseFilters, query: "no-matching-reference-258" } }));
    expect(empty).toContain("No matching references");
    expect(empty).toContain("Reset filters");
    expect(empty).not.toContain("<article");
    expect(empty).not.toContain('aria-label="Pagination"');
  });

  it("renders the requested server page with one H1 and an explicit reference boundary", async () => {
    const html = renderToStaticMarkup(await EngineeringCasesPage({ searchParams: Promise.resolve({ page: "3" }) }));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toMatch(/<h1\b[^>]*>Engineering Cases<\/h1>/);
    const heroSection = html.match(/<section\b[^>]*>/)![0];
    expect(heroSection).not.toMatch(/(?:^|\s)(?:\w+:)*(?:h-|min-h-|max-h-|aspect-)/);
    const hero = html.match(/<section\b[^>]*>([\s\S]*?)<\/section>/)![1];
    expect(hero).toContain("%2Fassets%2Fengineering-cases%2Fcases-banner.webp");
    expect(hero).toContain('sizes="100vw"');
    expect(hero).toContain('width="1587"');
    expect(hero).toContain('height="895"');
    expect(hero).toContain('class="block h-auto w-full"');
    expect(hero).not.toMatch(/data-nimg="fill"|object-cover|object-contain|object-\[/);
    const imagePreloads = html.match(/<link\b[^>]+rel="preload"[^>]*>/g) ?? [];
    expect(imagePreloads.some((link) => link.includes('as="image"') && link.includes("%2Fassets%2Fengineering-cases%2Fcases-banner.webp"))).toBe(true);
    expect(hero).toContain("Engineering Cases");
    expect(html).toContain("Partner-published technical references; not verified APEX delivery records.");
    expect(html).toContain("13-18 of 18 references");
    expect(html).toContain('href="/solutions"');
    expect(html).toContain('href="/resources"');
    expect(html).not.toContain('href="https://www.saiter.cn');
  });

  it("self-canonicalizes unfiltered pages while filtered searches canonicalize to the index", async () => {
    const pageTwo = await generateMetadata({ searchParams: Promise.resolve({ page: "2" }) });
    expect(pageTwo.title).toBe(`${engineeringCaseIndexTitle} - Page 2`);
    expect(pageTwo.alternates?.canonical).toBe("/engineering-cases?page=2");
    const filtered = await generateMetadata({ searchParams: Promise.resolve({ category: engineeringCaseCategories[0].id, page: "2" }) });
    expect(filtered.title).toBe(engineeringCaseIndexTitle);
    expect(filtered.alternates?.canonical).toBe("/engineering-cases");
    const invalid = await generateMetadata({ searchParams: Promise.resolve({ page: "999" }) });
    expect(invalid.alternates?.canonical).toBe("/engineering-cases?page=3");
  });
});
