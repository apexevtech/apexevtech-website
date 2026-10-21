import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "./page";
import AboutPage from "./about/page";
import NotFound from "./not-found";
import ResourcePage, { generateMetadata } from "./resources/[slug]/page";

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
    const params = Promise.resolve({ slug: "choose-ev-charger-test-system" });
    const html = renderToStaticMarkup(await ResourcePage({ params }));
    const breadcrumb = html.match(/<nav aria-label="Breadcrumb"[^>]*>(.*?)<\/nav>/)![1];
    expect(breadcrumb).toContain('href="/project-cases">Project Cases</a>');
    expect(breadcrumb).not.toContain('href="/resources"');
    expect(html).toContain('href="/resources/');
    const metadata = await generateMetadata({ params });
    expect(metadata.alternates?.canonical).toBe("/resources/choose-ev-charger-test-system");
  });
});
