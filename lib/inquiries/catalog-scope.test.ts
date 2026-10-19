import { describe, expect, it } from "vitest";
import { buildCatalogInquiryHref, readCatalogInquiryScope } from "./catalog-scope";

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
});
