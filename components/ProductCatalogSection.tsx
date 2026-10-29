"use client";

import { ProductCatalog, type ProductCatalogComparison } from "@/components/ProductCatalog";
import Link from "@/components/LocaleLink";
import { Columns3, RotateCcw, X } from "lucide-react";
import { CatalogControls } from "@/components/CatalogControls";
import type { Product } from "@/data/site";
import {
  filterProductCatalog,
  type InterfaceFilter,
  type ProductFilter,
  type ProductFilters,
  type WorkflowFilter,
} from "@/lib/products/filter";
import { trackEvent } from "@/lib/analytics/events";
import { buildCatalogInquiryHref } from "@/lib/inquiries/catalog-scope";
import { TrackedLink } from "@/components/TrackedLink";
import { T, useLanguage } from "@/components/LanguageProvider";
import { getComparedProducts } from "@/lib/products/comparison";

type ProductCatalogSectionProps = { products: Product[]; comparison: ProductCatalogComparison; filters: ProductFilters; onFiltersChange: (filters: ProductFilters) => void };
const defaults: ProductFilters = { type: "all", interface: "all", workflow: "all" };
const typeOptions: Array<[ProductFilter, string]> = [["all", "All charger types"], ["ac", "AC chargers"], ["dc", "DC chargers"]];
const interfaceOptions: Array<[InterfaceFilter, string]> = [["all", "All interfaces / standards"], ["gbt", "GB/T"], ["ccs2", "CCS2 / ISO 15118"], ["chademo", "CHAdeMO"], ["type1", "Type 1 / SAE J1772"], ["type2", "Type 2 / IEC 61851"], ["nacs", "NACS / SAE J3400"]];
const workflowOptions: Array<[WorkflowFilter, string]> = [["all", "All workflows"], ["portable", "Portable testing"], ["laboratory", "Laboratory / R&D"], ["production", "Production / end-of-line"], ["field", "Field commissioning"]];

