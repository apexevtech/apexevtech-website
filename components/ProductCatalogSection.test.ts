import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("product catalog filter initialization", () => {
  it("keeps the page static and synchronizes the client filter with the URL", () => {
    const source = readFileSync(join(process.cwd(), "components", "ProductCatalogSection.tsx"), "utf8");
    const pageSource = readFileSync(join(process.cwd(), "app", "products", "page.tsx"), "utf8");

    expect(pageSource).not.toContain("searchParams");
    expect(source).toContain("useState<ProductFilters>(defaults)");
    expect(source).toContain("parseProductFilters(new URLSearchParams(window.location.search))");
    expect(source).toContain('window.addEventListener("popstate", sync)');
    expect(source).toContain('window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)');
    expect(source).toContain('updateFilter("interface"');
    expect(source).toContain('updateFilter("workflow"');
  });
});
