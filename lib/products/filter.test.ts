import { describe, expect, it } from "vitest";
import { filterProducts, parseProductFilter } from "@/lib/products/filter";

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
});
