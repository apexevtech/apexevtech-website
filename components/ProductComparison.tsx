"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/site";
import { getProductComparisonDetails, parseComparedProductSlugs } from "@/lib/products/comparison";
import { trackEvent } from "@/lib/analytics/events";

export function ProductComparison({ products }: { products: Product[] }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const productsBySlug = useMemo(() => new Map(products.map((product) => [product.slug, product])), [products]);
  const selectedProducts = selectedSlugs.flatMap((slug) => {
    const product = productsBySlug.get(slug);
    return product ? [product] : [];
  });

  useEffect(() => {
    const syncWithUrl = () => {
      setSelectedSlugs(parseComparedProductSlugs(new URLSearchParams(window.location.search).get("compare"), products));
    };

    syncWithUrl();
    window.addEventListener("popstate", syncWithUrl);
    return () => window.removeEventListener("popstate", syncWithUrl);
  }, [products]);

  function updateSelection(index: number, slug: string) {
    const next = [...selectedSlugs];
    if (!slug) {
      next.splice(index, 1);
    } else {
      const existingIndex = next.indexOf(slug);
      if (existingIndex >= 0 && existingIndex !== index) next.splice(existingIndex, 1);
      next[index] = slug;
    }
    const normalized = next.filter(Boolean).slice(0, 3);
    setSelectedSlugs(normalized);

    const url = new URL(window.location.href);
    if (normalized.length) url.searchParams.set("compare", normalized.join(","));
    else url.searchParams.delete("compare");
    url.hash = "compare";
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    trackEvent("product_compare", { models: normalized.map((item) => productsBySlug.get(item)?.model ?? item).join(", ") });
  }

  function clearComparison() {
    setSelectedSlugs([]);
    const url = new URL(window.location.href);
    url.searchParams.delete("compare");
    url.hash = "compare";
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const inquiryHref = selectedSlugs.length
    ? `/contact?products=${encodeURIComponent(selectedSlugs.join(","))}#inquiry-form`
    : "/contact#inquiry-form";
  const rows = [
    ["System type", "type"],
    ["Interface / connector", "interface"],
    ["Electrical range", "electricalRange"],
    ["Load arrangement", "loadArrangement"],
    ["Test capabilities", "capabilities"],
    ["Typical applications", "applications"],
  ] as const;

  return (
    <section id="compare" className="scroll-mt-28 border-y border-slate-200 bg-[#f3f6f8] px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase text-[#1268a8]">Product comparison</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#12263a]">Compare up to three test systems</h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#526b7d]">Compare the interface, electrical range, load arrangement and test workflow before requesting a configuration.</p>
          </div>
          {selectedSlugs.length ? <button type="button" onClick={clearComparison} className="text-sm font-bold text-[#1268a8] underline">Clear comparison</button> : null}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <label key={index} className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">
              Product {String.fromCharCode(65 + index)}
              <select value={selectedSlugs[index] ?? ""} onChange={(event) => updateSelection(index, event.target.value)} className="min-h-12 w-full min-w-0 max-w-full rounded-md border border-slate-300 bg-white px-3 text-[#12263a] outline-none focus:border-[#1479c9]">
                <option value="">Select a product</option>
                {products.map((product) => <option key={product.slug} value={product.slug} disabled={selectedSlugs.includes(product.slug) && selectedSlugs[index] !== product.slug}>{product.model} — {product.title}</option>)}
              </select>
            </label>
          ))}
        </div>

        {selectedProducts.length ? (
          <>
            <div className="mt-8 overflow-x-auto rounded-md border border-slate-200 bg-white">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#102a43] text-white">
                    <th className="w-44 px-4 py-4 font-black">Compare</th>
                    {selectedProducts.map((product) => <th key={product.slug} className="min-w-60 px-4 py-4"><Link href={`/products/${product.slug}`} className="font-black hover:underline">{product.model} ↗</Link><span className="mt-1 block text-xs font-normal text-slate-300">{product.title}</span></th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, key]) => <tr key={key} className="border-t border-slate-200 align-top"><th className="bg-slate-50 px-4 py-4 font-black text-[#12263a]">{label}</th>{selectedProducts.map((product) => <td key={product.slug} className="px-4 py-4 leading-6 text-[#526b7d]">{getProductComparisonDetails(product)[key]}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={inquiryHref} onClick={() => trackEvent("comparison_inquiry_click", { models: selectedProducts.map((product) => product.model).join(", ") })} className="rounded-md bg-[#1479c9] px-6 py-3 font-extrabold text-white hover:bg-[#0f5f9f]">Discuss these products</Link>
              <p className="text-sm text-[#526b7d]">Your selected models will be added to the inquiry form.</p>
            </div>
          </>
        ) : <p className="mt-6 rounded-md border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-[#526b7d]">Select at least one product to start the comparison.</p>}
      </div>
    </section>
  );
}
