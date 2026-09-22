import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/data/site";

describe("product specifications", () => {
  it("uses unique, stable ASCII download URLs", () => {
    const documents = products.map((product) => product.document);
    expect(documents.every(Boolean)).toBe(true);
    expect(new Set(documents).size).toBe(products.length);
    for (const document of documents) {
      expect(document).toMatch(/^\/downloads\/[a-z0-9-]+-specifications\.docx$/);
      expect(existsSync(join(process.cwd(), "public", document!))).toBe(true);
    }
  });

  it("keeps the primary document information indexable in product HTML", () => {
    for (const product of products) {
      expect(product.overview.length).toBeGreaterThan(150);
      expect(product.features.length).toBeGreaterThanOrEqual(4);
      expect(product.specs.length).toBeGreaterThanOrEqual(5);
      expect(product.applications.length).toBeGreaterThanOrEqual(3);
    }
  });
});
