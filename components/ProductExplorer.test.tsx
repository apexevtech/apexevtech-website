import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { products } from "@/data/site";
import { ProductCatalog } from "./ProductCatalog";
import { ProductCatalogSection } from "./ProductCatalogSection";
import { ProductComparison } from "./ProductComparison";
import { ProductExplorer } from "./ProductExplorer";
import HomePage from "@/app/page";
import type { ProductFilters } from "@/lib/products/filter";
import { buildCatalogInquiryHref } from "@/lib/inquiries/catalog-scope";

const locale = vi.hoisted(() => ({ chinese: false }));
vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  const t = (text: string) => translateText(text, locale.chinese ? "zh" : "en", messages);
  return { T: ({ children }: { children: ReactNode }) => typeof children === "string" ? t(children) : children, useLanguage: () => ({ t, language: locale.chinese ? "zh" : "en" }) };
});
vi.mock("@/components/QueryStateSync", () => ({ QueryStateSync: () => null }));

const controls = (selectedSlugs: string[], ready = true) => ({ selectedSlugs, ready, onToggle: vi.fn(), onClear: vi.fn() });
const defaultFilters: ProductFilters = { type: "all", interface: "all", workflow: "all" };
const renderCatalog = (selectedSlugs: string[], ready = true) => renderToStaticMarkup(createElement(ProductCatalog, { products, eyebrow: "Matching equipment", title: "Compare specifications and configuration boundaries", comparison: controls(selectedSlugs, ready) }));

