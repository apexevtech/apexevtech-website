import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { caseStudies, products } from "@/data/site";

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
      "/assets/products/ev-charger-test-laboratory.webp",
    ];

    for (const asset of optimizedAssets) {
      expect(pageSources).toContain(asset);
      expect(existsSync(join(process.cwd(), "public", asset))).toBe(true);
    }
  });

  it("keeps solution case-study images on optimized WebP assets", () => {
    for (const study of caseStudies) {
      expect(study.image).toMatch(/\.webp$/);
      expect(existsSync(join(process.cwd(), "public", study.image))).toBe(true);
    }
  });

  it("uses the optimized favicon in the root metadata", () => {
    const layoutSource = readFileSync(join(process.cwd(), "app", "layout.tsx"), "utf8");

    expect(layoutSource).toContain('icon: "/assets/apex-logo.webp"');
    expect(layoutSource).not.toContain('icon: "/assets/apex-logo.jpg"');
  });

  it("keeps the mobile navigation keyboard-dismissible and explicitly associated with its toggle", () => {
    const headerSource = readFileSync(join(process.cwd(), "components", "Header.tsx"), "utf8");

    expect(headerSource).toContain('aria-controls="mobile-navigation"');
    expect(headerSource).toContain("event.key === \"Escape\"");
    expect(headerSource).toContain('id="mobile-navigation"');
  });

  it("uses the optimized WebP hero asset on the homepage and Open Graph metadata", () => {
    const homeSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf8");
    const layoutSource = readFileSync(join(process.cwd(), "app", "layout.tsx"), "utf8");
    const heroAsset = "/assets/hero/test-lab-systems.webp";

    expect(homeSource).toContain(`src="${heroAsset}"`);
    expect(layoutSource).toContain(`images: ["${heroAsset}"]`);
    expect(existsSync(join(process.cwd(), "public", heroAsset))).toBe(true);
  });

  it("does not retain duplicate PNG or JPEG sources for active WebP assets", () => {
    const activeAssets = new Set([
      ...products.map((product) => product.image),
      ...caseStudies.map((study) => study.image),
      "/assets/apex-logo.webp",
      "/assets/hero/test-lab-systems.webp",
      "/assets/products/AST-9000x-fitted.webp",
      "/assets/products/evse-field-commissioning.webp",
      "/assets/products/ev-charger-test-laboratory.webp",
    ]);

    for (const asset of activeAssets) {
      for (const extension of [".png", ".jpg", ".jpeg"]) {
        const duplicate = asset.replace(/\.webp$/, extension);
        expect(existsSync(join(process.cwd(), "public", duplicate))).toBe(false);
      }
    }
  });
});
