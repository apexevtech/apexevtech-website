import { describe, expect, it } from "vitest";
import { getResource, getProductResources, resources } from "@/lib/resources/catalog";
import { solutionLinks } from "@/data/solution-links";
import { solutions } from "@/data/site";
import { products } from "@/data/site";

describe("resource catalog", () => {
  it("gives every product reciprocal article links and an anchored application solution", () => {
    for (const product of products) {
      expect(getProductResources(product.slug).length).toBeGreaterThan(0);
      expect(Object.values(solutionLinks).some((links) => links.productSlugs.includes(product.slug))).toBe(true);
    }
    for (const [slug, links] of Object.entries(solutionLinks)) {
      expect(solutions.some((solution) => solution.slug === slug)).toBe(true);
      expect(links.productSlugs.every((slug) => products.some((product) => product.slug === slug))).toBe(true);
      expect(links.resourceSlugs.every((slug) => getResource(slug))).toBe(true);
    }
  });
  it("provides a unique, internally connected content cluster", () => {
    expect(resources).toHaveLength(17);
    expect(new Set(resources.map((item) => item.slug)).size).toBe(resources.length);
    for (const resource of resources) {
      expect(resource.summaryAnswer.length).toBeGreaterThan(80);
      expect(resource.relatedResourceSlugs.length).toBeGreaterThanOrEqual(2);
      expect(resource.relatedProductSlugs.length).toBeGreaterThanOrEqual(1);
      expect(resource.relatedResourceSlugs.every((slug) => getResource(slug))).toBe(true);
    }
  });

  it("covers the highest-impression charger testing topics with dedicated guides", () => {
    expect(getResource("ev-charger-testing-guide")?.title).toMatch(/EV Charger Testing/);
    expect(getResource("dc-fast-charger-testing-guide")?.title).toMatch(/DC Fast Charger Testing/);
    expect(getResource("choose-ev-charger-test-system")?.title).toMatch(/^EV Charger Test System/);
    expect(getResource("post-installation-evse-testing")?.topic).toBe("EVSE testing after commissioning");
    expect(getResource("post-installation-evse-testing")?.title).toMatch(/^EVSE Testing After Commissioning/);
    expect(getResource("ev-charging-protocol-testing")?.title).toMatch(/eMobility.*Protocol Testing/);
    expect(getResource("ac-vs-dc-evse-testing")?.title).toMatch(/^AC Charger Testing/);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getResource("missing")).toBeUndefined();
  });

  it("gives every resource distinct, substantial content", () => {
    const sectionFingerprints = resources.map((resource) => JSON.stringify(resource.sections));
    const faqFingerprints = resources.map((resource) => JSON.stringify(resource.faqs));

    expect(new Set(sectionFingerprints).size).toBe(resources.length);
    expect(new Set(faqFingerprints).size).toBe(resources.length);
    for (const resource of resources) {
      expect(resource.sections.length).toBeGreaterThanOrEqual(3);
      expect(resource.sections.flatMap((section) => section.paragraphs).join(" ").length).toBeGreaterThan(500);
      expect(resource.modifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Date.parse(resource.modifiedAt)).toBeGreaterThanOrEqual(Date.parse(resource.publishedAt));
    }
  });

  it("only links resources to products that exist", () => {
    const productSlugs = new Set(products.map((product) => product.slug));

    for (const resource of resources) {
      expect(resource.relatedProductSlugs.every((slug) => productSlugs.has(slug))).toBe(true);
    }
  });
});
