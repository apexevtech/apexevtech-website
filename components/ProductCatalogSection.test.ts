import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("product catalog filter initialization", () => {
  it("keeps the page static and synchronizes the client filter with the URL", () => {
    const source = readFileSync(join(process.cwd(), "components", "ProductCatalogSection.tsx"), "utf8");
    const explorerSource = readFileSync(join(process.cwd(), "components", "ProductExplorer.tsx"), "utf8");
    const pageSource = readFileSync(join(process.cwd(), "app", "(en)", "products", "page.tsx"), "utf8");

    expect(pageSource).not.toContain("searchParams");
    expect(explorerSource).toContain("useState<ProductFilters>");
    expect(explorerSource).toContain("setFilters(parseProductFilters(params))");
    expect(explorerSource).toContain("<QueryStateSync onChange={syncSelection} />");
    expect(explorerSource.match(/filters=\{filters\}/g)).toHaveLength(2);
    expect(source).not.toContain("<QueryStateSync");
    expect(source).toContain("onFiltersChange(next)");
    expect(source).toContain('window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)');
    expect(source).toContain('updateFilter("interface"');
    expect(source).toContain('updateFilter("workflow"');
  });
});
