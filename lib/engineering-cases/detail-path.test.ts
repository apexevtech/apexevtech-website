import { describe, expect, it } from "vitest";
import { engineeringCases } from "@/data/engineering-cases";
import { defaultEngineeringCaseFilters, getEngineeringCasePage } from "@/lib/engineering-cases/filter";
import { engineeringCaseDetailSlugs, getEngineeringCaseDetailHref, getEngineeringCaseIndexHref, getEngineeringCaseMaterialDetailHref } from "./detail-path";

describe("engineering case detail paths", () => {
  it("does not treat unrelated material or inherited object keys as a brief", () => {
    for (const value of ["", "unknown", "__proto__", "constructor", "toString", "ccs2-laboratory-scope?title=claim"]) {
      expect(getEngineeringCaseMaterialDetailHref(value)).toBeUndefined();
    }
  });
  it("publishes only the three existing laboratory, field and EOL references", () => {
    expect(engineeringCaseDetailSlugs).toEqual([
      "ccs-charger-laboratory-testing",
      "vehicle-charger-field-diagnostics",
      "production-embedded-charger-testing",
    ]);
    expect(engineeringCaseDetailSlugs.map((slug) => engineeringCases.find((entry) => entry.slug === slug)?.id)).toEqual(["case-1", "case-2", "case-14"]);
    for (const entry of engineeringCases) {
      const expected = engineeringCaseDetailSlugs.some((slug) => slug === entry.slug) ? `/project-cases/${entry.slug}` : undefined;
      expect(getEngineeringCaseDetailHref(entry.slug)).toBe(expected);
    }
  });

  it("rejects arbitrary, non-exact and URL-shaped detail slugs", () => {
    for (const slug of ["", "unknown", "__proto__", "../contact", "ccs-charger-laboratory-testing/", "CCS-CHARGER-LABORATORY-TESTING", "ccs-charger-laboratory-testing?title=claim", "https://example.com"]) {
      expect(getEngineeringCaseDetailHref(slug), slug).toBeUndefined();
      expect(getEngineeringCaseIndexHref(slug), slug).toBe("/project-cases");
    }
  });

  it("returns an unfiltered six-item index page containing the requested reference and its anchor", () => {
    for (const entry of engineeringCases) {
      const url = new URL(getEngineeringCaseIndexHref(entry.slug), "https://www.link-jl.com");
      const pageNumber = Number(url.searchParams.get("page") ?? 1);
      expect(url.pathname).toBe("/project-cases");
      expect(url.hash).toBe(`#${entry.slug}`);
      expect([...url.searchParams.keys()]).toEqual(pageNumber === 1 ? [] : ["page"]);
      const page = getEngineeringCasePage({ ...defaultEngineeringCaseFilters, page: pageNumber });
      expect(page.items.some((item) => item.slug === entry.slug), entry.slug).toBe(true);
      expect(page.items).toHaveLength(6);
    }
    expect(getEngineeringCaseIndexHref("ccs-charger-laboratory-testing")).toBe("/project-cases#ccs-charger-laboratory-testing");
    expect(getEngineeringCaseIndexHref("production-embedded-charger-testing")).toBe("/project-cases?page=3#production-embedded-charger-testing");
  });
});
