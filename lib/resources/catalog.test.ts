import { describe, expect, it } from "vitest";
import { getResource, resources } from "@/lib/resources/catalog";
import { products } from "@/data/site";

describe("resource catalog", () => {
  it("provides a unique, internally connected initial cluster", () => {
    expect(resources).toHaveLength(9);
    expect(new Set(resources.map((item) => item.slug)).size).toBe(9);
    for (const resource of resources) {
      expect(resource.summaryAnswer.length).toBeGreaterThan(80);
      expect(resource.relatedResourceSlugs.length).toBeGreaterThanOrEqual(2);
      expect(resource.relatedProductSlugs.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getResource("missing")).toBeUndefined();
  });

  it("gives every resource distinct, substantial content", () => {
    const sectionFingerprints = resources.map((resource) => JSON.stringify(resource.sections));
    const faqFingerprints = resources.map((resource) => JSON.stringify(resource.faqs));

    expect(new Set(sectionFingerprints).size).toBe(resources.length);
    expect(new Set(faqFingerprints).size).toBe(resources.length);
    for (const resource of resources) {
      expect(resource.sections.length).toBeGreaterThanOrEqual(3);
      expect(resource.sections.flatMap((section) => section.paragraphs).join(" ").length).toBeGreaterThan(500);
      expect(resource.modifiedAt).toBe("2026-09-15");
    }
  });

  it("only links resources to products that exist", () => {
    const productSlugs = new Set(products.map((product) => product.slug));

    for (const resource of resources) {
      expect(resource.relatedProductSlugs.every((slug) => productSlugs.has(slug))).toBe(true);
    }
  });
});
