import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { getComparedProducts, getProductComparisonDetails, parseComparedProductSlugs, reduceProductComparison, serializeComparedProducts } from "@/lib/products/comparison";

describe("product comparison", () => {
  it("toggles valid models, limits additions to three, and always allows removal", () => {
    let selected: string[] = [];
    for (const product of products.slice(0, 3)) selected = reduceProductComparison(selected, { type: "toggle", slug: product.slug }, products);
    expect(selected).toEqual(products.slice(0, 3).map((product) => product.slug));
    expect(reduceProductComparison(selected, { type: "toggle", slug: products[3].slug }, products)).toEqual(selected);
    expect(reduceProductComparison(selected, { type: "toggle", slug: "unknown" }, products)).toEqual(selected);
    selected = reduceProductComparison(selected, { type: "toggle", slug: products[1].slug }, products);
    expect(selected).toEqual([products[0].slug, products[2].slug]);
    expect(reduceProductComparison(selected, { type: "toggle", slug: products[3].slug }, products)).toEqual([products[0].slug, products[2].slug, products[3].slug]);
    expect(reduceProductComparison(selected, { type: "clear" }, products)).toEqual([]);
  });

  it("updates slots without duplicates, invalid positions or sparse selections", () => {
    const initial = products.slice(0, 3).map((product) => product.slug);
    expect(reduceProductComparison([], { type: "replace", index: 2, slug: products[0].slug }, products)).toEqual([products[0].slug]);
    expect(reduceProductComparison(initial, { type: "replace", index: 1, slug: products[3].slug }, products)).toEqual([products[0].slug, products[3].slug, products[2].slug]);
    expect(reduceProductComparison(initial, { type: "replace", index: 0, slug: "" }, products)).toEqual(initial.slice(1));
    expect(reduceProductComparison(initial, { type: "replace", index: 1, slug: products[0].slug }, products)).toEqual(initial);
    for (const index of [-1, 3, Number.NaN, 1.5]) expect(reduceProductComparison(initial, { type: "replace", index, slug: products[3].slug }, products)).toEqual(initial);
    expect(reduceProductComparison(initial, { type: "replace", index: 0, slug: "unknown" }, products)).toEqual(initial);
    expect(reduceProductComparison(["unknown", products[0].slug, products[0].slug], { type: "toggle", slug: products[1].slug }, products)).toEqual([products[0].slug, products[1].slug]);
  });

  it("preserves filter and unrelated query state when updating or clearing comparisons", () => {
    const query = new URLSearchParams("type=dc&interface=ccs2&workflow=field&utm_source=test&compare=unknown&compare=ignored");
    const selected = products.slice(0, 3).map((product) => product.slug);
    const next = serializeComparedProducts(query, selected, products);
    expect(next.getAll("compare")).toEqual([selected.join(",")]);
    for (const key of ["type", "interface", "workflow", "utm_source"]) expect(next.get(key)).toBe(query.get(key));
    const cleared = serializeComparedProducts(next, [], products);
    expect(cleared.has("compare")).toBe(false);
    expect(cleared.get("type")).toBe("dc");
    expect(cleared.get("utm_source")).toBe("test");
    expect(query.getAll("compare")).toEqual(["unknown", "ignored"]);
  });
  it("keeps valid unique products in the shared-link order and limits the comparison to three", () => {
    const value = `${products[2].slug},unknown,${products[0].slug},${products[2].slug},${products[1].slug},${products[3].slug}`;
    expect(parseComparedProductSlugs(value, products)).toEqual([products[2].slug, products[0].slug, products[1].slug]);
    expect(getComparedProducts(value, products).map((product) => product.slug)).toEqual([products[2].slug, products[0].slug, products[1].slug]);
  });

  it("builds useful comparison rows from the product content", () => {
    for (const product of products) {
      const details = getProductComparisonDetails(product);
      expect(details.type).toBe(product.category);
      expect(details.interface.length).toBeGreaterThan(0);
      expect(details.electricalRange.length).toBeGreaterThan(10);
      expect(details.loadArrangement.length).toBeGreaterThan(10);
      expect(details.standards.length).toBeGreaterThan(10);
      expect(details.capabilities).toContain(product.highlights[0]);
      expect(details.applications).toContain(product.applications[0]);
    }
  });
});
