import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { buildProductStructuredData } from "@/lib/seo/product-structured-data";

describe("product structured data", () => {
  it("describes every product with absolute URLs and visible specifications", () => {
    for (const product of products) {
      const data = buildProductStructuredData(product, "https://example.com/");
      const url = `https://example.com/products/${product.slug}`;

      expect(data["@type"]).toBe("Product");
      expect(data["@id"]).toBe(`${url}#product`);
      expect(data.url).toBe(url);
      expect(data.mainEntityOfPage).toBe(url);
      expect(data.image).toBe(new URL(product.image, "https://example.com/").toString());
      expect(data.model).toBe(product.model);
      expect(data.brand.name).toBe("APEX");
      expect(data.additionalProperty).toEqual(
        product.specs.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
      );
      expect(data).not.toHaveProperty("offers");
      expect(data).not.toHaveProperty("aggregateRating");
      expect(data).not.toHaveProperty("review");
    }
  });
});
