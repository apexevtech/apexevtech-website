import { describe, expect, it } from "vitest";
import { priorityProductSeo } from "@/lib/products/seo";
import { readFileSync } from "node:fs";
import { products } from "@/data/site";

describe("priority product SEO content", () => {
  it("provides substantial unique metadata and FAQs for priority products including the portable GB/T tester", () => {
    const entries = Object.entries(priorityProductSeo);

    expect(priorityProductSeo).toHaveProperty("st-9980a-pro");
    expect(entries).toHaveLength(products.length);
    for (const product of products) expect(priorityProductSeo).toHaveProperty(product.slug);
    expect(new Set(entries.map(([, value]) => value.title)).size).toBe(entries.length);
    expect(new Set(entries.map(([, value]) => value.description)).size).toBe(entries.length);
    for (const [, value] of entries) {
      expect(value.description.length).toBeGreaterThan(110);
      expect(value.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("links new selection guides to real alternative products and distinguishes socket from load limits", () => {
    const slugs = new Set(products.map((product) => product.slug));
    const guides = Object.values(priorityProductSeo).flatMap((value) => value.selection ? [value.selection] : []);
    expect(guides).toHaveLength(products.length);
    for (const guide of guides) {
      expect(guide.alternatives.every((alternative) => slugs.has(alternative.slug))).toBe(true);
    }
    expect(priorityProductSeo["st-6680ea-ac"].selection?.load).toContain("32 A");
    expect(priorityProductSeo["st-hcac-ea-ua-na"].selection?.load).toContain("NACS 80 A");
  });

  it("leaves the global APEX title template to add the brand suffix", () => {
    for (const [, value] of Object.entries(priorityProductSeo)) {
      expect(value.title).not.toMatch(/\| APEX$/);
    }
  });

  it("renders priority SEO content and FAQ structured data on product pages", () => {
    const source = readFileSync("app/products/[slug]/page.tsx", "utf8");
    expect(source).toContain("getProductSeo(product.slug)");
    expect(source).toContain('"@type": "FAQPage"');
    expect(source).toContain("Common questions about");
  });
});
