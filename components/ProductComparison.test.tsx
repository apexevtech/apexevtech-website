import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { products } from "@/data/site";
import { getProductComparisonDetails } from "@/lib/products/comparison";
import { buildComparisonInquiryHref } from "@/lib/inquiries/catalog-scope";
import type { ProductFilters } from "@/lib/products/filter";
import { ProductComparison } from "./ProductComparison";

const locale = vi.hoisted(() => ({ chinese: false }));
vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  const t = (text: string) => translateText(text, locale.chinese ? "zh" : "en", messages);
  return { T: ({ children }: { children: ReactNode }) => typeof children === "string" ? t(children) : children, useLanguage: () => ({ t, language: locale.chinese ? "zh" : "en" }) };
});

const filters: ProductFilters = { type: "all", interface: "all", workflow: "all" };
const rowKeys = ["type", "interface", "electricalRange", "loadArrangement", "standards", "capabilities", "applications"] as const;
const renderComparison = (count: number, selectedFilters = filters) => renderToStaticMarkup(createElement(ProductComparison, {
  products,
  selectedSlugs: products.slice(0, count).map((product) => product.slug),
  filters: selectedFilters,
  ready: true,
  onChange: vi.fn(),
  onClear: vi.fn(),
}));
const escapeText = (text: string) => renderToStaticMarkup(createElement("span", null, text)).slice(6, -7);

