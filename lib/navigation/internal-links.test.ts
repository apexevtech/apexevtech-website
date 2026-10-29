import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { navItems } from "@/data/site";
import { resources } from "@/lib/resources/catalog";

describe("internal navigation", () => {
  it("combines engineering cases and resources in one Project Cases interface", () => {
    expect(navItems.filter((item) => item.href === "/project-cases"))
      .toEqual([{ label: "Project Cases", href: "/project-cases" }]);
    expect(navItems.some((item) => item.href === "/engineering-cases" || item.href === "/resources")).toBe(false);
  });

  it("uses one Solutions entry for solution and application workflows", () => {
    expect(navItems.filter((item) => item.href === "/solutions")).toEqual([{ label: "Solutions", href: "/solutions" }]);
    expect(navItems.some((item) => item.href.startsWith("/applications"))).toBe(false);
  });

  it("keeps resource records connected under Project Cases", () => {
    expect(navItems).toContainEqual({ label: "Project Cases", href: "/project-cases" });
    expect(navItems.some((item) => item.href === "/library")).toBe(false);
    for (const resource of resources) {
      expect(resource.relatedProductSlugs.length).toBeGreaterThan(0);
      expect(resource.relatedResourceSlugs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("renders related products as crawlable links from resource pages", () => {
    const source = readFileSync(join(process.cwd(), "app", "(en)", "resources", "[slug]", "page.tsx"), "utf8");

    expect(source).toContain("`/products/${product.slug}`");
  });
});
