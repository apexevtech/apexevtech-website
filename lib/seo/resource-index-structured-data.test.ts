import { describe, expect, it } from "vitest";
import { resources } from "@/lib/resources/catalog";
import { buildResourceIndexStructuredData } from "@/lib/seo/resource-index-structured-data";

describe("resource index structured data", () => {
  it("lists every guide once with stable positions and canonical URLs", () => {
    const data = buildResourceIndexStructuredData(resources, "https://example.com/");

    expect(data["@type"]).toBe("ItemList");
    expect(data.numberOfItems).toBe(resources.length);
    expect(data.itemListElement.map((item) => item.position)).toEqual(resources.map((_, index) => index + 1));
    expect(data.itemListElement.map((item) => item.url)).toEqual(resources.map((resource) => `https://example.com/resources/${resource.slug}`));
    expect(new Set(data.itemListElement.map((item) => item.url)).size).toBe(resources.length);
  });
});
