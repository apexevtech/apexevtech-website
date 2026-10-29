import { createElement, isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SiteDocument from "@/components/SiteDocument";
import { T } from "@/components/LanguageProvider";
import { localizedPagePaths } from "@/lib/i18n/public-pages";
import { getPublicPageMetadata, renderPublicPage, type PublicPageSearchParams } from "@/lib/i18n/page-dispatch";
import { localizeHref } from "@/lib/i18n/urls";
import { siteUrl } from "@/lib/seo/site-urls";
import ChinesePage, { generateMetadata, generateStaticParams, dynamicParams } from "@/app/zh/[[...path]]/page";
import { metadata as englishRootMetadata } from "@/app/(en)/layout";
import { metadata as chineseRootMetadata } from "@/app/zh/layout";
import GlobalNotFound, { metadata as globalNotFoundMetadata } from "@/app/global-not-found";
import ChineseApplicationsPage from "@/app/zh/applications/page";
import { GET as resourcesRedirect } from "@/app/resources/route";
import { GET as chineseResourcesRedirect } from "@/app/zh/resources/route";
import { GET as libraryRedirect } from "@/app/library/route";
import { GET as chineseLibraryRedirect } from "@/app/zh/library/route";
import { GET as casesRedirect } from "@/app/engineering-cases/route";
import { GET as chineseCasesRedirect } from "@/app/zh/engineering-cases/route";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => { throw new Error("not found"); },
  permanentRedirect: (href: string) => { throw new Error(`redirect:${href}`); },
}));

function unreadSearchParams() {
  return { then: () => { throw new Error("Static page read request search params"); } } as unknown as Promise<PublicPageSearchParams>;
}

