import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("contains unique canonical URLs with stable dates", () => {
    const entries = sitemap();
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    expect(entries.every((entry) => entry.lastModified instanceof Date)).toBe(true);
  });

  it("uses the release date for static and product pages instead of the current time", () => {
    const entries = sitemap();
    const releaseDate = new Date("2026-09-11T00:00:00.000Z").getTime();
    const contentEntries = entries.filter((entry) => !entry.url.includes("/resources/"));

    expect(contentEntries.length).toBeGreaterThan(0);
    expect(contentEntries.every((entry) => entry.lastModified instanceof Date && entry.lastModified.getTime() === releaseDate)).toBe(true);
  });
});
