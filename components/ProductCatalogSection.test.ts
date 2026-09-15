import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("product catalog filter initialization", () => {
  it("initializes the selected filter from the server-rendered query string", () => {
    const source = readFileSync(join(process.cwd(), "components", "ProductCatalogSection.tsx"), "utf8");
    const pageSource = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(pageSource).toContain("searchParams: Promise<{ type?: string }>");
    expect(pageSource).toContain("parseProductFilter(params.type)");
    expect(source).toContain("initialFilter: ProductFilter");
    expect(source).not.toContain("useEffect");
  });
});
