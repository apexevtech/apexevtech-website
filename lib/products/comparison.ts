import type { Product } from "@/data/site";
import { getProductConfiguration } from "@/lib/products/configuration";

function matchingSpecs(product: Product, pattern: RegExp, limit: number) {
  return product.specs
    .filter(([name]) => pattern.test(name))
    .slice(0, limit)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

export function getProductComparisonDetails(product: Product) {
  const configuration = getProductConfiguration(product);
  return {
    type: product.category,
    interface: configuration.interface,
    electricalRange: configuration.electricalRange,
    loadArrangement: configuration.loadArrangement,
    standards: matchingSpecs(product, /standard|protocol|reference/i, 2) || product.highlights.filter((item) => /IEC|GB\/T|SAE|ISO|DIN|CHAdeMO|NACS/i.test(item)).slice(0, 3).join(" · ") || "Confirm the exact standards and editions with APEX.",
    capabilities: product.highlights.slice(0, 4).join(" · "),
    applications: product.applications.slice(0, 3).join(" · "),
  };
}

export function parseComparedProductSlugs(value: string | null | undefined, products: Product[]) {
  const available = new Set(products.map((product) => product.slug));
  return [...new Set((value ?? "").split(",").map((slug) => slug.trim()).filter((slug) => available.has(slug)))].slice(0, 3);
}

export function getComparedProducts(value: string | null | undefined, products: Product[]) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return parseComparedProductSlugs(value, products).flatMap((slug) => {
    const product = bySlug.get(slug);
    return product ? [product] : [];
  });
}
