import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("products page rendering", () => {
  it("keeps the route independent of server search params", () => {
    const source = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(source).not.toMatch(/searchParams/);
    expect(source).toContain("ProductCatalogSection");
  });
});
