"use client";

import { useCallback, useState } from "react";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogMetadataSync } from "@/components/CatalogMetadataSync";
import { Pagination } from "@/components/Pagination";
import { QueryStateSync } from "@/components/QueryStateSync";
import { ResourceCard } from "@/components/ResourceCard";
import { SourceCitation } from "@/components/SourceCitation";
import { StructuredData } from "@/components/StructuredData";
import { buildPageHref } from "@/lib/navigation/pagination";
import { defaultResourceBrowserFilters, getResourceBrowserCategories, getResourceBrowserPage, parseResourceBrowserFilters, serializeResourceBrowserFilters, type ResourceBrowserFilters } from "@/lib/resources/browser";
import { buildResourceIndexStructuredData } from "@/lib/seo/resource-index-structured-data";
import { siteUrl } from "@/lib/seo/site-urls";
import { getCatalogMetadataState, resourceIndexTitle } from "@/lib/seo/catalog-metadata";

const materialTypes: Array<{ value: ResourceBrowserFilters["type"]; label: string }> = [
  { value: "all", label: "All materials" },
  { value: "guides", label: "APEX guides" },
  { value: "sources", label: "Solutions" },
];

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

  return <section className="px-5 pb-12 pt-7 lg:px-8" aria-label="Resource materials">
    <QueryStateSync onChange={syncFilters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/resources", resourceIndexTitle, page.page, hasFilters)} />
    <StructuredData data={buildResourceIndexStructuredData(visibleGuides, siteUrl, pageHref)} />
    <div className="mx-auto max-w-7xl">
      <CatalogControls className="border-b border-slate-200 pb-5">
        <fieldset className="grid max-w-lg grid-cols-3 rounded-md border border-slate-300 bg-white p-1">
          <legend className="sr-only">Material type</legend>
          {materialTypes.map((type) => <label key={type.value} className="relative min-w-0 cursor-pointer">
            <input type="radio" name="resource-type" value={type.value} checked={filters.type === type.value} onChange={() => updateFilters({ type: type.value })} className="peer sr-only" />
            <span className="flex min-h-11 items-center justify-center rounded px-2 py-2 text-center text-sm font-bold text-[#385064] peer-checked:bg-[#1268a8] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1479c9]">{type.label}</span>
          </label>)}
        </fieldset>
        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]">
          <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">Search materials<input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Interface, workflow or topic" className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]" /></label>
          <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">Category<select value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })} className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]"><option value="all">All categories</option>{getResourceBrowserCategories(filters.type).map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
        </div>
        <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="min-w-0 flex-1 break-words text-sm text-[#526b7d]">{page.totalItems ? `${page.start}-${page.end} of ${page.totalItems} materials` : "0 materials"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button> : null}
        </div>
      </CatalogControls>

      <div id="resource-results" tabIndex={-1} className="scroll-mt-28 outline-none">
        <h2 className="sr-only">Resource results</h2>
        {page.totalItems ? <div className="grid gap-x-12 md:grid-cols-2">{page.items.map((entry) => entry.kind === "guide"
          ? <ResourceCard key={entry.id} resource={entry.resource} headingLevel="h3" />
          : <article key={entry.id} data-source-material={entry.id} className="min-w-0 border-t border-slate-200 py-6"><SourceCitation source={entry.material.source} compact headingLevel="h3" /></article>)}</div>
          : <div className="py-14 text-center"><h3 className="text-xl font-bold text-[#12263a]">No matching materials</h3><p className="mt-3 text-sm text-[#526b7d]">No material matches this search and category.</p><button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="mt-4 min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button></div>}
      </div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/resources", params, number, "resource-results")} />
    </div>
  </section>;
}