describe("responsive product comparison", () => {
  beforeEach(() => { locale.chinese = false; });

  it.each([0, 1, 3])("protects all comparison controls from the floating contact action with %i models", (count) => {
    const html = renderComparison(count);
    const wrapper = html.match(/<section\b[^>]*><div data-floating-controls-visible="false" class="mx-auto max-w-7xl">([\s\S]*)<\/div><\/section>/);
    expect(wrapper).not.toBeNull();
    expect(html.match(/data-floating-controls-visible=/g)).toHaveLength(1);
    expect(wrapper![1]).toContain("Compare up to three test systems");
    expect(wrapper![1].match(/<select\b/g)).toHaveLength(3);
    if (count) {
      expect(wrapper![1]).toContain("data-product-comparison-scroll");
      expect(wrapper![1]).toContain("Discuss these products");
    } else {
      expect(wrapper![1]).toContain("Select at least one product to start the comparison.");
    }
  });

  it.each([1, 2, 3])("keeps one semantic table with stable tracks for %i selected models", (count) => {
    const html = renderComparison(count);
    expect(html.match(/<table\b/g)).toHaveLength(1);
    expect(html.match(/<col\b/g)).toHaveLength(count + 1);
    expect(html.match(/scope="col"/g)).toHaveLength(count + 1);
    expect(html.match(/scope="row"/g)).toHaveLength(rowKeys.length);
    expect(html.match(/<td\b/g)).toHaveLength(count * rowKeys.length);
    expect(html).toContain(`min-width:calc(var(--comparison-label-width) + ${count} * var(--comparison-model-width))`);
    expect(html).toContain("table-fixed border-separate border-spacing-0");
    expect(html).toContain("[--comparison-label-width:8rem]");
    expect(html).toContain("md:[--comparison-label-width:11rem]");
    expect(html).toContain('class="w-[var(--comparison-label-width)]"');
    for (const product of products.slice(0, count)) {
      expect(html).toContain(`href="/products/${product.slug}"`);
      expect(html).toContain(escapeText(product.model));
      expect(html).toContain(escapeText(product.title));
    }
  });

  it("bounds both scroll axes and exposes a translated keyboard-focusable region", () => {
    const html = renderComparison(3);
    const region = html.match(/<div\b[^>]*data-product-comparison-scroll[^>]*>/)![0];
    expect(region).toContain('role="region"');
    expect(region).toContain('aria-label="Selected test system specifications"');
    expect(region).toContain('aria-describedby="comparison-scroll-help"');
    expect(region).toContain('tabindex="0"');
    expect(region).toContain("max-h-[min(36rem,70svh)]");
    expect(region).toContain("overflow-auto");
    expect(region).toContain("focus-visible:ring-2");
    expect(region).toContain("scroll-pl-32");
    expect(region).toContain("md:scroll-pl-44");
    expect(region).toContain("[container-type:inline-size]");
    expect(html).toContain('<p id="comparison-scroll-help" class="sr-only">');
    locale.chinese = true;
    const chinese = renderComparison(3);
    expect(chinese).toContain('aria-label="所选测试系统技术参数"');
    expect(chinese).toContain("在小屏幕上可横向滚动表格，查看全部型号。");
    expect(chinese).toContain("系统类型");
    expect(chinese).not.toContain("Selected test system specifications");
  });

  it("stacks opaque sticky corner, model headers and row names without duplicating content", () => {
    const html = renderComparison(3);
    const corner = html.match(/<th\b[^>]*data-comparison-corner[^>]*>/)![0];
    expect(corner).toContain("sticky left-0 top-0 z-30");
    expect(corner).toContain("bg-[#102a43]");
    const headers = [...html.matchAll(/<th\b[^>]*data-comparison-model[^>]*>/g)];
    expect(headers).toHaveLength(3);
    for (const [header] of headers) {
      expect(header).toContain("sticky top-0 z-20");
      expect(header).toContain("bg-[#102a43]");
    }
    const rowHeaders = [...html.matchAll(/<th\b[^>]*data-comparison-row[^>]*>/g)];
    expect(rowHeaders).toHaveLength(rowKeys.length);
    for (const [header] of rowHeaders) {
      expect(header).toContain("sticky left-0 z-10");
      expect(header).toContain("bg-slate-50");
    }
    expect(html).toContain("relative isolate");
    for (const key of rowKeys) {
      expect(html.match(new RegExp(`id="comparison-row-${key}"`, "g"))).toHaveLength(1);
      for (const product of products.slice(0, 3)) {
        expect(html).toContain(`headers="comparison-row-${key} comparison-model-${product.slug}"`);
      }
    }
    for (const product of products.slice(0, 3)) expect(html.match(new RegExp(`id="comparison-model-${product.slug}"`, "g"))).toHaveLength(1);
  });

  it("allows long model names and specification text to wrap instead of truncating or widening tracks", () => {
    const html = renderComparison(3);
    const table = html.match(/<table\b[\s\S]*?<\/table>/)![0];
    expect(table).toContain('<span class="min-w-0 [overflow-wrap:anywhere]">ST-HCAC-GB / UA / EA</span>');
    expect(table).toContain("max-w-full items-center");
    const modelLinks = [...table.matchAll(/<a\b[^>]*>/g)];
    expect(modelLinks).toHaveLength(3);
    for (const [link] of modelLinks) expect(link).toContain('style="max-width:min(100%, calc(100cqw - var(--comparison-label-width) - 2rem))"');
    expect(table).toContain("focus-visible:ring-white");
    expect(table).not.toMatch(/truncate|line-clamp|whitespace-nowrap/);
    for (const product of products.slice(0, 3)) {
      for (const value of Object.values(getProductComparisonDetails(product))) expect(table).toContain(escapeText(value));
    }
  });

  it("fits each mobile model track beside the fixed row names while retaining the wide-screen fallback", () => {
    const html = renderComparison(3);
    const table = html.match(/<table\b[^>]*>/)![0];
    expect(table).toContain("[--comparison-model-width:15rem]");
    expect(table).toContain("supports-[width:1cqw]:[--comparison-model-width:min(15rem,calc(100cqw_-_var(--comparison-label-width)))]");
    expect(table).toContain("w-full table-fixed");
    expect(table).not.toContain("min-w-[760px]");
  });

  it("preserves the three-model limit and exact configuration handoff in both languages", () => {
    const selectedFilters: ProductFilters = { type: "ac", interface: "ccs2", workflow: "field" };
    const inquiryHref = buildComparisonInquiryHref(selectedFilters, products.slice(0, 3));
    for (const chinese of [false, true]) {
      locale.chinese = chinese;
      const html = renderComparison(4, selectedFilters);
      const href = `${chinese ? "/zh" : ""}${inquiryHref}`.replaceAll("&", "&amp;");
      expect(html.match(/data-comparison-model/g)).toHaveLength(3);
      expect(html).toContain(`href="${href}"`);
      const destination = new URL(`${chinese ? "/zh" : ""}${inquiryHref}`, "https://www.link-jl.com");
      expect(destination.pathname).toBe(chinese ? "/zh/contact" : "/contact");
      expect(destination.searchParams.get("sourcePage")).toBe("/products");
      expect(destination.searchParams.get("products")).toBe(products.slice(0, 3).map((product) => product.slug).join(","));
      expect(destination.hash).toBe("#inquiry-form");
      expect(html).not.toContain(`id="comparison-model-${products[3].slug}"`);
      expect(html).toContain(chinese ? "所选型号仅供候选评审，未必满足当前的全部要求。" : "Selected models are candidates for review and may not match every current requirement.");
    }
  });
});
