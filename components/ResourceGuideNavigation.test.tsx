import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResourcePage from "@/app/resources/[slug]/page";
import { ResourceBrowser } from "@/components/ResourceBrowser";
import { resources } from "@/lib/resources/catalog";
import { getResourceGuideIndexHref } from "@/lib/navigation/resource-hash";
import { parseResourceBrowserFilters } from "@/lib/resources/browser";

const locale = vi.hoisted(() => ({ chinese: false }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => { throw new Error("not found"); },
}));
vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  const t = (text: string) => translateText(text, locale.chinese ? "zh" : "en", messages);
  return { T: ({ children }: { children: ReactNode }) => typeof children === "string" ? t(children) : children, useLanguage: () => ({ t, language: locale.chinese ? "zh" : "en" }) };
});

describe("guide collection navigation", () => {
  beforeEach(() => { locale.chinese = false; });

  it("links every visible guide breadcrumb to technical materials containing that guide without JavaScript", async () => {
    for (const resource of resources) {
      const href = getResourceGuideIndexHref(resource.slug);
      const article = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) }));
      const breadcrumb = article.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];
      expect(breadcrumb).toContain(`href="${href.replaceAll("&", "&amp;")}"`);
      expect(breadcrumb).toContain("Technical materials");
      expect(breadcrumb).not.toContain(">Project Cases<");
      const destination = new URL(href, "https://www.link-jl.com");
      const gallery = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: parseResourceBrowserFilters(destination.searchParams) }));
      expect(gallery).toContain(`id="${destination.hash.slice(1)}"`);
      expect(gallery).toContain(`href="/resources/${resource.slug}"`);
    }
  });

  it("uses the existing Chinese collection label without changing the return destination", async () => {
    locale.chinese = true;
    const resource = resources.at(-1)!;
    const article = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: resource.slug }) }));
    const breadcrumb = article.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];
    expect(breadcrumb).toContain("技术资料");
    expect(breadcrumb).toContain(`href="${getResourceGuideIndexHref(resource.slug).replaceAll("&", "&amp;")}"`);
    expect(breadcrumb).not.toContain("Technical materials");
  });
});
