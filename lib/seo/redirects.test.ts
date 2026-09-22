import { describe, expect, it } from "vitest";
import { legacyRedirects } from "@/lib/seo/redirects";

describe("legacy redirects", () => {
  it("permanently maps every legacy product document to a clean download URL", () => {
    const documentRedirects = legacyRedirects.filter(({ source }) => source.startsWith("/product-documents/"));
    expect(documentRedirects).toHaveLength(12);
    expect(documentRedirects.every(({ destination, permanent }) =>
      destination.startsWith("/downloads/") && destination.endsWith("-specifications.docx") && permanent,
    )).toBe(true);
    expect(new Set(documentRedirects.map(({ destination }) => destination)).size).toBe(12);
  });
});
