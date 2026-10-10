import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("product detail structured data", () => {
  it("does not request a Product rich result without real offers or reviews", async () => {
    const source = await readFile("app/products/[slug]/page.tsx", "utf8");

    expect(source).not.toContain("buildProductStructuredData");
    expect(source).not.toContain('"@type": "Product"');
    expect(source).toContain('<StructuredData data={breadcrumbData} />');
    expect(source).toContain('"@type": "FAQPage"');
  });

  it("uses the product image in social metadata", async () => {
    const source = await readFile("app/products/[slug]/page.tsx", "utf8");

    expect(source).toContain("image: product.image");
    expect(source).not.toContain('image: "/assets/social/products.png"');
  });
});
