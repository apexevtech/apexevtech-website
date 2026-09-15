import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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

  it("renders related products as crawlable links from resource pages", () => {
    const source = readFileSync(join(process.cwd(), "app", "resources", "[slug]", "page.tsx"), "utf8");

    expect(source).toContain("`/products/${product.slug}`");
  });
});
