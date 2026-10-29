import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import Link from "@/components/LocaleLink";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResourcePage from "@/app/(en)/resources/[slug]/page";
import { ResourceBrowser } from "@/components/ResourceBrowser";
import { resources } from "@/lib/resources/catalog";
import * as resourceCatalog from "@/lib/resources/catalog";
import { getResourceGuideIndexHref } from "@/lib/navigation/resource-hash";
import { parseResourceBrowserFilters } from "@/lib/resources/browser";
import { messages } from "@/lib/i18n/zh";
import { translateText } from "@/lib/i18n/translate";
import { localizeHref } from "@/lib/i18n/urls";

const locale = vi.hoisted(() => ({ chinese: false }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => { throw new Error("not found"); },
}));
vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  const t = (text: string) => translateText(text, locale.chinese ? "zh" : "en", messages);
  return { T: ({ children }: { children: ReactNode }) => typeof children === "string" ? t(children) : children, useLanguage: () => ({ t, language: locale.chinese ? "zh" : "en" }) };
});

describe("guide collection navigation", () => {
  beforeEach(() => { locale.chinese = false; });

  it("links every visible guide breadcrumb to technical materials containing that guide without JavaScript", async () => {
    for (const resource of resources) {
      const href = getResourceGuideIndexHref(resource.slug);
      const article = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) }));
      const breadcrumb = article.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];
      expect(breadcrumb).toContain(`href="${href.replaceAll("&", "&amp;")}"`);
      expect(breadcrumb).toContain("Technical materials");
      expect(breadcrumb).not.toContain(">Project Cases<");
      const destination = new URL(href, "https://www.link-jl.com");
      const gallery = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: parseResourceBrowserFilters(destination.searchParams) }));
      expect(gallery).toContain(`id="${destination.hash.slice(1)}"`);
      expect(gallery).toContain(`href="/resources/${resource.slug}"`);
    }
  });

  it("uses the existing Chinese collection label and returns to the matching Chinese collection", async () => {
    locale.chinese = true;
    const resource = resources.at(-1)!;
    const article = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) }));
    const breadcrumb = article.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];
    expect(breadcrumb).toContain("技术资料");
    expect(breadcrumb).toContain(`href="${localizeHref(getResourceGuideIndexHref(resource.slug), "zh").replaceAll("&", "&amp;")}"`);
    expect(breadcrumb).not.toContain("Technical materials");
  });

  it("does not add a matrix link or target to guides without a decision table", async () => {
    const guides = resources.filter((resource) => !resource.decisionTable);
    expect(guides.length).toBeGreaterThan(0);
    for (const resource of guides) {
      const html = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) }));
      const contents = html.match(/<nav aria-label="Guide contents"[\s\S]*?<\/nav>/)![0];
      expect(contents.match(/<li\b/g)).toHaveLength(resource.sections.length);
      expect(html).not.toContain('href="#decision-support"');
      expect(html).not.toContain('id="decision-support"');
    }
  });

  it("uses router-aware hash links without prefetching while retaining ordinary anchor markup", async () => {
    type LinkProps = { href?: string; prefetch?: boolean; children?: ReactNode };
    for (const resource of resources) {
      const page = await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) });
      const hashLinks: ReactElement<LinkProps>[] = [];
      const visit = (node: ReactNode) => Children.forEach(node, (child) => {
        if (!isValidElement<LinkProps>(child)) return;
        if (typeof child.props.href === "string" && child.props.href.startsWith("#")) hashLinks.push(child);
        if (child.props.children) visit(child.props.children);
      });
      visit(page);
      expect(hashLinks).toHaveLength(resource.sections.length + Number(Boolean(resource.decisionTable)));
      for (const link of hashLinks) {
        expect(link.type).toBe(Link);
        expect(link.props.prefetch).toBe(false);
      }
      const html = renderToStaticMarkup(page);
      for (const link of hashLinks) expect(html).toContain(`href="${link.props.href}"`);
    }
  });

  it("adds one sequential contents entry pointing to the unique offset matrix section", async () => {
    const guides = resources.filter((resource) => resource.decisionTable);
    expect(guides.length).toBeGreaterThan(0);
    for (const resource of guides) {
      const html = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) }));
      const contents = html.match(/<nav aria-label="Guide contents"[\s\S]*?<\/nav>/)![0];
      const links = [...contents.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
      expect(links.map((link) => link[1])).toEqual([...resource.sections.map((_, index) => `#step-${index + 1}`), "#decision-support"]);
      const title = renderToStaticMarkup(createElement("span", null, resource.decisionTable!.title)).slice(6, -7);
      expect(links.at(-1)![2]).toBe(`${resource.sections.length + 1}. ${title}`);
      expect(html.match(/href="#decision-support"/g)).toHaveLength(1);
      expect(html.match(/id="decision-support"/g)).toHaveLength(1);
      const target = html.match(/<section id="decision-support"[^>]*>/)![0];
      expect(target).toContain("scroll-mt-28");
      expect(html.indexOf(target)).toBeGreaterThan(html.indexOf(`id="step-${resource.sections.length}"`));
    }
  });

  it("translates the existing matrix title in both the contents and target without changing the anchor", async () => {
    locale.chinese = true;
    const resource = resources.find((item) => item.slug === "ev-charging-protocol-testing")!;
    const title = translateText(resource.decisionTable!.title, "zh", messages);
    expect(title).not.toBe(resource.decisionTable!.title);
    const html = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) }));
    const contents = html.match(/<nav aria-label="Guide contents"[\s\S]*?<\/nav>/)![0];
    expect(contents).toContain(`href="#decision-support"`);
    expect(contents).toContain(`${resource.sections.length + 1}. ${title}</a>`);
    const target = html.slice(html.indexOf('<section id="decision-support"'));
    expect(target).toContain(`>${title}</h2>`);
    expect(contents).not.toContain(resource.decisionTable!.title);
  });

  it.each([
    { slug: "choose-ev-charger-test-system", heading: "Match the guide to your project stage" },
    { slug: "ev-charger-testing-guide", heading: "Define the EV charger testing scope" },
  ])("renders $slug section references in English and Chinese after the checklist", async ({ slug, heading }) => {
    const resource = resources.find((item) => item.slug === slug)!;
    const sectionIndex = resource.sections.findIndex((section) => section.heading === heading);
    expect(sectionIndex).toBeGreaterThanOrEqual(0);
    const linkedSection = resource.sections[sectionIndex];
    expect(linkedSection.relatedResourceSlugs?.length).toBeGreaterThan(0);
    for (const chinese of [false, true]) {
      locale.chinese = chinese;
      const html = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug }) }));
      const section = html.match(new RegExp(`<section id="step-${sectionIndex + 1}"[^>]*>[\\s\\S]*?<\\/section>`))![0];
      for (const relatedSlug of linkedSection.relatedResourceSlugs!) {
        const related = resourceCatalog.getResource(relatedSlug)!;
        const title = translateText(related.title, chinese ? "zh" : "en", messages);
        if (chinese) expect(title).not.toBe(related.title);
        const href = localizeHref(`/resources/${related.slug}`, chinese ? "zh" : "en");
        const link = section.match(new RegExp(`<a\\b[^>]*href="${href}"[^>]*>[\\s\\S]*?<\\/a>`))![0];
        expect(link).toContain(`>${renderToStaticMarkup(createElement("span", null, title)).slice(6, -7)}</a>`);
        expect(link).toContain("inline-flex min-h-11 items-center py-2 text-sm");
        if (linkedSection.checklist?.length) expect(section.indexOf(link)).toBeGreaterThan(section.indexOf("</ul>"));
      }
      expect(section).toContain('<ul class="mt-4 grid">');
    }
  });

  it("omits invalid section references rather than producing empty links or lists", async () => {
    const originalLookup = resourceCatalog.getResource;
    const resource = originalLookup("choose-ev-charger-test-system")!;
    for (const relatedResourceSlugs of [["missing-resource", ""], ["missing-resource", "ev-charger-testing-guide", ""]]) {
      const fixture = { ...resource, sections: [{ ...resource.sections[0], relatedResourceSlugs }] };
      const lookup = vi.spyOn(resourceCatalog, "getResource").mockImplementation((slug) => slug === fixture.slug ? fixture : originalLookup(slug));
      try {
        const html = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: fixture.slug }) }));
        const section = html.match(/<section id="step-1"[^>]*>[\s\S]*?<\/section>/)![0];
        expect(section).not.toContain('href="/resources/missing-resource"');
        expect(section).not.toContain('href="/resources/"');
        expect(section).not.toMatch(/<a\b[^>]*>\s*<\/a>/);
        if (relatedResourceSlugs.includes("ev-charger-testing-guide")) {
          expect(section.match(/href="\/resources\/ev-charger-testing-guide"/g)).toHaveLength(1);
        } else {
          expect(section).not.toContain('<ul class="mt-4 grid">');
        }
      } finally {
        lookup.mockRestore();
      }
    }
  });
});
