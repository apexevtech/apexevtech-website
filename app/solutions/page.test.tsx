import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SolutionsPage from "@/app/(en)/solutions/page";
import { applicationExamples } from "@/data/applications";
import { products, solutions } from "@/data/site";
import { solutionLinks } from "@/data/solution-links";

describe("combined solutions hub", () => {
  it("renders all four workflows once and retains legacy solution anchors", () => {
    const html = renderToStaticMarkup(createElement(SolutionsPage));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html.match(/<article\b/g)).toHaveLength(4);
    expect(html).toContain('id="application-architectures"');
    for (const solution of solutions) {
      expect(html).toContain(`id="${solution.slug}"`);
      expect(html).toContain(`href="#${solution.slug}"`);
      for (const slug of solutionLinks[solution.slug].resourceSlugs) expect(html).toContain(`href="/resources/${slug}"`);
    }
    expect(html.match(/href="\/resources\//g)).toHaveLength(8);
  });

  it("keeps product models and equipment lists out of the solutions hub", () => {
    const html = renderToStaticMarkup(createElement(SolutionsPage));
    expect(html).not.toContain('href="/products/');
    expect(html).not.toMatch(/>Equipment<|More equipment/);
    for (const product of products) expect(html).not.toContain(product.model);
  });

  it("keeps the original architecture detail links, local images and scope boundary", () => {
    const html = renderToStaticMarkup(createElement(SolutionsPage));
    for (const application of applicationExamples) {
      expect(html).toContain(`href="/applications/${application.slug}"`);
      expect(html).toContain(encodeURIComponent(application.image));
      expect(html).toContain(application.imageAlt.replaceAll("&", "&amp;"));
    }
    expect(html).not.toContain('href="/applications"');
    expect(html).toContain("not named customer deliveries or certification claims");
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
    expect(data.numberOfItems).toBe(4);
    expect(data.url).toMatch(/\/solutions#application-architectures$/);
  });
});
