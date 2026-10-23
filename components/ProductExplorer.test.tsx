import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { products } from "@/data/site";
import { ProductCatalog } from "./ProductCatalog";
import { ProductCatalogSection } from "./ProductCatalogSection";
import { ProductComparison } from "./ProductComparison";
import { ProductExplorer } from "./ProductExplorer";
import HomePage from "@/app/page";

const locale = vi.hoisted(() => ({ chinese: false }));
vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  const t = (text: string) => translateText(text, locale.chinese ? "zh" : "en", messages);
  return { T: ({ children }: { children: ReactNode }) => typeof children === "string" ? t(children) : children, useLanguage: () => ({ t, language: locale.chinese ? "zh" : "en" }) };
});
vi.mock("@/components/QueryStateSync", () => ({ QueryStateSync: () => null }));

const controls = (selectedSlugs: string[], ready = true) => ({ selectedSlugs, ready, onToggle: vi.fn(), onClear: vi.fn() });
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
    const catalog = renderToStaticMarkup(createElement(ProductCatalogSection, { products, comparison: controls(selectedSlugs) }));
    const comparison = renderToStaticMarkup(createElement(ProductComparison, { products, selectedSlugs, ready: true, onChange: vi.fn(), onClear: vi.fn() }));
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
    const html = renderToStaticMarkup(createElement(ProductCatalogSection, { products, comparison: controls(selectedSlugs) }));
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
});
