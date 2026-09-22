import { describe, expect, it } from "vitest";
import { interfaceTopics } from "@/data/interface-topics";
import { buildInterfaceIndexStructuredData, buildInterfaceStructuredData } from "@/lib/seo/interface-structured-data";

describe("interface structured data", () => {
  it("builds collection, breadcrumb and FAQ data", () => {
    const topic = interfaceTopics[0];
    const data = buildInterfaceStructuredData(topic, "https://example.com/");
    expect(data.pageData["@type"]).toBe("CollectionPage");
    expect(data.pageData.mainEntity.numberOfItems).toBe(topic.relatedProductSlugs.length);
    expect(data.breadcrumbData.itemListElement.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(data.faqData.mainEntity).toHaveLength(topic.faqs.length);
  });

  it("lists all interface hubs on the index", () => {
    const data = buildInterfaceIndexStructuredData(interfaceTopics, "https://example.com/");
    expect(data.numberOfItems).toBe(interfaceTopics.length);
    expect(new Set(data.itemListElement.map((item) => item.url)).size).toBe(interfaceTopics.length);
  });
});
