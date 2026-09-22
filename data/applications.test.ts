import { describe, expect, it } from "vitest";
import { applicationExamples, getApplicationExample, getProductApplications, getResourceApplications } from "@/data/applications";
import { products } from "@/data/site";
import { getResource } from "@/lib/resources/catalog";

describe("application examples", () => {
  it("provides four unique, substantial reference architectures", () => {
    expect(applicationExamples).toHaveLength(4);
    expect(new Set(applicationExamples.map((application) => application.slug)).size).toBe(applicationExamples.length);
    for (const application of applicationExamples) {
      expect(application.configuration.length).toBeGreaterThanOrEqual(4);
      expect(application.workflow.length).toBeGreaterThanOrEqual(5);
      expect(application.outputs.length).toBeGreaterThanOrEqual(4);
      expect(application.confirmBeforeProject.length).toBeGreaterThanOrEqual(4);
      expect(getApplicationExample(application.slug)).toBe(application);
    }
  });

  it("only links to published products and resources", () => {
    const productSlugs = new Set(products.map((product) => product.slug));
    for (const application of applicationExamples) {
      expect(application.relatedProductSlugs.every((slug) => productSlugs.has(slug))).toBe(true);
      expect(application.relatedResourceSlugs.every((slug) => getResource(slug))).toBe(true);
    }
    for (const product of products) {
      expect(getProductApplications(product.slug).length).toBeGreaterThan(0);
    }
    for (const application of applicationExamples) {
      for (const slug of application.relatedResourceSlugs) {
        expect(getResourceApplications(slug)).toContain(application);
      }
    }
  });
});
