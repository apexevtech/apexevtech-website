"use client";

import { useCallback, useRef, useState } from "react";
import { ProductCatalogSection } from "@/components/ProductCatalogSection";
import { ProductComparison } from "@/components/ProductComparison";
import { QueryStateSync } from "@/components/QueryStateSync";
import type { Product } from "@/data/site";
import { trackEvent } from "@/lib/analytics/events";
import { parseComparedProductSlugs, reduceProductComparison, serializeComparedProducts, type ProductComparisonAction } from "@/lib/products/comparison";

export function ProductExplorer({ products }: { products: Product[] }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const selection = useRef<string[]>([]);
  const syncSelection = useCallback((params: URLSearchParams) => {
    const next = parseComparedProductSlugs(params.get("compare"), products);
    selection.current = next;
    setSelectedSlugs(next);
    setReady(true);
  }, [products]);

  function updateSelection(action: ProductComparisonAction, anchor: "compare" | "equipment") {
    const next = reduceProductComparison(selection.current, action, products);
    if (next.join(",") === selection.current.join(",")) return;
    selection.current = next;
    setSelectedSlugs(next);
    const url = new URL(window.location.href);
    url.search = serializeComparedProducts(url.searchParams, next, products).toString();
    url.hash = anchor;
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    trackEvent("product_compare", { models: next.flatMap((slug) => products.find((product) => product.slug === slug)?.model ?? []).join(", ") });
  }

  return <>
    <QueryStateSync onChange={syncSelection} />
    <ProductComparison products={products} selectedSlugs={selectedSlugs} ready={ready} onChange={(index, slug) => updateSelection({ type: "replace", index, slug }, "compare")} onClear={() => updateSelection({ type: "clear" }, "compare")} />
    <ProductCatalogSection products={products} comparison={{ selectedSlugs, ready, onToggle: (slug) => updateSelection({ type: "toggle", slug }, "equipment"), onClear: () => updateSelection({ type: "clear" }, "equipment") }} />
  </>;
}
