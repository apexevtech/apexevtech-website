import { describe, expect, it } from "vitest";
import { legacyRedirects } from "@/lib/seo/redirects";

describe("legacy redirects", () => {
  it("merges only the application index while preserving detail routes", () => {
    expect(legacyRedirects.find(({ source }) => source === "/applications")).toEqual({
      source: "/applications", destination: "/solutions#application-architectures", permanent: true,
    });
    expect(legacyRedirects.filter(({ source }) => source.startsWith("/applications"))).toHaveLength(1);
  });

  it("uses the query-preserving framework redirect for the Chinese application index", () => {
    expect(legacyRedirects.find(({ source }) => source === "/zh/applications")).toEqual({
      source: "/zh/applications", destination: "/zh/solutions#application-architectures", permanent: true,
    });
    expect(legacyRedirects.filter(({ source }) => source.startsWith("/zh/applications"))).toHaveLength(1);
  });

  it("permanently maps every legacy product document to a clean download URL", () => {
    const documentRedirects = legacyRedirects.filter(({ source }) => source.startsWith("/product-documents/"));
    expect(documentRedirects).toHaveLength(12);
    expect(documentRedirects.every(({ destination, permanent }) =>
      destination.startsWith("/downloads/") && destination.endsWith("-specifications.docx") && permanent,
    )).toBe(true);
    expect(new Set(documentRedirects.map(({ destination }) => destination)).size).toBe(12);
  });

  it("permanently maps legacy product image filenames to descriptive ASCII URLs", () => {
    const imageRedirects = legacyRedirects.filter(({ source }) => source.startsWith("/assets/products/"));
    expect(imageRedirects).toHaveLength(7);
    expect(imageRedirects.every(({ destination, permanent }) =>
      destination.startsWith("/assets/products/") && /^[\x00-\x7F]+$/.test(destination) && permanent,
    )).toBe(true);
  });
});
