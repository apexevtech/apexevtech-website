import { describe, expect, it } from "vitest";
import { getPathLanguage, localizeHref, stripLanguagePrefix } from "./urls";

describe("language URLs", () => {
  it("recognizes only the complete Chinese path prefix", () => {
    for (const path of ["/zh", "/zh/", "/zh/products", "/zh?x=1", "/zh#top"]) expect(getPathLanguage(path)).toBe("zh");
    for (const path of ["/", "/products", "/zh-cn", "/zhang", "https://example.com/zh"]) expect(getPathLanguage(path)).toBe("en");
    expect(stripLanguagePrefix("/zh")).toBe("/");
    expect(stripLanguagePrefix("/zh/products/ast-9000")).toBe("/products/ast-9000");
    expect(stripLanguagePrefix("/zhang")).toBe("/zhang");
  });

  it("preserves query and hash bytes while changing known HTML paths", () => {
    const suffix = "?q=CAN%20%26+PLC&page=2&utm_source=qa#material-evse";
    expect(localizeHref(`/project-cases${suffix}`, "zh")).toBe(`/zh/project-cases${suffix}`);
    expect(localizeHref(`/zh/project-cases${suffix}`, "en")).toBe(`/project-cases${suffix}`);
    expect(localizeHref(`/zh/project-cases${suffix}`, "zh")).toBe(`/zh/project-cases${suffix}`);
    expect(localizeHref("/#main", "zh")).toBe("/zh#main");
    expect(localizeHref("/zh#main", "en")).toBe("/#main");
    for (const path of ["/resources", "/library", "/engineering-cases", "/applications", "/resources/evse-testing", "/contact", "/privacy-policy"]) {
      expect(localizeHref(path, "zh")).toBe(`/zh${path}`);
    }
  });

  it("does not prefix relative references, external URLs or non-page routes", () => {
    for (const href of ["#inquiry-form", "?page=2", "products", "https://www.link-jl.com/products", "//example.com/products", "mailto:sales@example.com", "tel:+86123", "/api/inquiries", "/assets/products/a.webp", "/downloads/a.docx", "/product-documents/a.docx", "/_next/image?url=x", "/sitemap.xml", "/robots.txt", "/unknown", "/products/a/b", "/resources/file.pdf"]) {
      expect(localizeHref(href, "zh")).toBe(href);
    }
  });
});
