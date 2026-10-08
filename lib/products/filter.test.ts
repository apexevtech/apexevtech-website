import { describe, expect, it } from "vitest";
import { filterProductCatalog, filterProducts, parseInterfaceFilter, parseProductFilter, parseProductFilters, parseWorkflowFilter } from "@/lib/products/filter";

const sampleProducts = [
  { slug: "dc-one", category: "DC Charger Testing" },
  { slug: "ac-one", category: "AC Charger Testing" },
  { slug: "mixed-one", category: "AC / DC Laboratory Testing" },
];

describe("product filters", () => {
  it("normalizes supported query values and falls back to all", () => {
    expect(parseProductFilter("DC")).toBe("dc");
    expect(parseProductFilter("ac")).toBe("ac");
    expect(parseProductFilter("unknown")).toBe("all");
  });

  it("returns products matching the selected charger type", () => {
    expect(filterProducts(sampleProducts, "dc").map((product) => product.slug)).toEqual(["dc-one", "mixed-one"]);
    expect(filterProducts(sampleProducts, "ac").map((product) => product.slug)).toEqual(["ac-one", "mixed-one"]);
    expect(filterProducts(sampleProducts, "all")).toEqual(sampleProducts);
  });

  it("normalizes interface and workflow filters", () => {
    expect(parseInterfaceFilter("CCS2")).toBe("ccs2");
    expect(parseInterfaceFilter("other")).toBe("all");
    expect(parseWorkflowFilter("FIELD")).toBe("field");
    expect(parseWorkflowFilter(undefined)).toBe("all");
    expect(parseProductFilters(new URLSearchParams("type=dc&interface=ccs2&workflow=field"))).toEqual({ type: "dc", interface: "ccs2", workflow: "field" });
  });

  it("combines charger type, interface and workflow criteria", () => {
    const catalog = [
      { slug: "ccs-field", model: "A", overview: "A", image: "/a.webp", category: "DC Charger Testing / Field Service", title: "CCS2 tester", shortDescription: "Portable Combo 2 commissioning tester", highlights: ["ISO 15118"], features: [], specs: [["Connector", "CCS2"]] as Array<[string, string]>, applications: ["Field commissioning"] },
      { slug: "gbt-lab", model: "B", overview: "B", image: "/b.webp", category: "DC Charger Testing / Laboratory Testing", title: "GB/T system", shortDescription: "Integrated laboratory system", highlights: ["GB/T 27930"], features: [], specs: [["Interface", "GB/T"]] as Array<[string, string]>, applications: ["Laboratory validation"] },
    ];
    expect(filterProductCatalog(catalog, { type: "dc", interface: "ccs2", workflow: "field" }).map((product) => product.slug)).toEqual(["ccs-field"]);
  });
});
