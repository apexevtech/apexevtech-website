import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { ProductCard } from "./ProductCard";

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

describe("product gallery cards", () => {
  it("preserves product destinations, model names and specification copy", () => {
    for (const product of products) {
      const html = renderToStaticMarkup(createElement(ProductCard, { product }));
      expect(html).toContain(`href="/products/${product.slug}"`);
      expect(html).toContain(escape(product.model));
      expect(html).toContain(escape(product.title));
      expect(html).toContain(escape(product.shortDescription));
      expect(html).toContain(escape(product.highlights.slice(0, 3).join(" · ")));
      expect(html).toContain("View specifications");
      expect(html.match(/<a\b/g)).toHaveLength(1);
    }
  });

  it("keeps the complete product image stationary with restrained accessible hover styling", () => {
    const html = renderToStaticMarkup(createElement(ProductCard, { product: products[0] }));
    expect(html).toContain('class="h-full w-full object-contain"');
    expect(html).toContain("transition-[border-color,box-shadow]");
    expect(html).toContain("hover:border-[#8bb3cf]");
    expect(html).toContain("focus-visible:outline-offset-4");
    expect(html).toContain("motion-reduce:transition-none");
    expect(html).not.toMatch(/object-cover|scale-|translate-y-|transition-transform/);
  });

  it("uses legible metadata and a separated Lucide specification action", () => {
    const html = renderToStaticMarkup(createElement(ProductCard, { product: products[0] }));
    expect(html).toContain('class="text-xs font-semibold leading-5 text-[#1268a8]"');
    expect(html).toContain('class="mt-2 text-xs font-semibold leading-5 text-slate-500"');
    expect(html).toContain('class="mt-3 text-sm leading-6 text-slate-600"');
    expect(html).toContain("min-h-11 self-start items-center gap-2 pt-5");
    expect(html).toContain("lucide-arrow-up-right");
    expect(html).not.toContain("text-[11px]");
    expect(html).not.toContain("↗");
  });
});
