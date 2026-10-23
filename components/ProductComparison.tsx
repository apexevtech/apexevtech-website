"use client";

import Link from "next/link";
import { ArrowUpRight, MessageSquare, RotateCcw } from "lucide-react";
import type { Product } from "@/data/site";
import { getProductComparisonDetails } from "@/lib/products/comparison";
import { trackEvent } from "@/lib/analytics/events";
import { T, useLanguage } from "@/components/LanguageProvider";

type ProductComparisonProps = {
  products: Product[];
  selectedSlugs: string[];
  ready: boolean;
  onChange: (index: number, slug: string) => void;
  onClear: () => void;
};

export function ProductComparison({ products, selectedSlugs, ready, onChange, onClear }: ProductComparisonProps) {
  const { t } = useLanguage();
  const selectedProducts = selectedSlugs.flatMap((slug) => {
    const product = products.find((item) => item.slug === slug);
    return product ? [product] : [];
  });

  const inquiryHref = selectedSlugs.length
    ? `/contact?products=${encodeURIComponent(selectedSlugs.join(","))}#inquiry-form`
    : "/contact#inquiry-form";
  const rows = [
    ["System type", "type"],
    ["Interface / connector", "interface"],
    ["Electrical range", "electricalRange"],
    ["Load arrangement", "loadArrangement"],
    ["Standards / protocol scope", "standards"],
    ["Test capabilities", "capabilities"],
    ["Typical applications", "applications"],
  ] as const;

  return (
    <section id="compare" className="scroll-mt-28 border-y border-slate-200 bg-[#f3f6f8] px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase text-[#1268a8]"><T>Product comparison</T></p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-[#12263a] md:text-3xl"><T>Compare up to three test systems</T></h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#526b7d]"><T>Compare the interface, electrical range, load arrangement and test workflow before requesting a configuration.</T></p>
          </div>
          {selectedSlugs.length ? <button type="button" onClick={onClear} disabled={!ready} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1268a8] hover:underline"><RotateCcw size={16} aria-hidden="true" /><T>Clear comparison</T></button> : null}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <label key={index} className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">
              {t("Product")} {String.fromCharCode(65 + index)}
              <select value={selectedSlugs[index] ?? ""} disabled={!ready} onChange={(event) => onChange(index, event.target.value)} className="min-h-12 w-full min-w-0 max-w-full rounded-md border border-slate-300 bg-white px-3 text-[#12263a] outline-none focus:border-[#1479c9] disabled:opacity-60">
                <option value="">{t("Select a product")}</option>
                {products.map((product) => <option key={product.slug} value={product.slug} disabled={selectedSlugs.includes(product.slug) && selectedSlugs[index] !== product.slug}>{product.model} — {t(product.title)}</option>)}
              </select>
            </label>
          ))}
        </div>

        {selectedProducts.length ? (
          <>
            <p id="comparison-scroll-help" className="mt-6 text-xs leading-5 text-[#526b7d]"><T>On smaller screens, scroll the table horizontally to see every model.</T></p>
            <div role="region" aria-label={t("Selected test system specifications")} aria-describedby="comparison-scroll-help" tabIndex={0} className="mt-3 overflow-x-auto rounded-md border border-slate-200 bg-white">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <caption className="sr-only">{t("Specifications for")} {selectedProducts.map((product) => product.model).join(", ")}</caption>
                <thead>
                  <tr className="bg-[#102a43] text-white">
                    <th scope="col" className="w-44 px-4 py-4 font-black"><T>Compare</T></th>
                    {selectedProducts.map((product) => <th scope="col" key={product.slug} className="min-w-60 px-4 py-4"><Link href={`/products/${product.slug}`} className="inline-flex min-h-11 items-center gap-2 font-bold hover:underline">{product.model}<ArrowUpRight size={16} aria-hidden="true" className="shrink-0" /></Link><span className="mt-1 block text-xs font-normal text-slate-300">{t(product.title)}</span></th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, key]) => <tr key={key} className="border-t border-slate-200 align-top"><th scope="row" className="bg-slate-50 px-4 py-4 font-black text-[#12263a]">{t(label)}</th>{selectedProducts.map((product) => <td key={product.slug} className="px-4 py-4 leading-6 text-[#526b7d]">{getProductComparisonDetails(product, t)[key]}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={inquiryHref} onClick={() => trackEvent("comparison_inquiry_click", { models: selectedProducts.map((product) => product.model).join(", ") })} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1479c9] px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-[#0f5f9f]"><MessageSquare size={18} aria-hidden="true" className="shrink-0" /><T>Discuss these products</T></Link>
              <p className="text-sm text-[#526b7d]"><T>Your selected models will be added to the inquiry form.</T></p>
            </div>
          </>
        ) : <p className="mt-6 rounded-md border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-[#526b7d]"><T>Select at least one product to start the comparison.</T></p>}
      </div>
    </section>
  );
}
