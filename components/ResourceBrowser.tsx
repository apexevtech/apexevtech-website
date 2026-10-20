"use client";

import { useCallback, useState } from "react";
import { ArrowRight, BookOpen, FileText, Layers3, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogMetadataSync } from "@/components/CatalogMetadataSync";
import { Pagination } from "@/components/Pagination";
import { QueryStateSync } from "@/components/QueryStateSync";
import { SourceCitation } from "@/components/SourceCitation";
import { StructuredData } from "@/components/StructuredData";
import { buildPageHref } from "@/lib/navigation/pagination";
import { defaultResourceBrowserFilters, getResourceBrowserCategories, getResourceBrowserPage, parseResourceBrowserFilters, serializeResourceBrowserFilters, type ResourceBrowserFilters } from "@/lib/resources/browser";
import { buildResourceIndexStructuredData } from "@/lib/seo/resource-index-structured-data";
import { siteUrl } from "@/lib/seo/site-urls";
import { getCatalogMetadataState, resourceIndexTitle } from "@/lib/seo/catalog-metadata";

const materialTypes = [
  { value: "all", label: "All materials", icon: Layers3 },
  { value: "guides", label: "APEX guides", icon: BookOpen },
  { value: "sources", label: "Solutions", icon: FileText },
] satisfies Array<{ value: ResourceBrowserFilters["type"]; label: string; icon: typeof Layers3 }>;

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
    if (changes.type && !getResourceBrowserCategories(next.type).some((category) => category.id === next.category)) next.category = "all";
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

  return <section className="px-5 pb-8 pt-2 lg:px-8" aria-label="Resource materials">
    <QueryStateSync onChange={syncFilters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/resources", resourceIndexTitle, page.page, hasFilters)} />
    <StructuredData data={buildResourceIndexStructuredData(visibleGuides, siteUrl, pageHref)} />
    <div className="mx-auto max-w-7xl">
      <CatalogControls className="border-b border-slate-200 pb-1">
        <fieldset className="grid grid-cols-3 border-b border-slate-200 sm:flex">
          <legend className="sr-only">Material type</legend>
          {materialTypes.map((type) => <label key={type.value} className="relative -mb-px min-w-0 cursor-pointer sm:min-w-36">
            <input type="radio" name="resource-type" value={type.value} checked={filters.type === type.value} onChange={() => updateFilters({ type: type.value })} className="peer sr-only" />
            <span className="flex min-h-12 items-center justify-center gap-2 border-b-2 border-transparent px-2 py-3 text-center text-xs font-bold text-[#526b7d] peer-checked:border-[#1268a8] peer-checked:text-[#1268a8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-3px] peer-focus-visible:outline-[#1479c9] sm:px-4 sm:text-sm"><type.icon size={16} aria-hidden="true" className="hidden shrink-0 sm:block" />{type.label}</span>
          </label>)}
        </fieldset>
        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]">
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#385064]">Search materials<span className="relative flex min-w-0 items-center"><Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 text-slate-400" /><input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Interface, workflow or topic" className="min-h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]" /></span></label>
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#385064]">Category<select value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })} className="min-h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]"><option value="all">All categories</option>{getResourceBrowserCategories(filters.type).map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
        </div>
        <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="min-w-0 flex-1 break-words text-sm text-[#526b7d]">{page.totalItems ? `${page.start}-${page.end} of ${page.totalItems} materials` : "0 materials"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline"><RotateCcw size={15} aria-hidden="true" />Reset filters</button> : null}
        </div>
      </CatalogControls>

      <div id="resource-results" tabIndex={-1} className="scroll-mt-28 outline-none">
        <h2 className="sr-only">Resource results</h2>
        {page.totalItems ? <div className="divide-y divide-slate-200">{page.items.map((entry) => {
          const category = getResourceBrowserCategories(entry.kind === "guide" ? "guides" : "sources").find((item) => item.id === entry.categoryId)?.label;
          return <article key={entry.id} data-source-material={entry.kind === "source" ? entry.id : undefined} className="grid min-w-0 gap-3 py-6 lg:grid-cols-[156px_minmax(0,1fr)] lg:gap-8 lg:py-7">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 lg:block">
              <p className="inline-flex items-center gap-2 text-xs font-bold text-[#1268a8]">{entry.kind === "guide" ? <BookOpen size={14} aria-hidden="true" /> : <FileText size={14} aria-hidden="true" />}{entry.kind === "guide" ? "Technical guide" : "Solution brief"}</p>
              <p className="text-xs leading-5 text-[#526b7d] lg:mt-2">{category}</p>
            </div>
            <div className="min-w-0">{entry.kind === "guide" ? <>
              <h3 className="max-w-4xl break-words text-lg font-bold leading-7 text-[#12263a]"><Link href={`/resources/${entry.resource.slug}`} className="hover:text-[#1268a8]">{entry.resource.title}</Link></h3>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-[#526b7d]">{entry.resource.description}</p>
              <Link href={`/resources/${entry.resource.slug}`} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline">Read the guide<ArrowRight size={16} aria-hidden="true" /></Link>
            </> : <>
              <SourceCitation source={entry.material.source} presentation="list" headingLevel="h3" />
              <Link href={entry.material.relatedHref} className="mt-2 inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-bold leading-6 text-[#1268a8] hover:underline"><span>{entry.material.relatedLabel}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link>
            </>}</div>
          </article>;
        })}</div>
          : <div className="py-14 text-center"><h3 className="text-xl font-bold text-[#12263a]">No matching materials</h3><p className="mt-3 text-sm text-[#526b7d]">No material matches this search and category.</p><button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="mt-4 min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button></div>}
      </div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/resources", params, number, "resource-results")} />
    </div>
  </section>;
}
