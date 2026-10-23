import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { products, navItems } from "@/data/site";
import { resources } from "@/lib/resources/catalog";
import { siteUrl } from "@/lib/seo/site-urls";
import sitemap from "@/app/sitemap";
import { applicationExamples } from "@/data/applications";
import { interfaceTopics } from "@/data/interface-topics";
import { engineeringCases } from "@/data/engineering-cases";
import { projectBriefs } from "@/data/project-briefs";

describe("sitemap", () => {
  it("publishes exactly three canonical reference briefs with their existing images", () => {
    const entries = sitemap().filter((entry) => entry.url.startsWith(`${siteUrl}/project-cases/`));
    expect(entries).toHaveLength(3);
    for (const brief of projectBriefs) {
      const entry = entries.find((item) => item.url === `${siteUrl}/project-cases/${brief.caseSlug}`);
      expect(entry?.lastModified).toEqual(new Date("2026-10-23T00:00:00.000Z"));
      expect(entry?.images).toEqual([new URL(engineeringCases.find((item) => item.slug === brief.caseSlug)!.image!.src, siteUrl).toString()]);
    }
  });
  it("contains unique canonical URLs with stable dates", () => {
    const entries = sitemap();
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    expect(entries.every((entry) => entry.lastModified instanceof Date)).toBe(true);
  });

  it("updates changed static pages while preserving unchanged dates", () => {
    const entries = sitemap();
    const unchanged = ["/about", "/contact", "/interfaces"];
    for (const route of unchanged) {
      expect(entries.find((entry) => entry.url === `${siteUrl}${route}`)?.lastModified)
        .toEqual(new Date("2026-09-22T00:00:00.000Z"));
    }
    expect(entries.find((entry) => entry.url === siteUrl)?.lastModified)
      .toEqual(new Date("2026-10-10T00:00:00.000Z"));
    expect(entries.find((entry) => entry.url === `${siteUrl}/products`)?.lastModified)
      .toEqual(new Date("2026-10-08T00:00:00.000Z"));
    expect(entries.some((entry) => entry.url === `${siteUrl}/library`)).toBe(false);
    expect(entries.some((entry) => entry.url === `${siteUrl}/resources`)).toBe(false);
    expect(entries.find((entry) => entry.url === `${siteUrl}/solutions`)?.lastModified)
      .toEqual(new Date("2026-10-20T00:00:00.000Z"));
    expect(entries.find((entry) => entry.url === `${siteUrl}/project-cases`)?.lastModified)
      .toEqual(new Date("2026-10-23T00:00:00.000Z"));
    expect(entries.some((entry) => entry.url === `${siteUrl}/engineering-cases`)).toBe(false);
    expect(entries.some((entry) => entry.url === `${siteUrl}/applications`)).toBe(false);
    for (const route of ["/privacy-policy"]) {
      expect(entries.find((entry) => entry.url === `${siteUrl}${route}`)?.lastModified)
        .toEqual(new Date("2026-10-09T00:00:00.000Z"));
    }
    const productEntries = entries.filter((entry) => entry.url.includes("/products/"));
    for (const entry of productEntries) {
      const date = entry.url.endsWith("/st-hcac-gb-ua-ea") ? "2026-10-09T00:00:00.000Z" : "2026-10-08T00:00:00.000Z";
      expect(entry.lastModified).toEqual(new Date(date));
    }
  });
  it("includes every navigation destination, product, resource and application", () => {
    const urls = sitemap().map((entry) => entry.url);
    const paths = [...navItems.map((item) => item.href), "/interfaces", ...products.map((item) => `/products/${item.slug}`), ...resources.map((item) => `/resources/${item.slug}`), ...applicationExamples.map((item) => `/applications/${item.slug}`), ...interfaceTopics.map((item) => `/interfaces/${item.slug}`)];
    for (const path of paths) expect(urls).toContain(new URL(path, siteUrl).toString().replace(/\/$/, ""));
    const index = sitemap().find((entry) => entry.url === `${siteUrl}/project-cases`);
    expect(index?.lastModified).toEqual(new Date("2026-10-23T00:00:00.000Z"));
  });

  it("publishes crawlable product and application images", () => {
    const entries = sitemap();
    expect(entries.find((entry) => entry.url === `${siteUrl}/solutions`)?.images)
      .toEqual(applicationExamples.map((application) => new URL(application.image, siteUrl).toString()));
    const engineeringCaseImages = entries.find((entry) => entry.url === `${siteUrl}/project-cases`)?.images;
    expect(engineeringCaseImages).toHaveLength(6);
    expect(new Set(engineeringCaseImages).size).toBe(6);
    expect(engineeringCaseImages)
      .toEqual(engineeringCases.slice(0, 6).map((entry) => new URL(entry.image!.src, siteUrl).toString()));
    for (const product of products) {
      expect(entries.find((entry) => entry.url === `${siteUrl}/products/${product.slug}`)?.images)
        .toEqual([new URL(product.image, siteUrl).toString()]);
    }
    for (const application of applicationExamples) {
      expect(entries.find((entry) => entry.url === `${siteUrl}/applications/${application.slug}`)?.images)
        .toEqual([new URL(application.image, siteUrl).toString()]);
    }
    for (const imageUrl of entries.flatMap((entry) => entry.images || [])) {
      const pathname = new URL(imageUrl).pathname;
      expect(existsSync(join(process.cwd(), "public", pathname))).toBe(true);
    }
  });

});
