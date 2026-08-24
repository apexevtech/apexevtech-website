import { describe, expect, it } from "vitest";
import { parseInquiry } from "@/lib/inquiries/validation";

const validInput = {
  name: "  Ada Lovelace  ",
  email: "  ada@example.com  ",
  phone: " +44 20 0000 0000 ",
  company: " Analytical Engines ",
  country: " United Kingdom ",
  message: "  Please quote the ST-HCDC-HPC system for our laboratory.  ",
  context: " ST-HCDC-HPC ",
  privacyAccepted: true,
  website: "",
  formStartedAt: Date.now() - 5000,
};

describe("parseInquiry", () => {
  it("normalizes a valid inquiry", () => {
    expect(parseInquiry(validInput)).toEqual({
      ok: true,
      isBot: false,
      value: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "+44 20 0000 0000",
        company: "Analytical Engines",
        country: "United Kingdom",
        message: "Please quote the ST-HCDC-HPC system for our laboratory.",
        context: "ST-HCDC-HPC",
        privacyAccepted: true,
      },
    });
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
});
