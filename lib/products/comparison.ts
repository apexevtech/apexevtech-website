import type { Product } from "@/data/site";
import { getProductConfiguration } from "@/lib/products/configuration";

function matchingSpecs(product: Product, pattern: RegExp, limit: number, translate: (text: string) => string) {
  return product.specs
    .filter(([name]) => pattern.test(name))
    .slice(0, limit)
    .map(([name, value]) => `${translate(name)}: ${translate(value)}`)
    .join("; ");
}

export function getProductComparisonDetails(product: Product, translate: (text: string) => string = (text) => text) {
  const configuration = getProductConfiguration(product, translate);
  return {
    type: translate(product.category),
    interface: configuration.interface,
    electricalRange: configuration.electricalRange,
    loadArrangement: configuration.loadArrangement,
    standards: matchingSpecs(product, /standard|protocol|reference/i, 2, translate) || product.highlights.filter((item) => /IEC|GB\/T|SAE|ISO|DIN|CHAdeMO|NACS/i.test(item)).slice(0, 3).map(translate).join(" · ") || translate("Confirm the exact standards and editions with APEX."),
    capabilities: product.highlights.slice(0, 4).map(translate).join(" · "),
    applications: product.applications.slice(0, 3).map(translate).join(" · "),
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

export type ProductComparisonAction =
  | { type: "toggle"; slug: string }
  | { type: "replace"; index: number; slug: string }
  | { type: "clear" };

export function reduceProductComparison(current: string[], action: ProductComparisonAction, products: Product[]) {
  const selected = parseComparedProductSlugs(current.join(","), products);
  if (action.type === "clear") return [];
  if (action.type === "toggle") {
    if (selected.includes(action.slug)) return selected.filter((slug) => slug !== action.slug);
    if (selected.length === 3 || !products.some((product) => product.slug === action.slug)) return selected;
    return [...selected, action.slug];
  }
  if (!Number.isInteger(action.index) || action.index < 0 || action.index > 2) return selected;
  if (!action.slug) return selected.filter((_, index) => index !== action.index);
  if (!products.some((product) => product.slug === action.slug)) return selected;
  if (selected.includes(action.slug) && selected[action.index] !== action.slug) return selected;
  const next = [...selected];
  next[Math.min(action.index, next.length)] = action.slug;
  return next;
}

export function serializeComparedProducts(params: URLSearchParams, selected: string[], products: Product[]) {
  const next = new URLSearchParams(params);
  const slugs = parseComparedProductSlugs(selected.join(","), products);
  if (slugs.length) next.set("compare", slugs.join(","));
  else next.delete("compare");
  return next;
}
