import { existsSync } from "node:fs";
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
});
