import { describe, expect, it } from "vitest";
import { resources } from "@/lib/resources/catalog";
import { buildResourceStructuredData } from "@/lib/seo/resource-structured-data";
import { getResourceGuideIndexHref } from "@/lib/navigation/resource-hash";

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
    const indexUrl = new URL(getResourceGuideIndexHref(resource.slug), "https://example.com");
    indexUrl.hash = "";
    expect(breadcrumbData.itemListElement.map((item) => item.item)).toEqual([
      "https://example.com/", indexUrl.toString(), url,
    ]);
    expect(breadcrumbData.itemListElement[1].name).toBe("Technical materials");
    expect(breadcrumbData.itemListElement.map((item) => item.position)).toEqual([1, 2, 3]);
  });

  it("keeps every breadcrumb parent on the guide's actual collection page", () => {
    for (const resource of resources) {
      const parent = buildResourceStructuredData(resource, "https://example.com").breadcrumbData.itemListElement[1];
      const visibleTarget = new URL(getResourceGuideIndexHref(resource.slug), "https://example.com");
      visibleTarget.hash = "";
      expect(parent.item).toBe(visibleTarget.toString());
      expect(parent.name).toBe("Technical materials");
    }
  });
});
