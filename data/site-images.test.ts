import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/data/site";

describe("product image assets", () => {
  it("uses optimized WebP source images that are present in the public directory", () => {
    for (const product of products) {
      expect(product.image).toMatch(/\.webp$/);
      expect(existsSync(join(process.cwd(), "public", product.image))).toBe(true);
    }
  });

  it("uses the optimized WebP logo in the site header", () => {
    const headerSource = readFileSync(join(process.cwd(), "components", "Header.tsx"), "utf8");

    expect(headerSource).toContain('src="/assets/apex-logo.webp"');
    expect(existsSync(join(process.cwd(), "public", "assets/apex-logo.webp"))).toBe(true);
  });

  it("uses optimized WebP assets for the high-traffic about and solutions pages", () => {
    const pageSources = [
      readFileSync(join(process.cwd(), "app", "about", "page.tsx"), "utf8"),
      readFileSync(join(process.cwd(), "app", "solutions", "page.tsx"), "utf8"),
    ].join("\n");
    const optimizedAssets = [
      "/assets/products/AST-9000x-fitted.webp",
      "/assets/products/evse-field-commissioning.webp",
      "/assets/products/图片5.webp",
    ];

    for (const asset of optimizedAssets) {
      expect(pageSources).toContain(asset);
      expect(existsSync(join(process.cwd(), "public", asset))).toBe(true);
    }
  });

  it("uses the optimized favicon in the root metadata", () => {
    const layoutSource = readFileSync(join(process.cwd(), "app", "layout.tsx"), "utf8");

    expect(layoutSource).toContain('icon: "/assets/apex-logo.webp"');
    expect(layoutSource).not.toContain('icon: "/assets/apex-logo.jpg"');
  });
});
