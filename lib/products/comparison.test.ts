import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { getComparedProducts, getProductComparisonDetails, parseComparedProductSlugs } from "@/lib/products/comparison";

describe("product comparison", () => {
  it("keeps valid unique products in the shared-link order and limits the comparison to three", () => {
    const value = `${products[2].slug},unknown,${products[0].slug},${products[2].slug},${products[1].slug},${products[3].slug}`;
    expect(parseComparedProductSlugs(value, products)).toEqual([products[2].slug, products[0].slug, products[1].slug]);
    expect(getComparedProducts(value, products).map((product) => product.slug)).toEqual([products[2].slug, products[0].slug, products[1].slug]);
  });

  it("builds useful comparison rows from the product content", () => {
    for (const product of products) {
      const details = getProductComparisonDetails(product);
      expect(details.type).toBe(product.category);
      expect(details.interface.length).toBeGreaterThan(10);
      expect(details.electricalRange.length).toBeGreaterThan(10);
      expect(details.loadArrangement.length).toBeGreaterThan(10);
      expect(details.capabilities).toContain(product.highlights[0]);
      expect(details.applications).toContain(product.applications[0]);
    }
  });
});
