import { describe, expect, it } from "vitest";
import { resources } from "@/lib/resources/catalog";
import { buildResourceStructuredData } from "@/lib/seo/resource-structured-data";

describe("resource structured data", () => {
  it("uses the configured host throughout the article and breadcrumb", () => {
    const resource = resources[0];
    const { articleData, breadcrumbData } = buildResourceStructuredData(resource, "https://example.com/");
    const url = `https://example.com/resources/${resource.slug}`;
    expect(articleData.mainEntityOfPage).toBe(url);
    expect(articleData.url).toBe(url);
    expect(articleData.dateModified).toBe(resource.modifiedAt);
    expect(articleData.author).toEqual(articleData.publisher);
    expect(articleData.author.url).toBe("https://example.com/");
    expect(breadcrumbData.itemListElement.map((item) => item.item)).toEqual([
      "https://example.com/", "https://example.com/resources", url,
    ]);
    expect(breadcrumbData.itemListElement.map((item) => item.position)).toEqual([1, 2, 3]);
  });
});
