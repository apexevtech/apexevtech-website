import type { Product } from "@/data/site";

function matchingSpecs(product: Product, pattern: RegExp, limit: number) {
  return product.specs
    .filter(([name]) => pattern.test(name))
    .slice(0, limit)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

export function getProductComparisonDetails(product: Product) {
  return {
    type: product.category,
    interface: matchingSpecs(product, /connector|socket|supported interfaces|test object/i, 2) || "Confirm the required interface with APEX.",
    electricalRange: matchingSpecs(product, /voltage|current|socket rating|energy acquisition/i, 2) || "Configured for the target charger and test scope.",
    loadArrangement: matchingSpecs(product, /external load|system configuration|installation/i, 2) || "Confirm the load arrangement with APEX.",
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
