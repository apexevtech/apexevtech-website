import { describe, expect, it } from "vitest";
import { resourceEquipmentPaths } from "./resource-equipment";
import { products } from "./site";
import { resources } from "./resources";
import { buildCatalogInquiryHref, readCatalogInquiryScope } from "@/lib/inquiries/catalog-scope";

describe("guide equipment coverage", () => {
  it("keeps field and production workflows distinct in inquiry handoff", () => {
    for (const [slug, workflow, label] of [["field-commissioning-test-equipment", "field", "Field commissioning"], ["evse-end-of-line-testing", "production", "Production / end-of-line"]]) {
      const equipment = resourceEquipmentPaths[slug];
      const url = new URL(buildCatalogInquiryHref(equipment.inquiryFilters!, `/resources/${slug}`), "https://example.com");
      expect(readCatalogInquiryScope(url.searchParams)).toContain(label);
      expect(url.searchParams.get("sourcePage")).toBe(`/resources/${slug}`);
      expect(equipment.inquiryLabel).toBeTruthy();
      for (const path of equipment.paths) {
        expect(products.find((product) => product.slug === path.slug)!.capabilities.workflows).toContain(workflow);
      }
    }
  });

  it("provides distinct acceptance matrices for the three priority guides", () => {
    const titles = new Set<string>();
    for (const slug of ["field-commissioning-test-equipment", "evse-end-of-line-testing", "ccs2-dc-fast-charger-testing"]) {
      const guide = resources.find((resource) => resource.slug === slug)!;
      expect(guide.modifiedAt).toBe("2026-10-20");
      expect(guide.decisionTable!.rows.length).toBeGreaterThanOrEqual(4);
      expect(guide.decisionTable!.note).toBeTruthy();
      titles.add(guide.decisionTable!.title);
    }
    expect(titles.size).toBe(3);
  });
  it("references published products and known guides", () => {
    for (const [slug, equipment] of Object.entries(resourceEquipmentPaths)) {
      expect(resources.some((resource) => resource.slug === slug)).toBe(true);
      for (const path of equipment.paths) expect(products.some((product) => product.slug === path.slug)).toBe(true);
    }
  });
  it("does not recommend Type 1 or unconfirmed DC equipment as NACS coverage", () => {
    const guide = resources.find((resource) => resource.slug === "sae-j3400-nacs-testing")!;
    expect(guide.relatedProductSlugs).toEqual(["st-hcac-ea-ua-na"]);
    for (const path of resourceEquipmentPaths[guide.slug].paths) {
      const product = products.find((product) => product.slug === path.slug)!;
      expect(product.capabilities.interfaces).toContain("nacs");
      expect(product.capabilities.chargerTypes).toContain("ac");
    }
  });
  it("carries distinct CCS2 and NACS DC scope into configuration requests", () => {
    for (const [slug, connector] of [["ccs2-dc-fast-charger-testing", "CCS2"], ["sae-j3400-nacs-testing", "NACS"]]) {
      const filters = resourceEquipmentPaths[slug].inquiryFilters!;
      const url = new URL(buildCatalogInquiryHref(filters), "https://example.com");
      const scope = readCatalogInquiryScope(url.searchParams);
      expect(scope).toContain("DC chargers");
      expect(scope).toContain(connector);
    }
  });
});
