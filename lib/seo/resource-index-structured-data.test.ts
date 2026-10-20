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

  it("describes only the guides visible on a filtered or paginated page", () => {
    const visible = resources.slice(6, 9);
    const data = buildResourceIndexStructuredData(visible, "https://example.com/", "/resources?type=guides&page=2#resource-results");
    expect(data.url).toBe("https://example.com/resources?type=guides&page=2");
    expect(data.numberOfItems).toBe(3);
    expect(data.itemListElement.map((item) => item.url)).toEqual(visible.map((resource) => `https://example.com/resources/${resource.slug}`));
  });
});
