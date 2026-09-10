import { describe, expect, it } from "vitest";
import { priorityProductSeo } from "@/lib/products/seo";
import { readFileSync } from "node:fs";

describe("priority product SEO content", () => {
  it("provides substantial unique metadata and FAQs for five priority products", () => {
    const entries = Object.entries(priorityProductSeo);

    expect(entries).toHaveLength(5);
    expect(new Set(entries.map(([, value]) => value.title)).size).toBe(5);
    expect(new Set(entries.map(([, value]) => value.description)).size).toBe(5);
    for (const [, value] of entries) {
      expect(value.description.length).toBeGreaterThan(110);
      expect(value.faqs.length).toBeGreaterThanOrEqual(3);
    }
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
