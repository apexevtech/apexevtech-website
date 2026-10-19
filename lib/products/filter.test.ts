import { describe, expect, it } from "vitest";
import { products, type Product } from "@/data/site";
import { filterProductCatalog, parseInterfaceFilter, parseProductFilter, parseProductFilters, parseWorkflowFilter } from "@/lib/products/filter";

describe("product filters", () => {
  it("normalizes supported query values and falls back to all", () => {
    expect(parseProductFilter("DC")).toBe("dc");
    expect(parseProductFilter("ac")).toBe("ac");
    expect(parseProductFilter("unknown")).toBe("all");
  });

  it("normalizes interface and workflow filters", () => {
    expect(parseInterfaceFilter("CCS2")).toBe("ccs2");
    expect(parseInterfaceFilter("other")).toBe("all");
    expect(parseWorkflowFilter("FIELD")).toBe("field");
    expect(parseWorkflowFilter(undefined)).toBe("all");
    expect(parseProductFilters(new URLSearchParams("type=dc&interface=ccs2&workflow=field"))).toEqual({ type: "dc", interface: "ccs2", workflow: "field" });
  });

  it("combines charger type, interface and workflow criteria", () => {
    const catalog: Product[] = [
      { capabilities: { chargerTypes: ["dc"], interfaces: ["ccs2"], workflows: ["portable", "field"] }, slug: "ccs-field", model: "A", overview: "A", image: "/a.webp", category: "DC Charger Testing / Field Service", title: "CCS2 tester", shortDescription: "Portable Combo 2 commissioning tester", highlights: ["ISO 15118"], features: [], specs: [["Connector", "CCS2"]] as Array<[string, string]>, applications: ["Field commissioning"] },
      { capabilities: { chargerTypes: ["dc"], interfaces: ["gbt"], workflows: ["laboratory"] }, slug: "gbt-lab", model: "B", overview: "B", image: "/b.webp", category: "DC Charger Testing / Laboratory Testing", title: "GB/T system", shortDescription: "Integrated laboratory system", highlights: ["GB/T 27930"], features: [], specs: [["Interface", "GB/T"]] as Array<[string, string]>, applications: ["Laboratory validation"] },
    ];
    expect(filterProductCatalog(catalog, { type: "dc", interface: "ccs2", workflow: "field" }).map((product) => product.slug)).toEqual(["ccs-field"]);
  });
});

describe("reviewed product capabilities", () => {
  it("does not infer charger types or interfaces from incidental text", () => {
    const product: Product = {
      ...products.find((item) => item.slug === "st-6680ua-dc")!,
      shortDescription: "SAE J1772 references; AC source; compare Type 1, CCS2 and NACS alternatives for field work.",
    };
    expect(filterProductCatalog([product], { type: "ac", interface: "all", workflow: "all" })).toEqual([]);
    for (const connector of ["type1", "ccs2", "nacs"] as const) {
      expect(filterProductCatalog([product], { type: "dc", interface: connector, workflow: "all" })).toEqual([]);
    }
    expect(filterProductCatalog([product], { type: "dc", interface: "all", workflow: "field" })).toEqual([product]);
  });

  it("keeps AC and DC catalogs separate even for systems with programmable AC sources", () => {
    expect(filterProductCatalog(products, { type: "ac", interface: "all", workflow: "all" }).map((item) => item.slug)).toEqual([
      "st-hcac-gb-ua-ea", "st-6680b-plus", "st-6680ea-ac", "st-6680ua-ac", "st-hcac-ea-ua-na",
    ]);
    expect(filterProductCatalog(products, { type: "dc", interface: "all", workflow: "all" })).toHaveLength(7);
  });

  it("returns only documented connectors for regional and multi-interface systems", () => {
    const matching = (connector: "type1" | "type2" | "nacs" | "ccs2") => filterProductCatalog(products, { type: "all", interface: connector, workflow: "all" }).map((item) => item.slug);
    expect(matching("ccs2")).toEqual(["st-9980ea-hpc", "st-6680ea-dc"]);
    expect(matching("type1")).toEqual(["st-hcac-gb-ua-ea", "st-6680ua-ac", "st-hcac-ea-ua-na"]);
    expect(matching("type2")).toEqual(["st-hcac-gb-ua-ea", "st-6680ea-ac", "st-hcac-ea-ua-na"]);
    expect(matching("nacs")).toEqual(["st-hcac-ea-ua-na"]);
  });

  it("keeps configured laboratory platforms out of portable field results", () => {
    const matching = filterProductCatalog(products, { type: "all", interface: "all", workflow: "portable" }).map((item) => item.slug);
    expect(matching).not.toContain("ast-9000");
    expect(matching).not.toContain("st-hcac-ea-ua-na");
    expect(matching).toContain("st-hcac-gb-ua-ea");
  });
});
