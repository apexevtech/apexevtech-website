import { describe, expect, it } from "vitest";
import { engineeringCases } from "@/data/engineering-cases";
import { engineeringCaseDetailSlugs } from "@/lib/engineering-cases/detail-path";
import { buildReferenceCaseInquiryHref, isReferenceCaseInquirySourcePage, readReferenceCaseInquiry } from "./reference-case";

describe("reference scenario inquiry links", () => {
  it("preserves detail-page attribution only for published briefs and an exact origin flag", () => {
    for (const slug of engineeringCaseDetailSlugs) {
      const url = new URL(buildReferenceCaseInquiryHref(slug, "detail"), "https://www.link-jl.com");
      expect(url.searchParams.get("caseOrigin")).toBe("detail");
      expect(readReferenceCaseInquiry(url.searchParams)?.sourcePage).toBe(`/project-cases/${slug}`);
      expect(isReferenceCaseInquirySourcePage(`/project-cases/${slug}`)).toBe(true);
      for (const origin of ["", "unknown", "/project-cases/other", "https://example.com", "detail&caseOrigin=detail"]) {
        const params = new URLSearchParams(`case=${slug}&caseOrigin=${origin}`);
        expect(readReferenceCaseInquiry(params)?.sourcePage).toBe(`/project-cases#${slug}`);
      }
    }
    const unexpanded = engineeringCases.find((entry) => !engineeringCaseDetailSlugs.some((slug) => slug === entry.slug))!;
    const url = new URL(buildReferenceCaseInquiryHref(unexpanded.slug, "detail"), "https://www.link-jl.com");
    expect(url.searchParams.has("caseOrigin")).toBe(false);
    expect(readReferenceCaseInquiry(new URLSearchParams({ case: unexpanded.slug, caseOrigin: "detail" }))?.sourcePage).toBe(`/project-cases#${unexpanded.slug}`);
    expect(isReferenceCaseInquirySourcePage(`/project-cases/${unexpanded.slug}`)).toBe(false);
    expect(isReferenceCaseInquirySourcePage(`/project-cases/${engineeringCaseDetailSlugs[0]}?email=private@example.com`)).toBe(false);
  });
  it("round trips every published reference using only its local slug", () => {
    for (const entry of engineeringCases) {
      const url = new URL(buildReferenceCaseInquiryHref(entry.slug), "https://www.link-jl.com");
      expect(url.pathname).toBe("/contact");
      expect(url.hash).toBe("#inquiry-form");
      expect([...url.searchParams.keys()]).toEqual(["case"]);
      const result = readReferenceCaseInquiry(url.searchParams)!;
      expect(result.slug).toBe(entry.slug);
      expect(result.title).toBe(entry.title);
      expect(result.technicalFocus).toEqual(entry.technicalFocus);
      expect(result.context).toBe(`Reference scenario inquiry: ${entry.title}`);
      expect(result.sourcePage).toBe(`/project-cases#${entry.slug}`);
      expect(isReferenceCaseInquirySourcePage(result.sourcePage)).toBe(true);
      expect(result.message).toContain(entry.title);
      expect(result.message).toContain("not a verified APEX delivery record");
      expect(result.message).toContain("Voltage and current range:");
      expect(result.message).not.toMatch(/delivered by APEX|APEX customer|successful APEX project/i);
    }
  });

  it("ignores user-supplied titles, contexts and source paths for a valid reference", () => {
    const entry = engineeringCases[0];
    const params = new URLSearchParams({ case: entry.slug, title: "Fake customer", context: "APEX delivery claim", sourcePage: "https://example.com/not-a-project", message: "Injected text" });
    const result = readReferenceCaseInquiry(params)!;
    expect(result.context).toBe(`Reference scenario inquiry: ${entry.title}`);
    expect(result.sourcePage).toBe(`/project-cases#${entry.slug}`);
    expect(JSON.stringify(result)).not.toMatch(/Fake customer|APEX delivery claim|example\.com|Injected text/);
  });

  it("rejects unknown, empty, duplicate and non-slug values", () => {
    for (const query of ["", "case=", "case=unknown", "case=..%2Fcontact", "case=https%3A%2F%2Fexample.com", `case=${engineeringCases[0].slug}&case=${engineeringCases[1].slug}`, `case=${engineeringCases[0].slug}&case=${engineeringCases[0].slug}`, "case=__proto__"]) {
      expect(readReferenceCaseInquiry(new URLSearchParams(query)), query).toBeNull();
    }
    expect(buildReferenceCaseInquiryHref("unknown")).toBe("/contact#inquiry-form");
    for (const source of ["/project-cases#unknown", "/project-cases#", "/project-cases?case=unknown", "https://www.link-jl.com/project-cases#ccs-charger-laboratory-testing", "/project-cases#ccs-charger-laboratory-testing?email=private@example.com"]) expect(isReferenceCaseInquirySourcePage(source)).toBe(false);
  });
});
