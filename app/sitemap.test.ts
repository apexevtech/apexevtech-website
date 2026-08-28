import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("contains unique canonical URLs with stable dates", () => {
    const entries = sitemap();
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    expect(entries.every((entry) => entry.lastModified instanceof Date)).toBe(true);
  });
});
