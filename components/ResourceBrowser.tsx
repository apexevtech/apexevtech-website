"use client";

import { useCallback, useState } from "react";
import { BookOpen, FileText, Layers3, RotateCcw, Search, Workflow, X } from "lucide-react";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogMetadataSync } from "@/components/CatalogMetadataSync";
import { Pagination } from "@/components/Pagination";
import { QueryStateSync } from "@/components/QueryStateSync";
import { ResourceHashNavigation } from "@/components/ResourceHashNavigation";
import { ResourceMaterial } from "@/components/ResourceMaterial";
import { StructuredData } from "@/components/StructuredData";
import { buildPageHref } from "@/lib/navigation/pagination";
import { defaultResourceBrowserFilters, getResourceBrowserCategories, getResourceBrowserCategoryLabel, getResourceBrowserPage, parseResourceBrowserFilters, resourceBrowserEntries, serializeResourceBrowserFilters, type ResourceBrowserFilters } from "@/lib/resources/browser";
import { buildResourceIndexStructuredData } from "@/lib/seo/resource-index-structured-data";
import { siteUrl } from "@/lib/seo/site-urls";
import { getCatalogMetadataState, resourceIndexTitle } from "@/lib/seo/catalog-metadata";

const materialTypes = [
  { value: "all", label: "All materials", icon: Layers3, count: resourceBrowserEntries.length },
  { value: "guides", label: "Guides", icon: BookOpen, count: resourceBrowserEntries.filter((entry) => entry.kind === "guide").length },
  { value: "sources", label: "Solution briefs", icon: FileText, count: resourceBrowserEntries.filter((entry) => entry.kind === "source").length },
  { value: "scenarios", label: "Applications", icon: Workflow, count: resourceBrowserEntries.filter((entry) => entry.kind === "scenario").length },
] satisfies Array<{ value: ResourceBrowserFilters["type"]; label: string; icon: typeof Layers3; count: number }>;

export function ResourceBrowser({ initialFilters }: { initialFilters: ResourceBrowserFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const syncFilters = useCallback((params: URLSearchParams) => {
    const parsed = parseResourceBrowserFilters(params);
    setFilters((current) => current.type === parsed.type && current.category === parsed.category && current.page === parsed.page && current.query.trim() === parsed.query
      ? { ...parsed, query: current.query }
      : parsed);
    const normalized = serializeResourceBrowserFilters(parsed, params);
    if (normalized.toString() !== params.toString()) {
      window.history.replaceState(null, "", `${window.location.pathname}${normalized.size ? `?${normalized}` : ""}${window.location.hash}`);
    }
  }, []);

  function updateFilters(changes: Partial<ResourceBrowserFilters>, replace = false) {
    const next = { ...filters, ...changes, page: changes.page ?? 1 };
    if (changes.type) next.category = parseResourceBrowserFilters(serializeResourceBrowserFilters(next)).category;
    next.page = getResourceBrowserPage(next).page;
    setFilters(next);
    const url = new URL(window.location.href);
    url.search = serializeResourceBrowserFilters(next, url.searchParams).toString();
    if (changes.page) url.hash = "resource-results";
    const href = `${url.pathname}${url.search}${url.hash}`;
    if (replace) window.history.replaceState(null, "", href);
    else window.history.pushState(null, "", href);
  }

  const page = getResourceBrowserPage(filters);
  const hasFilters = filters.type !== "all" || filters.category !== "all" || Boolean(filters.query);
  const params = serializeResourceBrowserFilters(filters);
  const pageHref = buildPageHref("/resources", params, page.page, "resource-results");
  const visibleGuides = page.items.flatMap((entry) => entry.kind === "guide" ? [entry.resource] : []);
  const selectedType = filters.type === "materials" ? "all" : filters.type;
  const currentCategories = getResourceBrowserCategories(filters.type);
  const legacyCategory = filters.category !== "all" && !currentCategories.some((category) => category.id === filters.category);

  return <section className="px-5 pb-8 pt-2 lg:px-8" aria-label="Resource materials">
    <QueryStateSync onChange={syncFilters} />
    <ResourceHashNavigation filters={filters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/resources", resourceIndexTitle, page.page, hasFilters)} />
    <StructuredData data={buildResourceIndexStructuredData(visibleGuides, siteUrl, pageHref)} />
    <div className="mx-auto max-w-7xl">
      <CatalogControls className="border-b border-slate-200 pb-1">
        <fieldset className="grid grid-cols-2 border-b border-slate-200 sm:grid-cols-4">
          <legend className="sr-only">Material type</legend>
          {materialTypes.map((type) => <label key={type.value} className="relative -mb-px min-w-0 cursor-pointer">
            <input type="radio" name="resource-type" value={type.value} checked={selectedType === type.value} onChange={() => updateFilters({ type: type.value })} onClick={() => { if (filters.type === "materials" && type.value === "all") updateFilters({ type: "all" }); }} className="peer sr-only" />
            <span className="flex min-h-12 items-center justify-center gap-2 border-b-2 border-transparent px-2 py-3 text-center text-xs font-bold text-[#526b7d] peer-checked:border-[#1268a8] peer-checked:bg-[#f2f7fb] peer-checked:text-[#1268a8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-3px] peer-focus-visible:outline-[#1479c9] sm:px-4 sm:text-sm"><type.icon size={16} aria-hidden="true" className="hidden shrink-0 lg:block" /><span>{type.label}</span><span aria-hidden="true" className="text-[11px] font-normal tabular-nums text-[#526b7d]">{type.count}</span></span>
          </label>)}
        </fieldset>
        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]">
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#385064]">Search materials<span className="relative flex min-w-0 items-center"><Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 text-slate-400" /><input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Interface, workflow or topic" className="min-h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]" /></span></label>
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#385064]">Topic<select value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })} className="min-h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]"><option value="all">All topics</option>{legacyCategory ? <option value={filters.category}>{getResourceBrowserCategoryLabel(filters.category)}</option> : null}{currentCategories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
        </div>
        {filters.type === "materials" ? <div className="mt-3"><button type="button" aria-label="Remove planning materials filter" onClick={() => updateFilters({ type: "all" })} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded border border-slate-300 bg-[#f7fafc] px-2.5 text-xs font-semibold text-[#385064]">Planning materials<X size={14} aria-hidden="true" className="shrink-0" /></button></div> : null}
        <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="min-w-0 flex-1 break-words text-sm text-[#526b7d]">{page.totalItems ? `${page.start}-${page.end} of ${page.totalItems} materials` : "0 materials"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline"><RotateCcw size={15} aria-hidden="true" />Reset filters</button> : null}
        </div>
      </CatalogControls>

      <div id="resource-results" tabIndex={-1} className="scroll-mt-28 outline-none">
        <div id="library-results" className="scroll-mt-28" />
        <div id="solution-briefs" className="scroll-mt-28" />
        <div id="application-scenarios" className="scroll-mt-28" />
        <h2 className="sr-only">Resource results</h2>
        {page.totalItems ? <div className="divide-y divide-slate-200">{page.items.map((entry, index) => <ResourceMaterial key={entry.id} entry={entry} category={getResourceBrowserCategoryLabel(entry.categoryId)} number={page.start + index} />)}</div>
          : <div className="py-14 text-center"><h3 className="text-xl font-bold text-[#12263a]">No matching materials</h3><p className="mt-3 text-sm text-[#526b7d]">No material matches this search and category.</p><button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="mt-4 min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button></div>}
      </div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/resources", params, number, "resource-results")} />
    </div>
  </section>;
}
