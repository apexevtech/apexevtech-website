import { describe, expect, it } from "vitest";
import { products, navItems } from "@/data/site";
import { resources } from "@/lib/resources/catalog";
import { siteUrl } from "@/lib/seo/site-urls";
import sitemap from "@/app/sitemap";
import { applicationExamples } from "@/data/applications";
import { interfaceTopics } from "@/data/interface-topics";

describe("sitemap", () => {
  it("contains unique canonical URLs with stable dates", () => {
    const entries = sitemap();
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    expect(entries.every((entry) => entry.lastModified instanceof Date)).toBe(true);
  });

  it("updates changed static pages while preserving unchanged dates", () => {
    const entries = sitemap();
    const updated = ["", "/products"];
    for (const route of updated) {
      expect(entries.find((entry) => entry.url === `${siteUrl}${route}`)?.lastModified)
        .toEqual(new Date("2026-09-16T00:00:00.000Z"));
    }
    for (const route of ["/about", "/contact", "/solutions"]) {
      expect(entries.find((entry) => entry.url === `${siteUrl}${route}`)?.lastModified)
        .toEqual(new Date("2026-09-18T00:00:00.000Z"));
    }
    expect(entries.find((entry) => entry.url === `${siteUrl}/applications`)?.lastModified)
      .toEqual(new Date("2026-09-21T00:00:00.000Z"));
    expect(entries.find((entry) => entry.url === `${siteUrl}/interfaces`)?.lastModified)
      .toEqual(new Date("2026-09-22T00:00:00.000Z"));
    for (const route of ["/privacy-policy"]) {
      expect(entries.find((entry) => entry.url === `${siteUrl}${route}`)?.lastModified)
        .toEqual(new Date("2026-09-11T00:00:00.000Z"));
    }
    const productEntries = entries.filter((entry) => entry.url.includes("/products/"));
    for (const entry of productEntries) {
      const date = "2026-09-18T00:00:00.000Z";
      expect(entry.lastModified).toEqual(new Date(date));
    }
  });
  it("includes every navigation destination, product, resource and application", () => {
    const urls = sitemap().map((entry) => entry.url);
    const paths = [...navItems.map((item) => item.href), "/interfaces", ...products.map((item) => `/products/${item.slug}`), ...resources.map((item) => `/resources/${item.slug}`), ...applicationExamples.map((item) => `/applications/${item.slug}`), ...interfaceTopics.map((item) => `/interfaces/${item.slug}`)];
    for (const path of paths) expect(urls).toContain(new URL(path, siteUrl).toString().replace(/\/$/, ""));
    const index = sitemap().find((entry) => entry.url === `${siteUrl}/resources`);
    const latestResourceDate = resources.reduce((latest, resource) => resource.modifiedAt > latest ? resource.modifiedAt : latest, resources[0].modifiedAt);
    expect(index?.lastModified).toEqual(new Date(`${latestResourceDate}T00:00:00.000Z`));
  });

});
