"use client";

import Link from "@/components/LocaleLink";
import { ArrowUpRight, MessageSquare, RotateCcw } from "lucide-react";
import type { Product } from "@/data/site";
import { getComparedProducts, getProductComparisonDetails } from "@/lib/products/comparison";
import type { ProductFilters } from "@/lib/products/filter";
import { buildComparisonInquiryHref } from "@/lib/inquiries/catalog-scope";
import { trackEvent } from "@/lib/analytics/events";
import { CatalogControls } from "@/components/CatalogControls";
import { T, useLanguage } from "@/components/LanguageProvider";

type ProductComparisonProps = {
  products: Product[];
  selectedSlugs: string[];
  filters: ProductFilters;
  ready: boolean;
  onChange: (index: number, slug: string) => void;
  onClear: () => void;
};

export function ProductComparison({ products, selectedSlugs, filters, ready, onChange, onClear }: ProductComparisonProps) {
  const { t } = useLanguage();
  const selectedProducts = getComparedProducts(selectedSlugs.join(","), products);

  const inquiryHref = buildComparisonInquiryHref(filters, selectedProducts);
  const hasFilters = Object.values(filters).some((value) => value !== "all");
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
      <CatalogControls className="mx-auto max-w-7xl">
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
            <p id="comparison-scroll-help" className="sr-only"><T>On smaller screens, scroll the table horizontally to see every model.</T></p>
            <div data-product-comparison-scroll role="region" aria-label={t("Selected test system specifications")} aria-describedby="comparison-scroll-help" tabIndex={0} className="relative isolate mt-6 max-h-[min(36rem,70svh)] scroll-pl-32 overflow-auto overscroll-x-contain rounded-md border border-slate-300 bg-white [container-type:inline-size] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1479c9] focus-visible:ring-offset-2 md:scroll-pl-44">
              <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm [--comparison-label-width:8rem] [--comparison-model-width:15rem] supports-[width:1cqw]:[--comparison-model-width:min(15rem,calc(100cqw_-_var(--comparison-label-width)))] md:[--comparison-label-width:11rem]" style={{ minWidth: `calc(var(--comparison-label-width) + ${selectedProducts.length} * var(--comparison-model-width))` }}>
                <caption className="sr-only">{t("Specifications for")} {selectedProducts.map((product) => product.model).join(", ")}</caption>
                <colgroup>
                  <col className="w-[var(--comparison-label-width)]" />
                  {selectedProducts.map((product) => <col key={product.slug} />)}
                </colgroup>
                <thead>
                  <tr className="align-top text-white">
                    <th data-comparison-corner scope="col" className="sticky left-0 top-0 z-30 border-b border-r border-[#385064] bg-[#102a43] px-3 py-4 font-bold md:px-4"><T>Compare</T></th>
                    {selectedProducts.map((product) => (
                      <th data-comparison-model id={`comparison-model-${product.slug}`} scope="col" key={product.slug} className="sticky top-0 z-20 border-b border-[#385064] bg-[#102a43] px-4 py-4">
                        <Link href={`/products/${product.slug}`} style={{ maxWidth: "min(100%, calc(100cqw - var(--comparison-label-width) - 2rem))" }} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm font-bold leading-6 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#102a43]"><span className="min-w-0 [overflow-wrap:anywhere]">{product.model}</span><ArrowUpRight size={16} aria-hidden="true" className="shrink-0" /></Link>
                        <span className="mt-1 block text-xs font-normal leading-5 text-slate-300 [overflow-wrap:anywhere]">{t(product.title)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, key]) => (
                    <tr key={key} className="align-top">
                      <th data-comparison-row id={`comparison-row-${key}`} scope="row" className="sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 px-3 py-4 font-semibold leading-6 text-[#12263a] [overflow-wrap:anywhere] md:px-4">{t(label)}</th>
                      {selectedProducts.map((product) => <td key={product.slug} headers={`comparison-row-${key} comparison-model-${product.slug}`} className="border-b border-slate-200 bg-white px-4 py-4 leading-6 text-[#526b7d] [overflow-wrap:anywhere]">{getProductComparisonDetails(product, t)[key]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={inquiryHref} onClick={() => trackEvent("comparison_inquiry_click", { models: selectedProducts.map((product) => product.model).join(", ") })} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1479c9] px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-[#0f5f9f]"><MessageSquare size={18} aria-hidden="true" className="shrink-0" /><T>{hasFilters ? "Review models and test scope" : "Discuss these products"}</T></Link>
              <p className="text-sm leading-6 text-[#526b7d]"><T>{hasFilters ? "Selected models are candidates for review and may not match every current requirement." : "Your selected models will be added to the inquiry form."}</T></p>
            </div>
          </>
        ) : <p className="mt-6 rounded-md border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-[#526b7d]"><T>Select at least one product to start the comparison.</T></p>}
      </CatalogControls>
    </section>
  );
}
