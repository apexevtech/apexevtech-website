import { describe, expect, it } from "vitest";
import { navItems } from "@/data/site";
import { resources } from "@/lib/resources/catalog";

describe("internal navigation", () => {
  it("exposes Resources and keeps records connected", () => {
    expect(navItems).toContainEqual({ label: "Resources", href: "/resources" });
    for (const resource of resources) {
      expect(resource.relatedProductSlugs.length).toBeGreaterThan(0);
      expect(resource.relatedResourceSlugs.length).toBeGreaterThanOrEqual(2);
    }
  });
});
