import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("product detail structured data", () => {
  it("does not emit Product rich-result schema without commercial offers", async () => {
    const source = await readFile("app/products/[slug]/page.tsx", "utf8");
    expect(source).not.toContain('"@type": "Product"');
    expect(source).not.toContain("<StructuredData data={productData}");
  });
});
