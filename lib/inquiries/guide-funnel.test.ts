import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { resources } from "@/data/resources";
import { resourceEquipmentPaths } from "@/data/resource-equipment";
import { buildCatalogInquiryHref, readCatalogInquiryConfiguration } from "./catalog-scope";
import { resolveInquiryPrefill } from "./prefill";
import { parseInquiry } from "./validation";
import { buildInquiryEmail } from "./email";
import { buildResourceStructuredData } from "@/lib/seo/resource-structured-data";

const guides = [
  ["ccs2-dc-fast-charger-testing", "CCS2 / ISO 15118"],
  ["field-commissioning-test-equipment", "Field commissioning"],
  ["evse-end-of-line-testing", "Production / end-of-line"],
] as const;

describe("priority guide inquiry funnel", () => {
  for (const [slug, scope] of guides) {
    it(`preserves ${slug} scope through an edited inquiry and email`, () => {
      const url = new URL(buildCatalogInquiryHref(resourceEquipmentPaths[slug].inquiryFilters!, `/resources/${slug}`), "https://www.link-jl.com");
      const prefill = resolveInquiryPrefill(url.searchParams, {
        context: "Website contact page", prefillProductsFromQuery: true, prefillContextFromQuery: true,
      }, products);
      expect(prefill.message).toContain(scope);
      const now = Date.now();
      const result = parseInquiry({
        name: "Local QA", email: "qa@example.com", message: "My edited requirements replace the automatic draft.",
        context: prefill.context, sourcePage: url.searchParams.get("sourcePage"),
        configuration: readCatalogInquiryConfiguration(url.searchParams),
        privacyAccepted: true, website: "", formStartedAt: now - 5000,
      }, now);
      if (!result.ok || result.isBot) throw new Error("Expected a valid inquiry");
      const email = buildInquiryEmail(result.value);
      expect(email.text).toContain(`Source page: /resources/${slug}`);
      expect(email.text).toContain(scope);
      expect(email.text).toContain("My edited requirements replace the automatic draft.");
      expect(email.text).not.toContain("I would like equipment recommendations for these requirements.");
      expect(email.html).toContain(`/resources/${slug}`);
      expect(email.html).toContain(scope);
    });

    it(`keeps ${slug} canonical identity and structured dates aligned`, () => {
      const guide = resources.find((resource) => resource.slug === slug)!;
      const { articleData, breadcrumbData } = buildResourceStructuredData(guide, "https://www.link-jl.com");
      expect(articleData.url).toBe(`https://www.link-jl.com/resources/${slug}`);
      expect(articleData.dateModified).toBe(guide.modifiedAt);
      expect(articleData.headline).toBe(guide.title);
      expect(breadcrumbData.itemListElement.at(-1)?.item).toBe(articleData.url);
      for (const row of guide.decisionTable!.rows) {
        expect(row).toHaveLength(3);
        expect(row.every((cell) => cell.trim().length > 0)).toBe(true);
      }
    });
  }
});
