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
});
