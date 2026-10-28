import { describe, expect, it } from "vitest";
import { parseInquiry } from "@/lib/inquiries/validation";
import { engineeringCases } from "@/data/engineering-cases";
import { readReferenceCaseInquiry } from "@/lib/inquiries/reference-case";
import { engineeringCaseDetailSlugs, getEngineeringCaseIndexHref } from "@/lib/engineering-cases/detail-path";

const validInput = {
  name: "  Ada Lovelace  ",
  email: "  ada@example.com  ",
  company: " Analytical Engines ",
  country: " United Kingdom ",
  message: "  Please quote the ST-HCDC-HPC system for our laboratory.  ",
  context: " ST-HCDC-HPC ",
  privacyAccepted: true,
  website: "",
  formStartedAt: Date.now() - 5000,
};

describe("parseInquiry", () => {
  it("keeps bounded inquiry details and excludes full URLs or query strings", () => {
    expect(parseInquiry({ ...validInput, sourcePage: "/resources/ccs2-dc-fast-charger-testing", configuration: " DC chargers " })).toMatchObject({
      value: { sourcePage: "/resources/ccs2-dc-fast-charger-testing", configuration: "DC chargers" },
    });
    for (const sourcePage of ["https://external.test/products", "/products?email=private@example.com", "/resources/../contact", "//external.test/products"]) {
      const result = parseInquiry({ ...validInput, sourcePage, configuration: "x".repeat(700) });
      expect(result.ok && !result.isBot && result.value.sourcePage).toBeUndefined();
      expect(result.ok && !result.isBot && result.value.configuration?.length).toBe(600);
    }
  });
  it("normalizes a valid inquiry", () => {
    expect(parseInquiry(validInput)).toEqual({
      ok: true,
      isBot: false,
      value: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        company: "Analytical Engines",
        country: "United Kingdom",
        message: "Please quote the ST-HCDC-HPC system for our laboratory.",
        context: "ST-HCDC-HPC",
        privacyAccepted: true,
      },
    });
  });

  it("retains only published reference-scenario source paths for inquiry delivery", () => {
    for (const slug of engineeringCaseDetailSlugs) {
      const reference = readReferenceCaseInquiry(new URLSearchParams({ case: slug, caseOrigin: "detail" }))!;
      expect(parseInquiry({ ...validInput, context: reference.context, message: reference.message, sourcePage: reference.sourcePage })).toMatchObject({ ok: true, isBot: false, value: { sourcePage: `/project-cases/${slug}`, context: reference.context } });
    }
    for (const entry of engineeringCases) {
      const reference = readReferenceCaseInquiry(new URLSearchParams({ case: entry.slug }))!;
      expect(reference.sourcePage).toBe(getEngineeringCaseIndexHref(entry.slug));
      expect(parseInquiry({ ...validInput, message: reference.message, context: reference.context, sourcePage: reference.sourcePage })).toMatchObject({ ok: true, isBot: false, value: { sourcePage: reference.sourcePage, context: reference.context } });
      expect(parseInquiry({ ...validInput, sourcePage: `/project-cases#${entry.slug}` })).toMatchObject({ ok: true, isBot: false, value: { sourcePage: `/project-cases#${entry.slug}` } });
    }
    for (const sourcePage of ["/project-cases#unknown", "/project-cases#ccs-charger-laboratory-testing?email=private@example.com", "/project-cases?email=private@example.com", "https://www.link-jl.com/project-cases#ccs-charger-laboratory-testing", "/project-cases?page=2#ccs-charger-laboratory-testing", "/project-cases?page=2#production-embedded-charger-testing", "/project-cases?page=3&email=private@example.com#production-embedded-charger-testing"]) {
      const result = parseInquiry({ ...validInput, sourcePage });
      expect(result.ok && !result.isBot && result.value.sourcePage).toBeUndefined();
    }
  });

  it("returns field errors for invalid required fields", () => {
    const result = parseInquiry({
      ...validInput,
      name: "A",
      email: "not-an-email",
      message: "short",
      privacyAccepted: false,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        message: expect.any(String),
        privacyAccepted: expect.any(String),
      });
    }
  });

  it("marks a populated honeypot as a bot before validating other fields", () => {
    expect(parseInquiry({ website: "https://spam.test" })).toEqual({ ok: true, isBot: true });
  });

  it("rejects non-object input and oversized fields", () => {
    expect(parseInquiry(null).ok).toBe(false);
    const result = parseInquiry({ ...validInput, message: "x".repeat(5001) });
    expect(result.ok).toBe(false);
  });

  it("marks submissions made too quickly as bots", () => {
    expect(parseInquiry({ ...validInput, formStartedAt: Date.now() - 100 })).toEqual({ ok: true, isBot: true });
  });

  it("returns a form error when the timestamp is missing", () => {
    const result = parseInquiry({ ...validInput, formStartedAt: undefined });
    expect(result).toEqual({ ok: false, fieldErrors: { form: "Please submit the form again." } });
  });
});
