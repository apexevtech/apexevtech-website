import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("products page rendering", () => {
  it("passes the server search params into the catalog filter", () => {
    const source = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(source).toContain("searchParams: Promise<{ type?: string }>");
    expect(source).toContain("parseProductFilter(params.type)");
    expect(source).toContain("ProductCatalogSection");
  });

  it("generates a stable canonical URL for filtered catalog requests", () => {
    const source = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(source).toContain("generateMetadata");
    expect(source).toContain('path: "/products"');
  });
});