describe("catalog comparison selection", () => {
  beforeEach(() => { locale.chinese = false; });

  it("places model-labelled comparison controls outside product links", () => {
    const html = renderCatalog([]);
    expect(html.match(/type="checkbox"/g)).toHaveLength(products.length);
    for (const product of products) {
      expect(html).toContain(`data-catalog-product="${product.slug}"`);
      expect(html).toContain(`href="/products/${product.slug}"`);
      expect(html).toContain(`aria-label="Add to comparison: ${product.model}"`);
    }
    for (const link of html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)) expect(link[0]).not.toMatch(/<input\b|<button\b/);
    expect(html).not.toMatch(/type="checkbox"[^>]*disabled/);
  });

  it("keeps selected models removable and disables only unselected models at the limit", () => {
    const html = renderCatalog(products.slice(0, 3).map((product) => product.slug));
    const inputs = [...html.matchAll(/<input\b[^>]*type="checkbox"[^>]*>/g)].map(([input]) => input);
    expect(inputs.filter((input) => input.includes("checked=\"\""))).toHaveLength(3);
    expect(inputs.filter((input) => input.includes("disabled=\"\""))).toHaveLength(products.length - 3);
    for (const input of inputs.filter((input) => input.includes("checked=\"\""))) expect(input).not.toContain("disabled=");
    expect(html.match(/aria-label="View comparison:/g)).toHaveLength(3);
  });

  it("keeps static product links readable and comparison controls disabled before hydration", () => {
    const html = renderToStaticMarkup(createElement(ProductExplorer, { products }));
    expect(html.match(/type="checkbox"/g)).toHaveLength(products.length);
    for (const input of html.matchAll(/<input\b[^>]*type="checkbox"[^>]*>/g)) expect(input[0]).toContain('disabled=""');
    const section = html.match(/<section id="compare"[\s\S]*?<\/section>/)![0];
    for (const select of section.matchAll(/<select\b[^>]*>/g)) expect(select[0]).toContain('disabled=""');
    for (const product of products) expect(html).toContain(`href="/products/${product.slug}"`);
    expect(html.match(/id="compare"/g)).toHaveLength(1);
    expect(html.match(/id="comparison-selection-status"/g)).toHaveLength(1);
    expect(html).not.toContain("fixed ");
    const home = renderToStaticMarkup(createElement(HomePage));
    expect(home).not.toContain("Add to comparison");
    expect(home).not.toContain("data-catalog-product");
  });

  it("renders the same selected models in the summary, specification table and inquiry destination", () => {
    const selectedSlugs = products.slice(0, 3).map((product) => product.slug);
    const catalog = renderToStaticMarkup(createElement(ProductCatalogSection, { products, comparison: controls(selectedSlugs), filters: defaultFilters, onFiltersChange: vi.fn() }));
    const comparison = renderToStaticMarkup(createElement(ProductComparison, { products, selectedSlugs, filters: defaultFilters, ready: true, onChange: vi.fn(), onClear: vi.fn() }));
    expect(catalog).toContain("3 / 3");
    expect(catalog).toContain("Comparison limit reached");
    for (const product of products.slice(0, 3)) {
      expect(catalog).toContain(`aria-label="Remove from comparison: ${product.model}"`);
      expect(comparison).toContain(`href="/products/${product.slug}"`);
    }
    expect(comparison).toContain(`href="/contact?products=${encodeURIComponent(selectedSlugs.join(","))}#inquiry-form"`);
    expect(comparison).toContain("Discuss these products");
  });

  it("translates comparison actions and model-labelled controls in Chinese", () => {
    locale.chinese = true;
    const selectedSlugs = products.slice(0, 3).map((product) => product.slug);
    const html = renderToStaticMarkup(createElement(ProductCatalogSection, { products, comparison: controls(selectedSlugs), filters: defaultFilters, onFiltersChange: vi.fn() }));
    expect(html).toContain("已达到对比数量上限");
    expect(html).toContain("查看对比");
    for (const product of products.slice(0, 3)) {
      expect(html).toContain(`aria-label="移出对比: ${product.model}"`);
      expect(html).toContain(`aria-label="已加入对比: ${product.model}"`);
    }
    expect(html).toContain(`aria-label="加入对比: ${products[3].model}"`);
    expect(html).not.toContain("Add to comparison");
    expect(html).not.toContain("Comparison limit reached");
  });

  it("keeps hidden candidates and requested filters together in both inquiry destinations", () => {
    const filters: ProductFilters = { type: "ac", interface: "ccs2", workflow: "field" };
    const candidates = products.slice(0, 3);
    const selectedSlugs = candidates.map((product) => product.slug);
    const catalog = renderToStaticMarkup(createElement(ProductCatalogSection, { products, comparison: controls(selectedSlugs), filters, onFiltersChange: vi.fn() }));
    const comparison = renderToStaticMarkup(createElement(ProductComparison, { products, selectedSlugs, filters, ready: true, onChange: vi.fn(), onClear: vi.fn() }));
    const href = buildCatalogInquiryHref(filters, "/products", candidates).replaceAll("&", "&amp;");
    expect(catalog).toContain("No model matches every selected filter");
    expect(catalog).toContain(`href="${href}"`);
    expect(comparison).toContain(`href="${href}"`);
    for (const candidate of candidates) expect(catalog).toContain(`aria-label="Remove from comparison: ${candidate.model}"`);
    expect(comparison).toContain("Review models and test scope");
    for (const html of [catalog, comparison]) expect(html).toContain("Selected models are candidates for review and may not match every current requirement.");
  });

  it("also carries candidates from matching results without claiming they all match", () => {
    const filters: ProductFilters = { type: "dc", interface: "all", workflow: "all" };
    const candidate = products.find((product) => !product.capabilities.chargerTypes.includes("dc"))!;
    const catalog = renderToStaticMarkup(createElement(ProductCatalogSection, { products, comparison: controls([candidate.slug]), filters, onFiltersChange: vi.fn() }));
    expect(catalog).toContain("Review my configuration");
    expect(catalog).toContain(`products=${candidate.slug}`);
    expect(catalog).toContain("may not match every current requirement");
  });

  it("translates joint-context labels and qualifications without changing the query", () => {
    const filters: ProductFilters = { type: "dc", interface: "ccs2", workflow: "field" };
    const selectedSlugs = [products[0].slug];
    const props = { products, selectedSlugs, filters, ready: true, onChange: vi.fn(), onClear: vi.fn() };
    const english = renderToStaticMarkup(createElement(ProductComparison, props));
    locale.chinese = true;
    const chinese = renderToStaticMarkup(createElement(ProductComparison, props));
    expect(chinese).toContain("审核型号与测试范围");
    expect(chinese).toContain("所选型号仅供候选评审，未必满足当前的全部要求。");
    const href = buildCatalogInquiryHref(filters, "/products", [products[0]]).replaceAll("&", "&amp;");
    expect(english).toContain(`href="${href}"`);
    expect(chinese).toContain(`href="${href}"`);
    expect(chinese).not.toContain("Review models and test scope");
  });
});
