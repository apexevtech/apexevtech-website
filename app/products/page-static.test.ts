import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("products page rendering", () => {
  it("does not read request search params so the catalog can be statically rendered", () => {
    const source = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(source).not.toContain("searchParams");
    expect(source).not.toContain("parseProductFilter");
    expect(source).toContain("ProductCatalogSection");
  });

  it("generates a stable canonical URL for filtered catalog requests", () => {
    const source = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(source).toContain("export const metadata");
    expect(source).toContain('path: "/products"');
  });
});
