import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { engineeringCases } from "@/data/engineering-cases";
import { products } from "@/data/site";
import { applicationScenarios, solutionBriefs } from "@/data/technical-library";
import { resourceBrowserEntries } from "@/lib/resources/browser";
import { getResourceMaterialImage } from "@/lib/resources/images";

describe("resource gallery images", () => {
  it("gives all 46 materials local images with accurate intrinsic dimensions", async () => {
    const { default: sharp } = await import("sharp");
    expect(resourceBrowserEntries).toHaveLength(46);
    for (const entry of resourceBrowserEntries) {
      const image = getResourceMaterialImage(entry);
      expect(image.src).toMatch(/^\/assets\/.+\.(webp|jpg|png)$/);
      expect(image.alt.length).toBeGreaterThan(15);
      const file = join(process.cwd(), "public", image.src);
      expect(existsSync(file)).toBe(true);
      const metadata = await sharp(file).metadata();
      expect({ width: image.width, height: image.height }).toEqual({ width: metadata.width, height: metadata.height });
    }
  });

  it("uses the matching engineering reference for each of the 18 scenario documents", () => {
    expect(applicationScenarios).toHaveLength(18);
    applicationScenarios.forEach((material, index) => {
      const entry = resourceBrowserEntries.find((item) => item.kind === "scenario" && item.id === material.id);
      expect(entry).toBeDefined();
      if (!entry) return;
      const engineeringCase = engineeringCases.find((item) => item.id === `case-${index + 1}`);
      expect(getResourceMaterialImage(entry)).toEqual(engineeringCase?.image);
      if (material.source.image) expect(getResourceMaterialImage(entry).src).toBe(material.source.image.src);
    });
  });

  it("retains each solution brief's existing subject illustration", () => {
    expect(solutionBriefs).toHaveLength(6);
    for (const material of solutionBriefs) {
      const entry = resourceBrowserEntries.find((item) => item.kind === "source" && item.id === material.id);
      expect(entry).toBeDefined();
      if (entry) expect(getResourceMaterialImage(entry)).toEqual(material.source.image);
    }
  });

  it("illustrates all 22 guides with equipment already related to that guide", () => {
    const guides = resourceBrowserEntries.filter((entry) => entry.kind === "guide");
    expect(guides).toHaveLength(22);
    for (const entry of guides) {
      const image = getResourceMaterialImage(entry);
      const relatedProducts = products.filter((product) => entry.resource.relatedProductSlugs.includes(product.slug));
      const product = relatedProducts.find((item) => item.image === image.src);
      expect(product).toBeDefined();
      expect(image.alt).toBe(`${product?.model} ${product?.title}`);
      expect(image.src).not.toMatch(/engineering-cases|library\/case-/);
      expect(image.alt).not.toMatch(/delivered|customer|certified|proven|measured|regenerative/i);
    }
    expect(new Set(guides.map((entry) => getResourceMaterialImage(entry).src)).size).toBeGreaterThanOrEqual(8);
  });

  it("fails visibly for unknown or unrelated guide imagery instead of guessing", () => {
    const entry = resourceBrowserEntries.find((item) => item.kind === "guide");
    if (!entry || entry.kind !== "guide") throw new Error("Missing guide fixture");
    expect(() => getResourceMaterialImage({ ...entry, resource: { ...entry.resource, slug: "unknown-guide" } })).toThrow("Missing related equipment image");
    expect(() => getResourceMaterialImage({ ...entry, resource: { ...entry.resource, relatedProductSlugs: [] } })).toThrow("Missing related equipment image");
  });

  it("keeps image selection free of client filesystem and heavy data dependencies", () => {
    const source = readFileSync(join(process.cwd(), "lib/resources/images.ts"), "utf8");
    expect(source).not.toMatch(/node:fs|node:path|from ["']sharp|@\/data\/site|https?:|placeholder/);
    expect(source).toContain('import type { ResourceBrowserEntry }');
  });
});
