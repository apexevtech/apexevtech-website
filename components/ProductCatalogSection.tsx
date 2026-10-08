"use client";

import { useEffect, useState } from "react";
import { ProductCatalog } from "@/components/ProductCatalog";
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

type ProductCatalogSectionProps = { products: Product[] };
const defaults: ProductFilters = { type: "all", interface: "all", workflow: "all" };
const typeOptions: Array<[ProductFilter, string]> = [["all", "All charger types"], ["ac", "AC chargers"], ["dc", "DC chargers"]];
const interfaceOptions: Array<[InterfaceFilter, string]> = [["all", "All interfaces / standards"], ["gbt", "GB/T"], ["ccs2", "CCS2 / ISO 15118"], ["chademo", "CHAdeMO"], ["type1", "Type 1 / SAE J1772"], ["type2", "Type 2 / IEC 61851"], ["nacs", "NACS / SAE J3400"]];
const workflowOptions: Array<[WorkflowFilter, string]> = [["all", "All workflows"], ["portable", "Portable testing"], ["laboratory", "Laboratory / R&D"], ["production", "Production / end-of-line"], ["field", "Field commissioning"]];

export function ProductCatalogSection({ products }: ProductCatalogSectionProps) {
  const [filters, setFilters] = useState<ProductFilters>(defaults);

  useEffect(() => {
    const sync = () => setFilters(parseProductFilters(new URLSearchParams(window.location.search)));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
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
    window.history.replaceState(null, "", "/products#equipment");
  }

  const filteredProducts = filterProductCatalog(products, filters);
  const hasFilters = Object.values(filters).some((value) => value !== "all");

  return (
    <section id="equipment" className="scroll-mt-28 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-md border border-slate-200 bg-[#f3f8fa] p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-[#1268a8]">Equipment finder</p>
              <h2 className="mt-1 text-2xl font-black text-[#12263a]">Narrow the catalog by your test scope</h2>
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
        {filteredProducts.length ? <ProductCatalog eyebrow="Matching equipment" title="Compare specifications and configuration boundaries" products={filteredProducts} /> : (
          <div className="rounded-md border border-dashed border-slate-300 p-8 text-center">
            <h3 className="font-black text-[#12263a]">No model matches every selected filter</h3>
            <p className="mt-2 text-sm text-[#526b7d]">Reset one filter or send the complete test scope for a configuration review.</p>
            <a href="/contact#inquiry-form" className="mt-4 inline-flex rounded-md bg-[#1479c9] px-5 py-3 text-sm font-black text-white">Ask an engineer</a>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-bold text-[#385064]">{label}<select className="min-h-12 rounded-md border border-slate-300 bg-white px-3 text-[#12263a] outline-none focus:border-[#1479c9]" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>;
}
