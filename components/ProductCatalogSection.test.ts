import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("product catalog filter initialization", () => {
  it("keeps the page static and synchronizes the client filter with the URL", () => {
    const source = readFileSync(join(process.cwd(), "components", "ProductCatalogSection.tsx"), "utf8");
    const pageSource = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(pageSource).not.toContain("searchParams");
    expect(source).toContain('useState<ProductFilter>("all")');
    expect(source).toContain('new URLSearchParams(window.location.search).get("type")');
    expect(source).toContain('window.addEventListener("popstate", syncFilterWithUrl)');
    expect(source).toContain('window.history.pushState(null, "", href)');
  });
});
