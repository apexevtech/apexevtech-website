import { describe, expect, it } from "vitest";
import { applicationExamples } from "@/data/applications";
import { buildApplicationIndexStructuredData, buildApplicationStructuredData } from "@/lib/seo/application-structured-data";

describe("application structured data", () => {
  it("builds a technical article and canonical breadcrumb trail", () => {
    const application = applicationExamples[0];
    const { articleData, breadcrumbData } = buildApplicationStructuredData(application, "https://example.com/");
    const url = `https://example.com/applications/${application.slug}`;
    expect(articleData["@type"]).toBe("TechArticle");
    expect(articleData.mainEntityOfPage).toBe(url);
    expect(articleData.dateModified).toBe(application.modifiedAt);
    expect(breadcrumbData.itemListElement.map((item) => item.item)).toEqual(["https://example.com/", "https://example.com/applications", url]);
  });

  it("lists every application once on the index", () => {
    const data = buildApplicationIndexStructuredData(applicationExamples, "https://example.com/");
    expect(data.numberOfItems).toBe(applicationExamples.length);
    expect(data.itemListElement.map((item) => item.position)).toEqual([1, 2, 3, 4]);
    expect(new Set(data.itemListElement.map((item) => item.url)).size).toBe(applicationExamples.length);
  });
});