describe("independent English and Chinese routes", () => {
  it("statically enumerates exactly the approved Chinese counterparts including the home page", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(55);
    expect(params.map(({ path }) => `/${path.join("/")}`)).toEqual(localizedPagePaths);
    expect(params[0]).toEqual({ path: [] });
    expect(dynamicParams).toBe(false);
  });

  it("keeps static counterparts independent of request search params", async () => {
    for (const path of localizedPagePaths.filter((path) => path !== "/project-cases")) {
      const params = Promise.resolve({ path: path === "/" ? [] : path.slice(1).split("/") });
      const searchParams = unreadSearchParams();
      expect(isValidElement(await ChinesePage({ params, searchParams })), path).toBe(true);
      const metadata = await generateMetadata({ params, searchParams });
      expect(metadata.alternates?.canonical, path).toBe(localizeHref(path, "zh"));
    }
  });

  it("uses each original page's metadata rather than inheriting the Chinese home canonical", async () => {
    for (const path of localizedPagePaths) {
      const english = await getPublicPageMetadata(path, "en");
      const chinese = await getPublicPageMetadata(path, "zh");
      expect(english.alternates?.canonical, path).toBe(path);
      expect(chinese.alternates?.canonical, path).toBe(localizeHref(path, "zh"));
      expect(chinese.alternates?.languages).toEqual({
        en: new URL(path, siteUrl).toString(),
        "zh-Hans": new URL(localizeHref(path, "zh"), siteUrl).toString(),
        "x-default": new URL(path, siteUrl).toString(),
      });
      expect(chinese.title, path).not.toEqual(english.title);
      expect(chinese.description, path).not.toEqual(english.description);
    }
    expect(englishRootMetadata.alternates?.canonical).toBe("/");
    expect(chineseRootMetadata.alternates?.canonical).toBe("/zh");
  });

  it("passes query state only to the project collection and preserves its canonical pagination", async () => {
    const searchParams = Promise.resolve({ section: "resources", type: "guides", page: "2", apex_qa: "1" });
    const content = await renderPublicPage("/project-cases", searchParams);
    const html = renderToStaticMarkup(content);
    expect(html).toContain('name="resource-type"');
    expect(html).toContain("7-12 of 22 materials");
    const filteredMetadata = await getPublicPageMetadata("/project-cases", "zh", searchParams);
    expect(filteredMetadata.alternates?.canonical).toBe("/zh/project-cases?section=resources");
    const pageMetadata = await getPublicPageMetadata("/project-cases", "zh", Promise.resolve({ section: "resources", page: "2" }));
    expect(pageMetadata.alternates?.canonical).toBe("/zh/project-cases?section=resources&page=2");
  });

  it.each(["en", "zh"] as const)("server-renders the %s document, content, navigation and schema in one language", async (language) => {
    const content = createElement("h1", null, createElement(T, null, "Products"));
    const html = renderToStaticMarkup(await SiteDocument({ language, children: content }));
    expect(html).toContain(`<html lang="${language === "zh" ? "zh-CN" : "en"}"`);
    expect(html).toContain(`<h1>${language === "zh" ? "产品" : "Products"}</h1>`);
    expect(html).toContain(`href="${language === "zh" ? "/zh/products" : "/products"}"`);
    expect(html).toContain('id="main-content" tabindex="-1"');
    expect(html).toContain('href="#main-content"');
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain(`"url":"${new URL(language === "zh" ? "/zh" : "/", siteUrl).toString().replace(/\/$/, "")}`);
    expect(html).not.toContain('src="https://www.googletagmanager.com');
  });

  it("server-renders a full Chinese guide without waiting for a client translation effect", async () => {
    const content = await renderPublicPage("/resources/choose-ev-charger-test-system");
    const html = renderToStaticMarkup(await SiteDocument({ language: "zh", children: content }));
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)![1];
    expect(h1).toMatch(/[\u3400-\u9fff]/);
    expect(h1).not.toContain("EV Charger Test System Selection");
    expect(html).toContain('href="/zh/resources/prepare-ev-charger-standards-validation"');
    expect(html).toContain('href="/zh/products/ast-9000"');
    expect(html).toContain('"inLanguage":"zh-Hans"');
    expect(html).toContain('"mainEntityOfPage":"https://www.link-jl.com/zh/resources/choose-ev-charger-test-system"');
  });

  it("rejects unknown paths instead of falling back to an English page with status 200", async () => {
    for (const path of ["/unknown", "/products/unknown", "/resources/__proto__", "/zh/products", "/api/inquiries"]) {
      await expect(renderPublicPage(path)).rejects.toThrow("not found");
      await expect(getPublicPageMetadata(path, "zh")).rejects.toThrow("not found");
    }
  });

  it("provides a complete noindex error document for unmatched routes without needing a root layout", () => {
    const html = renderToStaticMarkup(createElement(GlobalNotFound));
    expect(html).toContain('<html lang="en">');
    expect(html).toContain(">404</h1>");
    expect(html).toContain("未找到该页面");
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/zh"');
    expect(globalNotFoundMetadata.robots).toEqual({ index: false, follow: true });
  });

  it.each([
    { path: "/resources?type=guides&page=2&utm_source=mail&utm_source=partner", english: resourcesRedirect, chinese: chineseResourcesRedirect },
    { path: "/library?view=solutions&page=2&q=CCS2&utm_source=mail&utm_source=partner", english: libraryRedirect, chinese: chineseLibraryRedirect },
    { path: "/engineering-cases?category=vehicle-manufacturers&page=2&utm_source=mail&utm_source=partner", english: casesRedirect, chinese: chineseCasesRedirect },
  ])("localizes the legacy $path redirect without changing its normalization or query data", ({ path, english, chinese }) => {
    const original = english(new Request(`https://example.com${path}`));
    const localized = chinese(new Request(`https://example.com/zh${path}`));
    const originalDestination = new URL(original.headers.get("location")!);
    const destination = new URL(localized.headers.get("location")!);
    expect(localized.status).toBe(original.status);
    expect(destination.origin).toBe(originalDestination.origin);
    expect(destination.pathname).toBe(localizeHref(originalDestination.pathname, "zh"));
    expect(destination.search).toBe(originalDestination.search);
    expect(destination.hash).toBe(originalDestination.hash);
    expect(destination.searchParams.getAll("utm_source")).toEqual(["mail", "partner"]);
  });

  it("keeps the Chinese applications alias in the Chinese solutions interface", () => {
    expect(() => ChineseApplicationsPage()).toThrow("redirect:/zh/solutions#application-architectures");
  });
});
