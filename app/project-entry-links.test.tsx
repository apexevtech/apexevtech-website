import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/(en)/page";
import AboutPage from "@/app/(en)/about/page";
import NotFound from "@/app/(en)/not-found";
import ResourcePage, { generateMetadata } from "@/app/(en)/resources/[slug]/page";
import { getResourceGuideIndexHref } from "@/lib/navigation/resource-hash";
import { getResourceBrowserPage, parseResourceBrowserFilters } from "@/lib/resources/browser";

describe("project cases entry links", () => {
  it.each([
    ["home", HomePage],
    ["about", AboutPage],
    ["not-found", NotFound],
  ])("opens the technical-resource view from the %s page", (_name, Page) => {
    const html = renderToStaticMarkup(createElement(Page));
    expect(html).toContain('href="/project-cases?section=resources"');
    expect(html).not.toContain('href="/resources"');
    expect(html).not.toContain('href="/engineering-cases"');
  });

  it("keeps guide URLs stable and returns to the combined hub from the visible breadcrumb", async () => {
    const slug = "choose-ev-charger-test-system";
    const params = Promise.resolve({ slug });
    const html = renderToStaticMarkup(await ResourcePage({ params }));
    const breadcrumb = html.match(/<nav aria-label="Breadcrumb"[^>]*>(.*?)<\/nav>/)![1];
    const href = getResourceGuideIndexHref(slug);
    expect(breadcrumb).toContain(`href="${href.replaceAll("&", "&amp;")}">Technical materials</a>`);
    const target = new URL(href, "https://www.link-jl.com");
    expect(target.pathname).toBe("/project-cases");
    expect(target.searchParams.get("section")).toBe("resources");
    expect([...target.searchParams.keys()]).toEqual(target.searchParams.has("page") ? ["section", "page"] : ["section"]);
    expect(target.hash).toBe(`#material-${slug}`);
    expect(getResourceBrowserPage(parseResourceBrowserFilters(target.searchParams)).items.some((entry) => entry.kind === "guide" && entry.resource.slug === slug)).toBe(true);
    expect(breadcrumb).not.toContain('href="/resources"');
    expect(html).toContain('href="/resources/');
    const metadata = await generateMetadata({ params });
    expect(metadata.alternates?.canonical).toBe("/resources/choose-ev-charger-test-system");
  });
});
