import { describe, expect, it } from "vitest";
import { buildCatalogInquiryHref, buildComparisonInquiryHref, readCatalogInquiryScope, readCatalogInquiryConfiguration } from "./catalog-scope";
import { products } from "@/data/site";
import type { ProductFilters } from "@/lib/products/filter";

describe("catalog inquiry handoff", () => {
  it("carries selected requirements into a readable inquiry", () => {
    const url = new URL(buildCatalogInquiryHref({ type: "ac", interface: "ccs2", workflow: "field" }), "https://example.com");
    expect(url.hash).toBe("#inquiry-form");
    expect(readCatalogInquiryScope(url.searchParams)).toContain("Charger type: AC chargers");
    expect(readCatalogInquiryScope(url.searchParams)).toContain("Charger connector / interface: CCS2 / ISO 15118");
    expect(readCatalogInquiryScope(url.searchParams)).toContain("Test workflow: Field commissioning");
  });

  it("omits unset filters and ignores unrecognized values", () => {
    const url = new URL(buildCatalogInquiryHref({ type: "dc", interface: "all", workflow: "all" }), "https://example.com");
    expect(url.searchParams.has("workflow")).toBe(false);
    expect(readCatalogInquiryScope(url.searchParams)).not.toContain("Test workflow:");
    expect(readCatalogInquiryScope(new URLSearchParams("source=equipment-finder&type=invalid&interface=unknown"))).toBeNull();
  });

  it("does not prefill unrelated contact visits", () => {
    expect(readCatalogInquiryScope(new URLSearchParams("type=dc"))).toBeNull();
    expect(readCatalogInquiryScope(new URLSearchParams("source=equipment-finder"))).toBeNull();
  });

  it("preserves guide origin separately from the editable message", () => {
    const url = new URL(buildCatalogInquiryHref({ type: "dc", interface: "ccs2", workflow: "all" }, "/resources/ccs2-dc-fast-charger-testing"), "https://example.com");
    expect(url.searchParams.get("sourcePage")).toBe("/resources/ccs2-dc-fast-charger-testing");
    expect(readCatalogInquiryConfiguration(url.searchParams)).toBe("Charger type: DC chargers\nCharger connector / interface: CCS2 / ISO 15118");
    expect(new URL(buildCatalogInquiryHref({ type: "dc", interface: "all", workflow: "all" }), "https://example.com").searchParams.get("sourcePage")).toBe("/products");
  });

  it("carries at most three unique candidate models alongside valid scope", () => {
    const filters: ProductFilters = { type: "dc", interface: "ccs2", workflow: "field" };
    const candidates = [products[0], products[0], ...products.slice(1, 4)];
    const catalog = new URL(buildCatalogInquiryHref(filters, "/products", candidates), "https://example.com");
    const comparison = new URL(buildComparisonInquiryHref(filters, candidates), "https://example.com");
    expect(catalog.searchParams.get("products")).toBe(products.slice(0, 3).map((product) => product.slug).join(","));
    expect(comparison.href).toBe(catalog.href);
    expect(readCatalogInquiryConfiguration(catalog.searchParams)).toContain("Test workflow: Field commissioning");
  });

  it("keeps products-only comparison and empty destinations backward compatible", () => {
    const filters: ProductFilters = { type: "all", interface: "all", workflow: "all" };
    expect(buildComparisonInquiryHref(filters, [])).toBe("/contact#inquiry-form");
    expect(buildComparisonInquiryHref(filters, products.slice(0, 2))).toBe(`/contact?products=${encodeURIComponent(products.slice(0, 2).map((product) => product.slug).join(","))}#inquiry-form`);
    expect(readCatalogInquiryConfiguration(new URLSearchParams("source=equipment-finder&products=ast-9000"))).toBeNull();
  });

  it("serializes only supported filter keys and public origin paths", () => {
    const filters = { type: "invalid@example.com", interface: "ccs2", workflow: "https://external.test", email: "private@example.com" } as unknown as ProductFilters;
    for (const sourcePage of ["https://external.test/products", "//external.test/products", "/products?email=private@example.com", "/products#private", "/resources/../contact"]) {
      const url = new URL(buildCatalogInquiryHref(filters, sourcePage, [products[0]]), "https://example.com");
      expect(url.searchParams.get("interface")).toBe("ccs2");
      expect(url.searchParams.has("type")).toBe(false);
      expect(url.searchParams.has("workflow")).toBe(false);
      expect(url.searchParams.has("sourcePage")).toBe(false);
      expect(url.href).not.toMatch(/private|invalid|external/);
    }
  });
});
