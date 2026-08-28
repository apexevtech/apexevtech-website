import { describe, expect, it } from "vitest";
import { getResource, resources } from "@/lib/resources/catalog";

describe("resource catalog", () => {
  it("provides a unique, internally connected initial cluster", () => {
    expect(resources).toHaveLength(9);
    expect(new Set(resources.map((item) => item.slug)).size).toBe(9);
    for (const resource of resources) {
      expect(resource.summaryAnswer.length).toBeGreaterThan(80);
      expect(resource.relatedResourceSlugs.length).toBeGreaterThanOrEqual(2);
      expect(resource.relatedProductSlugs.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getResource("missing")).toBeUndefined();
  });
});
