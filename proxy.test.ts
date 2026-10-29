import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";
import { localizedPagePaths } from "@/lib/i18n/public-pages";
import { localizeHref } from "@/lib/i18n/urls";

const request = (path: string, method = "GET", headers?: Record<string, string>) => new NextRequest(`https://www.link-jl.com${path}`, { method, headers });

describe("public-page not-found guard", () => {
  it("leaves all 110 approved page URLs and their query states with Next", () => {
    for (const path of localizedPagePaths) {
      for (const language of ["en", "zh"] as const) {
        const response = proxy(request(`${localizeHref(path, language)}?page=2&apex_qa=1`));
        expect(response.headers.get("x-middleware-next"), `${language}:${path}`).toBe("1");
      }
    }
  });

  it("preserves legacy redirects, trailing slashes, APIs, assets and downloads", () => {
    for (const path of ["/resources", "/library", "/engineering-cases", "/applications", "/zh/resources", "/zh/library", "/zh/engineering-cases", "/zh/applications", "/zh/products/", "/api/inquiries", "/assets/apex-logo.webp", "/downloads/spec.pdf", "/_next/image", "/sitemap.xml", "/robots.txt"]) {
      expect(proxy(request(path)).headers.get("x-middleware-next"), path).toBe("1");
    }
  });

  it("allows equivalent encoded page segments without rewriting the requested URL", () => {
    for (const path of ["/products/%61st-9000", "/zh/products/%61st-9000", "/resources/%65vse-end-of-line-testing", "/zh/%70roducts/ast-9000"]) {
      const input = request(path);
      expect(proxy(input).headers.get("x-middleware-next"), path).toBe("1");
      expect(input.nextUrl.pathname).toBe(path);
    }
  });

  it("rejects encoded separators, double encoding and malformed percent escapes", () => {
    for (const path of ["/products/%2fast-9000", "/products/%5cast-9000", "/products/%2561st-9000", "/zh/products/%", "/zh/products/%E0%A4%A"]) {
      expect(proxy(request(path)).status, path).toBe(404);
    }
  });

  it("returns a full noindex bilingual 404 document for unknown dynamic pages", async () => {
    for (const path of ["/zh/not-a-real-page", "/zh/products/not-a-real-model", "/products/not-a-real-model", "/resources/unknown", "/applications/unknown", "/interfaces/unknown", "/project-cases/unknown", "/zh/zh/products", "/zh/api/inquiries"]) {
      const response = proxy(request(path));
      expect(response.status, path).toBe(404);
      expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
      const html = await response.text();
      expect(html).toContain("<h1>404</h1>");
      expect(html).toContain("未找到该页面");
      expect(html).toContain('href="/zh"');
      expect(html).not.toContain("NEXT_HTTP_ERROR_FALLBACK");
    }
  });

  it("returns no HEAD body and does not intercept write methods", async () => {
    const head = proxy(request("/zh/unknown", "HEAD"));
    expect(head.status).toBe(404);
    expect(await head.text()).toBe("");
    for (const method of ["POST", "PUT", "DELETE"]) expect(proxy(request("/zh/unknown", method)).headers.get("x-middleware-next")).toBe("1");
  });

  it("returns HTML for unknown RSC requests so the router can fall back to a document navigation", () => {
    const response = proxy(request("/zh/unknown", "GET", { RSC: "1" }));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("text/html");
  });
});
