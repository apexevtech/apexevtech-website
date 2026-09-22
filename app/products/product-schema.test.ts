import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("product detail structured data", () => {
  it("emits factual Product entity data without unsupported commercial claims", async () => {
    const source = await readFile("app/products/[slug]/page.tsx", "utf8");
    const builder = await readFile("lib/seo/product-structured-data.ts", "utf8");

    expect(source).toContain("buildProductStructuredData(product, siteUrl)");
    expect(source).toContain("<StructuredData data={productData} />");
    expect(builder).toContain('"@type": "Product"');
    expect(builder).not.toContain("offers:");
    expect(builder).not.toContain("aggregateRating:");
    expect(builder).not.toContain("review:");
  });
});
