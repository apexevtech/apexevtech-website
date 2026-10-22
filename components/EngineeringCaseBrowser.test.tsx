import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ProjectCasesPage, { generateMetadata } from "@/app/project-cases/page";
import { engineeringCaseCategories } from "@/data/engineering-cases";
import { defaultEngineeringCaseFilters, getEngineeringCasePage } from "@/lib/engineering-cases/filter";
import { projectCasesIndexTitle } from "@/lib/seo/catalog-metadata";
import { EngineeringCaseBrowser } from "./EngineeringCaseBrowser";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("engineering case browser", () => {
  it("gives all four category tabs a labeled icon and a clear selected state", () => {
    const html = renderToStaticMarkup(createElement(EngineeringCaseBrowser, { initialFilters: defaultEngineeringCaseFilters }));
    const fieldset = html.match(/<fieldset\b[^>]*>[\s\S]*?<\/fieldset>/)![0];
    expect(fieldset.match(/<svg\b/g)).toHaveLength(4);
    for (const icon of ["lucide-car-front", "lucide-shield-check", "lucide-landmark", "lucide-factory"]) expect(fieldset).toContain(icon);
    for (const style of ["text-base font-semibold", "border-b-[3px]", "peer-checked:bg-[#e7f1fb]", "peer-focus-visible:outline"]) expect(fieldset).toContain(style);
  });

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
    expect(data.itemListElement.map((item: { url: string }) => item.url)).toEqual(page.items.map((entry) => `https://www.link-jl.com/project-cases?page=2#${entry.slug}`));
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

  it("renders engineering references beneath a compact shared heading without a banner", async () => {
    const html = renderToStaticMarkup(await ProjectCasesPage({ searchParams: Promise.resolve({ page: "3" }) }));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toMatch(/<h1\b[^>]*>Project Cases<\/h1>/);
    const heading = html.match(/<section\b[^>]*>[\s\S]*?<\/section>/)![0];
    expect(heading).toContain("bg-white");
    expect(heading).not.toMatch(/<img\b|(?:^|\s)(?:\w+:)*(?:h-|min-h-|max-h-|aspect-)|absolute|inset-0/);
    const collections = html.match(/<nav aria-label="Project case collections"[^>]*>[\s\S]*?<\/nav>/)![0];
    expect(collections.match(/<a\b[^>]*href="\/project-cases"[^>]*>/)![0]).toContain('aria-current="page"');
    expect(collections).toContain("Engineering references</span>");
    expect(collections).toContain(">18</span>");
    expect(collections).toContain('href="/project-cases?section=resources"');
    expect(collections).toContain("Technical materials</span>");
    expect(collections).toContain(">46</span>");
    expect(html.match(/<img\b/g)).toHaveLength(6);
    for (const entry of getEngineeringCasePage({ ...defaultEngineeringCaseFilters, page: 3 }).items) {
      expect(html).toContain(encodeURIComponent(entry.image!.src));
    }
    expect(html).not.toContain("cases-banner.webp");
    const imagePreloads = html.match(/<link\b[^>]+rel="preload"[^>]*>/g) ?? [];
    expect(imagePreloads.filter((link) => link.includes('as="image"'))).toHaveLength(0);
    expect(html).toContain("Partner-published technical references; not verified APEX delivery records.");
    expect(html).toContain("13-18 of 18 references");
    expect(html).toContain('href="/solutions"');
    expect(html).toContain('href="/project-cases?section=resources"');
    expect(html).not.toContain('class="group/directory');
    expect(html).not.toContain('href="https://www.saiter.cn');
  });

  it("self-canonicalizes unfiltered pages while filtered searches canonicalize to the index", async () => {
    const pageTwo = await generateMetadata({ searchParams: Promise.resolve({ page: "2" }) });
    expect(pageTwo.title).toBe(`${projectCasesIndexTitle} - Page 2`);
    expect(pageTwo.alternates?.canonical).toBe("/project-cases?page=2");
    const filtered = await generateMetadata({ searchParams: Promise.resolve({ category: engineeringCaseCategories[0].id, page: "2" }) });
    expect(filtered.title).toBe(projectCasesIndexTitle);
    expect(filtered.alternates?.canonical).toBe("/project-cases");
    const invalid = await generateMetadata({ searchParams: Promise.resolve({ page: "999" }) });
    expect(invalid.alternates?.canonical).toBe("/project-cases?page=3");
  });
});
