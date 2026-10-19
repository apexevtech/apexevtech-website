"use client";

import { useCallback, useState } from "react";
import { ProductCatalog } from "@/components/ProductCatalog";
import { QueryStateSync } from "@/components/QueryStateSync";
import type { Product } from "@/data/site";
import {
  filterProductCatalog,
  parseProductFilters,
  type InterfaceFilter,
  type ProductFilter,
  type ProductFilters,
  type WorkflowFilter,
} from "@/lib/products/filter";
import { trackEvent } from "@/lib/analytics/events";
import { buildCatalogInquiryHref } from "@/lib/inquiries/catalog-scope";
import { TrackedLink } from "@/components/TrackedLink";

type ProductCatalogSectionProps = { products: Product[] };
const defaults: ProductFilters = { type: "all", interface: "all", workflow: "all" };
const typeOptions: Array<[ProductFilter, string]> = [["all", "All charger types"], ["ac", "AC chargers"], ["dc", "DC chargers"]];
const interfaceOptions: Array<[InterfaceFilter, string]> = [["all", "All interfaces / standards"], ["gbt", "GB/T"], ["ccs2", "CCS2 / ISO 15118"], ["chademo", "CHAdeMO"], ["type1", "Type 1 / SAE J1772"], ["type2", "Type 2 / IEC 61851"], ["nacs", "NACS / SAE J3400"]];
const workflowOptions: Array<[WorkflowFilter, string]> = [["all", "All workflows"], ["portable", "Portable testing"], ["laboratory", "Laboratory / R&D"], ["production", "Production / end-of-line"], ["field", "Field commissioning"]];

export function ProductCatalogSection({ products }: ProductCatalogSectionProps) {
  const [filters, setFilters] = useState<ProductFilters>(defaults);

  const syncFilters = useCallback((params: URLSearchParams) => {
    setFilters(parseProductFilters(params));
  }, []);

  function updateFilter<Key extends keyof ProductFilters>(key: Key, value: ProductFilters[Key]) {
    const next = { ...filters, [key]: value };
    setFilters(next);
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
    setFilters(defaults);
    const url = new URL(window.location.href);
    for (const key of Object.keys(defaults)) url.searchParams.delete(key);
    url.hash = "equipment";
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const filteredProducts = filterProductCatalog(products, filters);
  const hasFilters = Object.values(filters).some((value) => value !== "all");

  return (
    <section id="equipment" className="scroll-mt-28 px-5 py-16 lg:px-8">
      <QueryStateSync onChange={syncFilters} />
      <div className="mx-auto max-w-7xl">
        <div className="rounded-md border border-slate-200 bg-[#f3f8fa] p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-[#1268a8]">Equipment finder</p>
              <h2 className="mt-1 text-2xl font-black text-[#12263a]">Narrow the catalog by your test scope</h2>
              <p className="mt-2 max-w-3xl text-sm font-normal leading-6 text-[#526b7d]">Interface filters show documented connectors. For configurable or unspecified regional interfaces, ask an engineer to confirm coverage.</p>
            </div>
            {hasFilters ? <button type="button" onClick={resetFilters} className="text-sm font-bold text-[#1268a8] underline">Reset filters</button> : null}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FilterSelect label="Charger type" value={filters.type} options={typeOptions} onChange={(value) => updateFilter("type", value as ProductFilter)} />
            <FilterSelect label="Interface / standard" value={filters.interface} options={interfaceOptions} onChange={(value) => updateFilter("interface", value as InterfaceFilter)} />
            <FilterSelect label="Test workflow" value={filters.workflow} options={workflowOptions} onChange={(value) => updateFilter("workflow", value as WorkflowFilter)} />
          </div>
        </div>

        <p aria-live="polite" className="mb-5 mt-6 text-sm font-semibold text-[#526b7d]">{filteredProducts.length} matching equipment {filteredProducts.length === 1 ? "model" : "models"}</p>
        {hasFilters && filteredProducts.length > 0 ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4">
            <p className="max-w-xl text-sm leading-6 text-[#526b7d]">Need to confirm the connector, electrical range or included options? Send this test scope for a configuration review.</p>
            <TrackedLink href={buildCatalogInquiryHref(filters)} eventName="catalog_inquiry_click" location="catalog-matching-results" className="inline-flex min-h-11 items-center rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f5f9f]">Review my configuration</TrackedLink>
          </div>
        ) : null}
        {filteredProducts.length ? <ProductCatalog eyebrow="Matching equipment" title="Compare specifications and configuration boundaries" products={filteredProducts} /> : (
          <div className="rounded-md border border-dashed border-slate-300 p-8 text-center">
            <h3 className="font-black text-[#12263a]">No model matches every selected filter</h3>
            <p className="mt-2 text-sm text-[#526b7d]">Reset one filter or send the complete test scope for a configuration review.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={resetFilters} className="min-h-11 rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-[#1268a8]">Reset filters</button>
              <TrackedLink href={buildCatalogInquiryHref(filters)} eventName="catalog_inquiry_click" location="catalog-no-results" className="inline-flex min-h-11 rounded-md bg-[#1479c9] px-5 py-3 text-sm font-black text-white">Ask an engineer</TrackedLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">{label}<select className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-[#12263a] outline-none focus:border-[#1479c9]" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>;
}
