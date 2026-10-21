import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { navItems } from "@/data/site";
import { resources } from "@/lib/resources/catalog";

describe("internal navigation", () => {
  it("exposes an independent engineering case interface", () => {
    expect(navItems.filter((item) => item.href === "/engineering-cases"))
      .toEqual([{ label: "Engineering Cases", href: "/engineering-cases" }]);
  });

  it("uses one Solutions entry for solution and application workflows", () => {
    expect(navItems.filter((item) => item.href === "/solutions")).toEqual([{ label: "Solutions", href: "/solutions" }]);
    expect(navItems.some((item) => item.href.startsWith("/applications"))).toBe(false);
  });

  it("exposes Resources and keeps records connected", () => {
    expect(navItems).toContainEqual({ label: "Resources", href: "/resources" });
    expect(navItems.filter((item) => item.href === "/resources")).toHaveLength(1);
    expect(navItems.some((item) => item.href === "/library")).toBe(false);
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
