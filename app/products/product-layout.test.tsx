import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { getProductSeo } from "@/lib/products/seo";
import ProductDetailPage from "./[slug]/page";

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

async function renderProduct(slug: string) {
  return renderToStaticMarkup(await ProductDetailPage({ params: Promise.resolve({ slug }) }));
}

describe("product detail information hierarchy", () => {
  it.each(products)("preserves specifications, selection boundaries and content for $model", async (product) => {
    const html = await renderProduct(product.slug);
    const seo = getProductSeo(product.slug);
    expect(html).toContain(escape(product.model));
    expect(html).toContain(escape(product.overview));
    for (const [label, value] of product.specs) {
      expect(html).toContain(escape(label));
      expect(html).toContain(escape(value.replaceAll("<=", "≤").replaceAll(">=", "≥")));
    }
    for (const text of [...product.features, ...product.highlights, ...product.applications]) {
      expect(html).toContain(escape(text));
    }
    if (seo) {
      expect(html).toContain(escape(seo.intro));
      for (const faq of seo.faqs) {
        expect(html).toContain(escape(faq.question));
        expect(html).toContain(escape(faq.answer));
      }
      if (seo.selection) {
        for (const text of [seo.selection.workflow, seo.selection.load, seo.selection.options]) {
          expect(html).toContain(escape(text));
        }
        for (const alternative of seo.selection.alternatives) {
          expect(html).toContain(`href="/products/${alternative.slug}"`);
          expect(html).toContain(escape(alternative.label));
        }
      }
    }
    if (product.document) expect(html).toContain(`href="${product.document}"`);
    expect(html).toContain(`href="/products?compare=${product.slug}#compare"`);
  });

  it("places complete specifications early, and the single inquiry form before related content", async () => {
    const html = await renderProduct(products[0].slug);
    const ids = ["product-configuration", "technical-specifications", "key-features", "product-inquiry"];
    const positions = ids.map((id) => html.indexOf(`id="${id}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    for (const id of ids) {
      expect(html.match(new RegExp(`id="${id}"`, "g"))).toHaveLength(1);
      expect(html).toContain(`href="#${id}"`);
    }
    expect(html.indexOf("Product Overview")).toBeGreaterThan(positions[1]);
    expect(html.indexOf("Application Scenarios")).toBeGreaterThan(positions[3]);
    expect(html.indexOf("Test workflows and application solutions")).toBeGreaterThan(positions[3]);
    expect(html.match(/<form\b/g)).toHaveLength(1);
    expect(html).toContain(`Equipment of interest: </span>${escape(products[0].model)}`);
    const configuration = html.slice(positions[0], positions[1]);
    expect(configuration.indexOf('href="#product-inquiry"')).toBeLessThan(configuration.indexOf("<dl"));
  });

  it("keeps procurement and FAQ content server-rendered inside native disclosures", async () => {
    const html = await renderProduct(products[0].slug);
    const procurement = html.match(/<details class="group\/procurement[\s\S]*?<\/details>/)?.[0];
    expect(procurement).toBeDefined();
    expect(procurement).not.toContain(" open=");
    expect(procurement).toContain("<summary");
    expect(procurement).toContain("Procurement checklist");
    expect(procurement).toContain("Confirm the delivered configuration before ordering");
    expect(procurement).toContain("Acceptance and support");
    const summaries = html.match(/<summary\b[\s\S]*?<\/summary>/g) ?? [];
    for (const summary of summaries) expect(summary).not.toMatch(/<(a|button)\b/);
    expect(html.match(/<details class="group\/faq"/g)).toHaveLength(getProductSeo(products[0].slug)!.faqs.length);
  });
});
