import { describe, expect, it } from "vitest";
import { getInterfaceTopic, getProductInterfaceTopics, interfaceTopics } from "@/data/interface-topics";
import { products } from "@/data/site";
import { getResource } from "@/lib/resources/catalog";

describe("interface topics", () => {
  it("provides six unique, complete interface hubs", () => {
    expect(interfaceTopics).toHaveLength(6);
    expect(new Set(interfaceTopics.map((topic) => topic.slug)).size).toBe(6);
    for (const topic of interfaceTopics) {
      expect(getInterfaceTopic(topic.slug)).toBe(topic);
      expect(topic.scope).toHaveLength(4);
      expect(topic.planningSteps).toHaveLength(4);
      expect(topic.faqs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("only links published products and resources", () => {
    const productSlugs = new Set(products.map((product) => product.slug));
    for (const topic of interfaceTopics) {
      expect(topic.relatedProductSlugs.every((slug) => productSlugs.has(slug))).toBe(true);
      expect(topic.relatedResourceSlugs.every((slug) => getResource(slug))).toBe(true);
      for (const slug of topic.relatedProductSlugs) expect(getProductInterfaceTopics(slug)).toContain(topic);
    }
  });
});