export function ProductCatalogSection({ products, comparison, filters, onFiltersChange }: ProductCatalogSectionProps) {
  const { t } = useLanguage();

  function updateFilter<Key extends keyof ProductFilters>(key: Key, value: ProductFilters[Key]) {
    const next = { ...filters, [key]: value };
    onFiltersChange(next);
    const url = new URL(window.location.href);
    for (const [name, selected] of Object.entries(next)) {
      if (selected === "all") url.searchParams.delete(name);
      else url.searchParams.set(name, selected);
    }
    url.hash = "equipment";
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    trackEvent("product_filter", { filter_name: key, filter_value: value });
  }

  function resetFilters() {
    onFiltersChange(defaults);
    const url = new URL(window.location.href);
    for (const key of Object.keys(defaults)) url.searchParams.delete(key);
    url.hash = "equipment";
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const filteredProducts = filterProductCatalog(products, filters);
  const hasFilters = Object.values(filters).some((value) => value !== "all");
  const selectedProducts = getComparedProducts(comparison.selectedSlugs.join(","), products);
  const inquiryHref = buildCatalogInquiryHref(filters, "/products", selectedProducts);

  return (
    <section id="equipment" className="scroll-mt-28 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CatalogControls className="rounded-md border border-slate-200 bg-[#f3f8fa] p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-[#1268a8]"><T>Equipment finder</T></p>
              <h2 className="mt-1 text-2xl font-black text-[#12263a]"><T>Narrow the catalog by your test scope</T></h2>
              <p className="mt-2 max-w-3xl text-sm font-normal leading-6 text-[#526b7d]"><T>Interface filters show documented connectors. For configurable or unspecified regional interfaces, ask an engineer to confirm coverage.</T></p>
            </div>
            {hasFilters ? <button type="button" onClick={resetFilters} className="text-sm font-bold text-[#1268a8] underline"><T>Reset filters</T></button> : null}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FilterSelect label="Charger type" value={filters.type} options={typeOptions} onChange={(value) => updateFilter("type", value as ProductFilter)} />
            <FilterSelect label="Interface / standard" value={filters.interface} options={interfaceOptions} onChange={(value) => updateFilter("interface", value as InterfaceFilter)} />
            <FilterSelect label="Test workflow" value={filters.workflow} options={workflowOptions} onChange={(value) => updateFilter("workflow", value as WorkflowFilter)} />
          </div>
        </CatalogControls>

        <CatalogControls className="mt-6 border-y border-slate-200 py-4">
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <p id="comparison-selection-status" role="status" aria-live="polite" className="text-sm font-semibold leading-6 text-[#385064]"><T>Product comparison</T><span className="ml-2 tabular-nums text-[#1268a8]">{selectedProducts.length} / 3</span>{selectedProducts.length === 3 ? <span className="ml-3 font-normal text-[#526b7d]"><T>Comparison limit reached</T></span> : null}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {selectedProducts.length ? <button type="button" onClick={comparison.onClear} disabled={!comparison.ready} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#526b7d] hover:text-[#1268a8] hover:underline"><RotateCcw size={16} aria-hidden="true" /><T>Clear comparison</T></button> : null}
              <Link href="#compare" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1268a8] hover:underline"><Columns3 size={18} aria-hidden="true" /><T>View comparison</T></Link>
            </div>
          </div>
          {selectedProducts.length ? <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">{selectedProducts.map((product) => <li key={product.slug} className="inline-flex min-w-0 max-w-full items-center gap-2 text-sm leading-6 text-[#385064]"><span className="break-words">{product.model}</span><button type="button" onClick={() => comparison.onToggle(product.slug)} disabled={!comparison.ready} title={`${t("Remove from comparison")}: ${product.model}`} aria-label={`${t("Remove from comparison")}: ${product.model}`} className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#526b7d] hover:bg-[#edf5fc] hover:text-[#1268a8]"><X size={17} aria-hidden="true" /></button></li>)}</ul> : null}
          {selectedProducts.length && hasFilters ? <p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>Selected models are candidates for review and may not match every current requirement.</T></p> : null}
        </CatalogControls>

        <p aria-live="polite" className="mb-5 mt-6 text-sm font-semibold text-[#526b7d]">{filteredProducts.length} {t(filteredProducts.length === 1 ? "matching equipment model" : "matching equipment models")}</p>
        {hasFilters && filteredProducts.length > 0 ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4">
            <p className="max-w-xl text-sm leading-6 text-[#526b7d]"><T>Need to confirm the connector, electrical range or included options? Send this test scope for a configuration review.</T></p>
            <TrackedLink href={inquiryHref} eventName="catalog_inquiry_click" location="catalog-matching-results" className="inline-flex min-h-11 items-center rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f5f9f]"><T>Review my configuration</T></TrackedLink>
          </div>
        ) : null}
        {filteredProducts.length ? <ProductCatalog eyebrow="Matching equipment" title="Compare specifications and configuration boundaries" products={filteredProducts} comparison={comparison} /> : (
          <div className="rounded-md border border-dashed border-slate-300 p-8 text-center">
            <h3 className="font-black text-[#12263a]"><T>No model matches every selected filter</T></h3>
            <p className="mt-2 text-sm text-[#526b7d]"><T>Reset one filter or send the complete test scope for a configuration review.</T></p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={resetFilters} className="min-h-11 rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-[#1268a8]"><T>Reset filters</T></button>
              <TrackedLink href={inquiryHref} eventName="catalog_inquiry_click" location="catalog-no-results" className="inline-flex min-h-11 rounded-md bg-[#1479c9] px-5 py-3 text-sm font-black text-white"><T>Ask an engineer</T></TrackedLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  const { t } = useLanguage();
  return <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">{t(label)}<select className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-[#12263a] outline-none focus:border-[#1479c9]" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option key={option} value={option}>{t(text)}</option>)}</select></label>;
}
